import type { Metadata } from "next";
import Link from "next/link";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Return, refund, privacy and disclaimer policies for the LearnPay demo store.",
};

export default function PoliciesIndexPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Policies</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        The legal pages a real store needs. Each one lives at its own URL.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {policies.map((policy) => (
          <Link
            key={policy.slug}
            href={`/policies/${policy.slug}`}
            className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
          >
            <h2 className="font-medium">{policy.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {policy.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
