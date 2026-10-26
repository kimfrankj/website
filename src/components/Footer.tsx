import { site, isPlaceholder } from "@/lib/site";

export function Footer() {
  const links = Object.entries(site.links).filter(([, v]) => !isPlaceholder(v));
  return (
    <footer className="vein-rule wrap mt-4 py-3">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <p className="label">© {new Date().getFullYear()} {site.name}</p>
        <ul className="flex gap-6">
          <li><a href={`mailto:${site.email}`} className="label link">Email</a></li>
          {links.map(([name, href]) => (
            <li key={name}>
              <a href={href} className="label link" rel="me noopener">{name}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
