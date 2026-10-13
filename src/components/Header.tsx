import Link from "next/link";
import { nav } from "@/lib/site";
import { Brand } from "@/components/Brand";

export function Header() {
  return (
    <header className="wrap relative z-20 flex flex-col gap-4 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:py-8">
      <Brand />
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
      </nav>
    </header>
  );
}
