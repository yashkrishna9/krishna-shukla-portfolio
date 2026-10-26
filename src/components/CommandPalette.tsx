"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import type { SearchItem } from "@/lib/content";

function score(item: SearchItem, terms: string[]): number {
  const title = item.title.toLowerCase();
  const rest = `${item.description} ${item.keywords}`.toLowerCase();
  let total = 0;
  for (const t of terms) {
    if (title.startsWith(t)) total += 6;
    else if (title.includes(t)) total += 4;
    else if (rest.includes(t)) total += 1;
    else return 0; // every word must match somewhere
  }
  return total;
}

export function CommandPalette({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items.filter((i) => i.kind === "Page").slice(0, 8);
    return items
      .map((i) => ({ i, s: score(i, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((r) => r.i);
  }, [items, query]);

  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    // Always start from a clean search box when the palette is opened.
    const show = () => {
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else show();
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      className="fixed inset-0 z-50 grid place-items-start bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="glass mx-auto w-full max-w-xl overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") go(results[active]);
            }}
            placeholder="Search projects, notes, videos and pages"
            aria-label="Search"
            aria-controls="palette-list"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted">
              Nothing matches “{query}”. Try a subject such as “regression” or “utility”.
            </li>
          )}
          {results.map((r, idx) => (
            <li key={r.href + r.title} role="option" aria-selected={idx === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(idx)}
                onClick={() => go(r)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ${
                  idx === active ? "bg-line" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{r.title}</span>
                  <span className="block truncate text-xs text-muted">{r.description}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
                  {r.kind}
                  {idx === active && <CornerDownLeft size={12} aria-hidden />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
