import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Play } from "lucide-react";
import { labelFor, noteSubjects, noteTypes, projectCategories } from "@content/taxonomy";
import { getNote, getNotes, getProjects, getVideos } from "@/lib/content";
import { Breadcrumbs, Container, Tag } from "@/components/ui";
import { Markdown } from "@/components/Markdown";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return { title: "Note not found" };
  return { title: n.title, description: n.description, openGraph: { title: n.title, description: n.description, type: "article" } };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const videos = getVideos().filter((v) => note.relatedVideos.includes(v.id));
  const projects = getProjects().filter((p) => note.relatedProjects.includes(p.slug));
  const more = getNotes()
    .filter((n) => n.slug !== note.slug && (n.subject === note.subject || n.tags.some((t) => note.tags.includes(t))))
    .slice(0, 3);

  return (
    <Container className="pt-10">
      <Breadcrumbs
        trail={[
          { label: "Notes", href: "/notes" },
          { label: labelFor(noteSubjects, note.subject) },
          { label: note.title },
        ]}
      />

      <div className="grid gap-14 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0">
          <p className="text-sm text-muted">
            {[note.semester ? `Semester ${note.semester}` : "", labelFor(noteSubjects, note.subject), note.chapter, note.topic]
              .filter(Boolean)
              .join(" › ")}
          </p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{note.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{note.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-line-strong px-2 py-0.5 text-xs">{labelFor(noteTypes, note.type)}</span>
            {note.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            {note.updated && <span className="text-xs text-muted">Updated {note.updated}</span>}
          </div>
          <div className="mt-10 border-t border-line pt-2">
            <Markdown>{note.body}</Markdown>
          </div>
        </article>

        <aside className="grid content-start gap-8 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="dl">
            <h2 id="dl" className="text-sm text-muted">
              Download
            </h2>
            {note.pdf ? (
              <a href={note.pdf} download className="mt-2 flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                <Download size={15} aria-hidden /> Download PDF
              </a>
            ) : (
              <p className="mt-2 rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">
                No PDF for this note yet. Put the file in <code>public/pdfs</code> and name it in the note.
              </p>
            )}
          </section>

          <section aria-labelledby="rv">
            <h2 id="rv" className="text-sm text-muted">
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

          <section aria-labelledby="rp">
            <h2 id="rp" className="text-sm text-muted">
              Related projects
            </h2>
            {projects.length ? (
              <ul className="mt-2 grid gap-2">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="block rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                      {p.title}
                      <span className="block text-xs text-muted">{labelFor(projectCategories, p.category)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">None linked yet.</p>
            )}
          </section>

          {more.length > 0 && (
            <section aria-labelledby="mn">
              <h2 id="mn" className="text-sm text-muted">
                More like this
              </h2>
              <ul className="mt-2 grid gap-2">
                {more.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/notes/${n.slug}`} className="block rounded-xl border border-line px-4 py-3 text-sm hover:border-line-strong">
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </Container>
  );
}
