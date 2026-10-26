"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceDot, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  budgetIntercepts,
  indifferenceCurve,
  optimalBundle,
  utilityLabels,
  type UtilityKind,
} from "@/lib/econ/consumer";
import { Note, ModelLayout, Segmented, Slider, Stat, Tex, chartColors, fmt } from "./controls";

type Setup = { kind: UtilityKind; a: number; m: number; px: number; py: number };

const pct = (from: number, to: number) => (from === 0 ? (to === 0 ? "no change" : "new") : `${to >= from ? "+" : ""}${fmt(((to - from) / from) * 100, 1)}%`);

export function ConsumerChoice() {
  const [s, setS] = useState<Setup>({ kind: "cobb-douglas", a: 0.5, m: 200, px: 4, py: 5 });
  const [base, setBase] = useState<Setup>(s);
  const set = (patch: Partial<Setup>) => setS((p) => ({ ...p, ...patch }));

  const opt = useMemo(() => optimalBundle(s.kind, s.a, s.m, s.px, s.py), [s]);
  const baseOpt = useMemo(() => optimalBundle(base.kind, base.a, base.m, base.px, base.py), [base]);
  const bi = budgetIntercepts(s.m, s.px, s.py);
  const bb = budgetIntercepts(base.m, base.px, base.py);

  const max = Math.max(bi.x, bi.y, opt.x, opt.y) * 1.12;
  const levels = [0.5, 0.75, 1, 1.3].map((f) => f * opt.u);
  const curves = levels.map((l) => indifferenceCurve(s.kind, s.a, l, max, max));
  const changed = JSON.stringify(s) !== JSON.stringify(base);

  const share = s.kind === "cobb-douglas" ? s.a : null;
  const why =
    s.kind === "cobb-douglas"
      ? `With Cobb-Douglas preferences the consumer always spends the fixed share a = ${fmt(s.a)} of income on X, which is ₹${fmt(s.a * s.m)}, and the rest on Y.`
      : s.kind === "substitutes"
        ? `The two goods are perfect substitutes, so only the cheaper source of satisfaction is bought. Utility per rupee is a/p_x = ${fmt(s.a / s.px, 3)} for X and (1−a)/p_y = ${fmt((1 - s.a) / s.py, 3)} for Y, so the consumer spends everything on ${opt.kind === "corner-x" ? "X" : "Y"} (a corner solution).`
        : `The goods are perfect complements, so they are consumed in the fixed ratio X : Y = a : (1−a) = ${fmt(s.a)} : ${fmt(1 - s.a)}. The optimum sits at the kink of the L-shaped indifference curve.`;

  return (
    <ModelLayout
      chart={
        <>
          <div role="img" aria-label={`Budget line and indifference curves. Optimal bundle: ${fmt(opt.x)} of good X and ${fmt(opt.y)} of good Y.`} className="h-[420px] w-full sm:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 10, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis type="number" dataKey="x" domain={[0, max]} allowDataOverflow tick={{ fill: chartColors.axis, fontSize: 12 }} tickFormatter={(v) => fmt(v, 0)} label={{ value: "Good X (units)", position: "insideBottom", offset: -16, fill: chartColors.axis, fontSize: 12 }} />
                <YAxis type="number" dataKey="y" domain={[0, max]} allowDataOverflow tick={{ fill: chartColors.axis, fontSize: 12 }} tickFormatter={(v) => fmt(v, 0)} label={{ value: "Good Y (units)", angle: -90, position: "insideLeft", fill: chartColors.axis, fontSize: 12 }} />
                {changed && (
                  <Line data={[{ x: 0, y: bb.y }, { x: bb.x, y: 0 }]} dataKey="y" stroke={chartColors.axis} strokeDasharray="5 5" dot={false} isAnimationActive={false} legendType="none" />
                )}
                {curves.map((c, i) => (
                  <Line key={i} data={c} dataKey="y" stroke={chartColors.cyan} strokeWidth={levels[i] === opt.u ? 2.6 : 1.2} strokeOpacity={levels[i] === opt.u ? 1 : 0.5} dot={false} isAnimationActive={false} />
                ))}
                <Line data={[{ x: 0, y: bi.y }, { x: bi.x, y: 0 }]} dataKey="y" stroke={chartColors.blue} strokeWidth={2.6} dot={false} isAnimationActive={false} />
                <ReferenceDot x={opt.x} y={opt.y} r={7} fill={chartColors.text} stroke={chartColors.blue} strokeWidth={3} ifOverflow="visible" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            <li><span className="mr-1.5 inline-block h-0.5 w-5 bg-accent align-middle" />Budget line</li>
            <li><span className="mr-1.5 inline-block h-0.5 w-5 bg-cyan align-middle" />Indifference curves (thick = highest reachable)</li>
            {changed && <li><span className="mr-1.5 inline-block h-0.5 w-5 border-t border-dashed border-muted align-middle" />Baseline budget line</li>}
          </ul>
        </>
      }
      controls={
        <>
          <Segmented<UtilityKind>
            label="Utility function"
            value={s.kind}
            onChange={(kind) => set({ kind })}
            options={(Object.keys(utilityLabels) as UtilityKind[]).map((k) => ({ id: k, label: utilityLabels[k].name }))}
          />
          <p className="text-sm text-muted">{utilityLabels[s.kind].formula}</p>
          <Slider label="Taste weight a" value={s.a} min={0.1} max={0.9} step={0.05} onChange={(a) => set({ a })} hint="How much the consumer values X relative to Y." />
          <Slider label="Income m" value={s.m} min={20} max={600} step={10} unit=" ₹" onChange={(m) => set({ m })} />
          <Slider label="Price of X" value={s.px} min={1} max={20} step={0.5} unit=" ₹" onChange={(px) => set({ px })} />
          <Slider label="Price of Y" value={s.py} min={1} max={20} step={0.5} unit=" ₹" onChange={(py) => set({ py })} />
          <button type="button" onClick={() => setBase(s)} className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:bg-line">
            Save these settings as the baseline
          </button>
        </>
      }
      below={
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass rounded-3xl p-6" aria-labelledby="cc-result">
            <h2 id="cc-result" className="display text-2xl">
              The optimal bundle
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Good X" value={fmt(opt.x)} />
              <Stat label="Good Y" value={fmt(opt.y)} />
              <Stat label="Utility" value={fmt(opt.u)} unit="utils" />
              <Stat label="Spending" value={fmt(s.px * opt.x + s.py * opt.y, 1)} unit="₹" />
            </dl>
            <p className="mt-4 leading-relaxed text-muted">{why}</p>
            {s.kind === "cobb-douglas" && (
              <div className="mt-3 text-sm text-muted">
                <Tex block>{`x^* = \\dfrac{a\\,m}{p_x} = \\dfrac{${fmt(s.a)}\\times ${fmt(s.m)}}{${fmt(s.px)}} = ${fmt(opt.x)},\\qquad y^* = \\dfrac{(1-a)\\,m}{p_y} = ${fmt(opt.y)}`}</Tex>
              </div>
            )}
            {share !== null && <span className="sr-only">Share of income on X: {fmt(share * 100)} percent</span>}
          </section>

          <section className="glass rounded-3xl p-6" aria-labelledby="cc-change">
            <h2 id="cc-change" className="display text-2xl">
              What changed from the baseline
            </h2>
            {!changed ? (
              <p className="mt-4 leading-relaxed text-muted">
                Nothing yet. Move a slider and this panel compares the new optimum with the baseline. Use “Save these settings as the baseline” to reset the comparison point.
              </p>
            ) : (
              <>
                <ul className="mt-4 grid gap-2 text-sm">
                  <li className="flex justify-between gap-4 border-b border-line pb-2"><span className="text-muted">Good X</span><span className="tabular-nums">{fmt(baseOpt.x)} → {fmt(opt.x)} ({pct(baseOpt.x, opt.x)})</span></li>
                  <li className="flex justify-between gap-4 border-b border-line pb-2"><span className="text-muted">Good Y</span><span className="tabular-nums">{fmt(baseOpt.y)} → {fmt(opt.y)} ({pct(baseOpt.y, opt.y)})</span></li>
                  <li className="flex justify-between gap-4"><span className="text-muted">Utility</span><span className="tabular-nums">{fmt(baseOpt.u)} → {fmt(opt.u)}</span></li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {[
                    s.kind !== base.kind && "The utility function changed, so the shape of the indifference curves changed too.",
                    s.m !== base.m && `Income moved from ₹${fmt(base.m)} to ₹${fmt(s.m)}, which shifts the whole budget line ${s.m > base.m ? "outward" : "inward"}.`,
                    s.px !== base.px && `The price of X moved from ₹${fmt(base.px)} to ₹${fmt(s.px)}, which makes the budget line ${s.px > base.px ? "steeper in X" : "flatter in X"} (the X-intercept moves).`,
                    s.py !== base.py && `The price of Y moved from ₹${fmt(base.py)} to ₹${fmt(s.py)}, which moves the Y-intercept.`,
                    s.a !== base.a && `The taste weight a moved from ${fmt(base.a)} to ${fmt(s.a)}.`,
                    s.kind === "cobb-douglas" && base.kind === "cobb-douglas" && s.px !== base.px && s.py === base.py && s.m === base.m && s.a === base.a && "Under Cobb-Douglas, a change in the price of X leaves the amount of Y unchanged, because the income share spent on each good is constant.",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              </>
            )}
          </section>
          <div className="lg:col-span-2">
            <Note>
              Assumptions: two goods, strictly positive prices, the whole income is spent, and preferences are exactly the chosen function. Quantities are in units and money is in illustrative rupees. This is a teaching model, not an estimate of real behaviour.
            </Note>
          </div>
        </div>
      }
    />
  );
}
