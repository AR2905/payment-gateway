import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProduct, formatINR } from "@/lib/products";
import PayButton from "@/components/PayButton";

/**
 * Pre-render one static page per product at build time. Because the list of
 * products is known, Next.js can serve these instantly from the static shell.
 */
export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

/**
 * With Cache Components enabled, request-time data (here `params`) must be read
 * inside a Suspense boundary. The page itself stays static and streams in the
 * product-specific part.
 */
export default function CheckoutPage(props: PageProps<"/checkout/[productId]">) {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContent params={props.params} />
      </Suspense>
    </main>
  );
}

async function CheckoutContent({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to shop
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-medium">{product.name}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          </div>
          <p className="whitespace-nowrap text-lg font-semibold">
            {formatINR(product.priceInPaise)}
          </p>
        </div>

        <dl className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
          <div className="flex justify-between">
            <dt className="text-zinc-500 dark:text-zinc-400">Subtotal</dt>
            <dd>{formatINR(product.priceInPaise)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold dark:border-zinc-800">
            <dt>Total</dt>
            <dd>{formatINR(product.priceInPaise)}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <PayButton
            productId={product.id}
            productName={product.name}
            amount={product.priceInPaise}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        This store runs in Razorpay test mode. Use the test card
        4111&nbsp;1111&nbsp;1111&nbsp;1111 with any future expiry and any CVV.
      </p>
    </>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-4 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
