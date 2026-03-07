"use client";

import { useState } from "react";
import { Heart, CheckCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  guests: string;
  attendance: "yes" | "no" | "";
  message: string;
}

export function WeddingRSVP() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    guests: "1",
    attendance: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 animate-scale-in">
        <CheckCircle className="w-16 h-16 text-rose-400 mx-auto mb-5 animate-float" />
        <h3 className="font-serif text-3xl text-stone-800 mb-3">Cảm ơn bạn!</h3>
        <p className="text-stone-500 text-lg leading-relaxed">
          Chúng mình rất mong được đón tiếp bạn<br />trong ngày trọng đại này.
        </p>
        <Heart className="w-5 h-5 text-rose-300 mx-auto mt-8 animate-heartbeat" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">

      {/* Name + Email */}
      <div
        className="grid grid-cols-2 gap-4 opacity-0 translate-y-4 animate-[formFadeUp_0.5s_ease_0.1s_forwards]"
        style={{ animation: "formFadeUp 0.5s ease 0.1s forwards" }}
      >
        <div className="col-span-2 sm:col-span-1 space-y-2">
          <Label htmlFor="name" className="text-stone-600 text-sm tracking-wide">
            Họ và tên *
          </Label>
          <Input
            id="name"
            required
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-stone-200 focus-visible:ring-rose-300 transition-shadow duration-200"
          />
        </div>
        <div className="col-span-2 sm:col-span-1 space-y-2">
          <Label htmlFor="email" className="text-stone-600 text-sm tracking-wide">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-stone-200 focus-visible:ring-rose-300 transition-shadow duration-200"
          />
        </div>
      </div>

      {/* Attendance buttons */}
      <div
        className="space-y-3"
        style={{ animation: "formFadeUp 0.5s ease 0.2s forwards", opacity: 0, transform: "translateY(16px)" }}
      >
        <Label className="text-stone-600 text-sm tracking-wide">Bạn có tham dự không? *</Label>
        <div className="flex gap-4">
          {(["yes", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm({ ...form, attendance: val })}
              className={cn(
                "flex-1 py-3 rounded-full border text-sm font-medium transition-all duration-300",
                form.attendance === val
                  ? "bg-rose-500 border-rose-500 text-white scale-[1.03] shadow-md shadow-rose-200"
                  : "border-stone-200 text-stone-600 hover:border-rose-300 hover:scale-[1.02]"
              )}
            >
              {val === "yes" ? "Vui lòng tham dự" : "Tiếc là không thể"}
            </button>
          ))}
        </div>
      </div>

      {/* Guests — smooth expand/collapse */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          form.attendance === "yes" ? "max-h-24 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        )}
      >
        <div className="space-y-2 pt-1">
          <Label htmlFor="guests" className="text-stone-600 text-sm tracking-wide">
            Số khách tham dự
          </Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="10"
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="border-stone-200 focus-visible:ring-rose-300 w-32"
          />
        </div>
      </div>

      {/* Message */}
      <div
        className="space-y-2"
        style={{ animation: "formFadeUp 0.5s ease 0.3s forwards", opacity: 0, transform: "translateY(16px)" }}
      >
        <Label htmlFor="message" className="text-stone-600 text-sm tracking-wide">
          Lời chúc (tùy chọn)
        </Label>
        <Textarea
          id="message"
          placeholder="Gửi lời chúc đến cô dâu chú rể..."
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="border-stone-200 focus-visible:ring-rose-300 resize-none transition-shadow duration-200"
        />
      </div>

      {/* Submit */}
      <div style={{ animation: "formFadeUp 0.5s ease 0.4s forwards", opacity: 0, transform: "translateY(16px)" }}>
        <Button
          type="submit"
          disabled={!form.attendance}
          className="w-full btn-shimmer text-white rounded-full py-6 text-sm tracking-widest uppercase font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-200/50"
        >
          Gửi xác nhận
        </Button>
      </div>

    </form>
  );
}
