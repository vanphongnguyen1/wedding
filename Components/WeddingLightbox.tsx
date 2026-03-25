"use client";

import { useEffect, useCallback } from "react";
import { ImageLoading } from "@/Components/common/ImageLoading";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function WeddingLightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Prefetch prev-1, next+1, next+2 via <link rel="preload"> pointing at Next.js optimizer URL
  useEffect(() => {
    const indices = [currentIndex - 1, currentIndex + 1, currentIndex + 2];
    const links = indices
      .filter((i) => i >= 0 && i < images.length)
      .map((i) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = `/_next/image?url=${encodeURIComponent(images[i])}&w=1200&q=75`;
        document.head.appendChild(link);
        return link;
      });
    return () => links.forEach((l) => l.remove());
  }, [currentIndex, images]);

  useEffect(() => {
    let startX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX === null) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) onNext(); else onPrev();
      }
      startX = null;
    };

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ImageLoading
          key={currentIndex}
          src={images[currentIndex]}
          animationDuration={100}
          alt={`Wedding photo ${currentIndex + 1}`}
          width={1200}
          height={900}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          priority
        />

        {/* Download */}
        <a
          href={images[currentIndex]}
          download
          onClick={(e) => e.stopPropagation()}
          aria-label="Tải ảnh"
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/20 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        >
          <Download className="w-5 h-5 text-black" />
        </a>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Đóng"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm"
      >
        <X className="w-5 h-5" />
      </button>


      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Ảnh trước"
        disabled={currentIndex === 0}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20",
          "flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm",
          currentIndex === 0 && "opacity-30 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Ảnh tiếp"
        disabled={currentIndex === images.length - 1}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20",
          "flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm",
          currentIndex === images.length - 1 && "opacity-30 cursor-not-allowed"
        )}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="text-white/60 text-sm tabular-nums">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[80vw] overflow-hidden">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); }}
            aria-label={`Ảnh ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-300 shrink-0",
              i === currentIndex
                ? "w-6 h-1.5 bg-rose-400"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
