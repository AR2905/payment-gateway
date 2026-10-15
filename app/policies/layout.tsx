import Link from "next/link";
import { policies } from "@/lib/policies";

export default function PoliciesLayout({
  children,
}: LayoutProps<"/policies">) {
  return (
    <div className="mx-auto max-w-5xl gap-10 px-4 py-10 lg:flex">
      <aside className="mb-8 lg:mb-0 lg:w-56 lg:shrink-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Policies
        </p>
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {policies.map((policy) => (
            <Link
              key={policy.slug}
              href={`/policies/${policy.slug}`}
              className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {policy.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
