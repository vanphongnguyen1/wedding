"use client";

import { useEffect, useRef } from "react";
import { ImageLoading } from "@/Components/common/ImageLoading";
import { aspectOf } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

/**
 * Hand-placed so the photos frame the centre card instead of covering it.
 * x / y = centre of the polaroid in % of the hero; depth drives mouse parallax.
 */
const ITEMS = [
  { src: "/images/PTH_1772.JPG", x: 8,  y: 22, tilt: -8, depth: 0.6 },
  { src: "/images/PTH_1768.JPG", x: 24, y: 12, tilt: 5,  depth: 1   },
  { src: "/images/PTH_1913.JPG", x: 10, y: 55, tilt: -4, depth: 0.8, desktopOnly: true },
  { src: "/images/PTH_1838.JPG", x: 21, y: 82, tilt: 6,  depth: 0.9 },
  { src: "/images/PTH_1926.JPG", x: 6,  y: 90, tilt: -3, depth: 0.5, desktopOnly: true },
  { src: "/images/PTH_2049.JPG", x: 50, y: 9,  tilt: 3,  depth: 0.7 },
  { src: "/images/PTH_2019.JPG", x: 38, y: 92, tilt: -6, depth: 1   },
  { src: "/images/PTH_1803.JPG", x: 77, y: 12, tilt: -5, depth: 0.9 },
  { src: "/images/PTH_1904.JPG", x: 93, y: 26, tilt: 7,  depth: 0.6 },
  { src: "/images/PTH_1849.JPG", x: 90, y: 56, tilt: -3, depth: 0.8, desktopOnly: true },
  { src: "/images/PTH_2065.JPG", x: 77, y: 84, tilt: 5,  depth: 1   },
  { src: "/images/PTH_2044.JPG", x: 95, y: 90, tilt: -7, depth: 0.5, desktopOnly: true },
  { src: "/images/PTH_2121.JPG", x: 61, y: 93, tilt: 4,  depth: 0.7 },
] as const;

const TAPES = ["bg-rose-200/80", "bg-amber-100/90", "bg-sky-100/90", "bg-emerald-100/90"];

interface PolaroidScatterProps {
  className?: string;
}

export function PolaroidScatter({ className }: PolaroidScatterProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse parallax: write --mx / --my (−1…1) on the container, CSS does the rest
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", String((e.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty("--my", String((e.clientY / window.innerHeight - 0.5) * 2));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} aria-hidden className={cn("absolute inset-0 [--mx:0] [--my:0]", className)}>
      {ITEMS.map((item, i) => {
        const ratio = aspectOf(item.src);
        const landscape = ratio > 1;
        return (
          <div
            key={item.src}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2",
              "desktopOnly" in item && "hidden md:block",
            )}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {/* parallax layer */}
            <div
              className="transition-transform duration-700 ease-out"
              style={{
                transform: `translate3d(calc(var(--mx) * ${item.depth * -22}px), calc(var(--my) * ${item.depth * -16}px), 0)`,
              }}
            >
              {/* polaroid */}
              <div
                className={cn(
                  "relative bg-white p-1.5 pb-4 sm:p-2 sm:pb-6 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.35)]",
                  landscape ? "w-32 sm:w-48 lg:w-60" : "w-22 sm:w-32 lg:w-40",
                  "animate-polaroid-drop",
                )}
                style={{ rotate: `${item.tilt}deg`, animationDelay: `${i * 90}ms` }}
              >
                <span
                  className={cn(
                    "absolute -top-2.5 left-1/2 z-10 h-5 w-12 -translate-x-1/2 rotate-[-4deg] shadow-sm sm:w-14",
                    TAPES[i % TAPES.length],
                  )}
                />
                <span className="relative block overflow-hidden bg-stone-200" style={{ aspectRatio: ratio }}>
                  <ImageLoading
                    src={item.src}
                    alt=""
                    fill
                    sizes={landscape ? "(max-width: 640px) 128px, 240px" : "(max-width: 640px) 88px, 160px"}
                    className="object-cover"
                  />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
