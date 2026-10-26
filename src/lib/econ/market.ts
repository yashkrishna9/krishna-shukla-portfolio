/**
 * Linear competitive market.
 *   Demand:  Qd = A − B·P
 *   Supply:  Qs = D·(P − P0)   for P > P0, otherwise 0   (P0 is the lowest price any seller accepts)
 * Welfare numbers assume the units that do trade are allocated efficiently
 * (to the buyers who value them most and the sellers with the lowest cost).
 */
export type MarketParams = { A: number; B: number; D: number; P0: number };
export type Control = { kind: "none" | "ceiling" | "floor"; price: number };

export const qDemand = (m: MarketParams, p: number) => Math.max(0, m.A - m.B * p);
export const qSupply = (m: MarketParams, p: number) => Math.max(0, m.D * (p - m.P0));

export function equilibrium(m: MarketParams) {
  const p = (m.A + m.D * m.P0) / (m.B + m.D);
  return { p, q: Math.max(0, m.A - m.B * p) };
}

const totalSurplusAt = (m: MarketParams, q: number) => (m.A * q - (q * q) / 2) / m.B - (m.P0 * q + (q * q) / (2 * m.D));

export type MarketOutcome = {
  p: number; // price at which trades happen
  q: number; // quantity traded
  pEq: number;
  qEq: number;
  shortage: number;
  surplus: number;
  consumerSurplus: number;
  producerSurplus: number;
  deadweightLoss: number;
  binding: boolean;
};

export function solveMarket(m: MarketParams, control: Control): MarketOutcome {
  const eq = equilibrium(m);
  let p = eq.p;
  let q = eq.q;
  let binding = false;
  if (control.kind === "ceiling" && control.price < eq.p) {
    binding = true;
    p = control.price;
    q = qSupply(m, p);
  } else if (control.kind === "floor" && control.price > eq.p) {
    binding = true;
    p = control.price;
    q = qDemand(m, p);
  }
  const cs = (m.A * q - (q * q) / 2) / m.B - p * q;
  const ps = p * q - (m.P0 * q + (q * q) / (2 * m.D));
  const qdAtP = qDemand(m, p);
  const qsAtP = qSupply(m, p);
  return {
    p,
    q,
    pEq: eq.p,
    qEq: eq.q,
    shortage: Math.max(0, qdAtP - qsAtP),
    surplus: Math.max(0, qsAtP - qdAtP),
    consumerSurplus: cs,
    producerSurplus: ps,
    deadweightLoss: Math.max(0, totalSurplusAt(m, eq.q) - totalSurplusAt(m, q)),
    binding,
  };
}
