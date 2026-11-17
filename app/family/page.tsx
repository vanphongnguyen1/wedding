import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { PaperTexture } from "@/Components/common/PaperTexture";
import { FamilyAlbum } from "@/Components/family/FamilyAlbum";
import { FamilyGate } from "@/Components/family/FamilyGate";
import { FAMILY_MEDIA } from "@/lib/family-media";

export const metadata: Metadata = {
  title: "Gia đình — Văn Phong & Hồng Nhung",
  description: "Album gia đình nhỏ của Văn Phong & Hồng Nhung: những khoảnh khắc lớn lên cùng con.",
};

const years = FAMILY_MEDIA.map((i) => i.date?.slice(0, 4)).filter(Boolean).sort();
const photoCount = FAMILY_MEDIA.filter((i) => i.kind !== "video").length;
const videoCount = FAMILY_MEDIA.length - photoCount;

export default function FamilyPage() {
  return (
    <main className="min-h-screen bg-amber-50/60">
      <FamilyGate>
      <header className="relative overflow-hidden px-6 pt-16 pb-10 text-center">
        <PaperTexture color="#92400e" />
        <p className="relative font-script text-4xl text-rose-400 sm:text-6xl">Gia đình nhỏ</p>
        {/* <h1 className="relative mt-2 font-serif text-4xl text-stone-800 sm:text-6xl">Bố, mẹ và con</h1> */}
        <div className="relative mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-rose-200" />
          <Heart className="h-4 w-4 fill-rose-300 text-rose-300 animate-heartbeat" />
          <span className="h-px w-12 bg-rose-200" />
        </div>
        <p className="relative mt-5 text-sm tracking-wide text-stone-500">
          {photoCount} ảnh · {videoCount} video
          {years.length > 0 && ` · ${years[0]} – ${years[years.length - 1]}`}
        </p>
      </header>

      <FamilyAlbum items={FAMILY_MEDIA} />
      </FamilyGate>
    </main>
  );
}
