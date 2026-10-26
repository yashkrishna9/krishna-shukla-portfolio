/**
 * Monopoly with linear inverse demand  P = a − b·Q
 * and marginal cost                    MC = c + d·Q   (so total cost TC = F + c·Q + d·Q²/2).
 * Marginal revenue is MR = a − 2b·Q.
 */
export type MonopolyParams = { a: number; b: number; c: number; d: number; fixed: number };

export type MonopolyResult = {
  q: number; // monopoly quantity
  p: number; // monopoly price
  mr: number; // MR at q
  mc: number; // MC at q
  revenue: number;
  totalCost: number;
  profit: number;
  consumerSurplus: number;
  qCompetitive: number;
  pCompetitive: number;
  deadweightLoss: number;
  markup: number; // (P − MC) / P
};

export const demand = (p: MonopolyParams, q: number) => p.a - p.b * q;
export const marginalRevenue = (p: MonopolyParams, q: number) => p.a - 2 * p.b * q;
export const marginalCost = (p: MonopolyParams, q: number) => p.c + p.d * q;

export function solveMonopoly(p: MonopolyParams): MonopolyResult {
  const q = Math.max(0, (p.a - p.c) / (2 * p.b + p.d));
  const price = demand(p, q);
  const revenue = price * q;
  const totalCost = p.fixed + p.c * q + (p.d * q * q) / 2;
  const qComp = Math.max(0, (p.a - p.c) / (p.b + p.d));
  const gap = demand(p, q) - marginalCost(p, q);
  return {
    q,
    p: price,
    mr: marginalRevenue(p, q),
    mc: marginalCost(p, q),
    revenue,
    totalCost,
    profit: revenue - totalCost,
    consumerSurplus: 0.5 * (p.a - price) * q,
    qCompetitive: qComp,
    pCompetitive: demand(p, qComp),
    deadweightLoss: 0.5 * Math.max(0, qComp - q) * Math.max(0, gap),
    markup: price > 0 ? (price - marginalCost(p, q)) / price : 0,
  };
}
