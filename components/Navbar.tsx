import Link from "next/link";

const links = [
  { href: "/", label: "Shop" },
  { href: "/policies/return", label: "Return" },
  { href: "/policies/refund", label: "Refund" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/disclaimer", label: "Disclaimer" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-base font-semibold tracking-tight">
          LearnPay
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
