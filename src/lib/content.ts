import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { videos, type VideoEntry } from "@content/videos";
import { site } from "@content/site";
import {
  labelFor,
  noteSubjects,
  projectCategories,
  type NoteSubjectId,
  type NoteTypeId,
  type ProjectCategoryId,
  type ProjectStatusId,
} from "@content/taxonomy";

const ROOT = process.cwd();
const PROJECT_DIR = path.join(ROOT, "content", "projects");
const NOTE_DIR = path.join(ROOT, "content", "notes");
const PDF_DIR = path.join(ROOT, "public", "pdfs");
const REPORT_DIR = path.join(ROOT, "public", "reports");

/* ---------------------------- helpers ---------------------------- */

function readMarkdownDir(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .filter((f) => !f.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx?$/, ""), data, content };
    });
}

const asArray = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const asString = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : v == null ? fallback : String(v));

/** Returns the public URL only if the file really exists. Never invents a link. */
export function existingFile(kind: "pdf" | "report", filename: string): string | null {
  if (!filename) return null;
  const safe = path.basename(filename);
  const dir = kind === "pdf" ? PDF_DIR : REPORT_DIR;
  const url = kind === "pdf" ? `/pdfs/${safe}` : `/reports/${safe}`;
  return fs.existsSync(path.join(dir, safe)) ? url : null;
}

export function cvUrl(): string | null {
  if (!site.links.cv) return null;
  const local = path.join(ROOT, "public", site.links.cv.replace(/^\//, ""));
  return fs.existsSync(local) ? site.links.cv : null;
}

/* ---------------------------- projects ---------------------------- */

export type ProjectSection = { heading: string; body: string };

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatusId;
  category: ProjectCategoryId;
  tags: string[];
  featured: boolean;
  summary: string;
  researchQuestion: string;
  github: string;
  report: string | null;
  tools: string[];
  relatedNotes: string[];
  relatedVideos: string[];
  sections: ProjectSection[];
  hue: number;
};

function splitSections(body: string): ProjectSection[] {
  const parts = body.split(/^##\s+/m).slice(1);
  return parts.map((p) => {
    const [first, ...rest] = p.split("\n");
    return { heading: first.trim(), body: rest.join("\n").trim() };
  });
}

export function getProjects(): Project[] {
  const items = readMarkdownDir(PROJECT_DIR).map(({ slug, data, content }): Project => {
    const status = asString(data.status, "concept") as ProjectStatusId;
    return {
      slug,
      title: asString(data.title, slug),
      status,
      category: asString(data.category, "python-data") as ProjectCategoryId,
      tags: asArray(data.tags),
      featured: Boolean(data.featured),
      summary: asString(data.summary),
      researchQuestion: asString(data.researchQuestion),
      github: asString(data.github),
      report: existingFile("report", asString(data.report)),
      tools: asArray(data.tools),
      relatedNotes: asArray(data.relatedNotes),
      relatedVideos: asArray(data.relatedVideos),
      sections: splitSections(content),
      hue: Number(data.hue ?? 215),
    };
  });
  // Featured order follows content/site.ts, then everything else alphabetically.
  const order = site.featuredProjects;
  return items.sort((a, b) => {
    const ia = order.indexOf(a.slug);
    const ib = order.indexOf(b.slug);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.title.localeCompare(b.title);
  });
}

export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug) ?? null;

export function getFeaturedProjects(): Project[] {
  const all = getProjects();
  const picked = site.featuredProjects.map((s) => all.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p));
  return picked.length ? picked : all.filter((p) => p.featured).slice(0, 5);
}

/* ------------------------------ notes ------------------------------ */

export type Note = {
  slug: string;
  title: string;
  description: string;
  semester: number | null;
  subject: NoteSubjectId;
  chapter: string;
  topic: string;
  type: NoteTypeId;
  tags: string[];
  pdf: string | null;
  relatedVideos: string[];
  relatedProjects: string[];
  updated: string;
  body: string;
};

export function getNotes(): Note[] {
  return readMarkdownDir(NOTE_DIR)
    .map(({ slug, data, content }): Note => ({
      slug,
      title: asString(data.title, slug),
      description: asString(data.description),
      semester: data.semester == null ? null : Number(data.semester),
      subject: asString(data.subject, "microeconomics") as NoteSubjectId,
      chapter: asString(data.chapter),
      topic: asString(data.topic),
      type: asString(data.type, "notes") as NoteTypeId,
      tags: asArray(data.tags),
      pdf: existingFile("pdf", asString(data.pdf)),
      relatedVideos: asArray(data.relatedVideos),
      relatedProjects: asArray(data.relatedProjects),
      updated: asString(data.updated),
      body: content,
    }))
    .sort((a, b) => (a.semester ?? 99) - (b.semester ?? 99) || a.title.localeCompare(b.title));
}

export const getNote = (slug: string) => getNotes().find((n) => n.slug === slug) ?? null;

/* ------------------------------ videos ------------------------------ */

export const getVideos = (): VideoEntry[] => videos;

/* ----------------------------- search ----------------------------- */

export type SearchItem = {
  kind: "Project" | "Note" | "Video" | "Page";
  title: string;
  description: string;
  href: string;
  keywords: string;
};

export function buildSearchIndex(): SearchItem[] {
  const pages: SearchItem[] = [
    ...site.nav.map((n) => ({ kind: "Page" as const, title: n.label, description: "Go to page", href: n.href, keywords: "" })),
    { kind: "Page", title: "Data dashboard", description: "Indian macro and market indicators (labelled sample data)", href: "/data", keywords: "inflation gdp yield" },
    { kind: "Page", title: "Consumer Choice Simulator", description: "Budget line, indifference curves, optimal bundle", href: "/lab/consumer-choice", keywords: "utility" },
    { kind: "Page", title: "Monopoly Simulator", description: "Demand, marginal revenue and marginal cost", href: "/lab/monopoly", keywords: "profit" },
    { kind: "Page", title: "Supply & Demand Explorer", description: "Equilibrium, price ceilings and floors", href: "/lab/supply-demand", keywords: "equilibrium" },
    { kind: "Page", title: "Econometrics Playground", description: "Simple linear regression on synthetic data", href: "/lab/regression", keywords: "ols r-squared" },
  ];
  const projects = getProjects().map((p) => ({
    kind: "Project" as const,
    title: p.title,
    description: p.summary,
    href: `/projects/${p.slug}`,
    keywords: [...p.tags, labelFor(projectCategories, p.category)].join(" "),
  }));
  const notes = getNotes().map((n) => ({
    kind: "Note" as const,
    title: n.title,
    description: n.description,
    href: `/notes/${n.slug}`,
    keywords: [...n.tags, n.topic, n.chapter, labelFor(noteSubjects, n.subject)].join(" "),
  }));
  const vids = getVideos().map((v) => ({
    kind: "Video" as const,
    title: v.title,
    description: v.description,
    href: `/videos#${v.id}`,
    keywords: `${v.category} ${v.playlist}`,
  }));
  return [...pages, ...projects, ...notes, ...vids];
}
