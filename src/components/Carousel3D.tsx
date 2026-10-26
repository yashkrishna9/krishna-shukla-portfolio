"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ProjectArt } from "./ProjectArt";
import { StatusBadge } from "./ui";
import type { ProjectCategoryId } from "@content/taxonomy";

export type CarouselProject = {
  slug: string;
  title: string;
  status: string;
  category: ProjectCategoryId;
  categoryLabel: string;
  summary: string;
  hue: number;
};

/** Where a card sits for a given distance from the centre. */
function pose(offset: number) {
  const a = Math.abs(offset);
  const s = Math.sign(offset);
  if (a === 0) return { x: "0%", z: 0, ry: 0, scale: 1, opacity: 1 };
  if (a === 1) return { x: `${s * 62}%`, z: -170, ry: -s * 34, scale: 0.86, opacity: 0.9 };
  return { x: `${s * 100}%`, z: -340, ry: -s * 44, scale: 0.72, opacity: 0.45 };
}

export function Carousel3D({ projects }: { projects: CarouselProject[] }) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const n = projects.length;
  const [active, setActive] = useState(Math.min(2, n - 1));
  const drag = useRef<{ x: number } | null>(null);
  const dragged = useRef(false); // true right after a swipe, so the click that follows is ignored
  const live = useRef<HTMLParagraphElement>(null);

  const go = useCallback(
    (delta: number) => setActive((a) => (((a + delta) % n) + n) % n),
    [n],
  );

  if (n === 0) return null;

  // Shortest signed distance on a circle, so the ring wraps around.
  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  const transition = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.9 };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured project concepts"
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        }
      }}
    >
      <div
        className="relative mx-auto h-[430px] w-full select-none sm:h-[470px]"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 40%", touchAction: "pan-y" }}
        onPointerDown={(e) => {
          dragged.current = false;
          drag.current = { x: e.clientX };
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 8) dragged.current = true;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => (drag.current = null)}
      >
        {/* soft floor light under the centre card */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-1/2 h-16 w-[60%] max-w-md -translate-x-1/2 rounded-full opacity-70 blur-2xl"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 55%, transparent), transparent)" }}
        />

        {projects.map((p, i) => {
          const off = offsetOf(i);
          const visible = Math.abs(off) <= 2;
          const target = pose(off);
          const isActive = off === 0;
          return (
            <motion.div
              key={p.slug}
              className="absolute left-1/2 top-4 w-[min(78vw,360px)] -translate-x-1/2"
              style={{ transformStyle: "preserve-3d", zIndex: 10 - Math.abs(off) }}
              initial={false}
              animate={{
                x: target.x,
                z: target.z,
                rotateY: target.ry,
                scale: target.scale,
                opacity: visible ? target.opacity : 0,
              }}
              transition={transition}
              aria-hidden={!isActive}
            >
              <Card
                project={p}
                active={isActive}
                reduced={reduced}
                onSideClick={() => {
                  if (!dragged.current) setActive(i);
                }}
                onOpen={() => {
                  if (!dragged.current) router.push(`/projects/${p.slug}`);
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="grid size-11 place-items-center rounded-full border border-line-strong text-text transition-colors hover:bg-line"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose project">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${p.title}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${i === active ? "w-7 bg-accent" : "w-2 bg-line-strong hover:bg-muted"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="grid size-11 place-items-center rounded-full border border-line-strong text-text transition-colors hover:bg-line"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
      <p ref={live} className="sr-only" aria-live="polite">
        {`Project ${active + 1} of ${n}: ${projects[active].title}`}
      </p>
      <p className="mt-3 text-center text-xs text-muted">
        Drag, swipe, use the arrow keys, or press the buttons. Click the centre card to open it. These are concepts and works in progress.
      </p>
    </section>
  );
}

function Card({
  project: p,
  active,
  reduced,
  onSideClick,
  onOpen,
}: {
  project: CarouselProject;
  active: boolean;
  reduced: boolean;
  onSideClick: () => void;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Hover tilt and moving highlight on the centre card only.
  const onMove = (e: React.PointerEvent) => {
    if (!active || reduced || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    ref.current.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={(e) => {
        if (!active) {
          e.preventDefault();
          onSideClick();
        }
      }}
      className="relative h-[360px] w-full cursor-pointer overflow-hidden rounded-3xl border border-line-strong transition-[transform] duration-200 ease-out sm:h-[390px]"
      style={{
        transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        background: `linear-gradient(165deg, color-mix(in oklab, hsl(${p.hue} 90% 58%) 24%, var(--surface-solid)), var(--surface-solid) 70%)`,
        boxShadow: active ? "0 40px 70px -30px rgba(0,0,0,0.75), 0 0 0 1px var(--line)" : "0 20px 40px -24px rgba(0,0,0,0.6)",
      }}
    >
      {/* moving specular highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: "radial-gradient(420px circle at var(--mx, 30%) var(--my, 0%), rgba(255,255,255,0.10), transparent 55%)",
        }}
      />
      <div className="relative flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <ProjectArt category={p.category} className="size-20 shrink-0" />
          <StatusBadge status={p.status} />
        </div>
        <p className="mt-5 text-sm text-muted">{p.categoryLabel}</p>
        <h3 className="display mt-1 text-[1.9rem] leading-[1.05]">{p.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{p.summary}</p>
        <div className="mt-auto">
          {active ? (
            <Link
              href={`/projects/${p.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onOpen();
              }}
              className="inline-flex items-center gap-1.5 text-sm text-text after:absolute after:inset-0 after:content-['']"
            >
              Open project <ArrowUpRight size={15} aria-hidden />
            </Link>
          ) : (
            <span className="text-sm text-muted">Bring to front</span>
          )}
        </div>
      </div>
    </div>
  );
}
