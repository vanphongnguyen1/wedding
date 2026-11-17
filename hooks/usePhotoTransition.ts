"use client";

import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

/** view-transition-name shared by the clicked thumbnail and the lightbox photo */
export const PHOTO_TRANSITION_NAME = "gallery-photo";

/** Thumbnail for `index` that is currently on screen (photos can appear twice, e.g. polaroid + grid). */
function findVisibleThumb(index: number): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>(`[data-photo-index="${index}"]`);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width && r.bottom > 0 && r.top < window.innerHeight) return el;
  }
  return null;
}

function canAnimate(): boolean {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Lightbox index state whose open/close morphs the photo from/to its thumbnail
 * (View Transitions API). Browsers without support just switch instantly.
 */
export function usePhotoTransition() {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => {
    const thumb = canAnimate() ? findVisibleThumb(i) : null;
    if (!thumb) { setIndex(i); return; }
    thumb.style.viewTransitionName = PHOTO_TRANSITION_NAME;
    document.startViewTransition(() => {
      thumb.style.viewTransitionName = "";
      flushSync(() => setIndex(i));
    });
  }, []);

  const close = useCallback(() => {
    const thumb = index !== null && canAnimate() ? findVisibleThumb(index) : null;
    if (!thumb) { setIndex(null); return; }
    const t = document.startViewTransition(() => {
      flushSync(() => setIndex(null));
      thumb.style.viewTransitionName = PHOTO_TRANSITION_NAME;
    });
    t.finished.finally(() => { thumb.style.viewTransitionName = ""; });
  }, [index]);

  return { index, setIndex, open, close };
}
