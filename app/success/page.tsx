import { Suspense } from "react";
import Link from "next/link";
import OrderReceipt from "@/components/OrderReceipt";

export const metadata = {
  title: "Payment status",
};

/**
 * The success page is a Server Component. It does not read `searchParams`
 * itself (that is request-time data) — it passes the promise down to the
 * client component inside a Suspense boundary. This keeps the static shell
 * fast while the receipt streams in.
 */
export default function SuccessPage(props: PageProps<"/success">) {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Suspense fallback={<ReceiptSkeleton />}>
        <OrderReceipt searchParams={props.searchParams} />
      </Suspense>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}

function ReceiptSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-4 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
