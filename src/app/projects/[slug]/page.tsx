import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, GitBranch, Play } from "lucide-react";
import { labelFor, projectCategories, noteSubjects } from "@content/taxonomy";
import { getNotes, getProject, getProjects, getVideos } from "@/lib/content";
import { Breadcrumbs, Container, EmptyState, StatusBadge, Tag } from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { ProjectArt } from "@/components/ProjectArt";
import { ProjectCard } from "@/components/ProjectExplorer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, type: "article" },
  };
}

/** The sections every project page shows, in order. A missing one shows an empty state. */
const slots = [
  { title: "Motivation and background", match: /^motivation|^background/i },
  { title: "Data sources and limitations", match: /^data/i },
  { title: "Methodology and equations", match: /^method/i },
  { title: "Charts and visualisations", match: /^chart|^visual/i },
  { title: "Results and interpretation", match: /^result/i },
  { title: "Limitations and potential improvements", match: /^limit|^next/i },
];

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const used = new Set<number>();
  const rendered = slots.map((slot) => {
    const idx = project.sections.findIndex((s, i) => !used.has(i) && slot.match.test(s.heading));
    if (idx >= 0) used.add(idx);
    return { title: slot.title, body: idx >= 0 ? project.sections[idx].body : "" };
  });
  const extras = project.sections.filter((_, i) => !used.has(i));

  const allNotes = getNotes();
  const allVideos = getVideos();
  const notes = project.relatedNotes.map((s) => allNotes.find((n) => n.slug === s)).filter((x) => x !== undefined);
  const videos = project.relatedVideos.map((s) => allVideos.find((v) => v.id === s)).filter((x) => x !== undefined);

  const similar = getProjects()
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({
      p,
      score: (p.category === project.category ? 2 : 0) + p.tags.filter((t) => project.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.p);

  return (
    <Container className="pb-8 pt-10">
      <Breadcrumbs trail={[{ label: "Projects", href: "/projects" }, { label: project.title }]} />

      <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-sm text-muted">{labelFor(projectCategories, project.category)}</span>
          </div>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
        <ProjectArt category={project.category} className="hidden size-40 lg:block" />
      </header>

      {project.status === "concept" && (
        <p className="mt-8 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm leading-relaxed">
          This project is a concept. It describes what is planned. No data has been analysed and no results exist yet.
        </p>
      )}

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <section aria-labelledby="rq" className="glass rounded-2xl p-6">
            <h2 id="rq" className="text-sm text-muted">
              Research question
            </h2>
            <p className="display mt-2 text-3xl leading-snug">{project.researchQuestion || "Not written yet."}</p>
          </section>

          {[...rendered, ...extras.map((e) => ({ title: e.heading, body: e.body }))].map((s) => (
            <section key={s.title} className="mt-12" aria-labelledby={`s-${s.title}`}>
              <h2 id={`s-${s.title}`} className="display text-3xl">
                {s.title}
              </h2>
              <div className="mt-3">
                {s.body ? (
                  <Markdown>{s.body}</Markdown>
                ) : (
                  <EmptyState title="Not added yet">This section will be filled in as the project develops.</EmptyState>
                )}
              </div>
            </section>
          ))}
        </div>

        <aside className="grid content-start gap-8 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="tools">
            <h2 id="tools" className="text-sm text-muted">
              Tools and technologies
            </h2>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.tools.length ? project.tools.map((t) => <li key={t}><Tag>{t}</Tag></li>) : <li className="text-sm text-muted">Not listed yet</li>}
            </ul>
          </section>

          <section aria-labelledby="files" className="grid gap-2">
            <h2 id="files" className="text-sm text-muted">
              Code and report
            </h2>
            {project.github ? (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                <GitBranch size={15} aria-hidden /> GitHub repository
              </a>
            ) : (
              <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">Repository link: placeholder, none added yet.</p>
            )}
            {project.report ? (
              <a href={project.report} download className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                <Download size={15} aria-hidden /> Download report (PDF)
              </a>
            ) : (
              <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">Report: none published yet.</p>
            )}
          </section>

          <section aria-labelledby="rel-notes">
            <h2 id="rel-notes" className="text-sm text-muted">
              Related notes
            </h2>
            {notes.length ? (
              <ul className="mt-2 grid gap-2">
                {notes.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/notes/${n.slug}`} className="block rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                      {n.title}
                      <span className="block text-xs text-muted">{labelFor(noteSubjects, n.subject)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">None linked yet.</p>
            )}
          </section>

          <section aria-labelledby="rel-videos">
            <h2 id="rel-videos" className="text-sm text-muted">
              Related videos
            </h2>
            {videos.length ? (
              <ul className="mt-2 grid gap-2">
                {videos.map((v) => (
                  <li key={v.id}>
                    <Link href={`/videos#${v.id}`} className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                      <Play size={14} aria-hidden /> {v.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">None linked yet.</p>
            )}
          </section>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-20" aria-labelledby="similar">
          <h2 id="similar" className="display text-3xl">
            Related projects
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {similar.map((p) => (
              <li key={p.slug}>
                <ProjectCard
                  project={{
                    slug: p.slug,
                    title: p.title,
                    summary: p.summary,
                    status: p.status,
                    category: p.category,
                    categoryLabel: labelFor(projectCategories, p.category),
                    tags: p.tags,
                    featured: p.featured,
                    hue: p.hue,
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
