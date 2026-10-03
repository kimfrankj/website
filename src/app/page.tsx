import Link from "next/link";

const index = [
  { href: "/about", label: "About", note: "" },
  { href: "/projects", label: "Projects", note: "Private" },
  { href: "/writing", label: "Writing", note: "Private" },
];

export default function Home() {
  return (
    <section className="wrap pt-16 pb-24 md:pt-28 md:pb-36">
      <h1 className="display text-hero max-w-3xl">Welcome to my sandbox</h1>

      <ul className="mt-16 md:mt-24">
        {index.map((item, i) => (
          <li key={item.href} className="ruled ruled-last">
            <Link
              href={item.href}
              className="group -mx-4 grid grid-cols-12 items-baseline gap-4 px-4 py-6 transition-colors hover:bg-surface"
            >
              <span className="label col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="display col-span-6 text-2xl transition-colors group-hover:text-accent md:col-span-7 md:text-3xl">
                {item.label}
              </span>
              <span className="label col-span-4 text-right md:col-span-4">{item.note || "→"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
