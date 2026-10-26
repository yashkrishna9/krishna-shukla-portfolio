"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * The hero centrepiece, drawn from real consumer theory.
 *   Surface:        U(x, y) = sqrt(x·y)            (Cobb-Douglas, a = 0.5)
 *   Contour lines:  indifference curves U = constant
 *   Vertical plane: the budget line x + y = 2
 *   Bright point:   the utility-maximising bundle (1, 1), where U = 1
 * Three.js axes: x → x, y (up) → utility, z → good y.
 */

const L = 2.4; // domain size for x and y
const N = 48; // grid resolution
const BLUE = "#3b78ff";
const CYAN = "#3fd0e6";

const u = (x: number, y: number) => Math.sqrt(Math.max(x * y, 0));

function useGeometry() {
  return useMemo(() => {
    // Surface mesh (very transparent fill that gives the sheet depth).
    const surface = new THREE.PlaneGeometry(L, L, N, N);
    const pos = surface.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + L / 2;
      const y = pos.getY(i) + L / 2;
      pos.setXYZ(i, x, u(x, y), y);
    }
    surface.computeVertexNormals();

    // Fine wireframe along constant-x and constant-y lines.
    const grid: number[] = [];
    const step = 3;
    for (let a = 0; a <= N; a += step) {
      const c = (a / N) * L;
      for (let b = 0; b < N; b++) {
        const t0 = (b / N) * L;
        const t1 = ((b + 1) / N) * L;
        grid.push(t0, u(t0, c), c, t1, u(t1, c), c); // line of constant y
        grid.push(c, u(c, t0), t0, c, u(c, t1), t1); // line of constant x
      }
    }
    const wire = new THREE.BufferGeometry();
    wire.setAttribute("position", new THREE.Float32BufferAttribute(grid, 3));

    // Indifference curves: y = level² / x on the surface at height = level.
    const contour: number[] = [];
    for (const level of [0.3, 0.6, 0.9, 1.2, 1.5, 1.8]) {
      const xStart = (level * level) / L;
      const M = 70;
      for (let i = 0; i < M; i++) {
        const x0 = xStart + ((L - xStart) * i) / M;
        const x1 = xStart + ((L - xStart) * (i + 1)) / M;
        contour.push(x0, level, (level * level) / x0, x1, level, (level * level) / x1);
      }
    }
    const contours = new THREE.BufferGeometry();
    contours.setAttribute("position", new THREE.Float32BufferAttribute(contour, 3));

    // Budget plane (vertical sheet standing on the line x + y = 2) and the curve it cuts on the surface.
    const planeH = 1.35;
    const plane = new THREE.BufferGeometry();
    plane.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 2, 2, 0, 0, 2, planeH, 0, 0, 0, 2, 2, planeH, 0, 0, planeH, 2], 3),
    );
    plane.computeVertexNormals();

    const cut: [number, number, number][] = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2;
      cut.push([t, u(t, 2 - t), 2 - t]);
    }

    // Fine particles floating around the scene.
    const dust: number[] = [];
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 140; i++) dust.push((rnd() - 0.5) * 6, rnd() * 3 - 0.3, (rnd() - 0.5) * 6);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));

    return { surface, wire, contours, plane, cut, dustGeo };
  }, []);
}

function Model({ reduced }: { reduced: boolean }) {
  const g = useGeometry();
  const group = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const marker = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;
    const targetY = -0.55 + Math.sin(t * 0.18) * 0.12 + state.pointer.x * 0.35;
    const targetX = state.pointer.y * -0.1;
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, dt * 2);
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, dt * 2);
    if (dust.current) dust.current.rotation.y = t * 0.02;
    if (marker.current) marker.current.scale.setScalar(1 + Math.sin(t * 2) * 0.12);
  });

  return (
    <group ref={group} rotation={[0, -0.55, 0]}>
      <group position={[-1.2, -0.7, -1.2]}>
        <mesh geometry={g.surface}>
          <meshStandardMaterial
            color={BLUE}
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            roughness={0.35}
            metalness={0.2}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={g.wire}>
          <lineBasicMaterial color={BLUE} transparent opacity={0.4} />
        </lineSegments>
        <lineSegments geometry={g.contours}>
          <lineBasicMaterial color={CYAN} transparent opacity={0.85} />
        </lineSegments>

        {/* base-plane budget line and the vertical budget plane */}
        <Line points={[[0, 0, 2], [2, 0, 0]]} color={CYAN} lineWidth={1.5} transparent opacity={0.9} />
        <mesh geometry={g.plane}>
          <meshBasicMaterial color={CYAN} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <Line points={g.cut} color="#ffffff" lineWidth={2} transparent opacity={0.9} />

        {/* the optimum */}
        <mesh ref={marker} position={[1, 1, 1]}>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Line points={[[1, 0, 1], [1, 1, 1]]} color="#ffffff" lineWidth={1} transparent opacity={0.45} dashed dashSize={0.05} gapSize={0.05} />
      </group>
      <points ref={dust} geometry={g.dustGeo}>
        <pointsMaterial color={CYAN} size={0.018} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

export default function UtilityScene({ reduced, paused }: { reduced: boolean; paused: boolean }) {
  return (
    <Canvas
      frameloop={reduced || paused ? "demand" : "always"}
      dpr={[1, 1.75]}
      camera={{ position: [3.7, 2.5, 3.7], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.1, 0)}
      aria-hidden
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[3, 4, 2]} intensity={14} color="#8fb4ff" />
      <Model reduced={reduced} />
    </Canvas>
  );
}
