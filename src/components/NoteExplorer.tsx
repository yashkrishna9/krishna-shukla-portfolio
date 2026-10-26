"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileDown, Search } from "lucide-react";
import { EmptyState, Tag } from "./ui";
import { noteSubjects, noteTypes } from "@content/taxonomy";

export type NoteCardData = {
  slug: string;
  title: string;
  description: string;
  semester: number | null;
  subject: string;
  subjectLabel: string;
  chapter: string;
  topic: string;
  type: string;
  typeLabel: string;
  tags: string[];
  hasPdf: boolean;
};

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
    on ? "border-accent bg-accent/15 text-text" : "border-line text-muted hover:border-line-strong hover:text-text"
  }`;

export function NoteExplorer({ notes }: { notes: NoteCardData[] }) {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [semester, setSemester] = useState("all");

  const semesters = useMemo(
    () => Array.from(new Set(notes.map((n) => n.semester).filter((s): s is number => s !== null))).sort((a, b) => a - b),
    [notes],
  );

  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return notes.filter((n) => {
      if (subject !== "all" && n.subject !== subject) return false;
      if (type !== "all" && n.type !== type) return false;
      if (semester !== "all" && String(n.semester) !== semester) return false;
      const hay = `${n.title} ${n.description} ${n.chapter} ${n.topic} ${n.tags.join(" ")} ${n.subjectLabel}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [notes, q, subject, type, semester]);

  // Group by semester, then subject, so the library reads like a syllabus.
  const groups = useMemo(() => {
    const map = new Map<string, NoteCardData[]>();
    for (const n of shown) {
      const key = n.semester === null ? "Unassigned semester" : `Semester ${n.semester}`;
      map.set(key, [...(map.get(key) ?? []), n]);
    }
    return Array.from(map.entries());
  }, [shown]);

  const reset = () => {
    setQ("");
    setSubject("all");
    setType("all");
    setSemester("all");
  };

  return (
    <div>
      <div className="grid gap-5">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search notes</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, chapter, topic or tag"
            className="glass h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none placeholder:text-muted focus-visible:border-cyan"
          />
        </label>
        <div role="group" aria-label="Filter by subject" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={subject === "all"} onClick={() => setSubject("all")} className={chip(subject === "all")}>
            All subjects
          </button>
          {noteSubjects.map((s) => (
            <button key={s.id} type="button" aria-pressed={subject === s.id} onClick={() => setSubject(s.id)} className={chip(subject === s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div role="group" aria-label="Filter by resource type" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={type === "all"} onClick={() => setType("all")} className={chip(type === "all")}>
              Any type
            </button>
            {noteTypes.map((t) => (
              <button key={t.id} type="button" aria-pressed={type === t.id} onClick={() => setType(t.id)} className={chip(type === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          {semesters.length > 0 && (
            <div role="group" aria-label="Filter by semester" className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={semester === "all"} onClick={() => setSemester("all")} className={chip(semester === "all")}>
                Any semester
              </button>
              {semesters.map((s) => (
                <button key={s} type="button" aria-pressed={semester === String(s)} onClick={() => setSemester(String(s))} className={chip(semester === String(s))}>
                  Semester {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        Showing {shown.length} of {notes.length} resources
      </p>

      {shown.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No notes match those filters">
            Clear the search or filters to see everything.{" "}
            <button type="button" onClick={reset} className="text-cyan underline underline-offset-4">
              Reset filters
            </button>
          </EmptyState>
        </div>
      ) : (
        groups.map(([label, items]) => (
          <section key={label} className="mt-10" aria-labelledby={`g-${label}`}>
            <h2 id={`g-${label}`} className="display text-3xl">
              {label}
            </h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((n) => (
                <li key={n.slug}>
                  <Link href={`/notes/${n.slug}`} className="glass group flex h-full flex-col rounded-2xl p-5 transition-colors hover:border-line-strong">
                    <p className="text-sm text-muted">{n.subjectLabel}</p>
                    <h3 className="display mt-1 text-2xl leading-tight">{n.title}</h3>
                    {(n.chapter || n.topic) && (
                      <p className="mt-1 text-sm text-muted">{[n.chapter, n.topic].filter(Boolean).join(" › ")}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-muted">{n.description}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                      <span className="rounded-md border border-line-strong px-2 py-0.5 text-xs">{n.typeLabel}</span>
                      {n.tags.slice(0, 3).map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                      {n.hasPdf && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-cyan">
                          <FileDown size={13} aria-hidden /> PDF
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
