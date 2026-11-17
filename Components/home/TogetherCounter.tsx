"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;

interface TogetherCounterProps {
  /** ISO date, e.g. "2023-05-07" */
  since: string;
  className?: string;
}

/** "Đã bên nhau 1.290 ngày" — computed on the client so SSR never disagrees about "today". */
export function TogetherCounter({ since, className }: TogetherCounterProps) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const start = new Date(`${since}T00:00:00`).getTime();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(Math.max(0, Math.floor((Date.now() - start) / DAY_MS)));
  }, [since]);

  return (
    <p className={cn("text-stone-500 text-sm tracking-wide", className)}>
      Đã bên nhau{" "}
      <span className="font-serif text-2xl text-rose-500 tabular-nums">
        {days === null ? "…" : days.toLocaleString("vi-VN")}
      </span>{" "}
      ngày
    </p>
  );
}
