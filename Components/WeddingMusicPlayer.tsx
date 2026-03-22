"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeddingMusicPlayerProps {
  src?: string;
}

export function WeddingMusicPlayer({ src = "/audio/wedding-music.mp3" }: WeddingMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);
  // hint shows when we auto-played muted, waiting for user to unmute
  const [showHint, setShowHint] = useState(false);

  // Fade-in player UI after 1s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Play có tiếng ngay sau lần tương tác đầu tiên của user
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onInteract = () => {
      audio.muted = false;
      audio.play()
        .then(() => {
          setPlaying(true);
          setMuted(false);
          setShowHint(false);
        })
        .catch(() => setPlaying(false));
    };

    const events = ["click", "scroll", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, onInteract, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onInteract));
  }, []);

  // When muted + playing: unmute on first user interaction anywhere on the page
  useEffect(() => {
    if (!playing || !muted) return;
    const audio = audioRef.current;
    if (!audio) return;

    const tryUnmute = () => {
      audio.muted = false;
      setMuted(false);
      setShowHint(false);
    };

    window.addEventListener("click", tryUnmute, { once: true });
    return () => window.removeEventListener("click", tryUnmute);
  }, [playing, muted]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.muted = false;
      setMuted(false);
      setShowHint(false);
      audio.play().catch(() => { });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
    setShowHint(false);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {/* Hint bubble: click anywhere to unmute */}
        {showHint && (
          <div className="bg-white/95 backdrop-blur-md border border-rose-100 rounded-2xl px-4 py-2.5 shadow-lg text-xs text-stone-500 flex items-center gap-2 animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <Volume2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Nhấn bất kỳ để bật âm thanh</span>
          </div>
        )}

        <div className="flex items-center gap-2 opacity-60 md:opacity-100">
          {/* Song label — visible when playing & unmuted */}
          <div
            className={cn(
              "flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full p-2 shadow-lg transition-all duration-500 overflow-hidden w-10 h-10 px-0"
            )}
          >
            <Music className="w-3 h-3 text-rose-400 shrink-0 animate-[spin_4s_linear_infinite]" />
          </div>

          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            {muted
              ? <VolumeX className="w-4 h-4 text-stone-400" />
              : <Volume2 className="w-4 h-4 text-rose-400" />
            }
          </button>

          {/* Play/Pause */}
          <button
            onClick={toggle}
            aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
            className="relative w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            {playing
              ? <Pause className="w-5 h-5 fill-white" />
              : <Play className="w-5 h-5 fill-white translate-x-0.5" />
            }
            {/* Ripple */}
            {playing && !muted && (
              <span className="absolute inset-0 rounded-full border-2 border-rose-400/50 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
