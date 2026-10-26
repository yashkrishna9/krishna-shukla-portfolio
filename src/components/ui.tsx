import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { labelFor, projectStatuses } from "@content/taxonomy";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-x-0 -top-16 h-[420px]" aria-hidden />
      <Container className="relative pb-10 pt-14 sm:pt-20">
        <h1 className="display text-5xl sm:text-7xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <li>
          <Link href="/" className="hover:text-text">
            Home
          </Link>
        </li>
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-1.5">
            <ChevronRight size={13} aria-hidden />
            {t.href && i < trail.length - 1 ? (
              <Link href={t.href} className="hover:text-text">
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-text">
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const statusStyle: Record<string, string> = {
  concept: "border-warn/50 text-warn",
  "in-progress": "border-cyan/50 text-cyan",
  completed: "border-accent/60 text-accent",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${statusStyle[status] ?? "border-line text-muted"}`}>
      {labelFor(projectStatuses, status)}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-line px-2 py-0.5 text-xs text-muted">{children}</span>;
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="display text-2xl">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{children}</div>}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const cls =
    variant === "primary"
      ? "bg-accent text-accent-ink hover:brightness-110"
      : "border border-line-strong text-text hover:bg-line";
  const common = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${cls}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={common}>
      {children}
    </a>
  ) : (
    <Link href={href} className={common}>
      {children}
    </Link>
  );
}
