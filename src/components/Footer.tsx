import Link from "next/link";
import { site } from "@content/site";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-2xl">{site.title}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {site.name} · {site.program}. A personal research and learning site that grows through the degree.
          </p>
        </div>
        <ul className="grid content-start gap-2 text-sm text-muted">
          {site.nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="transition-colors hover:text-text">
                {n.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/data" className="transition-colors hover:text-text">
              Data dashboard
            </Link>
          </li>
        </ul>
        <div>
          <p className="text-sm text-muted">Get in touch</p>
          <div className="mt-3">
            <SocialLinks showEmptyHint />
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-7xl px-5 pb-10 text-xs text-muted sm:px-8">
        Educational content only. Nothing here is financial advice, and illustrative data is always labelled as such.
      </p>
    </footer>
  );
}
