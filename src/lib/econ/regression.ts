export type XY = { x: number; y: number };

export type OlsFit = {
  n: number;
  slope: number;
  intercept: number;
  r2: number;
  sigma: number; // residual standard error, sqrt(SSR / (n−2))
  seSlope: number;
  tSlope: number;
  residuals: number[];
};

/** Simple linear regression y = b0 + b1·x by ordinary least squares. */
export function olsFit(data: XY[]): OlsFit | null {
  const n = data.length;
  if (n < 3) return null;
  const xbar = data.reduce((s, d) => s + d.x, 0) / n;
  const ybar = data.reduce((s, d) => s + d.y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const d of data) {
    sxx += (d.x - xbar) ** 2;
    sxy += (d.x - xbar) * (d.y - ybar);
    syy += (d.y - ybar) ** 2;
  }
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const intercept = ybar - slope * xbar;
  const residuals = data.map((d) => d.y - intercept - slope * d.x);
  const ssr = residuals.reduce((s, r) => s + r * r, 0);
  const sigma = Math.sqrt(ssr / (n - 2));
  const seSlope = sigma / Math.sqrt(sxx);
  return {
    n,
    slope,
    intercept,
    r2: syy === 0 ? 1 : 1 - ssr / syy,
    sigma,
    seSlope,
    tSlope: seSlope === 0 ? Infinity : slope / seSlope,
    residuals,
  };
}

/** Small seeded random number generator so the same seed gives the same data. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SyntheticParams = {
  n: number;
  beta0: number;
  beta1: number;
  noiseSd: number;
  seed: number;
  outlier: boolean;
};

/** Synthetic data: x ~ Uniform(0, 10), y = β0 + β1·x + ε with ε ~ Normal(0, σ²). */
export function generateData(p: SyntheticParams): XY[] {
  const rand = mulberry32(p.seed);
  const normal = () => {
    const u1 = Math.max(rand(), 1e-12);
    const u2 = rand();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  const data: XY[] = [];
  for (let i = 0; i < p.n; i++) {
    const x = rand() * 10;
    data.push({ x, y: p.beta0 + p.beta1 * x + p.noiseSd * normal() });
  }
  if (p.outlier && data.length > 0) {
    // One deliberately extreme point at high x, far below the true line.
    data[data.length - 1] = { x: 9.6, y: p.beta0 + p.beta1 * 9.6 - 6 * Math.max(p.noiseSd, 1) };
  }
  return data;
}
