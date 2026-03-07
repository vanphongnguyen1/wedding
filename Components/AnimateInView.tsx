"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Animation = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom-in";

interface AnimateInViewProps {
  children: React.ReactNode;
  className?: string;
  animation?: Animation;
  delay?: number;
  duration?: number;
}

const hiddenClass: Record<Animation, string> = {
  "fade-up":    "opacity-0 translate-y-10",
  "fade-in":    "opacity-0",
  "slide-left": "opacity-0 -translate-x-12",
  "slide-right":"opacity-0 translate-x-12",
  "zoom-in":    "opacity-0 scale-95",
};

export function AnimateInView({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 700,
}: AnimateInViewProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        inView ? "opacity-100 translate-y-0 translate-x-0 scale-100" : hiddenClass[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
