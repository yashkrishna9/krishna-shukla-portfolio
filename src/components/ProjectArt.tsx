import type { ProjectCategoryId } from "@content/taxonomy";

/**
 * Small decorative drawings keyed by category. They are illustrations of the
 * kind of work, NOT data or results from any project.
 */
export function ProjectArt({ category, className = "" }: { category: ProjectCategoryId; className?: string }) {
  const stroke = "var(--cyan)";
  const soft = "var(--accent)";
  let body: React.ReactNode;

  switch (category) {
    case "microeconomics": {
      const curves = [0.5, 1, 1.6].map((k) => {
        const p: string[] = [];
        for (let x = k / 2.2; x <= 2.2; x += 0.08) p.push(`${14 + x * 40},${96 - (k / x) * 40}`);
        return p.join(" ");
      });
      body = (
        <>
          {curves.map((c, i) => (
            <polyline key={i} points={c} fill="none" stroke={stroke} strokeWidth="1.3" opacity={0.5 + i * 0.2} />
          ))}
          <line x1="14" y1="30" x2="96" y2="96" stroke={soft} strokeWidth="1.6" />
          <circle cx="55" cy="63" r="3.2" fill="var(--text)" />
        </>
      );
      break;
    }
    case "econometrics": {
      const pts = [
        [18, 82], [26, 70], [32, 74], [40, 60], [47, 62], [55, 50], [63, 54], [70, 40], [79, 44], [88, 30],
      ];
      body = (
        <>
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.3" fill={stroke} opacity="0.85" />
          ))}
          <line x1="14" y1="86" x2="94" y2="28" stroke={soft} strokeWidth="1.6" />
        </>
      );
      break;
    }
    case "quant-finance": {
      const p: string[] = [];
      for (let i = 0; i <= 44; i++) {
        const x = 14 + i * 1.85;
        const y = 62 - Math.sin(i * 0.5) * 9 - Math.sin(i * 1.3) * 5 - i * 0.28;
        p.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      body = <polyline points={p.join(" ")} fill="none" stroke={stroke} strokeWidth="1.6" />;
      break;
    }
    case "macro-development": {
      const bars = [28, 36, 31, 44, 52, 48, 60];
      body = (
        <>
          {bars.map((h, i) => (
            <rect key={i} x={16 + i * 11.5} y={96 - h} width="7" height={h} rx="1.5" fill={i % 2 ? soft : stroke} opacity="0.75" />
          ))}
        </>
      );
      break;
    }
    case "math-optimization": {
      body = (
        <>
          {[10, 20, 30, 40].map((r) => (
            <ellipse key={r} cx="56" cy="58" rx={r * 1.25} ry={r * 0.8} fill="none" stroke={stroke} strokeWidth="1.2" opacity={1.1 - r / 50} transform="rotate(-20 56 58)" />
          ))}
          <circle cx="56" cy="58" r="2.6" fill="var(--text)" />
        </>
      );
      break;
    }
    default: {
      body = (
        <>
          {Array.from({ length: 5 }).flatMap((_, r) =>
            Array.from({ length: 7 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={18 + c * 12} cy={30 + r * 13} r={1.4 + ((r * 7 + c) % 4) * 0.5} fill={(r + c) % 3 ? stroke : soft} opacity="0.7" />
            )),
          )}
        </>
      );
    }
  }

  return (
    <svg viewBox="0 0 110 110" className={className} role="img" aria-label="Decorative illustration, not project data">
      <rect x="6" y="6" width="98" height="98" rx="10" fill="none" stroke="var(--line)" />
      <path d="M14 96H100M14 96V16" stroke="var(--line-strong)" strokeWidth="1" fill="none" />
      {body}
    </svg>
  );
}
