"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import { ImageLoading } from "@/Components/common/ImageLoading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingLightbox } from "@/Components/WeddingLightbox";

const masonryBreakpoints = { default: 3, 768: 2 };
const PAGE_SIZE = 6;

const masonryImages = [
  "/images/PTH_1803.JPG",
    "/images/PTH_1772.JPG",
  "/images/PTH_1838.JPG",
  "/images/PTH_1849.JPG",
  "/images/PTH_1865.JPG",
  "/images/PTH_1872.JPG",
  "/images/PTH_1882.JPG",
  "/images/PTH_1900.JPG",
  "/images/PTH_2028.JPG",
  "/images/PTH_2030.JPG",
  "/images/PTH_1936.JPG",
];

const rowImages = [
  "/images/PTH_2019.JPG",
  "/images/PTH_2044.JPG",
  "/images/PTH_1981.JPG",
  "/images/PTH_2166.JPG",
];

const allImages = [...masonryImages, ...rowImages];

export function WeddingGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleImages = allImages.slice(0, visibleCount);
  const hasMore = visibleCount < allImages.length;

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, allImages.length));
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="flex gap-4"
            columnClassName="flex flex-col gap-4"
          >
            {visibleImages.map((src, i) => (
              <AnimateInView
                key={src}
                animation="zoom-in"
                delay={i * 60}
                duration={600}
              >
                <button
                  onClick={() => open(i)}
                  className="w-full overflow-hidden rounded-xl group cursor-zoom-in block relative bg-stone-100"
                  aria-label={`Xem ảnh ${i + 1}`}
                >
                  <ImageLoading
                    src={src}
                    alt={`Wedding photo ${i + 1}`}
                    width={600}
                    height={800}
                    quality={70}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
          </Masonry>

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} />

          {/* View all button */}
          <AnimateInView className="mt-12 text-center" animation="fade-up" delay={200}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-rose-300 px-8 py-3.5 text-sm text-rose-500 font-medium tracking-wide hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 group"
            >
              Xem tất cả ảnh
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
