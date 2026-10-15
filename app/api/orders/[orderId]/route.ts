import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

/**
 * Read-only lookup used by the success page. Given a Razorpay order id, return
 * the current status stored in MongoDB. Because both the verify route and the
 * webhook update this document, the value here reflects the real state.
 */
export async function GET(
  _request: Request,
  context: RouteContext<"/api/orders/[orderId]">,
) {
  const { orderId } = await context.params;

  await connectToDatabase();
  const order = await Order.findOne({ razorpayOrderId: orderId }).lean();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    razorpayOrderId: order.razorpayOrderId,
    productName: order.productName,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    razorpayPaymentId: order.razorpayPaymentId ?? null,
    method: order.method ?? null,
    paidAt: order.paidAt ?? null,
  });
}
