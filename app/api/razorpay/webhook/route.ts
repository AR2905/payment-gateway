import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { Order } from "@/models/Order";

/**
 * The webhook endpoint — the safety net.
 *
 * The browser might close before the verify step runs (phone dies, tab
 * closed, network drops). Razorpay then calls this URL from its servers
 * instead. It is the source of truth for what actually happened to a payment.
 *
 * Register it in the Razorpay dashboard:
 *   Account & Settings -> Webhooks -> endpoint https://<your-url>/api/razorpay/webhook
 *   Events: payment.captured, payment.failed, order.paid
 */

type RazorpayWebhookPayload = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        method?: string;
        error_description?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  // IMPORTANT: read the RAW body. The signature is computed over these exact
  // bytes, so `request.json()` (which reorders/normalises) must not be used
  // before verifying.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const payment = payload.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;

  try {
    await connectToDatabase();

    if (payload.event === "payment.captured" || payload.event === "order.paid") {
      if (razorpayOrderId) {
        // Upsert-style update keyed on the Razorpay order id, so the webhook
        // and the verify route never create duplicate orders.
        await Order.findOneAndUpdate(
          { razorpayOrderId },
          {
            status: "paid",
            razorpayPaymentId: payment?.id ?? null,
            method: payment?.method ?? null,
            paidAt: new Date(),
          },
        );
      }
    } else if (payload.event === "payment.failed") {
      if (razorpayOrderId) {
        await Order.findOneAndUpdate(
          { razorpayOrderId },
          {
            status: "failed",
            failureReason: payment?.error_description ?? "Payment failed",
          },
        );
      }
    }

    // Always answer 200 quickly so Razorpay stops retrying.
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] handler failed:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
