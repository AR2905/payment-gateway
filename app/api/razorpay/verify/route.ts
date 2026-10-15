import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { razorpay, verifyPaymentSignature } from "@/lib/razorpay";
import { Order } from "@/models/Order";

/**
 * STEP 3 of the flow — verify the payment signature.
 *
 * After checkout succeeds, Razorpay hands the browser three values. We MUST
 * verify them on the server before trusting that a payment happened, because a
 * cheat could otherwise fake a successful response.
 *
 * The signature is an HMAC-SHA256 of `"<order_id>|<payment_id>"` using the key
 * secret. Only Razorpay and our server know that secret.
 */

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      parsed.data;

    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      await connectToDatabase();
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed", failureReason: "Payment signature mismatch" },
      );
      return NextResponse.json(
        { verified: false, error: "Payment signature verification failed" },
        { status: 400 },
      );
    }

    // Signature is valid. As a second check, ask Razorpay directly for the
    // payment status. This also gives us the payment method for the receipt.
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const isPaid =
      payment.status === "captured" || payment.status === "authorized";

    await connectToDatabase();
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: isPaid ? "paid" : "created",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        method: payment.method ?? null,
        paidAt: isPaid ? new Date() : null,
      },
      { new: true },
    );

    return NextResponse.json({
      verified: true,
      status: order?.status ?? "paid",
    });
  } catch (error) {
    console.error("[verify] failed:", error);
    return NextResponse.json(
      { verified: false, error: "Could not verify payment. Check server logs." },
      { status: 500 },
    );
  }
}
