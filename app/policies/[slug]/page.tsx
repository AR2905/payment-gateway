import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { policies, getPolicy } from "@/lib/policies";

/** Pre-render one static page per policy at build time. */
export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata(
  props: PageProps<"/policies/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const policy = getPolicy(slug);

  return {
    title: policy?.title ?? "Policy",
    description: policy?.summary,
  };
}

export default function PolicyPage(props: PageProps<"/policies/[slug]">) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading policy...</p>}>
      <PolicyContent params={props.params} />
    </Suspense>
  );
}

async function PolicyContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) {
    notFound();
  }

  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">{policy.title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Last updated {policy.updated}
      </p>

      <div className="mt-8 space-y-8">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
