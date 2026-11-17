"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingLightbox } from "@/Components/WeddingLightbox";
import { PolaroidWall } from "@/Components/gallery/PolaroidWall";
import { PHOTO_TRANSITION_NAME, usePhotoTransition } from "@/hooks/usePhotoTransition";

const images = [
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
  "/images/PTH_2019.JPG",
  "/images/PTH_2044.JPG",
  "/images/PTH_1981.JPG",
  "/images/PTH_2166.JPG",
];

export function WeddingGallery() {
  const { index: lightboxIndex, setIndex, open, close } = usePhotoTransition();

  const prev = () => setIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const next = () => setIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i));

  return (
    <>
      <section id="gallery" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <PolaroidWall images={images} onOpen={open} />

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

      {lightboxIndex !== null && (
        <WeddingLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
          photoTransitionName={PHOTO_TRANSITION_NAME}
        />
      )}
    </>
  );
}
