"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Images, LayoutGrid, Play, Video } from "lucide-react";
import { ImageLoading } from "@/Components/common/ImageLoading";
import { JustifiedRows } from "@/Components/common/JustifiedRows";
import { LivePhoto } from "@/Components/family/LivePhoto";
import { MediaViewer } from "@/Components/family/MediaViewer";
import { PHOTO_TRANSITION_NAME, usePhotoTransition } from "@/hooks/usePhotoTransition";
import { type FamilyItem, formatDuration, groupByMonth } from "@/lib/family-media";
import { cn } from "@/lib/utils";

const PAGE = 48;

type Filter = "all" | "photo" | "video";
const FILTERS: { id: Filter; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "Tất cả", icon: LayoutGrid },
  { id: "photo", label: "Ảnh", icon: Images },
  { id: "video", label: "Video", icon: Video },
];

const matches = (f: Filter, item: FamilyItem) =>
  f === "all" || (f === "video" ? item.kind === "video" : item.kind !== "video");

interface FamilyAlbumProps {
  items: FamilyItem[];
}

export function FamilyAlbum({ items }: FamilyAlbumProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE);
  const { index, setIndex, open, close } = usePhotoTransition();
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => items.filter((i) => matches(filter, i)), [items, filter]);
  const groups = useMemo(() => groupByMonth(filtered.slice(0, visible)), [filtered, visible]);
  const counts = useMemo(
    () => ({
      all: items.length,
      photo: items.filter((i) => i.kind !== "video").length,
      video: items.filter((i) => i.kind === "video").length,
    }),
    [items],
  );
  // First index of every year in the filtered list → year chips jump there
  const years = useMemo(() => {
    const firstIndex = new Map<string, number>();
    filtered.forEach((i, n) => {
      const y = i.date?.slice(0, 4);
      if (y && !firstIndex.has(y)) firstIndex.set(y, n);
    });
    return [...firstIndex.entries()];
  }, [filtered]);

  const hasMore = visible < filtered.length;

  // Infinite scroll
  const loadMore = useCallback(() => setVisible((v) => v + PAGE), []);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && loadMore(), { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  // Year chip: scroll to the year's first month, rendering more items first if needed
  const pendingYear = useRef<string | null>(null);
  const scrollToYear = (year: string) => {
    const el = document.querySelector(`[data-year="${year}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    return !!el;
  };
  const jumpToYear = (year: string, firstIndex: number) => {
    if (scrollToYear(year)) return;
    pendingYear.current = year;
    setVisible((v) => Math.max(v, firstIndex + PAGE));
  };
  useEffect(() => {
    if (pendingYear.current && scrollToYear(pendingYear.current)) pendingYear.current = null;
  }, [groups]);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setVisible(PAGE);
    setIndex(null);
  };

  const renderTile = ({ item, index: i }: { item: FamilyItem; index: number }) => {
    const ratio = item.w / item.h;
    if (item.kind === "live") {
      return (
        <div className="h-full overflow-hidden rounded-md">
          <LivePhoto src={item.src} video={item.video} alt="Ảnh gia đình" ratio={ratio} photoIndex={i} onOpen={() => open(i)} />
        </div>
      );
    }
    const isVideo = item.kind === "video";
    return (
      <button
        type="button"
        data-photo-index={i}
        onClick={() => open(i)}
        aria-label={isVideo ? `Xem video ${formatDuration(item.duration)}` : "Xem ảnh"}
        className="group relative block h-full w-full overflow-hidden rounded-md bg-stone-200 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
      >
        <ImageLoading
          src={isVideo ? item.poster : item.src}
          alt=""
          fill
          sizes={ratio > 1 ? "(max-width: 640px) 70vw, 30vw" : "(max-width: 640px) 40vw, 16vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isVideo && (
          <>
            <span className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-rose-500 shadow transition-transform group-hover:scale-110">
              <Play className="h-4 w-4 translate-x-px fill-rose-500" />
            </span>
            <span className="absolute bottom-1.5 right-2 text-[11px] font-medium text-white tabular-nums drop-shadow">
              {formatDuration(item.duration)}
            </span>
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Toolbar — sits under the 57px sticky site header */}
      <div className="sticky top-[57px] z-20 border-b border-stone-200/70 bg-white/90 backdrop-blur">
        {/* one row on every screen (scrolls sideways on phones) so month headers can stick right below */}
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:gap-6">
          <div className="flex shrink-0 gap-1 rounded-full bg-stone-100 p-1">
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => changeFilter(id)}
                aria-pressed={filter === id}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors sm:px-3.5",
                  filter === id ? "bg-white text-rose-500 shadow-sm" : "text-stone-500 hover:text-stone-800",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span className="hidden text-xs text-stone-400 tabular-nums sm:inline">{counts[id]}</span>
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-1">
            {years.map(([y, first]) => (
              <button
                key={y}
                type="button"
                onClick={() => jumpToYear(y, first)}
                className="shrink-0 rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-500 transition-colors hover:border-rose-300 hover:text-rose-500"
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month groups */}
      <div className="mx-auto max-w-7xl px-2 pb-10 sm:px-4">
        {groups.map((g, n) => {
          // Anchor for the year chips: first month of each year
          const newYear = g.year && g.year !== groups[n - 1]?.year;
          return (
            <section key={g.key} data-year={newYear ? g.year : undefined} className="scroll-mt-32 pt-8">
              <h2 className="sticky top-[110px] z-10 -mx-2 mb-3 flex items-baseline gap-3 bg-amber-50/90 px-2 py-2 backdrop-blur-sm sm:top-[114px]">
                <span className="font-serif text-xl text-stone-800 sm:text-2xl">{g.label}</span>
                <span className="text-xs text-stone-400">{g.items.length} khoảnh khắc</span>
              </h2>
              <JustifiedRows
                items={g.items}
                getKey={({ item }) => item.src}
                getRatio={({ item }) => item.w / item.h}
                renderItem={renderTile}
              />
            </section>
          );
        })}

        <div ref={sentinel} className="py-10 text-center text-xs uppercase tracking-widest text-stone-400">
          {hasMore ? <span className="animate-pulse">Đang tải thêm…</span> : `${filtered.length} khoảnh khắc`}
        </div>
      </div>

      {index !== null && (
        <MediaViewer
          items={filtered}
          index={index}
          onClose={close}
          onPrev={() => setIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i))}
          transitionName={PHOTO_TRANSITION_NAME}
        />
      )}
    </>
  );
}
