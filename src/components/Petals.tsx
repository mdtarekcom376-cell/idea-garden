import { useEffect, useRef } from "react";

export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--primary-soft").trim();
    let w = 0, h = 0, raf = 0, wind = 0;
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    resize();
    const count = window.innerWidth < 768 ? 18 : 36;
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, s: 6 + Math.random() * 8,
      vy: 0.4 + Math.random() * 0.8, vx: Math.random() * 0.6 - 0.3, r: Math.random() * 6, vr: Math.random() * 0.02 - 0.01,
    }));
    const onMove = (e: PointerEvent) => { wind = (e.clientX / w - 0.5) * 1.2; };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy; p.x += p.vx + wind * 0.5 + Math.sin(p.y / 40) * 0.3; p.r += p.vr;
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        if (p.x > w + 20) p.x = -20; if (p.x < -20) p.x = w + 20;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = color; ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40" />;
}
