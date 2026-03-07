"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  "/images/album 20x30 doc_03.JPG",
  "/images/album 20x30 doc_05.JPG",
  "/images/album 20x30 doc_06.JPG",
  "/images/album 20x30 doc_07.JPG",
  "/images/album 20x30 doc_08.JPG",
  "/images/album 20x30 doc_09.JPG",
  "/images/album 20x30 doc_10.JPG",
  "/images/album 20x30 doc_12.JPG",
];

const INTERVAL = 4000;

export function WeddingSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, INTERVAL);
  }, [next]);

  // useEffect(() => {
  //   startTimer();
  //   return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // }, [startTimer]);

  const handlePrev = () => { prev(); startTimer(); };
  const handleNext = () => { next(); startTimer(); };

  return (
    <div
      className="relative h-[400px] md:h-[65vh] overflow-hidden group"
      onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
      onMouseLeave={startTimer}
    >
      {/* Slides */}
      {slides.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={src}
            alt={`Wedding slide ${i + 1}`}
            fill
            className="object-contain"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 z-20 pointer-events-none" />

      {/* Prev arrow */}
      <button
        onClick={handlePrev}
        aria-label="Ảnh trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next arrow */}
      <button
        onClick={handleNext}
        aria-label="Ảnh tiếp"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); startTimer(); }}
            aria-label={`Đến ảnh ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-400",
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
