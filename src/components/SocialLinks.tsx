import { GitBranch, Link2, Mail, Play } from "lucide-react";
import { site } from "@content/site";

/** Shows only the links that have been filled in inside content/site.ts. */
export function SocialLinks({ showEmptyHint = false }: { showEmptyHint?: boolean }) {
  const l = site.links;
  const items = [
    { href: l.github, label: "GitHub", Icon: GitBranch },
    { href: l.linkedin, label: "LinkedIn", Icon: Link2 },
    { href: l.youtube, label: "YouTube", Icon: Play },
    { href: l.email ? `mailto:${l.email}` : "", label: "Email", Icon: Mail },
  ].filter((i) => i.href);

  if (!items.length) {
    return showEmptyHint ? (
      <p className="text-sm text-muted">
        Placeholder: add your GitHub, LinkedIn, YouTube and email in <code>content/site.ts</code>.
      </p>
    ) : null;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-text"
          >
            <Icon size={15} aria-hidden />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
