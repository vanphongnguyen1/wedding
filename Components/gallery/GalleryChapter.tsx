import { cn } from "@/lib/utils";

interface GalleryChapterProps {
  number: number;
  totalChapters: number;
  title: string;
  quote: string;
  photoCount: number;
  children: React.ReactNode;
  className?: string;
}

/** A chapter: title + quote that stays pinned beside its photos on desktop. */
export function GalleryChapter({
  number,
  totalChapters,
  title,
  quote,
  photoCount,
  children,
  className,
}: GalleryChapterProps) {
  const num = String(number).padStart(2, "0");
  return (
    <section
      aria-label={`Chương ${number}: ${title}`}
      className={cn("lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10", className)}
    >
      <header className="mb-6 lg:mb-0">
        <div className="lg:sticky lg:top-36">
          <div className="flex items-end gap-4 lg:block">
            <span
              aria-hidden
              className="font-serif text-6xl lg:text-8xl leading-none text-transparent [-webkit-text-stroke:1px_var(--color-rose-300)]"
            >
              {num}
            </span>
            <div className="lg:mt-4">
              <p className="text-rose-400 uppercase tracking-[0.3em] text-[10px] mb-1">
                Chương {num} / {String(totalChapters).padStart(2, "0")}
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-stone-800">{title}</h2>
            </div>
          </div>
          <p className="mt-3 font-serif italic text-stone-500 text-sm leading-relaxed max-w-md lg:max-w-none">
            “{quote}”
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 bg-rose-200" />
            <span className="text-stone-400 text-xs tracking-widest uppercase">{photoCount} ảnh</span>
          </div>
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}
