"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { WeddingLightbox } from "@/Components/WeddingLightbox";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingMusicPlayer } from "./WeddingMusicPlayer";
export const ALL_IMAGES = [
  "/images/PTH_1768.JPG",
  "/images/PTH_1772.JPG",
  "/images/PTH_1802.JPG",
  "/images/PTH_1803.JPG",
  "/images/PTH_1838.JPG",
  "/images/PTH_1845.JPG",
  "/images/PTH_1849.JPG",
  "/images/PTH_1865.JPG",
  "/images/PTH_1872.JPG",
  "/images/PTH_1882.JPG",
  "/images/PTH_1886.JPG",
  "/images/PTH_1894.JPG",
  "/images/PTH_1897.JPG",
  "/images/PTH_1900.JPG",
  "/images/PTH_1911.JPG",
  "/images/PTH_1913.JPG",
  "/images/PTH_1920.JPG",
  "/images/PTH_1929.JPG",
  "/images/PTH_1936.JPG",
  "/images/PTH_1939.JPG",
  "/images/PTH_1970.JPG",
  "/images/PTH_1981.JPG",
  "/images/PTH_1993.JPG",
  "/images/PTH_2019.JPG",
  "/images/PTH_2025.JPG",
  "/images/PTH_2030.JPG",
  "/images/PTH_2045.JPG",
  "/images/PTH_2085.JPG",
  "/images/PTH_2107.JPG",
  "/images/PTH_2166.JPG",
];

const imagesLength = ALL_IMAGES.length

export function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const next = () => setLightboxIndex((i) => (i !== null && i < ALL_IMAGES.length - 1 ? i + 1 : i));

  return (
    <>
      <main className="min-h-screen bg-stone-50 pb-20">

        {/* ── Hero header ── */}
        <div className="relative bg-white border-b border-stone-100 py-16 text-center overflow-hidden">
          {/* subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #be123c 2px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <AnimateInView animation="fade-up" className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-rose-200" />
              <Heart className="w-4 h-4 text-rose-400 animate-heartbeat" />
              <div className="h-px w-12 bg-rose-200" />
            </div>
            <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-3">Toàn bộ khoảnh khắc</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-stone-800 mb-3">Bộ ảnh cưới</h1>
            <p className="text-stone-400 text-sm tracking-wide">
              {ALL_IMAGES.length} bức ảnh &nbsp;·&nbsp; Văn Phong & Hồng Nhung
            </p>
          </AnimateInView>
        </div>

        {/* ── CSS Columns layout ── */}
        <div className="max-w-7xl mx-auto px-3 pt-3">
          <div className="columns-2 md:columns-3 lg:columns-5 gap-3">
            {ALL_IMAGES.map((src, i) => (
              <AnimateInView
                key={src}
                animation="zoom-in"
                delay={Math.min((i % 10) * 50, 400)}
                duration={500}
                // break-inside-avoid: ngăn ảnh bị cắt giữa cột
                className="break-inside-avoid mb-3 overflow-hidden rounded-xl"
              >
                <button
                  onClick={() => open(i)}
                  className="relative w-full block group cursor-zoom-in"
                  aria-label={`Xem ảnh ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`Wedding photo ${i + 1}`}
                    width={600}
                    height={800}
                    // w-full h-auto: ảnh fill cột, giữ tỉ lệ gốc
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <span className="text-white text-xs font-light tracking-widest">
                      {String(i + 1).padStart(2, "0")} / {imagesLength}
                    </span>
                  </div>
                </button>
              </AnimateInView>
            ))}
          </div>
        </div>

      </main>
      <WeddingMusicPlayer src="/music/gap-go-yeu-duong-duoc-ben-em.mp3" />
      {lightboxIndex !== null && (
        <WeddingLightbox
          images={ALL_IMAGES}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}

    </>
  );
}
