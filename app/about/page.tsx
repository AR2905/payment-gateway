import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About LearnPay, a Razorpay plus Next.js learning project.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About LearnPay</h1>

      <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <p>
          LearnPay is a small storefront built to demonstrate one thing well: how
          a payment gateway fits into a modern web application. It uses Next.js
          for the app, Razorpay for payments, and MongoDB for storing orders.
        </p>
        <p>
          The interesting part is not the shopping cart. It is everything that
          happens after the shopper clicks Pay: creating an order on the server,
          opening the gateway, verifying the result with a signature, and
          recording the outcome so it survives even if the browser closes.
        </p>
        <p>
          The store runs entirely in Razorpay test mode, so no real money ever
          moves. Read the source starting from{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
            app/api/razorpay/create-order/route.ts
          </code>
          .
        </p>
      </div>

      <div className="mt-8 flex gap-4 text-sm">
        <Link
          href="/"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Browse the shop
        </Link>
        <Link
          href="/policies"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Read the policies
        </Link>
      </div>
    </main>
  );
}
