"use client";

import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Dataset } from "@content/data/sample";
import { Slider, chartColors, fmt } from "./lab/controls";

const palette = [chartColors.blue, chartColors.cyan, chartColors.warn];

function DatasetCard({ d }: { d: Dataset }) {
  const total = d.rows.length;
  const [last, setLast] = useState(total);
  const [hidden, setHidden] = useState<string[]>([]);
  const rows = d.kind === "timeseries" ? d.rows.slice(Math.max(0, total - last)) : d.rows;

  return (
    <section className="glass rounded-3xl p-5 sm:p-7" aria-labelledby={`d-${d.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`d-${d.id}`} className="display text-3xl">
            {d.title}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">{d.description}</p>
        </div>
        {d.isSample && <span className="rounded-full border border-warn/50 px-3 py-1 text-xs text-warn">Sample data</span>}
      </div>

      <div role="img" aria-label={`${d.title}. Line chart of ${d.series.map((s) => s.label).join(" and ")}.`} className="mt-5 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 20, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} />
            <XAxis dataKey="x" tick={{ fill: chartColors.axis, fontSize: 11 }} interval="preserveStartEnd" label={{ value: d.xLabel, position: "insideBottom", offset: -12, fill: chartColors.axis, fontSize: 11 }} />
            <YAxis tick={{ fill: chartColors.axis, fontSize: 11 }} tickFormatter={(v) => fmt(v, 1)} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--line-strong)", borderRadius: 12, color: "var(--text)", fontSize: 13 }}
              formatter={(v) => (typeof v === "number" ? fmt(v, 2) : String(v))}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {d.series.map((s, i) => (
              <Line key={s.key} dataKey={s.key} name={s.label} hide={hidden.includes(s.key)} stroke={palette[i % palette.length]} strokeWidth={2.4} dot={d.kind === "curve"} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
        {d.series.length > 1 && (
          <fieldset>
            <legend className="text-sm">Show series</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {d.series.map((s) => (
                <label key={s.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--accent)]"
                    checked={!hidden.includes(s.key)}
                    onChange={(e) => setHidden((h) => (e.target.checked ? h.filter((k) => k !== s.key) : [...h, s.key]))}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {d.kind === "timeseries" && (
          <div className="w-full max-w-xs">
            <Slider label="Periods shown (most recent)" value={last} min={4} max={total} step={1} onChange={setLast} />
          </div>
        )}
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-1 border-t border-line pt-4 text-xs text-muted sm:grid-cols-2">
        <div className="flex gap-2"><dt>Unit:</dt><dd>{d.unit}</dd></div>
        <div className="flex gap-2"><dt>Frequency:</dt><dd>{d.frequency}</dd></div>
        <div className="flex gap-2"><dt>Source:</dt><dd>{d.source}</dd></div>
        <div className="flex gap-2"><dt>Data retrieved:</dt><dd>{d.retrievedAt ?? "Not applicable (not fetched from a source)"}</dd></div>
      </dl>
    </section>
  );
}

export function DataDashboard({ datasets }: { datasets: Dataset[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {datasets.map((d) => (
        <DatasetCard key={d.id} d={d} />
      ))}
    </div>
  );
}
