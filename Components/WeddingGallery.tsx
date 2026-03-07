"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingLightbox } from "@/Components/WeddingLightbox";

const masonryImages = [
  "/images/PTH_1803.JPG",
  "/images/PTH_1838.JPG",
  "/images/PTH_1849.JPG",
  "/images/PTH_1865.JPG",
  "/images/PTH_1872.JPG",
  "/images/PTH_1882.JPG",
  "/images/PTH_1894.JPG",
  "/images/PTH_1900.JPG",
  "/images/PTH_1911.JPG",
  "/images/PTH_1920.JPG",
  "/images/PTH_1929.JPG",
  "/images/PTH_1936.JPG",
];

const rowImages = [
  "/images/PTH_1939.JPG",
  "/images/PTH_1970.JPG",
  "/images/PTH_1981.JPG",
];

const allImages = [...masonryImages, ...rowImages];

export function WeddingGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open  = (index: number) => setLightboxIndex(index);
  const close = () => setLightboxIndex(null);
  const prev  = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const next  = () => setLightboxIndex((i) => (i !== null && i < allImages.length - 1 ? i + 1 : i));

  return (
    <>
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateInView className="text-center mb-14" animation="fade-up">
            <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-3">Khoảnh khắc</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-stone-800">Bộ ảnh cưới</h2>
          </AnimateInView>

          {/* Masonry */}
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {allImages.map((src, i) => (
              <AnimateInView
                key={src}
                animation="zoom-in"
                delay={i * 60}
                duration={600}
                className="break-inside-avoid"
              >
                <button
                  onClick={() => open(i)}
                  className="w-full overflow-hidden rounded-xl group cursor-zoom-in block relative"
                  aria-label={`Xem ảnh ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`Wedding photo ${i + 1}`}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs tracking-widest uppercase bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                      Xem ảnh
                    </span>
                  </div>
                </button>
              </AnimateInView>
            ))}
          </div>

          {/* View all button */}
          <AnimateInView className="mt-12 text-center" animation="fade-up" delay={200}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-rose-300 px-8 py-3.5 text-sm text-rose-500 font-medium tracking-wide hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 group"
            >
              Xem tất cả {30} bức ảnh
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <WeddingLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
