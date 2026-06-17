"use client";

import { useEffect, useRef } from "react";
import { ImageLoading } from "@/Components/common/ImageLoading";

// All portrait 1600×2400 — same dimensions
const HERO_IMAGES = [
  "/images/PTH_1768.JPG", "/images/PTH_1795.JPG", "/images/PTH_1809.JPG",
  "/images/PTH_1913.JPG", "/images/PTH_1793.JPG", "/images/PTH_1904.JPG",
  "/images/PTH_1926.JPG", "/images/PTH_1934.JPG", "/images/PTH_2049.JPG",
  "/images/PTH_2065.JPG", "/images/iwindding/_MG_0704.JPG", "/images/PTH_2044.JPG",
  "/images/iwindding/_MG_0443.jpg", "/images/PTH_2145.JPG", "/images/PTH_2057.JPG",
  "/images/iwindding/_MG_0479.jpg", "/images/PTH_1744.JPG", "/images/PTH_2104.JPG",
  "/images/iwindding/_MG_0474.jpg", "/images/PTH_1852.JPG", "/images/PTH_2107.JPG",
  "/images/iwindding/_MG_0498.jpg", "/images/PTH_1982.JPG", "/images/PTH_2110.JPG",
  "/images/iwindding/_MG_0499.jpg", "/images/PTH_2027.JPG", "/images/PTH_2120.JPG",
  "/images/iwindding/_MG_0738.jpg", "/images/PTH_2029.JPG", "/images/iwindding/_MG_0356.JPG",
];

type Layout = "GRID" | "TABLE" | "SPHERE";
const LAYOUTS: Layout[] = ["TABLE", "GRID", "SPHERE"];

const N          = HERO_IMAGES.length;  // 40
const SWITCH_MS  = 10000;
const LERP       = 0.040;
const CAM_Z      = 2500;   // default camera distance
const CAM_Z_MIN  = 800;    // zoom-in limit  (small Z = closer)
const CAM_Z_MAX  = 2500;   // zoom-out limit (large Z = farther)
const FOV        = 40;
const PHOTO_W_BASE = 480; // desktop base — scaled down for tablet/mobile

interface Obj3D {
  position: { x: number; y: number; z: number; set(x: number, y: number, z: number): void };
  rotation: { x: number; y: number };
}

type Pos = { x: number; y: number; z: number; ry: number; rx: number };

function buildTargets(scale: number, isMobile: boolean): Record<Layout, Pos[]> {
  const COLS = isMobile ? 3 : 5;
  const ROWS = 4;
  const CX = 560 * scale, CY = 440 * scale;
  // Mobile: show first 20 images, park the rest behind the scene
  const GRID_N = isMobile ? 20 : N;

  const grid = Array.from<unknown, Pos>({ length: N }, (_, i) => {
    if (i >= GRID_N) return { x: 0, y: 0, z: -9999, ry: 0, rx: 0 };
    const layer = Math.floor(i / (COLS * ROWS));
    const idx   = i % (COLS * ROWS);
    return {
      x: (idx % COLS - (COLS - 1) / 2) * CX,
      y: -(Math.floor(idx / COLS) - (ROWS - 1) / 2) * CY,
      z: -layer * 900 * scale,
      ry: 0, rx: 0,
    };
  });

  const TABLE_COLS = isMobile ? 4 : 8;
  const table = Array.from<unknown, Pos>({ length: N }, (_, i) => ({
    x: (i % TABLE_COLS - (TABLE_COLS - 1) / 2) * CX,
    y: -(Math.floor(i / TABLE_COLS) - 2) * CY,
    z: 0, ry: 0, rx: 0,
  }));

  const SPHERE_N = 20;
  const R = 950 * scale;
  const sphere = Array.from<unknown, Pos>({ length: N }, (_, i) => {
    if (i >= SPHERE_N) return { x: 0, y: 0, z: -3500 * scale, ry: 0, rx: 0 };
    const phi   = Math.acos(-1 + (2 * i) / SPHERE_N);
    const theta = Math.sqrt(SPHERE_N * Math.PI) * phi;
    const x = R * Math.sin(phi) * Math.cos(theta);
    const y = R * Math.cos(phi);
    const z = R * Math.sin(phi) * Math.sin(theta);
    return { x, y, z, ry: Math.atan2(x, z), rx: -Math.atan2(y, Math.sqrt(x * x + z * z)) };
  });

  return { TABLE: table, GRID: grid, SPHERE: sphere };
}

function lerpAngle(cur: number, tgt: number, t: number): number {
  let d = ((tgt - cur + Math.PI) % (2 * Math.PI)) - Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  return cur + d * t;
}

export function GalleryHero3D() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Kick off image fetches immediately — warms browser cache before Three.js loads
    HERO_IMAGES.forEach(src => { const img = new window.Image(); img.src = src; });

    let cancelled = false;
    let rafId     = 0;
    let cleanupFn: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const { CSS3DRenderer, CSS3DObject } = await import("three/addons/renderers/CSS3DRenderer.js");
      if (cancelled) return;

      const W = el.clientWidth  || el.offsetWidth;
      const H = el.clientHeight || el.offsetHeight;
      if (!W || !H) return;

      // Responsive photo size: mobile < 640, tablet < 1024, desktop >= 1024
      const isMobile = W < 640;
      const photoW = isMobile ? 220 : W < 1024 ? 320 : PHOTO_W_BASE;
      const photoH = Math.round(photoW * 0.75); // maintain 4:3
      const scale  = photoW / PHOTO_W_BASE;

      // Camera distances scale with photo size on mobile to reduce whitespace
      const camZ    = isMobile ? 1500 : CAM_Z;
      const camZMin = isMobile ? 1000 : CAM_Z_MIN;
      const camZMax = isMobile ? 1500 : CAM_Z_MAX;

      const renderer = new CSS3DRenderer();
      renderer.setSize(W, H);
      Object.assign(renderer.domElement.style, {
        position: "absolute", top: "0", left: "0",
        width: "100%", height: "100%",
        pointerEvents: "none",
        opacity: "0",
        transition: "opacity 0.8s ease",
      });
      el.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, W / H, 1, 10000);
      camera.position.z = camZ;

      const TARGETS = buildTargets(scale, isMobile);
      const objects: Obj3D[] = [];

      HERO_IMAGES.forEach((src, i) => {
        const div = document.createElement("div");
        div.style.width              = `${photoW}px`;
        div.style.height             = `${photoH}px`;
        div.style.backgroundImage    = `url(${src})`;
        div.style.backgroundSize     = "cover";
        div.style.backgroundPosition = "center";
        div.style.border             = "8px solid rgba(255,255,255,0.92)";
        div.style.borderRadius       = "4px";
        div.style.boxShadow          = "0 12px 40px rgba(0,0,0,0.28)";
        div.style.overflow           = "hidden";
        const obj = new CSS3DObject(div);
        const p   = TARGETS.GRID[i];
        obj.position.set(p.x, p.y, p.z);
        obj.rotation.y = p.ry;
        obj.rotation.x = p.rx;
        scene.add(obj);
        objects.push(obj);
      });

      const resize = () => {
        const W = el.clientWidth, H = el.clientHeight;
        if (!W || !H) return;
        renderer.setSize(W, H);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // ── Interaction state ──────────────────────────────────────────────────
      const ROT_LIMIT = Math.PI * 0.111; // ≈ 20° — max for flat layouts
      let targetCamZ = camZ;
      let autoRotY   = 0;
      let autoRotDir = 1;  // bounce direction for GRID/TABLE
      let userRotY   = 0;
      let userRotX   = 0;
      let isDragging = false;
      let dragX      = 0, dragY = 0;
      let pinchDist  = 0;
      let mouseX     = 0, mouseY = 0; // for subtle camera pan when idle

      // Scroll → zoom only while hero is visible; below that, let page scroll freely
      const onWheel = (e: WheelEvent) => {
        if (window.scrollY > window.innerHeight * 0.6) return;
        targetCamZ = Math.min(camZMax, Math.max(camZMin, targetCamZ + e.deltaY * 2));
      };
      window.addEventListener("wheel", onWheel, { passive: true });

      // Mouse drag → orbit (all on window — el is behind content)
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        dragX = e.clientX; dragY = e.clientY;
      };
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!isDragging) return;
        userRotY += (e.clientX - dragX) * 0.006;
        userRotX  = Math.max(-0.65, Math.min(0.65, userRotX + (e.clientY - dragY) * 0.004));
        dragX = e.clientX; dragY = e.clientY;
      };
      const onMouseUp = () => {
        isDragging = false;
        autoRotY += userRotY; userRotY = 0;
      };
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup",   onMouseUp);

      // Touch → drag + pinch-zoom (on window)
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging = true;
          dragX = e.touches[0].clientX; dragY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          pinchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY,
          );
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
          userRotY += (e.touches[0].clientX - dragX) * 0.007;
          userRotX  = Math.max(-0.65, Math.min(0.65, userRotX + (e.touches[0].clientY - dragY) * 0.004));
          dragX = e.touches[0].clientX; dragY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          const d = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY,
          );
          targetCamZ = Math.min(camZMax, Math.max(camZMin, targetCamZ - (d - pinchDist) * 6));
          pinchDist  = d;
        }
      };
      const onTouchEnd = () => {
        isDragging = false;
        autoRotY += userRotY; userRotY = 0;
      };
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove",  onTouchMove,  { passive: true });
      window.addEventListener("touchend",   onTouchEnd);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let layoutIdx  = 0;
      let lastSwitch = Date.now();

      const animate = () => {
        if (cancelled) return;
        rafId = requestAnimationFrame(animate);

        // Cycle layout
        if (Date.now() - lastSwitch > SWITCH_MS) {
          const nextIdx = (layoutIdx + 1) % LAYOUTS.length;
          const nextIsFlat = LAYOUTS[nextIdx] === "TABLE";
          if (nextIsFlat) {
            // Normalize autoRotY into [-π, π] to avoid snap when coming from SPHERE
            autoRotY = ((autoRotY % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
            autoRotDir = 1;
          }
          layoutIdx  = nextIdx;
          lastSwitch = Date.now();
        }

        const isLimited = LAYOUTS[layoutIdx] === "TABLE";
        const targets = TARGETS[LAYOUTS[layoutIdx]];

        // Lerp object positions + rotations
        objects.forEach((obj, i) => {
          const t = targets[i];
          obj.position.x += (t.x - obj.position.x) * LERP;
          obj.position.y += (t.y - obj.position.y) * LERP;
          obj.position.z += (t.z - obj.position.z) * LERP;
          obj.rotation.y  = lerpAngle(obj.rotation.y, t.ry, LERP);
          obj.rotation.x  = lerpAngle(obj.rotation.x, t.rx, LERP);
        });

        if (!reducedMotion) {
          // Auto-rotation: bounce within ±40° for flat layouts, free spin for SPHERE
          if (!isDragging) {
            autoRotY += 0.0004 * (isLimited ? autoRotDir : 1);
            if (isLimited && Math.abs(autoRotY) >= ROT_LIMIT) {
              autoRotDir *= -1;
              autoRotY = Math.sign(autoRotY) * ROT_LIMIT;
            }
          }

          // Scene rotation — clamp for flat layouts
          const totalRotY = isLimited
            ? Math.max(-ROT_LIMIT, Math.min(ROT_LIMIT, autoRotY + userRotY))
            : autoRotY + userRotY;
          scene.rotation.y = totalRotY;
          scene.rotation.x = userRotX;

          // Camera zoom (lerp to target)
          camera.position.z += (targetCamZ - camera.position.z) * 0.06;

          // Subtle camera pan follows mouse when idle (not dragging)
          if (!isDragging) {
            camera.position.x += (mouseX * 120 - camera.position.x) * 0.04;
            camera.position.y += (-mouseY * 70 - camera.position.y) * 0.04;
          }
          camera.lookAt(scene.position);
        }

        renderer.render(scene, camera);
      };
      animate();
      requestAnimationFrame(() => {
        renderer.domElement.style.opacity = "1";
        const ph = placeholderRef.current;
        if (ph) {
          ph.style.transition = "opacity 0.8s ease";
          ph.style.opacity = "0";
          ph.addEventListener("transitionend", () => { ph.style.display = "none"; }, { once: true });
        }
      });

      cleanupFn = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("wheel",       onWheel);
        window.removeEventListener("mousedown",   onMouseDown);
        window.removeEventListener("mousemove",   onMouseMove);
        window.removeEventListener("mouseup",     onMouseUp);
        window.removeEventListener("touchstart",  onTouchStart);
        window.removeEventListener("touchmove",   onTouchMove);
        window.removeEventListener("touchend",    onTouchEnd);
        ro.disconnect();
        if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      };
    })();

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Placeholder — 1 ảnh responsive, biến mất khi Three.js sẵn sàng */}
      <div ref={placeholderRef} className="absolute inset-0 pointer-events-none" aria-hidden>
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
      </div>
    </div>
  );
}
