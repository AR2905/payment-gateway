import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { getRequiredEnv } from "@/lib/env";

const keyId = getRequiredEnv("RAZORPAY_KEY_ID");
const keySecret = getRequiredEnv("RAZORPAY_KEY_SECRET");
// Optional: only needed if you enable the webhook endpoint.
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

/**
 * The key ID is PUBLIC and safe to send to the browser — the Razorpay checkout
 * script needs it. The key secret must NEVER leave the server, which is why
 * this whole module is guarded by `server-only`.
 */
export const razorpayKeyId = keyId;

/** Configured Razorpay client. Every call through it happens on the server. */
export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

/**
 * Verify the signature Razorpay hands back to the browser after a successful
 * payment.
 *
 * Razorpay signs the string `"<order_id>|<payment_id>"` with HMAC-SHA256 using
 * our key secret. We recompute the same digest and compare. If they match, we
 * know the response really came from Razorpay and not from a tampering client.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  return safeCompare(expected, params.signature);
}

/**
 * Verify a webhook request. Webhooks are signed over the RAW request body with
 * a separate webhook secret, so we must pass the untouched body string here.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  if (!webhookSecret) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return safeCompare(expected, signature);
}

/**
 * Constant-time string comparison. A normal `===` leaks how many characters
 * matched through timing, which can be exploited. `timingSafeEqual` avoids
 * that. It throws when the buffers differ in length, so we guard first.
 */
function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}
