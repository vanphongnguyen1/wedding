"use client";

import { ImageLoading } from "@/Components/common/ImageLoading";
import { AnimateInView } from "@/Components/AnimateInView";
import { aspectOf } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

// Fixed (not random) so server and client render identically
const TILTS    = [-6, 4, -3, 5, -4, 2, -5, 3, -2, 6, -4, 3];
const TAPES    = ["bg-rose-200/70", "bg-amber-100/80", "bg-sky-100/80", "bg-emerald-100/80"];

interface PolaroidWallProps {
  images: string[];
  /** Indices (into `images`) to pin on the wall — defaults to all of them */
  picks?: number[];
  onOpen: (index: number) => void;
  title?: string;
  subtitle?: string;
  /** "section": standalone block with paper background + title. "inline": compact cluster only. */
  variant?: "section" | "inline";
  /** Offset into TILTS / TAPES so neighbouring walls don't repeat the same pattern */
  seed?: number;
  className?: string;
}


const FRAME_WIDTH = {
  section: { landscape: "w-60 sm:w-80", portrait: "w-36 sm:w-52" },
  inline:  { landscape: "w-48 sm:w-64", portrait: "w-28 sm:w-40" },
} as const;

export function PolaroidWall({
  images,
  picks,
  onOpen,
  title = "Những khoảnh khắc đáng nhớ",
  subtitle = "Chạm vào ảnh để xem lớn",
  variant = "section",
  seed = 0,
  className,
}: PolaroidWallProps) {
  const indices = picks ?? images.map((_, i) => i);
  const isSection = variant === "section";
  return (
    <section
      aria-label={title}
      className={cn(
        "relative",
        isSection && "overflow-hidden rounded-3xl bg-rose-50/70 px-4 py-14 sm:px-10",
        className,
      )}
    >
      {isSection && (
        <>
          {/* paper texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #9f1239 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />
          <div className="relative text-center mb-10">
            <p className="font-script text-4xl sm:text-5xl text-rose-500">{title}</p>
            {subtitle && (
              <p className="mt-2 text-stone-400 text-xs tracking-[0.3em] uppercase">{subtitle}</p>
            )}
          </div>
        </>
      )}

      <div
        className={cn(
          "relative flex flex-wrap items-center justify-center",
          isSection ? "gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10" : "gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 py-3",
        )}
      >
        {indices.map((index, n) => {
          const k = n + seed;
          const ratio = aspectOf(images[index]);
          const landscape = ratio > 1;
          return (
            <AnimateInView
              key={index}
              animation="zoom-in"
              delay={(n % 6) * 70}
              duration={600}
              className="relative hover:z-10 focus-within:z-10"
            >
              <button
                type="button"
                data-photo-index={index}
                onClick={() => onOpen(index)}
                aria-label={`Xem ảnh ${index + 1}`}
                style={{ "--tilt": `${TILTS[k % TILTS.length]}deg` } as React.CSSProperties}
                className={cn(
                  // Frame width follows orientation so the whole photo always fits — never cropped
                  FRAME_WIDTH[variant][landscape ? "landscape" : "portrait"],
                  "group relative block bg-white p-2 pb-5 sm:p-2.5 sm:pb-7 shadow-[0_10px_25px_-8px_rgba(0,0,0,0.3)] rotate-(--tilt) transition-[rotate,scale,box-shadow] duration-300 ease-out hover:rotate-0 hover:scale-110 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)] focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-rose-400 cursor-zoom-in",
                )}
              >
                {/* washi tape */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 rotate-[-4deg] shadow-sm",
                    TAPES[k % TAPES.length],
                  )}
                />
                <span className="relative block overflow-hidden bg-stone-200" style={{ aspectRatio: ratio }}>
                  <ImageLoading
                    src={images[index]}
                    alt={`Ảnh cưới ${index + 1}`}
                    fill
                    sizes={landscape ? "(max-width: 640px) 240px, 320px" : "(max-width: 640px) 150px, 210px"}
                    className="object-cover"
                  />
                </span>
              </button>
            </AnimateInView>
          );
        })}
      </div>
    </section>
  );
}
