"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Heart, Camera, Flower2 } from "lucide-react";
import { WeddingLightbox } from "@/Components/WeddingLightbox";
import { WeddingMusicPlayer } from "@/Components/WeddingMusicPlayer";
import { GalleryChapter } from "@/Components/gallery/GalleryChapter";
import { PolaroidWall } from "@/Components/gallery/PolaroidWall";
import { PHOTO_TRANSITION_NAME, usePhotoTransition } from "@/hooks/usePhotoTransition";
import {
  PREWEDDING_IMAGES,
  WEDDING_IMAGES,
  PREWEDDING_CHAPTERS,
  WEDDING_CHAPTERS,
  buildChapters,
  type ChapterConfig,
} from "@/lib/gallery-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 30;
/** Each chapter is a scrapbook page with its own paper tone */
const PAPER_TONES = [
  { bg: "bg-rose-50/80",    dot: "#9f1239" },
  { bg: "bg-amber-50/80",   dot: "#92400e" },
  { bg: "bg-sky-50/80",     dot: "#075985" },
  { bg: "bg-emerald-50/70", dot: "#065f46" },
];

type Tab = "anhcuoi" | "wedding";

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ElementType;
  images: string[];
  chapters: ChapterConfig[];
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "anhcuoi",
    label: "Ảnh cưới",
    icon: Camera,
    images: PREWEDDING_IMAGES,
    chapters: PREWEDDING_CHAPTERS,
    description: "Khoảnh khắc lễ cưới",
  },
  {
    id: "wedding",
    label: "Wedding",
    icon: Flower2,
    images: WEDDING_IMAGES,
    chapters: WEDDING_CHAPTERS,
    description: "Tiệc cưới & gia đình",
  },
];

export function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("anhcuoi");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { index: lightboxIndex, setIndex: setLightboxIndex, open, close } = usePhotoTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const currentImages = currentTab.images;
  const hasMore = visibleCount < currentImages.length;

  const chapters = useMemo(
    () => buildChapters(currentTab.images, currentTab.chapters),
    [currentTab],
  );

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
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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
        </div>

        {/* ── Sticky Tab Bar (sits below the 57px sticky site header) ── */}
        <div className="sticky top-[57px] z-20 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
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
                    className={cn(
                      "relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-rose-500" : "text-stone-500 hover:text-stone-800",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "ml-1 text-xs px-2 py-0.5 rounded-full transition-colors duration-200",
                        isActive ? "bg-rose-100 text-rose-500" : "bg-stone-100 text-stone-400",
                      )}
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
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
          <p className="text-stone-400 text-xs tracking-widest uppercase">
            {currentTab.description} &nbsp;·&nbsp; {chapters.length} chương &nbsp;·&nbsp; {currentImages.length} bức ảnh
          </p>
        </div>

        {/* ── Chapters ── */}
        <div key={activeTab} className="max-w-7xl mx-auto px-4 pt-6 space-y-20 lg:space-y-28">
          {chapters.map((ch, n) => {
            const shown = Math.max(0, Math.min(ch.images.length, visibleCount - ch.start));
            if (shown === 0) return null;
            const tone = PAPER_TONES[n % PAPER_TONES.length];
            const picks = Array.from({ length: shown }, (_, i) => ch.start + i);
            return (
              <GalleryChapter
                key={ch.title}
                number={n + 1}
                totalChapters={chapters.length}
                title={ch.title}
                quote={ch.quote}
                photoCount={ch.images.length}
              >
                {/* Scrapbook page */}
                <div className={cn("relative overflow-hidden rounded-3xl px-3 py-8 sm:px-8 sm:py-12", tone.bg)}>
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: `radial-gradient(circle, ${tone.dot} 1px, transparent 1px)`,
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <PolaroidWall
                    variant="inline"
                    images={currentImages}
                    picks={picks}
                    seed={ch.start}
                    onOpen={open}
                    title={`Chương ${n + 1} — ${ch.title}`}
                  />
                </div>
              </GalleryChapter>
            );
          })}

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="py-6 flex justify-center">
            {hasMore ? (
              <span className="text-stone-400 text-xs tracking-widest uppercase animate-pulse">
                Đang tải thêm...
              </span>
            ) : (
              <span className="flex items-center gap-3 text-stone-400 text-xs tracking-[0.3em] uppercase">
                <span className="h-px w-10 bg-rose-200" />
                Hết ảnh
                <Heart className="w-3.5 h-3.5 text-rose-300" />
                <span className="h-px w-10 bg-rose-200" />
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
          photoTransitionName={PHOTO_TRANSITION_NAME}
        />
      )}
    </>
  );
}
