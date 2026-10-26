"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Search, X } from "lucide-react";
import { EmptyState } from "./ui";
import { embedUrl, thumbnailUrl } from "@/lib/youtube";
import { videoCategories } from "@content/taxonomy";

export type VideoCardData = {
  id: string;
  title: string;
  videoId: string | null; // null means a placeholder (no valid YouTube link yet)
  invalidUrl: boolean;
  category: string;
  categoryLabel: string;
  playlist: string;
  description: string;
  featured: boolean;
  notes: { slug: string; title: string }[];
  projects: { slug: string; title: string }[];
};

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
    on ? "border-accent bg-accent/15 text-text" : "border-line text-muted hover:border-line-strong hover:text-text"
  }`;

function Thumb({ v, big = false }: { v: VideoCardData; big?: boolean }) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-bg2 ${big ? "" : ""}`}>
      {v.videoId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnailUrl(v.videoId)} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        <div className="grid size-full place-items-center bg-[repeating-linear-gradient(135deg,transparent_0_14px,var(--line)_14px_15px)]">
          <span className="rounded-full border border-warn/50 bg-bg/70 px-3 py-1 text-xs text-warn">Placeholder: no video linked yet</span>
        </div>
      )}
      {v.videoId && (
        <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/40">
          <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-ink shadow-lg">
            <Play size={22} aria-hidden fill="currentColor" />
          </span>
        </span>
      )}
    </div>
  );
}

function Player({ v, onClose }: { v: VideoCardData; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={v.title}
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="display text-2xl text-white">{v.title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close video" className="grid size-10 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
          <iframe
            src={embedUrl(v.videoId!)}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}

function Related({ v }: { v: VideoCardData }) {
  if (!v.notes.length && !v.projects.length) return null;
  return (
    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
      {v.notes.map((n) => (
        <Link key={n.slug} href={`/notes/${n.slug}`} className="underline-offset-4 hover:text-text hover:underline">
          Note: {n.title}
        </Link>
      ))}
      {v.projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} className="underline-offset-4 hover:text-text hover:underline">
          Project: {p.title}
        </Link>
      ))}
    </p>
  );
}

function VideoCard({ v, onOpen }: { v: VideoCardData; onOpen: (v: VideoCardData) => void }) {
  const inner = (
    <>
      <Thumb v={v} />
      <p className="mt-3 text-sm text-muted">{v.categoryLabel}</p>
      <h3 className="display mt-1 text-2xl leading-tight">{v.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
      {v.invalidUrl && <p className="mt-2 text-xs text-warn">The link in content/videos.ts is not a valid YouTube address.</p>}
    </>
  );
  return (
    <article id={v.id} className="scroll-mt-24">
      {v.videoId ? (
        <button type="button" onClick={() => onOpen(v)} className="group block w-full text-left" aria-label={`Play video: ${v.title}`}>
          {inner}
        </button>
      ) : (
        <div>{inner}</div>
      )}
      <Related v={v} />
    </article>
  );
}

export function VideoLibrary({ videos, channelUrl }: { videos: VideoCardData[]; channelUrl: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [playing, setPlaying] = useState<VideoCardData | null>(null);

  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return videos.filter((v) => {
      if (cat !== "all" && v.category !== cat) return false;
      const hay = `${v.title} ${v.description} ${v.playlist} ${v.categoryLabel}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [videos, q, cat]);

  const playlists = useMemo(() => {
    const map = new Map<string, VideoCardData[]>();
    for (const v of shown) map.set(v.playlist, [...(map.get(v.playlist) ?? []), v]);
    return Array.from(map.entries());
  }, [shown]);

  const featured = videos.find((v) => v.featured) ?? null;

  return (
    <div>
      {featured && !q && cat === "all" && (
        <section aria-labelledby="feat" className="mb-14">
          <h2 id="feat" className="display text-3xl">
            Featured video
          </h2>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            {featured.videoId ? (
              <button type="button" onClick={() => setPlaying(featured)} className="group block text-left" aria-label={`Play featured video: ${featured.title}`}>
                <Thumb v={featured} big />
              </button>
            ) : (
              <Thumb v={featured} big />
            )}
            <div>
              <p className="text-sm text-muted">{featured.categoryLabel}</p>
              <h3 className="display mt-1 text-4xl leading-tight">{featured.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{featured.description}</p>
              <Related v={featured} />
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-5">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search videos</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, topic or playlist"
            className="glass h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none placeholder:text-muted focus-visible:border-cyan"
          />
        </label>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
            All categories
          </button>
          {videoCategories.map((c) => (
            <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={chip(cat === c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No videos match those filters">
            Clear the search or choose another category.{" "}
            <button type="button" onClick={() => { setQ(""); setCat("all"); }} className="text-cyan underline underline-offset-4">
              Reset filters
            </button>
          </EmptyState>
        </div>
      ) : (
        playlists.map(([name, items]) => (
          <section key={name} className="mt-12" aria-labelledby={`pl-${name}`}>
            <h2 id={`pl-${name}`} className="display text-3xl">
              {name}
            </h2>
            <ul className="mt-5 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((v) => (
                <li key={v.id}>
                  <VideoCard v={v} onOpen={setPlaying} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <div className="mt-16 rounded-2xl border border-line p-6">
        {channelUrl ? (
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg hover:text-cyan">
            <Play size={16} aria-hidden /> Visit my YouTube channel
          </a>
        ) : (
          <p className="text-sm text-muted">
            Placeholder: add your channel address as <code>youtube</code> in <code>content/site.ts</code> and a channel link appears here.
          </p>
        )}
      </div>

      {playing && playing.videoId && <Player v={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
