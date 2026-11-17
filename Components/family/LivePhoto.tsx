"use client";

import { useRef, useState } from "react";
import { ImageLoading } from "@/Components/common/ImageLoading";
import { cn } from "@/lib/utils";

interface LivePhotoProps {
  src: string;
  video: string;
  alt: string;
  /** Width / height of the still */
  ratio: number;
  onOpen: () => void;
  /** Index used by the lightbox view-transition */
  photoIndex: number;
}

/** iPhone-style Live Photo: hover (desktop) or press-and-hold (touch) plays the motion clip. */
export function LivePhoto({ src, video, alt, ratio, onOpen, photoIndex }: LivePhotoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().then(() => setLive(true)).catch(() => {});
  };
  const stop = () => setLive(false);

  return (
    <button
      type="button"
      data-photo-index={photoIndex}
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && play()}
      onPointerLeave={stop}
      onTouchStart={play}
      onTouchEnd={stop}
      aria-label={`Xem ảnh: ${alt}`}
      className="relative block w-full overflow-hidden bg-stone-200 cursor-zoom-in"
      style={{ aspectRatio: ratio }}
    >
      <ImageLoading src={src} alt={alt} fill sizes="(max-width: 640px) 60vw, 240px" className="object-cover" />
      <video
        ref={ref}
        src={video}
        muted
        playsInline
        preload="metadata"
        onEnded={stop}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          live ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-stone-700 backdrop-blur-sm">
        <span className={cn("h-2 w-2 rounded-full border border-stone-700", live && "bg-amber-400 border-amber-500")} />
        LIVE
      </span>
    </button>
  );
}
