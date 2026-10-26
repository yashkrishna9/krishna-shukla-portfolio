"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceDot, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { equilibrium, solveMarket, type Control, type MarketParams } from "@/lib/econ/market";
import { ModelLayout, Note, Segmented, Slider, Stat, Tex, chartColors, fmt } from "./controls";

type Kind = Control["kind"];

export function SupplyDemand() {
  const [m, setM] = useState<MarketParams>({ A: 200, B: 4, D: 4, P0: 10 });
  const [kind, setKind] = useState<Kind>("none");
  const [price, setPrice] = useState(0);
  // Keep every parameter inside a sensible range when another one changes.
  const set = (patch: Partial<MarketParams>) => {
    const n = { ...m, ...patch };
    const top = n.A / n.B;
    n.P0 = Math.min(n.P0, Math.floor(top * 0.8));
    setM(n);
    setPrice((p) => Math.min(p, Math.floor(top)));
  };

  const eq = useMemo(() => equilibrium(m), [m]);
  const pMax = m.A / m.B;
  const out = useMemo(() => solveMarket(m, { kind, price }), [m, kind, price]);

  const changeKind = (k: Kind) => {
    setKind(k);
    if (k === "ceiling") setPrice(Math.round(eq.p * 0.75 * 2) / 2);
    if (k === "floor") setPrice(Math.min(Math.round(eq.p * 1.25 * 2) / 2, pMax));
  };

  const yMax = pMax * 1.05;
  const xMax = m.A * 1.05;
  const demandLine = [{ q: 0, p: pMax }, { q: m.A, p: 0 }];
  const supplyTopQ = m.D * (yMax - m.P0);
  const supplyLine = [{ q: 0, p: m.P0 }, { q: Math.max(supplyTopQ, 0), p: yMax }];

  return (
    <ModelLayout
      chart={
        <>
          <div role="img" aria-label={`Supply and demand. Equilibrium price ${fmt(eq.p)}, quantity ${fmt(eq.q)}.`} className="h-[420px] w-full sm:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 10, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis type="number" dataKey="q" domain={[0, xMax]} allowDataOverflow tick={{ fill: chartColors.axis, fontSize: 12 }} tickFormatter={(v) => fmt(v, 0)} label={{ value: "Quantity (units)", position: "insideBottom", offset: -16, fill: chartColors.axis, fontSize: 12 }} />
                <YAxis type="number" dataKey="p" domain={[0, yMax]} allowDataOverflow tick={{ fill: chartColors.axis, fontSize: 12 }} tickFormatter={(v) => fmt(v, 0)} label={{ value: "Price (₹ per unit)", angle: -90, position: "insideLeft", fill: chartColors.axis, fontSize: 12 }} />
                <Line data={demandLine} dataKey="p" stroke={chartColors.blue} strokeWidth={2.6} dot={false} isAnimationActive={false} />
                <Line data={supplyLine} dataKey="p" stroke={chartColors.cyan} strokeWidth={2.6} dot={false} isAnimationActive={false} />
                {kind !== "none" && (
                  <ReferenceLine y={price} stroke={chartColors.warn} strokeWidth={2} strokeDasharray="6 4" label={{ value: kind === "ceiling" ? "Price ceiling" : "Price floor", fill: chartColors.warn, fontSize: 12, position: "insideTopRight" }} />
                )}
                <ReferenceDot x={eq.q} y={eq.p} r={6} fill="none" stroke={chartColors.text} strokeWidth={2} />
                {out.binding && <ReferenceDot x={out.q} y={out.p} r={7} fill={chartColors.warn} stroke={chartColors.text} strokeWidth={2} />}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            <li><span className="mr-1.5 inline-block h-0.5 w-5 bg-accent align-middle" />Demand</li>
            <li><span className="mr-1.5 inline-block h-0.5 w-5 bg-cyan align-middle" />Supply</li>
            <li>Hollow dot: free-market equilibrium. {out.binding ? "Filled dot: where trade actually happens." : ""}</li>
          </ul>
        </>
      }
      controls={
        <>
          <p className="text-sm text-muted">
            Demand <Tex>{"Q_d = A - BP"}</Tex>, supply <Tex>{"Q_s = D(P - P_0)"}</Tex>.
          </p>
          <Slider label="Demand intercept A" value={m.A} min={50} max={400} step={10} unit=" units" onChange={(A) => set({ A })} hint="Quantity demanded at a price of zero." />
          <Slider label="Demand slope B" value={m.B} min={0.5} max={10} step={0.5} onChange={(B) => set({ B })} hint="Larger B means buyers react more to price." />
          <Slider label="Supply slope D" value={m.D} min={0.5} max={10} step={0.5} onChange={(D) => set({ D })} hint="Larger D means sellers react more to price." />
          <Slider label="Lowest supply price P₀" value={m.P0} min={0} max={Math.floor(pMax * 0.8)} step={1} unit=" ₹" onChange={(P0) => set({ P0 })} />
          <Segmented<Kind>
            label="Price control"
            value={kind}
            onChange={changeKind}
            options={[
              { id: "none", label: "None" },
              { id: "ceiling", label: "Price ceiling" },
              { id: "floor", label: "Price floor" },
            ]}
          />
          {kind !== "none" && <Slider label={kind === "ceiling" ? "Maximum legal price" : "Minimum legal price"} value={price} min={0} max={Math.floor(pMax)} step={0.5} unit=" ₹" onChange={setPrice} />}
        </>
      }
      below={
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass rounded-3xl p-6" aria-labelledby="sd-res">
            <h2 id="sd-res" className="display text-2xl">
              Outcome
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Equilibrium price" value={fmt(eq.p)} unit="₹" />
              <Stat label="Equilibrium quantity" value={fmt(eq.q)} unit="units" />
              <Stat label="Quantity traded" value={fmt(out.q)} unit="units" />
              <Stat label="Consumer surplus" value={fmt(out.consumerSurplus, 1)} unit="₹" />
              <Stat label="Producer surplus" value={fmt(out.producerSurplus, 1)} unit="₹" />
              <Stat label="Deadweight loss" value={fmt(out.deadweightLoss, 1)} unit="₹" />
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {kind === "none" && "With no price control, the market clears at the price where the quantity buyers want equals the quantity sellers offer, and total surplus is as large as it can be."}
              {kind !== "none" && !out.binding && `This ${kind} is not binding. A ${kind === "ceiling" ? "ceiling above" : "floor below"} the equilibrium price of ₹${fmt(eq.p)} changes nothing, because the market already trades at an allowed price.`}
              {out.binding && kind === "ceiling" && `The ceiling of ₹${fmt(price)} is below equilibrium. At that price buyers want ${fmt(m.A - m.B * price)} units but sellers offer only ${fmt(out.q)}, a shortage of ${fmt(out.shortage)} units. Trade falls from ${fmt(eq.q)} to ${fmt(out.q)} units.`}
              {out.binding && kind === "floor" && `The floor of ₹${fmt(price)} is above equilibrium. At that price sellers offer ${fmt(m.D * (price - m.P0))} units but buyers want only ${fmt(out.q)}, a surplus of ${fmt(out.surplus)} unsold units. Trade falls from ${fmt(eq.q)} to ${fmt(out.q)} units.`}
            </p>
          </section>
          <section className="glass rounded-3xl p-6" aria-labelledby="sd-calc">
            <h2 id="sd-calc" className="display text-2xl">
              How it is calculated
            </h2>
            <ol className="mt-4 grid gap-3 text-sm leading-relaxed text-muted">
              <li>
                Set <Tex>{"Q_d = Q_s"}</Tex>: <Tex>{`${fmt(m.A)} - ${fmt(m.B)}P = ${fmt(m.D)}(P - ${fmt(m.P0)})`}</Tex>.
              </li>
              <li>
                Solve for price: <Tex>{`P^* = \\dfrac{A + D P_0}{B + D} = ${fmt(eq.p)}`}</Tex>, then quantity <Tex>{`Q^* = A - BP^* = ${fmt(eq.q)}`}</Tex>.
              </li>
              <li>
                With a binding control, the <em>short side</em> of the market decides how much is traded: supply under a ceiling, demand under a floor.
              </li>
              <li>
                Consumer and producer surplus are the areas between each curve and the price. Deadweight loss is the surplus that disappears because fewer units are traded.
              </li>
            </ol>
          </section>
          <div className="lg:col-span-2">
            <Note>
              Assumptions: linear curves, a competitive market, and trades that go to the buyers with the highest willingness to pay and the sellers with the lowest cost (efficient rationing). Real queues or black markets would make the loss larger. Prices are in illustrative rupees.
            </Note>
          </div>
        </div>
      }
    />
  );
}
