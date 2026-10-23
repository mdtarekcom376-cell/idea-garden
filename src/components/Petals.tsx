import { useEffect, useRef } from "react";

type P = { x: number; y: number; s: number; vx: number; vy: number; r: number; vr: number; spark: boolean; life: number; tw: number };

/** Single canvas: falling sakura petals + twinkling sparkles + click bursts. */
export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const petal = css.getPropertyValue("--primary-soft").trim();
    const sparkle = css.getPropertyValue("--primary").trim();
    const mobile = window.innerWidth < 768;
    const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 4;
    let w = 0, h = 0, raf = 0, wind = 0, running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
    const resize = () => { w = window.innerWidth; h = window.innerHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const base = Math.round((mobile ? 14 : 30) * (lowEnd ? 0.5 : 1));
    const make = (spark: boolean): P => ({
      x: Math.random() * w, y: Math.random() * h, s: spark ? 1.5 + Math.random() * 2 : 6 + Math.random() * 8,
      vy: spark ? 0.15 + Math.random() * 0.3 : 0.4 + Math.random() * 0.8, vx: Math.random() * 0.6 - 0.3,
      r: Math.random() * 6, vr: Math.random() * 0.02 - 0.01, spark, life: -1, tw: Math.random() * 6,
    });
    const ps: P[] = [...Array.from({ length: base }, () => make(false)), ...Array.from({ length: Math.round(base / 3) }, () => make(true))];
    const MAX = base * 3;

    const onMove = (e: PointerEvent) => { wind = (e.clientX / w - 0.5) * 1.2; };
    const onBurst = (e: Event) => {
      const { x, y, count } = (e as CustomEvent<{ x: number; y: number; count: number }>).detail;
      for (let i = 0; i < count && ps.length < MAX; i++) {
        const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 4;
        ps.push({ ...make(i % 3 === 0), x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, life: 80 + Math.random() * 40 });
      }
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]!;
        if (p.life >= 0) { p.vy += 0.08; p.vx *= 0.98; if (--p.life <= 0) { ps.splice(i, 1); continue; } }
        p.y += p.vy; p.x += p.vx + (p.life < 0 ? wind * 0.5 + Math.sin(p.y / 40) * 0.3 : 0); p.r += p.vr; p.tw += 0.05;
        if (p.life < 0) {
          if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
          if (p.x > w + 20) p.x = -20; if (p.x < -20) p.x = w + 20;
        }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = (p.life >= 0 ? Math.min(1, p.life / 40) : 1) * (p.spark ? 0.4 + Math.abs(Math.sin(p.tw)) * 0.6 : 0.85);
        ctx.fillStyle = p.spark ? sparkle : petal;
        ctx.beginPath();
        if (p.spark) { const s = p.s; ctx.moveTo(0, -s * 2); ctx.lineTo(s * 0.5, -s * 0.5); ctx.lineTo(s * 2, 0); ctx.lineTo(s * 0.5, s * 0.5); ctx.lineTo(0, s * 2); ctx.lineTo(-s * 0.5, s * 0.5); ctx.lineTo(-s * 2, 0); ctx.lineTo(-s * 0.5, -s * 0.5); }
        else ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    const onVis = () => { const vis = !document.hidden; if (vis && !running) { running = true; tick(); } else if (!vis) { running = false; cancelAnimationFrame(raf); } };
    tick();
    window.addEventListener("resize", resize);
    if (!mobile) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("artsstory:burst", onBurst);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove);
      window.removeEventListener("artsstory:burst", onBurst); document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />;
}
