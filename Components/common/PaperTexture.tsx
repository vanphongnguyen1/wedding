import { cn } from "@/lib/utils";

interface PaperTextureProps {
  /** Dot colour of the paper pattern */
  color?: string;
  className?: string;
}

/** Faint polka-dot "scrapbook paper" overlay. Place inside a `relative` parent. */
export function PaperTexture({ color = "#9f1239", className }: PaperTextureProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 opacity-[0.06]", className)}
      style={{ backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
    />
  );
}
