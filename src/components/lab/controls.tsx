"use client";

import { useId } from "react";
import katex from "katex";

export const fmt = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  const v = Math.abs(n) < 1e-9 ? 0 : n;
  return v.toLocaleString("en-IN", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
};

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
        <output htmlFor={id} className="text-sm tabular-nums text-cyan">
          {fmt(value)}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${fmt(value)}${unit}`}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-line-strong accent-[var(--accent)]"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.id}
            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan ${
              value === o.id ? "border-accent bg-accent/15 text-text" : "border-line text-muted hover:border-line-strong hover:text-text"
            }`}
          >
            <input type="radio" name={label} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Renders a LaTeX string with KaTeX. Only ever used with strings written in this codebase. */
export function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = katex.renderToString(children, { displayMode: block, throwOnError: false, strict: "ignore" });
  return <span className={block ? "block overflow-x-auto py-1" : ""} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Stat({ label, value, unit = "" }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-line px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-xl tabular-nums">
        {value}
        {unit && <span className="ml-1 text-sm text-muted">{unit}</span>}
      </dd>
    </div>
  );
}

/** Two-column layout used by every model: chart on the left, controls on the right. */
export function ModelLayout({
  chart,
  controls,
  below,
}: {
  chart: React.ReactNode;
  controls: React.ReactNode;
  below: React.ReactNode;
}) {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="glass min-w-0 rounded-3xl p-4 sm:p-6">{chart}</div>
        <div className="glass grid content-start gap-5 rounded-3xl p-5 sm:p-6">{controls}</div>
      </div>
      <div className="mt-6">{below}</div>
    </div>
  );
}

export const chartColors = {
  axis: "var(--muted)",
  grid: "var(--line)",
  blue: "var(--accent)",
  cyan: "var(--cyan)",
  text: "var(--text)",
  warn: "var(--warn)",
};

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-line bg-bg2/60 px-4 py-3 text-sm leading-relaxed text-muted">{children}</p>;
}
