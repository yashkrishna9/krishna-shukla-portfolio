import { describe, expect, it } from "vitest";
import { budgetIntercepts, indifferenceCurve, optimalBundle, utility } from "./consumer";
import { solveMonopoly, marginalCost, marginalRevenue } from "./monopoly";
import { equilibrium, solveMarket } from "./market";
import { generateData, olsFit } from "./regression";

describe("consumer choice", () => {
  it("Cobb-Douglas demands equal a·m/px and (1−a)·m/py and exhaust the budget", () => {
    const o = optimalBundle("cobb-douglas", 0.3, 100, 2, 5);
    expect(o.x).toBeCloseTo(15);
    expect(o.y).toBeCloseTo(14);
    expect(2 * o.x + 5 * o.y).toBeCloseTo(100);
  });
  it("Cobb-Douglas optimum is on the indifference curve at its own utility", () => {
    const o = optimalBundle("cobb-douglas", 0.5, 120, 4, 3);
    const pts = indifferenceCurve("cobb-douglas", 0.5, o.u, 60, 60, 400);
    const nearest = pts.reduce((b, p) => (Math.abs(p.x - o.x) < Math.abs(b.x - o.x) ? p : b));
    expect(nearest.y).toBeCloseTo(o.y, 0);
  });
  it("perfect substitutes choose the corner with the higher utility per rupee", () => {
    const o = optimalBundle("substitutes", 0.5, 100, 1, 4);
    expect(o).toMatchObject({ x: 100, y: 0, kind: "corner-x" });
    const o2 = optimalBundle("substitutes", 0.5, 100, 4, 1);
    expect(o2).toMatchObject({ x: 0, y: 100, kind: "corner-y" });
  });
  it("perfect complements consume in fixed proportions and spend all income", () => {
    const o = optimalBundle("complements", 0.25, 100, 2, 3);
    expect(o.x / o.y).toBeCloseTo(0.25 / 0.75);
    expect(2 * o.x + 3 * o.y).toBeCloseTo(100);
    expect(utility("complements", 0.25, o.x, o.y)).toBeCloseTo(o.u);
  });
  it("budget intercepts", () => {
    expect(budgetIntercepts(100, 4, 5)).toEqual({ x: 25, y: 20 });
  });
});

describe("monopoly", () => {
  const params = { a: 100, b: 2, c: 10, d: 1, fixed: 0 };
  it("produces where MR = MC", () => {
    const r = solveMonopoly(params);
    expect(r.q).toBeCloseTo(90 / 5);
    expect(marginalRevenue(params, r.q)).toBeCloseTo(marginalCost(params, r.q));
    expect(r.p).toBeCloseTo(100 - 2 * r.q);
  });
  it("restricts output below the competitive level and creates deadweight loss", () => {
    const r = solveMonopoly(params);
    expect(r.q).toBeLessThan(r.qCompetitive);
    expect(r.pCompetitive).toBeCloseTo(100 - 2 * (90 / 3));
    expect(r.deadweightLoss).toBeGreaterThan(0);
  });
  it("profit equals revenue minus cost", () => {
    const r = solveMonopoly({ ...params, fixed: 50 });
    expect(r.profit).toBeCloseTo(r.revenue - r.totalCost);
    expect(r.totalCost).toBeCloseTo(50 + 10 * r.q + (r.q * r.q) / 2);
  });
});

describe("supply and demand", () => {
  const m = { A: 100, B: 2, D: 3, P0: 5 };
  it("finds the equilibrium where Qd = Qs", () => {
    const e = equilibrium(m);
    expect(e.p).toBeCloseTo((100 + 15) / 5);
    expect(100 - 2 * e.p).toBeCloseTo(3 * (e.p - 5));
  });
  it("a binding ceiling causes a shortage and deadweight loss", () => {
    const eq = equilibrium(m);
    const out = solveMarket(m, { kind: "ceiling", price: eq.p - 4 });
    expect(out.binding).toBe(true);
    expect(out.shortage).toBeGreaterThan(0);
    expect(out.q).toBeLessThan(eq.q);
    expect(out.deadweightLoss).toBeGreaterThan(0);
  });
  it("a non-binding ceiling changes nothing", () => {
    const eq = equilibrium(m);
    const out = solveMarket(m, { kind: "ceiling", price: eq.p + 5 });
    expect(out.binding).toBe(false);
    expect(out.deadweightLoss).toBeCloseTo(0);
    expect(out.q).toBeCloseTo(eq.q);
  });
  it("a binding floor causes a surplus", () => {
    const eq = equilibrium(m);
    const out = solveMarket(m, { kind: "floor", price: eq.p + 3 });
    expect(out.surplus).toBeGreaterThan(0);
    expect(out.q).toBeLessThan(eq.q);
  });
  it("welfare at equilibrium sums to the maximum", () => {
    const out = solveMarket(m, { kind: "none", price: 0 });
    expect(out.deadweightLoss).toBeCloseTo(0);
    expect(out.consumerSurplus).toBeGreaterThan(0);
    expect(out.producerSurplus).toBeGreaterThan(0);
  });
});

describe("regression", () => {
  it("matches a hand-computed example", () => {
    const fit = olsFit([1, 2, 3, 4, 5].map((x, i) => ({ x, y: [2, 4, 5, 4, 5][i] })))!;
    expect(fit.slope).toBeCloseTo(0.6);
    expect(fit.intercept).toBeCloseTo(2.2);
    expect(fit.r2).toBeCloseTo(0.6);
  });
  it("recovers the true line with no noise", () => {
    const data = generateData({ n: 40, beta0: 3, beta1: 1.5, noiseSd: 0, seed: 7, outlier: false });
    const fit = olsFit(data)!;
    expect(fit.slope).toBeCloseTo(1.5);
    expect(fit.intercept).toBeCloseTo(3);
    expect(fit.r2).toBeCloseTo(1);
  });
  it("is reproducible for a given seed and returns residuals that sum to zero", () => {
    const p = { n: 60, beta0: 1, beta1: 2, noiseSd: 2, seed: 42, outlier: false };
    expect(generateData(p)).toEqual(generateData(p));
    const fit = olsFit(generateData(p))!;
    expect(fit.residuals.reduce((s, r) => s + r, 0)).toBeCloseTo(0, 6);
  });
  it("an outlier lowers the estimated slope", () => {
    const base = { n: 50, beta0: 1, beta1: 2, noiseSd: 1, seed: 3 };
    const clean = olsFit(generateData({ ...base, outlier: false }))!;
    const dirty = olsFit(generateData({ ...base, outlier: true }))!;
    expect(dirty.slope).toBeLessThan(clean.slope);
  });
  it("returns null when it cannot fit", () => {
    expect(olsFit([{ x: 1, y: 1 }])).toBeNull();
    expect(olsFit([1, 1, 1].map((x) => ({ x, y: x })))).toBeNull();
  });
});
