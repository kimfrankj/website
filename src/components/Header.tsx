import Link from "next/link";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="wrap flex flex-col gap-4 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:py-8">
      <Link href="/" className="inline-block py-1 font-display text-2xl leading-none tracking-tight">
        {site.name}
      </Link>
      <nav aria-label="Primary" className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-8">
        <ul className="flex gap-4 sm:gap-8">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="label link-quiet inline-block py-1.5 !text-ink">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
