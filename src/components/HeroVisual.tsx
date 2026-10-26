"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { detectWebGL, usePrefersReducedMotion } from "@/lib/hooks";

const UtilityScene = dynamic(() => import("./three/UtilityScene"), {
  ssr: false,
  loading: () => <div className="skeleton size-full rounded-3xl opacity-40" aria-hidden />,
});

/** Flat 2D drawing of the same idea, used when WebGL is unavailable or fails. */
function Fallback() {
  const curves = [0.4, 0.8, 1.2, 1.6, 2.0].map((k) => {
    const pts: string[] = [];
    for (let x = k / 2.6; x <= 2.6; x += 0.05) pts.push(`${60 + x * 120},${300 - (k / x) * 120}`);
    return pts.join(" ");
  });
  return (
    <svg viewBox="0 0 400 340" role="img" aria-label="Indifference curves touching a budget line at the optimal bundle" className="size-full">
      <g fill="none" stroke="#3fd0e6" strokeWidth="1.4" opacity="0.85">
        {curves.map((c, i) => (
          <polyline key={i} points={c} />
        ))}
      </g>
      <line x1="60" y1="60" x2="340" y2="300" stroke="#3b78ff" strokeWidth="2" />
      <circle cx="180" cy="180" r="5" fill="#fff" />
      <path d="M60 300H350M60 300V30" stroke="currentColor" opacity="0.3" fill="none" />
    </svg>
  );
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function HeroVisual() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // null on the server / first paint, then true or false once the browser is known.
  const supported = useSyncExternalStore<boolean | null>(
    () => () => {},
    () => detectWebGL(),
    () => null,
  );
  const [visible, setVisible] = useState(true);

  // Stop rendering frames while the scene is scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="size-full text-muted">
      {supported === null ? null : supported ? (
        <Boundary fallback={<Fallback />}>
          <UtilityScene reduced={reduced} paused={!visible} />
        </Boundary>
      ) : (
        <Fallback />
      )}
    </div>
  );
}
