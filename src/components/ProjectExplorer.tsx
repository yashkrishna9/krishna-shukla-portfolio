"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { ProjectArt } from "./ProjectArt";
import { EmptyState, StatusBadge, Tag } from "./ui";
import { projectCategories, projectStatuses, type ProjectCategoryId } from "@content/taxonomy";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  status: string;
  category: ProjectCategoryId;
  categoryLabel: string;
  tags: string[];
  featured: boolean;
  hue: number;
};

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
    on ? "border-accent bg-accent/15 text-text" : "border-line text-muted hover:border-line-strong hover:text-text"
  }`;

export function ProjectExplorer({ projects }: { projects: ProjectCardData[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return projects.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (status !== "all" && p.status !== status) return false;
      if (featuredOnly && !p.featured) return false;
      const hay = `${p.title} ${p.summary} ${p.tags.join(" ")} ${p.categoryLabel}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [projects, q, cat, status, featuredOnly]);

  const reset = () => {
    setQ("");
    setCat("all");
    setStatus("all");
    setFeaturedOnly(false);
  };

  return (
    <div>
      <div className="grid gap-5">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search projects</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, topic or tag"
            className="glass h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none placeholder:text-muted focus-visible:border-cyan"
          />
        </label>

        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
            All categories
          </button>
          {projectCategories.map((c) => (
            <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={chip(cat === c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={status === "all"} onClick={() => setStatus("all")} className={chip(status === "all")}>
              Any status
            </button>
            {projectStatuses.map((s) => (
              <button key={s.id} type="button" aria-pressed={status === s.id} onClick={() => setStatus(s.id)} className={chip(status === s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <button type="button" aria-pressed={featuredOnly} onClick={() => setFeaturedOnly((f) => !f)} className={`${chip(featuredOnly)} inline-flex items-center gap-1.5`}>
            <Star size={13} aria-hidden /> Featured only
          </button>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        Showing {shown.length} of {projects.length} projects
      </p>

      {shown.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No projects match those filters">
            Clear the search or filters to see everything.{" "}
            <button type="button" onClick={reset} className="text-cyan underline underline-offset-4">
              Reset filters
            </button>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug} className={p.featured ? "xl:first:col-span-2" : ""}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProjectCard({ project: p }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line p-6 transition-colors hover:border-line-strong"
      style={{ background: `linear-gradient(165deg, color-mix(in oklab, hsl(${p.hue} 90% 58%) 16%, var(--surface-solid)), var(--surface-solid) 65%)` }}
    >
      <div className="flex items-start justify-between gap-4">
        <ProjectArt category={p.category} className="size-16 shrink-0 transition-transform duration-300 group-hover:scale-105" />
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={p.status} />
          {p.featured && (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Star size={11} aria-hidden /> Featured
            </span>
          )}
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">{p.categoryLabel}</p>
      <h3 className="display mt-1 text-3xl leading-tight">{p.title}</h3>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{p.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {p.tags.slice(0, 4).map((t) => (
          <li key={t}>
            <Tag>{t}</Tag>
          </li>
        ))}
      </ul>
    </Link>
  );
}
