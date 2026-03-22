"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import { ImageLoading } from "@/Components/common/ImageLoading";
import { Heart, Camera, Flower2 } from "lucide-react";
import { WeddingLightbox } from "@/Components/WeddingLightbox";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingMusicPlayer } from "./WeddingMusicPlayer";

const masonryBreakpoints = { default: 5, 1024: 3, 768: 2 };
const PAGE_SIZE = 30;

export const ALL_IMAGES: string[] = [
  "/images/PTH_1768.JPG",
  "/images/PTH_1772.JPG",
  "/images/PTH_1782.JPG",
  "/images/PTH_1800.JPG",
  "/images/PTH_1802.JPG",
  "/images/PTH_1803.JPG",
  "/images/PTH_1809.JPG",
  "/images/PTH_1819.JPG",
  "/images/PTH_1837.JPG",
  "/images/PTH_1838.JPG",
  "/images/PTH_1845.JPG",
  "/images/PTH_1848.JPG",
  "/images/PTH_1849.JPG",
  "/images/PTH_1864.JPG",
  "/images/PTH_1865.JPG",
  "/images/PTH_1872.JPG",
  "/images/PTH_1882.JPG",
  "/images/PTH_1884.JPG",
  "/images/PTH_1885.JPG",
  "/images/PTH_1886.JPG",
  "/images/PTH_1891.JPG",
  "/images/PTH_1892.JPG",
  "/images/PTH_1894.JPG",
  "/images/PTH_1895.JPG",
  "/images/PTH_1897.JPG",
  "/images/PTH_1899.JPG",
  "/images/PTH_1900.JPG",
  "/images/PTH_1901.JPG",
  "/images/PTH_1904.JPG",
  "/images/PTH_1906.JPG",
  "/images/PTH_1911.JPG",
  "/images/PTH_1913.JPG",
  "/images/PTH_1914.JPG",
  "/images/PTH_1919.JPG",
  "/images/PTH_1920.JPG",
  "/images/PTH_1921.JPG",
  "/images/PTH_1922.JPG",
  "/images/PTH_1926.JPG",
  "/images/PTH_1927.JPG",
  "/images/PTH_1929.JPG",
  "/images/PTH_1930.JPG",
  "/images/PTH_1933.JPG",
  "/images/PTH_1934.JPG",
  "/images/PTH_1936.JPG",
  "/images/PTH_1937.JPG",
  "/images/PTH_1938.JPG",
  "/images/PTH_1939.JPG",
  "/images/PTH_1940.JPG",
  "/images/PTH_1941.JPG",
  "/images/PTH_1946.JPG",
  "/images/PTH_1948.JPG",
  "/images/PTH_1956.JPG",
  "/images/PTH_1969.JPG",
  "/images/PTH_1970.JPG",
  "/images/PTH_1974.JPG",
  "/images/PTH_1975.JPG",
  "/images/PTH_1976.JPG",
  "/images/PTH_1981.JPG",
  "/images/PTH_1982.JPG",
  "/images/PTH_1987.JPG",
  "/images/PTH_1989.JPG",
  "/images/PTH_1993.JPG",
  "/images/PTH_1994.JPG",
  "/images/PTH_1995.JPG",
  "/images/PTH_2001.JPG",
  "/images/PTH_2009.JPG",
  "/images/PTH_2010.JPG",
  "/images/PTH_2011.JPG",
  "/images/PTH_2014.JPG",
  "/images/PTH_2018.JPG",
  "/images/PTH_2019.JPG",
  "/images/PTH_2024.JPG",
  "/images/PTH_2025.JPG",
  "/images/PTH_2026.JPG",
  "/images/PTH_2027.JPG",
  "/images/PTH_2028.JPG",
  "/images/PTH_2029.JPG",
  "/images/PTH_2030.JPG",
  "/images/PTH_2039.JPG",
  "/images/PTH_2044.JPG",
  "/images/PTH_2045.JPG",
  "/images/PTH_2046.JPG",
  "/images/PTH_2049.JPG",
  "/images/PTH_2059.JPG",
  "/images/PTH_2074.JPG",
  "/images/PTH_2075.JPG",
  "/images/PTH_2076.JPG",
  "/images/PTH_2078.JPG",
  "/images/PTH_2080.JPG",
  "/images/PTH_2083.JPG",
  "/images/PTH_2084.JPG",
  "/images/PTH_2085.JPG",
  "/images/PTH_2086.JPG",
  "/images/PTH_2092.JPG",
  "/images/PTH_2098.JPG",
  "/images/PTH_2100.JPG",
  "/images/PTH_2102.JPG",
  "/images/PTH_2104.JPG",
  "/images/PTH_2107.JPG",
  "/images/PTH_2110.JPG",
  "/images/PTH_2166.JPG",
  "/images/PTH_2187.JPG",
  "/images/PTH_2192.JPG",
];

const WEDDING_IMAGES: string[] = [
  "/images/iwindding/_MG_0117.jpg",
  "/images/iwindding/_MG_0147.jpg",
  "/images/iwindding/_MG_0150.jpg",
  "/images/iwindding/_MG_0171.jpg",
  "/images/iwindding/_MG_0178.jpg",
  "/images/iwindding/_MG_0183.jpg",
  "/images/iwindding/_MG_0188.jpg",
  "/images/iwindding/_MG_0191.jpg",
  "/images/iwindding/_MG_0194.jpg",
  "/images/iwindding/_MG_0196.jpg",
  "/images/iwindding/_MG_0198.jpg",
  "/images/iwindding/_MG_0200.jpg",
  "/images/iwindding/_MG_0201.jpg",
  "/images/iwindding/_MG_0220.jpg",
  "/images/iwindding/_MG_0223.jpg",
  "/images/iwindding/_MG_0225.jpg",
  "/images/iwindding/_MG_0228.jpg",
  "/images/iwindding/_MG_0231.jpg",
  "/images/iwindding/_MG_0233.jpg",
  "/images/iwindding/_MG_0237.jpg",
  "/images/iwindding/_MG_0245.jpg",
  "/images/iwindding/_MG_0246.jpg",
  "/images/iwindding/_MG_0258.jpg",
  "/images/iwindding/_MG_0280.jpg",
  "/images/iwindding/_MG_0287.jpg",
  "/images/iwindding/_MG_0289.jpg",
  "/images/iwindding/_MG_0295.jpg",
  "/images/iwindding/_MG_0297.jpg",
  "/images/iwindding/_MG_0301.jpg",
  "/images/iwindding/_MG_0305.jpg",
  "/images/iwindding/_MG_0307.jpg",
  "/images/iwindding/_MG_0310.jpg",
  "/images/iwindding/_MG_0319.jpg",
  "/images/iwindding/_MG_0324.jpg",
  "/images/iwindding/_MG_0333.jpg",
  "/images/iwindding/_MG_0335.jpg",
  "/images/iwindding/_MG_0339.jpg",
  "/images/iwindding/_MG_0351.jpg",
  "/images/iwindding/_MG_0356.jpg",
  "/images/iwindding/_MG_0363.jpg",
  "/images/iwindding/_MG_0367.jpg",
  "/images/iwindding/_MG_0370.jpg",
  "/images/iwindding/_MG_0372.jpg",
  "/images/iwindding/_MG_0375.jpg",
  "/images/iwindding/_MG_0377.jpg",
  "/images/iwindding/_MG_0383.jpg",
  "/images/iwindding/_MG_0393.jpg",
  "/images/iwindding/_MG_0402.jpg",
  "/images/iwindding/_MG_0406.jpg",
  "/images/iwindding/_MG_0411.jpg",
  "/images/iwindding/_MG_0416.jpg",
  "/images/iwindding/_MG_0418.jpg",
  "/images/iwindding/_MG_0422.jpg",
  "/images/iwindding/_MG_0425.jpg",
  "/images/iwindding/_MG_0429.jpg",
  "/images/iwindding/_MG_0432.jpg",
  "/images/iwindding/_MG_0434.jpg",
  "/images/iwindding/_MG_0436.jpg",
  "/images/iwindding/_MG_0441.jpg",
  "/images/iwindding/_MG_0443.jpg",
  "/images/iwindding/_MG_0445.jpg",
  "/images/iwindding/_MG_0447.jpg",
  "/images/iwindding/_MG_0449.jpg",
  "/images/iwindding/_MG_0453.jpg",
  "/images/iwindding/_MG_0461.jpg",
  "/images/iwindding/_MG_0464.jpg",
  "/images/iwindding/_MG_0465.jpg",
  "/images/iwindding/_MG_0470.jpg",
  "/images/iwindding/_MG_0473.jpg",
  "/images/iwindding/_MG_0474.jpg",
  "/images/iwindding/_MG_0479.jpg",
  "/images/iwindding/_MG_0497.jpg",
  "/images/iwindding/_MG_0498.jpg",
  "/images/iwindding/_MG_0500.jpg",
  "/images/iwindding/_MG_0503.jpg",
  "/images/iwindding/_MG_0505.jpg",
  "/images/iwindding/_MG_0510.jpg",
  "/images/iwindding/_MG_0513.jpg",
  "/images/iwindding/_MG_0521.jpg",
  "/images/iwindding/_MG_0529.jpg",
  "/images/iwindding/_MG_0534.jpg",
  "/images/iwindding/_MG_0544.jpg",
  "/images/iwindding/_MG_0548.jpg",
  "/images/iwindding/_MG_0556.jpg",
  "/images/iwindding/_MG_0559.jpg",
  "/images/iwindding/_MG_0568.jpg",
  "/images/iwindding/_MG_0570.jpg",
  "/images/iwindding/_MG_0574.jpg",
  "/images/iwindding/_MG_0578.jpg",
  "/images/iwindding/_MG_0583.jpg",
  "/images/iwindding/_MG_0595.jpg",
  "/images/iwindding/_MG_0598.jpg",
  "/images/iwindding/_MG_0605.jpg",
  "/images/iwindding/_MG_0608.jpg",
  "/images/iwindding/_MG_0613.jpg",
  "/images/iwindding/_MG_0621.jpg",
  "/images/iwindding/_MG_0623.jpg",
  "/images/iwindding/_MG_0627.jpg",
  "/images/iwindding/_MG_0629.jpg",
  "/images/iwindding/_MG_0631.jpg",
  "/images/iwindding/_MG_0636.jpg",
  "/images/iwindding/_MG_0642.jpg",
  "/images/iwindding/_MG_0643.jpg",
  "/images/iwindding/_MG_0647.jpg",
  "/images/iwindding/_MG_0653.jpg",
  "/images/iwindding/_MG_0655.jpg",
  "/images/iwindding/_MG_0657.jpg",
  "/images/iwindding/_MG_0658.jpg",
  "/images/iwindding/_MG_0662.jpg",
  "/images/iwindding/_MG_0664.jpg",
  "/images/iwindding/_MG_0669.jpg",
  "/images/iwindding/_MG_0672.jpg",
  "/images/iwindding/_MG_0674.jpg",
  "/images/iwindding/_MG_0678.jpg",
  "/images/iwindding/_MG_0681.jpg",
  "/images/iwindding/_MG_0687.jpg",
  "/images/iwindding/_MG_0692.jpg",
  "/images/iwindding/_MG_0699.jpg",
  "/images/iwindding/_MG_0704.jpg",
  "/images/iwindding/_MG_0711.jpg",
  "/images/iwindding/_MG_0713.jpg",
  "/images/iwindding/_MG_0718.jpg",
  "/images/iwindding/_MG_0722.jpg",
  "/images/iwindding/_MG_0724.jpg",
  "/images/iwindding/_MG_0736.jpg",
  "/images/iwindding/_MG_0738.jpg",
  "/images/iwindding/_MG_0742.jpg",
  "/images/iwindding/_MG_0747.jpg",
  "/images/iwindding/_MG_0767.jpg",
  "/images/iwindding/_MG_0778.jpg",
];

type Tab = "anhcuoi" | "wedding";

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ElementType;
  images: string[];
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "anhcuoi",
    label: "Ảnh cưới",
    icon: Camera,
    images: ALL_IMAGES,
    description: "Khoảnh khắc lễ cưới",
  },
  {
    id: "wedding",
    label: "Wedding",
    icon: Flower2,
    images: WEDDING_IMAGES,
    description: "Tiệc cưới & gia đình",
  },
];

interface ImageGridProps {
  images: string[];
  onOpen: (i: number) => void;
}

function ImageGrid({ images, onOpen }: ImageGridProps) {
  return (
    <Masonry
      breakpointCols={masonryBreakpoints}
      className="flex gap-3"
      columnClassName="flex flex-col gap-3"
    >
      {images.map((src, i) => (
        <AnimateInView
          key={src}
          animation="zoom-in"
          delay={Math.min((i % 10) * 40, 300)}
          duration={500}
          className="overflow-hidden rounded-xl"
        >
          <button
            onClick={() => onOpen(i)}
            className="relative w-full block group cursor-zoom-in bg-stone-100"
            aria-label={`Xem ảnh ${i + 1}`}
          >
            <ImageLoading
              src={src}
              alt={`Wedding photo ${i + 1}`}
              width={600}
              height={800}
              quality={70}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <span className="text-white text-xs font-light tracking-widest">
                {String(i + 1).padStart(2, "0")} / {images.length}
              </span>
            </div>
          </button>
        </AnimateInView>
      ))}
    </Masonry>
  );
}

export function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("anhcuoi");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const currentImages = currentTab.images;
  const visibleImages = currentImages.slice(0, visibleCount);
  const hasMore = visibleCount < currentImages.length;

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, currentImages.length));
  }, [currentImages.length]);

  // Reset khi đổi tab
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(PAGE_SIZE);
  }, [activeTab]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const next = () =>
    setLightboxIndex((i) =>
      i !== null && i < currentImages.length - 1 ? i + 1 : i
    );

  return (
    <>
      <main className="min-h-screen bg-stone-50 pb-20">

        {/* ── Hero header ── */}
        <div className="relative bg-white border-b border-stone-100 py-16 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #be123c 2px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <AnimateInView animation="fade-up" className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-rose-200" />
              <Heart className="w-4 h-4 text-rose-400 animate-heartbeat" />
              <div className="h-px w-12 bg-rose-200" />
            </div>
            <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-3">
              Toàn bộ khoảnh khắc
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl text-stone-800 mb-3">
              Bộ ảnh cưới
            </h1>
            <p className="text-stone-400 text-sm tracking-wide">
              Văn Phong &amp; Hồng Nhung · 07.05.2023
            </p>
          </AnimateInView>
        </div>

        {/* ── Sticky Tab Bar ── */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setLightboxIndex(null);
                    }}
                    className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-rose-500"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1 text-xs px-2 py-0.5 rounded-full transition-colors duration-200 ${
                        isActive
                          ? "bg-rose-100 text-rose-500"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {tab.images.length}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Tab description ── */}
        <div className="max-w-7xl mx-auto px-3 pt-4 pb-2">
          <p className="text-stone-400 text-xs tracking-widest uppercase">
            {currentTab.description} &nbsp;·&nbsp; {currentImages.length} bức ảnh
          </p>
        </div>

        {/* ── Image Grid ── */}
        <div className="max-w-7xl mx-auto px-3 pt-1">
          <ImageGrid key={activeTab} images={visibleImages} onOpen={open} />
          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="py-6 flex justify-center">
            {hasMore && (
              <span className="text-stone-400 text-xs tracking-widest uppercase animate-pulse">
                Đang tải thêm...
              </span>
            )}
          </div>
        </div>

      </main>

      <WeddingMusicPlayer src="/music/gap-go-yeu-duong-duoc-ben-em.mp3" />

      {lightboxIndex !== null && (
        <WeddingLightbox
          images={currentImages}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
