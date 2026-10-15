import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { razorpay, razorpayKeyId } from "@/lib/razorpay";
import { getProduct } from "@/lib/products";
import { Order } from "@/models/Order";

/**
 * STEP 1 of the flow — create a Razorpay order.
 *
 * The browser sends ONLY a `productId` (and optionally contact details). It
 * never sends the price, because a malicious client could otherwise pay ₹1 for
 * a ₹999 product. We look the price up on the server instead.
 */

const bodySchema = z.object({
  productId: z.string().min(1),
  email: z.email().optional().or(z.literal("")),
  contact: z.string().min(6).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { productId, email, contact } = parsed.data;

    // Authoritative price lookup (server-side only).
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Unknown product" }, { status: 404 });
    }

    await connectToDatabase();

    // Ask Razorpay to create an order for the exact amount.
    const razorpayOrder = await razorpay.orders.create({
      amount: product.priceInPaise,
      currency: product.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: { productId: product.id, productName: product.name },
    });

    // Persist our own record so verify/webhook have something to update.
    await Order.create({
      productId: product.id,
      productName: product.name,
      amount: product.priceInPaise,
      currency: product.currency,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
      email: email || null,
      contact: contact || null,
    });

    // `keyId` is public; the secret stays on the server.
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: Number(razorpayOrder.amount),
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId,
      productName: product.name,
    });
  } catch (error) {
    console.error("[create-order] failed:", error);
    return NextResponse.json(
      { error: "Could not create order. Check the server logs." },
      { status: 500 },
    );
  }
}
