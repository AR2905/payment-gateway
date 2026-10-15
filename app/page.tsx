import Link from "next/link";
import { products, formatINR } from "@/lib/products";

const steps = [
  {
    title: "1. Create an order",
    body: "The server asks Razorpay to create an order for the real price, then stores a record in MongoDB.",
  },
  {
    title: "2. Pay",
    body: "Razorpay Checkout opens. Pay with a test card. No real money moves.",
  },
  {
    title: "3. Verify",
    body: "The server checks the payment signature, confirms with Razorpay, and marks the order as paid.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Razorpay + Next.js learning demo
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          A complete payment flow you can read
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Pick a product, pay in Razorpay test mode, and watch the order get
          created and verified automatically. The whole flow is commented in the
          source.
        </p>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-950" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
            <p className="mt-4 text-2xl font-semibold">
              {formatINR(product.priceInPaise)}
            </p>
            <Link
              href={`/checkout/${product.id}`}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Buy now
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-center text-xl font-semibold">
          What happens when you click Buy
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
