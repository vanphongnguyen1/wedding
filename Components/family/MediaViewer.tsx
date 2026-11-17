"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type FamilyItem, formatDate } from "@/lib/family-media";
import { cn } from "@/lib/utils";

interface MediaViewerProps {
  items: FamilyItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** view-transition-name for the morph from the grid tile */
  transitionName?: string;
}

/** Full-screen viewer for photos, live photos and videos — keyboard, swipe, prev/next. */
export function MediaViewer({ items, index, onClose, onPrev, onNext, transitionName }: MediaViewerProps) {
  const item = items[index];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  // Swipe left / right
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 60) (dx < 0 ? onNext : onPrev)();
  };

  // A playing video pauses any other media on the page (e.g. background music)
  const pauseOthers = () =>
    document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((el) => {
      if (el !== videoRef.current && !el.muted) el.pause();
    });

  const media = cn("max-h-[calc(100svh-8rem)] max-w-[calc(100vw-2rem)] w-auto h-auto object-contain");
  const vt = transitionName ? { viewTransitionName: transitionName } : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh và video"
      className="fixed inset-0 z-100 flex flex-col bg-black/95 animate-[fadeIn_0.2s_ease]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white/80">
        <div className="text-sm">
          <span className="tabular-nums">{index + 1} / {items.length}</span>
          {item.date && <span className="ml-3 text-white/50">{formatDate(item.date)}</span>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* media */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6" onClick={onClose}>
        <div key={item.src} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
          {item.kind === "video" ? (
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              onPlay={pauseOthers}
              className={cn(media, "bg-black")}
              style={{ ...vt, aspectRatio: item.w / item.h }}
            />
          ) : item.kind === "live" ? (
            <video
              src={item.video}
              poster={item.src}
              autoPlay
              muted
              playsInline
              loop
              className={media}
              style={{ ...vt, aspectRatio: item.w / item.h }}
            />
          ) : (
            <Image
              src={item.src}
              alt={item.date ? `Ảnh ngày ${formatDate(item.date)}` : "Ảnh gia đình"}
              width={item.w}
              height={item.h}
              sizes="100vw"
              priority
              className={media}
              style={vt}
            />
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          disabled={index === 0}
          aria-label="Trước"
          className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 sm:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          disabled={index === items.length - 1}
          aria-label="Tiếp"
          className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 sm:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
