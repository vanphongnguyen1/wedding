"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const messages = [
  { from: "Anh Minh & Chị Lan", text: "Chúc mừng đám cưới! Chúc hai bạn trăm năm hạnh phúc 🌹" },
  { from: "Gia đình Nguyễn", text: "Chúc cô dâu chú rể mãi mãi yêu thương nhau!" },
  { from: "Nhóm bạn đại học", text: "Cuối cùng cũng đến ngày này! Hạnh phúc mãi nhé cả hai 🎉" },
  { from: "Chị Hoa", text: "Chúc hai bạn có một đám cưới thật đẹp và một cuộc sống viên mãn!" },
  { from: "Anh Tuấn", text: "Xúc động quá! Chúc mừng Phong và Nhung! 🥂" },
  { from: "Bạn bè Sài Gòn", text: "Chúc hai bạn sớm có tin vui và sống hạnh phúc bên nhau mãi!" },
  { from: "Cô Bảy", text: "Cô chúc hai con trăm năm hạnh phúc, con cái đầy đàn nhé!" },
  { from: "Team công ty", text: "Chúc mừng! Mong ngày vui của hai bạn thật ý nghĩa 💐" },
  { from: "Chú Hùng", text: "Chúc mừng! Sống hạnh phúc, khỏe mạnh và thịnh vượng!" },
  { from: "Bạn thân Nhung", text: "Mình rất vui cho bạn! Hạnh phúc mãi nha Nhung ơi 🌸" },
  { from: "Anh Khoa", text: "Chúc cặp đôi hoàn hảo mãi mãi bên nhau!" },
  { from: "Dì Thu", text: "Chúc hai con một đám cưới thật đẹp! Yêu thương mãi nhé 💕" },
];

function getRandomInterval() {
  return Math.floor(Math.random() * 5000) + 10000; // 5s – 10s
}

function getRandomMessage(exclude: number) {
  let idx: number;
  do { idx = Math.floor(Math.random() * messages.length); }
  while (idx === exclude);
  return { idx, msg: messages[idx] };
}

export function WeddingNotifications() {
  useEffect(() => {
    let lastIdx = -1;
    let timeoutId: ReturnType<typeof setTimeout>;

    const showNext = () => {
      const { idx, msg } = getRandomMessage(lastIdx);
      lastIdx = idx;

      toast.custom(() => (
        <div className="flex items-start gap-3 bg-white border border-rose-100 rounded-2xl px-4 py-3 shadow-lg w-[320px] animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="mt-0.5 w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-rose-500 truncate">{msg.from}</p>
            <p className="text-sm text-stone-600 leading-snug mt-0.5">{msg.text}</p>
          </div>
        </div>
      ), { duration: 5000 });

      timeoutId = setTimeout(showNext, getRandomInterval());
    };

    // First message after 10s
    timeoutId = setTimeout(showNext, 10000);
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
