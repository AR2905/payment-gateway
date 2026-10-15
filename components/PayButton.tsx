"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { formatINR } from "@/lib/products";

type PayButtonProps = {
  productId: string;
  productName: string;
  amount: number;
};

type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  productName: string;
};

export default function PayButton({
  productId,
  productName,
  amount,
}: PayButtonProps) {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);

    if (!window.Razorpay) {
      setError("Payment SDK is still loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Ask our server to create a Razorpay order.
      // We send only the product id — the server decides the price.
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const order = (await createRes.json().catch(() => ({}))) as
        | CreateOrderResponse
        | { error?: string };

      if (!createRes.ok || !("orderId" in order)) {
        throw new Error(
          "error" in order && order.error
            ? order.error
            : "Could not create the order.",
        );
      }

      // STEP 2: Open the Razorpay Checkout modal.
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "LearnPay",
        description: order.productName,
        order_id: order.orderId,
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          // STEP 3: Send the signed result to our server to verify.
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = (await verifyRes.json().catch(() => ({}))) as {
            verified?: boolean;
            error?: string;
          };

          if (!verifyRes.ok || !verifyData.verified) {
            setError(verifyData.error ?? "Payment verification failed.");
            setLoading(false);
            return;
          }

          // STEP 4: Show the receipt.
          router.push(
            `/success?order_id=${encodeURIComponent(order.orderId)}`,
          );
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Checkout closed before the payment was completed.");
          },
        },
      });

      checkout.open();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setLoading(false);
    }
  }

  return (
    <div>
      {/* The official Razorpay checkout script. Loaded once, after hydration. */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !scriptReady}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Opening checkout..."
          : `Pay ${formatINR(amount)} for ${productName}`}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
