import { Brand } from "@/components/Brand";
import { NavLinks } from "@/components/NavLinks";

export function Header() {
  return (
    <header className="header-in wrap relative z-20 flex flex-col gap-4 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:py-8">
      <Brand />
      <nav aria-label="Primary" className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-8">
        <NavLinks />
      </nav>
    </header>
  );
}
