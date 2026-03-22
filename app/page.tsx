import { ImageLoading } from "@/Components/common/ImageLoading";
import { Heart, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";
import { WeddingRSVP } from "@/Components/WeddingRSVP";
import { AnimateInView } from "@/Components/AnimateInView";
import { WeddingMusicPlayer } from "@/Components/WeddingMusicPlayer";
import { WeddingGallery } from "@/Components/WeddingGallery";
import { WeddingSlider } from "@/Components/WeddingSlider";
import { WeddingNotifications } from "@/Components/WeddingNotifications";

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

export default function Home() {
  return (
    <div className="bg-stone-50 overflow-x-hidden">
      {/* ── MUSIC PLAYER ── */}
      <WeddingMusicPlayer src="/music/ngay-dau-tien-lofi-ver-duc-phuc.mp3" />

      {/* ── NOTIFICATIONS ── */}
      <WeddingNotifications />
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        <ImageLoading
          src="/images/PTH_1768.JPG"
          alt="Ảnh cưới"
              fill
          className="hidden lg:block object-cover object-bottom scale-105 animate-[heroZoom_8s_ease_forwards]"
          priority
        />
        <ImageLoading
          src="/images/PTH_2045.JPG"
          alt="Ảnh cưới"
             fill
          className="block lg:hidden object-cover object-bottom scale-105 animate-[heroZoom_8s_ease_forwards]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

        <div className="absolute z-10 text-center w-full top-o text-white px-6">

          <div className="lg:flex justify-center">
            <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl font-light leading-none mb-4 opacity-0 animate-hero-name-1">
              Văn Phong
            </h1>
            <div className="flex items-center justify-center gap-6 my-2 opacity-0 animate-hero-divider">
              <div className="h-px w-16 bg-rose-300/70" />
              <Heart className="w-8 h-8 text-rose-300 animate-heartbeat" />
              <div className="h-px w-16 bg-rose-300/70" />
            </div>
            <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl font-light leading-none mb-8 opacity-0 animate-hero-name-2">
              Hồng Nhung
            </h1>
          </div>

          <p className="text-xs uppercase tracking-[0.4em] mb-6 font-light opacity-0 animate-hero-tag">
            Trân trọng kính mời
          </p>
          <p className="text-lg sm:text-xl tracking-[0.25em] font-light opacity-0 animate-hero-date">
            07 · 05 · 2023
          </p>
        </div>

        <a
          href="#story"
          aria-label="Cuộn xuống"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white/90 transition-colors animate-bounce opacity-0 animate-hero-scroll"
        >
          <ChevronDown className="w-8 h-8" />
        </a>
      </section>

      {/* ── QUOTE ── */}
      <section className="py-20 bg-white text-center">
        <AnimateInView className="max-w-2xl mx-auto px-6" animation="fade-in" duration={900}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-[80px] bg-rose-200" />
            <Heart className="w-5 h-5 text-rose-400 animate-heartbeat" />
            <div className="h-px flex-1 max-w-[80px] bg-rose-200" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-stone-600 italic leading-relaxed">
            &ldquo;Yêu là khi bạn trở thành người quan trọng nhất trong mắt ai đó,
            và họ trở thành người quan trọng nhất trong mắt bạn.&rdquo;
          </p>
        </AnimateInView>
      </section>

      {/* ── OUR STORY ── */}
      <section id="story" className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimateInView animation="slide-left" duration={800}>
              <div className="relative">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <ImageLoading
                    src="/images/PTH_1802.JPG"
                    alt="Câu chuyện của chúng mình"
                      
                                     fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden shadow-xl border-4 border-white animate-float">
                  <ImageLoading
                    src="/images/PTH_2166.JPG"
                    alt="Kỷ niệm"
                    
                                     fill
                    className="object-cover"
                  />
                </div>
              </div>
            </AnimateInView>

            <AnimateInView animation="slide-right" duration={800} delay={150}>
              <div className="md:pl-6">
                <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-4">Câu chuyện của chúng mình</p>
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
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <WeddingGallery />

      {/* ── FULL WIDTH PHOTO BANNER ── */}
      <div className="relative h-[60vh] overflow-hidden">
        <ImageLoading
          src="/images/PTH_2030.JPG"
          alt="Wedding banner"
          fill
          className="object-cover object-[0_60%]"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <AnimateInView animation="zoom-in" duration={1000}>
            <p className="font-serif text-4xl sm:text-6xl text-white font-light tracking-widest">
              07 · 05 · 2023
            </p>
          </AnimateInView>
        </div>
      </div>

      {/* ── EVENT DETAILS ── */}
      <section id="details" className="py-24 bg-rose-50">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateInView className="text-center mb-14" animation="fade-up">
            <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-3">Thông tin</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-stone-800">Lịch trình</h2>
          </AnimateInView>

          <div className="grid md:grid-cols-2 gap-8">
            {events.map(({ icon: Icon, label, date, time, location, address }, i) => (
              <AnimateInView key={label} animation="fade-up" delay={i * 150} duration={700}>
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-rose-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-6 h-6 text-rose-400" />
                  </div>
                  <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-3">{label}</p>
                  <h3 className="font-serif text-2xl text-stone-800 mb-6">{location}</h3>
                  <div className="space-y-3 text-stone-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-300" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-rose-300" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-start justify-center gap-2 pt-2">
                      <MapPin className="w-4 h-4 text-rose-300 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{address}</span>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO SLIDER ── */}
      <WeddingSlider />

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateInView className="text-center mb-12" animation="fade-up">
            <p className="text-rose-400 uppercase tracking-[0.3em] text-xs mb-3">Xác nhận tham dự</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-stone-800 mb-4">RSVP</h2>
            <p className="text-stone-500">
              Vui lòng xác nhận trước ngày <strong>05 tháng 05 năm 2023</strong>
            </p>
          </AnimateInView>
          <AnimateInView animation="fade-up" delay={200}>
            <WeddingRSVP />
          </AnimateInView>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-24 overflow-hidden">
        <ImageLoading
          src="/images/PTH_2107.JPG"
          alt="Footer background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <AnimateInView
          animation="fade-up"
          className="relative z-10 text-center text-white px-6"
        >
          <h2 className="font-serif text-5xl sm:text-7xl font-light mb-4">
            <span>Văn Phong</span>         <Heart className="w-7 h-7 text-rose-300 mx-auto my-4 animate-heartbeat" />
            <span>Hồng Nhung</span>
          </h2>
          <p className="text-white/60 tracking-[0.3em] text-sm mb-10">07 · 05 · 2023</p>
          <div className="h-px w-20 bg-rose-300/50 mx-auto mb-10" />
          <p className="text-white/50 text-sm">
            Chúng mình rất vui vì có bạn là một phần trong ngày đặc biệt này.
          </p>
          <p className="text-white/30 text-xs mt-8">© 2023 Văn Phong & Hồng Nhung Wedding</p>
        </AnimateInView>
      </footer>
    </div>
  );
}
