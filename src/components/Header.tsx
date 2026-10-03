import Link from "next/link";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="wrap flex items-baseline justify-between gap-6 py-6 md:py-8">
      <Link href="/" className="font-display text-2xl leading-none tracking-tight">
        {site.name}
      </Link>
      <nav aria-label="Primary" className="flex items-baseline gap-5 sm:gap-8">
        <ul className="flex gap-5 sm:gap-8">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="label link !text-ink">
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
