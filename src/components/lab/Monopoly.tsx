"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceDot, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { demand, marginalCost, marginalRevenue, solveMonopoly, type MonopolyParams } from "@/lib/econ/monopoly";
import { ModelLayout, Note, Slider, Stat, Tex, chartColors, fmt } from "./controls";

export function Monopoly() {
  const [p, setP] = useState<MonopolyParams>({ a: 100, b: 2, c: 10, d: 1, fixed: 100 });
  const set = (patch: Partial<MonopolyParams>) => setP((x) => ({ ...x, ...patch }));
  const r = useMemo(() => solveMonopoly(p), [p]);

  const qMax = p.a / p.b;
  const line = (f: (q: number) => number, n = 40) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const q = (qMax * i) / n;
      return { q, v: f(q) };
    });
  const D = line((q) => demand(p, q));
  const MR = line((q) => marginalRevenue(p, q));
  const MC = line((q) => marginalCost(p, q));
  const yMax = p.a * 1.05;
  const noProduction = r.q <= 0;

  const dwl = [
    { q: r.q, v: r.p },
    { q: r.qCompetitive, v: r.pCompetitive },
    { q: r.q, v: r.mc },
    { q: r.q, v: r.p },
  ];

  return (
    <ModelLayout
      chart={
        <>
          <div role="img" aria-label={`Demand, marginal revenue and marginal cost. The monopolist produces ${fmt(r.q)} units at a price of ${fmt(r.p)}.`} className="h-[420px] w-full sm:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 10, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis type="number" dataKey="q" domain={[0, qMax]} allowDataOverflow tick={{ fill: chartColors.axis, fontSize: 12 }} tickFormatter={(v) => fmt(v, 0)} label={{ value: "Quantity Q (units)", position: "insideBottom", offset: -16, fill: chartColors.axis, fontSize: 12 }} />
                <YAxis type="number" dataKey="v" domain={[0, yMax]} allowDataOverflow tick={{ fill: chartColors.axis, fontSize: 12 }} tickFormatter={(v) => fmt(v, 0)} label={{ value: "Price and cost (₹ per unit)", angle: -90, position: "insideLeft", fill: chartColors.axis, fontSize: 12 }} />
                <Line data={D} dataKey="v" stroke={chartColors.blue} strokeWidth={2.4} dot={false} isAnimationActive={false} />
                <Line data={MR} dataKey="v" stroke={chartColors.cyan} strokeWidth={2.4} strokeDasharray="7 4" dot={false} isAnimationActive={false} />
                <Line data={MC} dataKey="v" stroke={chartColors.warn} strokeWidth={2.4} dot={false} isAnimationActive={false} />
                {!noProduction && (
                  <>
                    <Line data={dwl} dataKey="v" stroke={chartColors.warn} strokeWidth={1} strokeDasharray="2 3" dot={false} isAnimationActive={false} />
                    <Line data={[{ q: r.q, v: 0 }, { q: r.q, v: r.p }]} dataKey="v" stroke={chartColors.text} strokeOpacity={0.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                    <Line data={[{ q: 0, v: r.p }, { q: r.q, v: r.p }]} dataKey="v" stroke={chartColors.text} strokeOpacity={0.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                    <ReferenceDot x={r.q} y={r.p} r={7} fill={chartColors.text} stroke={chartColors.blue} strokeWidth={3} />
                    <ReferenceDot x={r.q} y={r.mc} r={5} fill={chartColors.warn} stroke="none" />
                    <ReferenceDot x={r.qCompetitive} y={r.pCompetitive} r={5} fill="none" stroke={chartColors.warn} strokeWidth={2} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            <li><span className="mr-1.5 inline-block h-0.5 w-5 bg-accent align-middle" />Demand (price)</li>
            <li><span className="mr-1.5 inline-block h-0.5 w-5 border-t-2 border-dashed border-cyan align-middle" />Marginal revenue</li>
            <li><span className="mr-1.5 inline-block h-0.5 w-5 bg-warn align-middle" />Marginal cost</li>
            <li>Large dot: monopoly choice. Hollow dot: competitive outcome. Dotted triangle: deadweight loss.</li>
          </ul>
        </>
      }
      controls={
        <>
          <p className="text-sm text-muted">
            Demand <Tex>{"P = a - bQ"}</Tex>, marginal cost <Tex>{"MC = c + dQ"}</Tex>.
          </p>
          <Slider label="Demand intercept a" value={p.a} min={20} max={200} step={5} unit=" ₹" onChange={(a) => set({ a })} hint="The highest price anyone would pay." />
          <Slider label="Demand slope b" value={p.b} min={0.2} max={5} step={0.1} onChange={(b) => set({ b })} hint="How fast price falls as output rises." />
          <Slider label="Marginal cost intercept c" value={p.c} min={0} max={60} step={1} unit=" ₹" onChange={(c) => set({ c })} />
          <Slider label="Marginal cost slope d" value={p.d} min={0} max={3} step={0.1} onChange={(d) => set({ d })} hint="0 means constant marginal cost." />
          <Slider label="Fixed cost" value={p.fixed} min={0} max={1000} step={10} unit=" ₹" onChange={(fixed) => set({ fixed })} />
        </>
      }
      below={
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass rounded-3xl p-6" aria-labelledby="mo-res">
            <h2 id="mo-res" className="display text-2xl">
              Results
            </h2>
            {noProduction ? (
              <p className="mt-4 leading-relaxed text-muted">
                Demand starts below marginal cost (a ≤ c), so producing even one unit would lose money. The profit-maximising choice is to produce nothing.
              </p>
            ) : (
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Monopoly quantity" value={fmt(r.q)} unit="units" />
                <Stat label="Monopoly price" value={fmt(r.p)} unit="₹" />
                <Stat label="Profit" value={fmt(r.profit, 1)} unit="₹" />
                <Stat label="Competitive quantity" value={fmt(r.qCompetitive)} unit="units" />
                <Stat label="Competitive price" value={fmt(r.pCompetitive)} unit="₹" />
                <Stat label="Deadweight loss" value={fmt(r.deadweightLoss, 1)} unit="₹" />
              </dl>
            )}
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Mark-up over marginal cost: {fmt(r.markup * 100, 1)}% of the price. Consumer surplus at the monopoly price: ₹{fmt(r.consumerSurplus, 1)}.
              {r.profit < 0 && !noProduction && " Profit is negative here, so in the long run this firm might exit."}
            </p>
          </section>

          <section className="glass rounded-3xl p-6" aria-labelledby="mo-calc">
            <h2 id="mo-calc" className="display text-2xl">
              How it is calculated
            </h2>
            <ol className="mt-4 grid gap-3 text-sm leading-relaxed text-muted">
              <li>
                Total revenue is <Tex>{"TR = P\\,Q = aQ - bQ^2"}</Tex>, so marginal revenue is <Tex>{`MR = a - 2bQ = ${fmt(p.a)} - ${fmt(2 * p.b)}Q`}</Tex>. It falls twice as fast as demand.
              </li>
              <li>
                Profit is highest where <Tex>{"MR = MC"}</Tex>: <Tex>{`${fmt(p.a)} - ${fmt(2 * p.b)}Q = ${fmt(p.c)} + ${fmt(p.d)}Q`}</Tex>.
              </li>
              <li>
                Solving gives <Tex>{`Q^m = \\dfrac{a-c}{2b+d} = \\dfrac{${fmt(p.a - p.c)}}{${fmt(2 * p.b + p.d)}} = ${fmt(r.q)}`}</Tex>.
              </li>
              <li>
                The price comes from the demand curve, not from MR: <Tex>{`P^m = a - bQ^m = ${fmt(r.p)}`}</Tex>.
              </li>
              <li>
                Profit is <Tex>{`TR - TC = ${fmt(r.revenue, 1)} - ${fmt(r.totalCost, 1)} = ${fmt(r.profit, 1)}`}</Tex>, where <Tex>{"TC = F + cQ + dQ^2/2"}</Tex>.
              </li>
              <li>
                A competitive market would set <Tex>{"P = MC"}</Tex>, giving <Tex>{`Q^c = \\dfrac{a-c}{b+d} = ${fmt(r.qCompetitive)}`}</Tex>. The triangle between the two outputs is the deadweight loss.
              </li>
            </ol>
          </section>
          <div className="lg:col-span-2">
            <Note>
              Assumptions: one seller, linear demand, rising or constant marginal cost, no price discrimination, no entry. Money is in illustrative rupees and quantities in units. Results follow from the formulas above and are not estimates for any real market.
            </Note>
          </div>
        </div>
      }
    />
  );
}
