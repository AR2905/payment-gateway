"use client";

import { use, useCallback, useEffect, useState } from "react";
import { formatINR } from "@/lib/products";

type OrderSummary = {
  razorpayOrderId: string;
  productName: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  razorpayPaymentId: string | null;
  method: string | null;
  paidAt: string | null;
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

/** Fetch one order. Kept free of React state so it can be reused anywhere. */
async function requestOrder(orderId: string): Promise<OrderSummary> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Could not load the order.");
  }
  return data as OrderSummary;
}

export default function OrderReceipt({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // `use` unwraps the promise the Server Component passed down.
  const params = use(searchParams);
  const raw = params.order_id;
  const orderId = Array.isArray(raw) ? raw[0] : raw;

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let active = true;

    // State updates happen only after `await`, never synchronously in the
    // effect body.
    (async () => {
      try {
        const data = await requestOrder(orderId);
        if (active) {
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unknown error.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [orderId]);

  const handleRefresh = useCallback(async () => {
    if (!orderId) {
      return;
    }
    setRefreshing(true);
    try {
      const data = await requestOrder(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setRefreshing(false);
    }
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        <h1 className="text-lg font-semibold">No order found</h1>
        <p className="mt-2 text-sm">
          This page expects an order id in the URL, for example
          /success?order_id=order_abc123.
        </p>
      </div>
    );
  }

  if (loading && !order) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Loading receipt...
      </p>
    );
  }

  if (error && !order) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        <h1 className="text-lg font-semibold">We could not load this order</h1>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusStyles: Record<OrderSummary["status"], string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    created: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };

  const statusLabel: Record<OrderSummary["status"], string> = {
    paid: "Payment successful",
    created: "Payment pending",
    failed: "Payment failed",
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
      >
        {statusLabel[order.status]}
      </span>

      <h1 className="mt-4 text-2xl font-semibold">{order.productName}</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        {formatINR(order.amount)}
      </p>

      <dl className="mt-6 space-y-3 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        <Row label="Razorpay order id" value={order.razorpayOrderId} mono />
        <Row
          label="Razorpay payment id"
          value={order.razorpayPaymentId ?? "Not received yet"}
          mono={Boolean(order.razorpayPaymentId)}
        />
        <Row label="Payment method" value={order.method ?? "-"} />
        <Row
          label="Paid at"
          value={order.paidAt ? new Date(order.paidAt).toLocaleString() : "-"}
        />
      </dl>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        className="mt-6 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {refreshing ? "Refreshing..." : "Refresh status"}
      </button>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        If the status is still pending, the payment webhook may not have arrived
        yet. In live mode this page is a fallback; the webhook is what makes the
        record final.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : ""}>{value}</dd>
    </div>
  );
}
