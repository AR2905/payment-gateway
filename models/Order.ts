import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

/**
 * One document per Razorpay order.
 *
 * `razorpayOrderId` is our idempotency key: both the client-side verify route
 * and the webhook update the SAME document. This means the order is recorded
 * correctly even if the shopper closes the tab before verification finishes.
 */
const OrderSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    /** Amount in paise — exactly what we asked Razorpay to charge. */
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },

    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    // Optional details we prefill / receive from Razorpay.
    email: { type: String, default: null },
    contact: { type: String, default: null },
    method: { type: String, default: null },
    failureReason: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof OrderSchema>;

/**
 * Reuse the existing model on hot reload, otherwise Mongoose throws
 * "OverwriteModelError: Cannot overwrite `Order` model once compiled."
 */
export const Order: Model<OrderDocument> =
  (models.Order as Model<OrderDocument>) ??
  model<OrderDocument>("Order", OrderSchema);
