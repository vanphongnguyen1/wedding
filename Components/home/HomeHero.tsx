import { ChevronDown, Heart } from "lucide-react";
import { PaperTexture } from "@/Components/common/PaperTexture";
import { PolaroidScatter } from "@/Components/home/PolaroidScatter";
import { TogetherCounter } from "@/Components/home/TogetherCounter";
import { cn } from "@/lib/utils";

const WEDDING_DATE = "2023-05-07";

/** Staggered CSS entrance — runs straight from the server HTML, no JS needed */
const rise = (delay: number) => ({
  className: "animate-card-rise",
  style: { animationDelay: `${delay}ms` },
});

/** Home hero: polaroids drop onto a paper table around the invitation card. */
export function HomeHero() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-rose-50/60 px-4 py-24">
      <PaperTexture />

      <PolaroidScatter />

      {/* Invitation card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-xl rounded-sm bg-white/95 px-6 py-10 text-center text-stone-800 shadow-[0_30px_60px_-20px_rgba(159,18,57,0.35)] sm:px-12 sm:py-14",
          rise(500).className,
        )}
        style={rise(500).style}
      >
        {/* inner frame */}
        <div aria-hidden className="pointer-events-none absolute inset-2.5 border border-rose-200/70" />

        <p
          className={cn("text-[11px] uppercase tracking-[0.4em] text-rose-400", rise(700).className)}
          style={rise(700).style}
        >
          Trân trọng kính mời
        </p>

        <h1 className="mt-6 font-serif font-light leading-none">
          <span className={cn("block text-5xl sm:text-7xl", rise(850).className)} style={rise(850).style}>
            Văn Phong
          </span>
          <span
            className={cn("my-3 flex items-center justify-center gap-4", rise(1000).className)}
            style={rise(1000).style}
          >
            <span className="h-px w-12 bg-rose-300/70" />
            <Heart className="h-6 w-6 fill-rose-400 text-rose-400 animate-heartbeat" />
            <span className="h-px w-12 bg-rose-300/70" />
          </span>
          <span className={cn("block text-5xl sm:text-7xl", rise(1150).className)} style={rise(1150).style}>
            Hồng Nhung
          </span>
        </h1>

        <div className={rise(1300).className} style={rise(1300).style}>
          <p className="mt-8 text-lg tracking-[0.3em] font-light sm:text-xl">07 · 05 · 2023</p>
          <TogetherCounter since={WEDDING_DATE} className="mt-3" />
        </div>
      </div>

      <a
        href="#story"
        aria-label="Cuộn xuống"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-stone-400 transition-colors hover:text-stone-700 animate-[card-rise_0.8s_ease_1.7s_both]"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </a>
    </section>
  );
}
