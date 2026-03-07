"use client";

import { useEffect, useState } from "react";

const PETAL_COUNT = 18;

const PETAL_SVGS = [
  `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="5" ry="10"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21C12 21 3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="4" ry="9" transform="rotate(20 12 12)"/></svg>`,
];

const COLORS = [
  "#fda4af", "#fb7185", "#f9a8d4", "#f472b6",
  "#fecdd3", "#fbcfe8", "#fef9c3", "#fff1f2",
];

interface Petal {
  id: number;
  svg: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
  sway: number;
  rotate: number;
  rotateDelta: number;
  color: string;
  opacity: number;
}

function makePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    svg: PETAL_SVGS[i % PETAL_SVGS.length],
    left: Math.random() * 100,
    size: Math.random() * 14 + 10,
    delay: Math.random() * 12,
    duration: Math.random() * 8 + 10,
    sway: (Math.random() - 0.5) * 160,
    rotate: Math.random() * 360,
    rotateDelta: (Math.random() - 0.5) * 720,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() * 0.5 + 0.4,
  }));
}

export function WeddingPetals() {
  // Khởi tạo null để server không render gì → tránh hydration mismatch
  const [petals, setPetals] = useState<Petal[] | null>(makePetals());

  useEffect(() => {
    // Chỉ chạy trên client sau khi hydration xong
    const petals = makePetals()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPetals(petals);

    const styleId = "wedding-petal-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes petalFall {
          0%   { transform: translateY(-60px) translateX(0) rotate(var(--r0)) scale(1); opacity: 0; }
          5%   { opacity: var(--op); }
          90%  { opacity: var(--op); }
          100% { transform: translateY(105vh) translateX(var(--sway)) rotate(var(--r1)) scale(0.8); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!petals) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}vw`,
            width: p.size,
            height: p.size,
            color: p.color,
            "--r0": `${p.rotate}deg`,
            "--r1": `${p.rotate + p.rotateDelta}deg`,
            "--sway": `${p.sway}px`,
            "--op": p.opacity,
            animation: `petalFall ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: "transform, opacity",
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: p.svg }}
        />
      ))}
    </div>
  );
}
