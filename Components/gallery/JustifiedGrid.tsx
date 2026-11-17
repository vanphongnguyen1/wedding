"use client";

import { ImageLoading } from "@/Components/common/ImageLoading";
import { AnimateInView } from "@/Components/AnimateInView";
import { aspectOf } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

export interface GridPhoto {
  src: string;
  /** Index within the tab's image list — used for lightbox + counter */
  index: number;
}

interface JustifiedGridProps {
  photos: GridPhoto[];
  total: number;
  onOpen: (index: number) => void;
  className?: string;
}

/**
 * Google-Photos-style justified rows in pure CSS (SSR-safe, no measuring):
 * each tile grows in proportion to its aspect ratio, so every tile in a row ends up
 * the same height and rows are flush on both edges. Photos are never cropped.
 * The trailing spacer stops the last, incomplete row from stretching.
 */
export function JustifiedGrid({ photos, total, onOpen, className }: JustifiedGridProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 sm:gap-3 [--row-h:130px] sm:[--row-h:180px] lg:[--row-h:230px]",
        "after:content-[''] after:grow-[999]",
        className,
      )}
    >
      {photos.map(({ src, index }, k) => {
        const ratio = aspectOf(src);
        return (
          <AnimateInView
            key={src}
            animation="fade-up"
            delay={(k % 5) * 50}
            duration={600}
            className="min-w-0"
            style={{ flexGrow: ratio, flexBasis: `calc(var(--row-h) * ${ratio})` }}
          >
            <button
              type="button"
              data-photo-index={index}
              onClick={() => onOpen(index)}
              aria-label={`Xem ảnh ${index + 1}`}
              className="group relative block w-full overflow-hidden rounded-lg bg-stone-200 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
              style={{ aspectRatio: ratio }}
            >
              <ImageLoading
                src={src}
                alt={`Ảnh cưới ${index + 1}`}
                fill
                sizes={ratio > 1 ? "(max-width: 640px) 60vw, 33vw" : "(max-width: 640px) 35vw, 18vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-end bg-linear-to-t from-black/55 via-black/0 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-white text-[11px] font-light tracking-widest tabular-nums">
                  {String(index + 1).padStart(2, "0")} / {total}
                </span>
              </span>
            </button>
          </AnimateInView>
        );
      })}
    </div>
  );
}
