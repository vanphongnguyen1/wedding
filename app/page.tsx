import { ImageLoading } from "@/Components/common/ImageLoading";
import { PaperTexture } from "@/Components/common/PaperTexture";
import { Heart, MapPin, Calendar, Clock } from "lucide-react";
import { WeddingRSVP } from "@/Components/WeddingRSVP";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingMusicPlayer } from "@/Components/WeddingMusicPlayer";
import { WeddingGallery } from "@/Components/WeddingGallery";
import { HomeHero } from "@/Components/home/HomeHero";
import { WeddingSlider } from "@/Components/WeddingSlider";
import { WeddingNotifications } from "@/Components/WeddingNotifications";
import { cn } from "@/lib/utils";

const events = [
  {
    icon: Heart,
    label: "Lễ Vu Quy",
    date: "Thứ Bảy, 06 tháng 05 năm 2023",
    time: "08:00 — 20:00",
    location: "Nhà Gái",
    address: "chợ Đế, Đại Thắng, Vụ Bản, Nam Định",
  },
  {
    icon: Calendar,
    label: "Tiệc Cưới",
    date: "Thứ Bảy, 07 tháng 05 năm 2023",
    time: "08:00 — 20:00",
    location: "Nhà Trai",
    address: "Số 197 đường Vạn Chánh, Phú Thứ, Kinh Môn, Hải Dương",
  },
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <AnimateInView className="text-center mb-14" animation="fade-up">
      <p className="font-script text-3xl text-rose-400 mb-1">{eyebrow}</p>
      <h2 className="font-serif text-4xl sm:text-5xl text-stone-800">{title}</h2>
      <div className="mt-5 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-rose-200" />
        <Heart className="h-3.5 w-3.5 fill-rose-300 text-rose-300" />
        <span className="h-px w-12 bg-rose-200" />
      </div>
    </AnimateInView>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-stone-50">
      {/* ── MUSIC PLAYER ── */}
      <WeddingMusicPlayer src="/music/ngay-dau-tien-lofi-ver-duc-phuc.mp3" />

      {/* ── NOTIFICATIONS ── */}
      <WeddingNotifications />

      {/* ── HERO: invitation envelope + polaroid table ── */}
      <HomeHero />

      {/* ── QUOTE ── */}
      <section className="relative py-24 bg-white text-center">
        <AnimateInView className="relative max-w-2xl mx-auto px-6" animation="fade-in" duration={900}>
          <span aria-hidden className="absolute -top-10 left-2 font-serif text-[120px] leading-none text-rose-100 sm:-left-6">
            &ldquo;
          </span>
          <p className="relative font-script text-3xl sm:text-4xl text-stone-600 leading-snug">
            Yêu là khi bạn trở thành người quan trọng nhất trong mắt ai đó,
            và họ trở thành người quan trọng nhất trong mắt bạn.
          </p>
          <Heart className="mx-auto mt-8 h-5 w-5 text-rose-400 animate-heartbeat" />
        </AnimateInView>
      </section>

      {/* ── OUR STORY ── */}
      <section id="story" className="relative py-28 bg-amber-50/60">
        <PaperTexture color="#92400e" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Two overlapping polaroids */}
            <AnimateInView animation="slide-left" duration={800}>
              <div className="relative mx-auto max-w-sm pb-16 sm:pb-20">
                <figure className="relative -rotate-3 bg-white p-3 pb-8 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)]">
                  <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-7 w-20 -translate-x-1/2 rotate-[-3deg] bg-rose-200/80 shadow-sm" />
                  <div className="relative aspect-2/3 overflow-hidden bg-stone-200">
                    <ImageLoading
                      src="/images/PTH_1802.JPG"
                      alt="Câu chuyện của chúng mình"
                      fill
                      sizes="(max-width: 768px) 90vw, 384px"
                      className="object-cover"
                    />
                  </div>
                </figure>
                <figure className="absolute -bottom-2 -right-4 w-36 rotate-6 bg-white p-2 pb-5 shadow-[0_16px_35px_-12px_rgba(0,0,0,0.4)] sm:-right-12 sm:w-44 animate-float">
                  <span aria-hidden className="absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[4deg] bg-sky-100/90 shadow-sm" />
                  <div className="relative aspect-2/3 overflow-hidden bg-stone-200">
                    <ImageLoading src="/images/PTH_2166.JPG" alt="Kỷ niệm" fill sizes="176px" className="object-cover" />
                  </div>
                </figure>
              </div>
            </AnimateInView>

            <AnimateInView animation="slide-right" duration={800} delay={150}>
              <div>
                <p className="font-script text-3xl text-rose-400 mb-2">Câu chuyện của chúng mình</p>
                <h2 className="font-serif text-4xl sm:text-5xl text-stone-800 mb-8 leading-tight">
                  Từ bạn bè<br />đến mãi mãi
                </h2>
                <div className="space-y-5 text-stone-600 leading-relaxed">
                  <p>
                    Lần đầu gặp nhau vào một ngày đầu hè Hà Nội, trong một buổi gặp mặt
                    của nhóm bạn chung. Lúc đó không ai nghĩ rằng cuộc gặp gỡ ấy
                    lại thay đổi cuộc đời của cả hai mãi mãi.
                  </p>
                  <p>
                    Qua những tháng ngày cùng nhau trải qua vui buồn, chia sẻ những bữa ăn,
                    những chuyến đi và cả những giây phút lặng yên — chúng mình nhận ra
                    rằng mình thuộc về nhau.
                  </p>
                  <p>
                    Và hôm nay, chúng mình muốn chia sẻ hạnh phúc này cùng với tất cả những
                    người thân yêu nhất.
                  </p>
                </div>
                <p className="mt-8 font-script text-3xl text-stone-500">— Phong & Nhung</p>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* ── GALLERY (polaroid wall) ── */}
      <div className="bg-white">
        <WeddingGallery />
      </div>

      {/* ── FULL WIDTH PHOTO BANNER ── */}
      <div className="relative h-[60vh] overflow-hidden">
        <ImageLoading
          src="/images/PTH_2030.JPG"
          alt="Wedding banner"
          fill
          sizes="100vw"
          className="object-cover object-[0_60%]"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <AnimateInView animation="zoom-in" duration={1000} className="text-center">
            <p className="font-script text-4xl sm:text-5xl text-white/90 mb-2">Ngày chung đôi</p>
            <p className="font-serif text-4xl sm:text-6xl text-white font-light tracking-widest">
              07 · 05 · 2023
            </p>
          </AnimateInView>
        </div>
      </div>

      {/* ── EVENT DETAILS: invitation tickets ── */}
      <section id="details" className="relative py-28 bg-rose-50/70">
        <PaperTexture />
        <div className="relative max-w-5xl mx-auto px-6">
          <SectionHeading eyebrow="Thông tin" title="Lịch trình" />

          <div className="grid md:grid-cols-2 gap-10">
            {events.map(({ icon: Icon, label, date, time, location, address }, i) => (
              <AnimateInView key={label} animation="fade-up" delay={i * 150} duration={700}>
                {/* Ticket card — the two tickets lean slightly in opposite directions */}
                <article
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_45px_-20px_rgba(159,18,57,0.35)]",
                    "transition-transform duration-300 hover:-translate-y-1 hover:rotate-0",
                    i % 2 === 0 ? "md:-rotate-1" : "md:rotate-1",
                  )}
                >
                  {/* ticket notches, centred on the dashed tear line */}
                  <span aria-hidden className="absolute left-0 top-[122px] h-7 w-7 -translate-x-1/2 rounded-full bg-rose-50" />
                  <span aria-hidden className="absolute right-0 top-[122px] h-7 w-7 translate-x-1/2 rounded-full bg-rose-50" />

                  <header className="px-8 pt-8 pb-7 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200">
                      <Icon className="h-5 w-5 text-rose-400" />
                    </div>
                    <p className="text-rose-400 uppercase tracking-[0.3em] text-xs">{label}</p>
                  </header>

                  <div className="mx-8 border-t-2 border-dashed border-rose-100" />

                  <div className="px-8 pt-7 pb-8 text-center">
                    <h3 className="font-serif text-3xl text-stone-800 mb-5">{location}</h3>
                    <div className="space-y-3 text-stone-500 text-sm">
                      <p className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-300" />
                        {date}
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-rose-300" />
                        {time}
                      </p>
                      <p className="flex items-start justify-center gap-2 pt-1">
                        <MapPin className="w-4 h-4 text-rose-300 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{address}</span>
                      </p>
                    </div>
                  </div>
                </article>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO SLIDER ── */}
      <WeddingSlider />

      {/* ── RSVP: a letter ── */}
      <section id="rsvp" className="relative py-28 bg-amber-50/60">
        <PaperTexture color="#92400e" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <SectionHeading eyebrow="Xác nhận tham dự" title="Gửi lời chúc" />
          <AnimateInView animation="fade-up" delay={150}>
            <div className="relative rotate-[0.5deg] bg-white px-6 py-10 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.3)] sm:px-12 sm:py-12">
              <span aria-hidden className="absolute -top-3 left-10 h-7 w-24 rotate-[-6deg] bg-rose-200/80 shadow-sm" />
              <span aria-hidden className="absolute -top-3 right-10 h-7 w-24 rotate-[5deg] bg-amber-100/90 shadow-sm" />
              <div className="-rotate-[0.5deg]">
                <p className="mb-8 text-center text-stone-500">
                  Vui lòng xác nhận trước ngày <strong className="text-stone-700">05 tháng 05 năm 2023</strong>
                </p>
                <WeddingRSVP />
              </div>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-28 overflow-hidden">
        <ImageLoading
          src="/images/PTH_2107.JPG"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <AnimateInView animation="fade-up" className="relative z-10 text-center text-white px-6">
          <p className="font-script text-3xl text-rose-200 mb-4">Cảm ơn bạn</p>
          <h2 className="font-serif text-5xl sm:text-7xl font-light leading-tight">
            <span className="block">Văn Phong</span>
            <Heart className="w-7 h-7 fill-rose-300 text-rose-300 mx-auto my-4 animate-heartbeat" />
            <span className="block">Hồng Nhung</span>
          </h2>
          <p className="text-white/60 tracking-[0.3em] text-sm mt-6 mb-10">07 · 05 · 2023</p>
          <div className="h-px w-20 bg-rose-300/50 mx-auto mb-10" />
          <p className="text-white/60 text-sm">
            Chúng mình rất vui vì có bạn là một phần trong ngày đặc biệt này.
          </p>
          <p className="text-white/30 text-xs mt-8">© 2023 Văn Phong & Hồng Nhung Wedding</p>
        </AnimateInView>
      </footer>
    </div>
  );
}
