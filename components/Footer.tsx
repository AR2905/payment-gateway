import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
        <p>
          LearnPay is a demo storefront built to teach the Razorpay payment flow.
          No real money moves.
        </p>
        <div className="flex gap-4">
          <Link href="/policies" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Policies
          </Link>
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
