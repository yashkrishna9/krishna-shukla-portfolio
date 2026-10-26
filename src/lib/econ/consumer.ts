/**
 * Consumer choice with two goods.
 * `a` is a taste weight between 0 and 1 (share on good x for Cobb-Douglas).
 */
export type UtilityKind = "cobb-douglas" | "substitutes" | "complements";

export type Point = { x: number; y: number };

export const utilityLabels: Record<UtilityKind, { name: string; formula: string }> = {
  "cobb-douglas": { name: "Cobb-Douglas", formula: "U = x^a · y^(1−a)" },
  substitutes: { name: "Perfect substitutes", formula: "U = a·x + (1−a)·y" },
  complements: { name: "Perfect complements", formula: "U = min(x/a, y/(1−a))" },
};

export function utility(kind: UtilityKind, a: number, x: number, y: number): number {
  switch (kind) {
    case "cobb-douglas":
      return Math.pow(Math.max(x, 0), a) * Math.pow(Math.max(y, 0), 1 - a);
    case "substitutes":
      return a * x + (1 - a) * y;
    case "complements":
      return Math.min(x / a, y / (1 - a));
  }
}

export type Optimum = Point & { u: number; kind: "interior" | "corner-x" | "corner-y" | "kink" };

/** Utility-maximising bundle on the budget line px·x + py·y = m. */
export function optimalBundle(kind: UtilityKind, a: number, m: number, px: number, py: number): Optimum {
  switch (kind) {
    case "cobb-douglas": {
      const x = (a * m) / px;
      const y = ((1 - a) * m) / py;
      return { x, y, u: utility(kind, a, x, y), kind: "interior" };
    }
    case "substitutes": {
      // Compare utility per rupee: a/px versus (1-a)/py.
      const perX = a / px;
      const perY = (1 - a) / py;
      if (perX > perY) {
        const x = m / px;
        return { x, y: 0, u: utility(kind, a, x, 0), kind: "corner-x" };
      }
      const y = m / py;
      return { x: 0, y, u: utility(kind, a, 0, y), kind: "corner-y" };
    }
    case "complements": {
      const t = m / (a * px + (1 - a) * py);
      const x = a * t;
      const y = (1 - a) * t;
      return { x, y, u: t, kind: "kink" };
    }
  }
}

/** Points of the indifference curve U(x,y) = level, for x from xMin to xMax. */
export function indifferenceCurve(
  kind: UtilityKind,
  a: number,
  level: number,
  xMax: number,
  yMax: number,
  n = 80,
): Point[] {
  const pts: Point[] = [];
  if (level <= 0) return pts;
  if (kind === "complements") {
    const kx = a * level;
    const ky = (1 - a) * level;
    if (kx > xMax || ky > yMax) {
      // Corner outside the plotted window: draw whatever part is visible.
    }
    pts.push({ x: kx, y: yMax });
    pts.push({ x: kx, y: ky });
    pts.push({ x: xMax, y: ky });
    return pts;
  }
  const xStart = xMax / 400;
  for (let i = 0; i <= n; i++) {
    const x = xStart + ((xMax - xStart) * i) / n;
    let y: number;
    if (kind === "cobb-douglas") y = Math.pow(level / Math.pow(x, a), 1 / (1 - a));
    else y = (level - a * x) / (1 - a);
    if (Number.isFinite(y) && y >= 0 && y <= yMax * 1.5) pts.push({ x, y });
  }
  return pts;
}

export const budgetIntercepts = (m: number, px: number, py: number) => ({ x: m / px, y: m / py });
