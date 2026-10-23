import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { easeExpo, spring } from "@/components/motion";

/** Fire a petal burst at viewport coords (handled by the Petals canvas). */
export function petalBurst(x: number, y: number, count = 24) {
  window.dispatchEvent(new CustomEvent("artsstory:burst", { detail: { x, y, count } }));
}

const finePointer = () => window.matchMedia("(pointer: fine)").matches;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SmoothScroll() {
  useEffect(() => {
    if (reduced() || !finePointer()) return;
    let raf = 0, alive = true;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({ lerp: 0.12 });
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { alive = false; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
}

/** Soft glowing cursor; grows with "View" over [data-cursor=view]. Desktop only. */
export function GlowCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [view, setView] = useState(false);
  useEffect(() => {
    if (!finePointer() || reduced()) return;
    setOn(true);
    document.documentElement.classList.add("has-glow-cursor");
    let x = -100, y = -100, cx = x, cy = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      setView(!!(e.target as Element | null)?.closest?.("[data-cursor=view]"));
    };
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.documentElement.classList.remove("has-glow-cursor"); };
  }, []);
  if (!on) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]">
      <motion.div className="cursor-glow" animate={{ scale: view ? 1 : 0.28 }} transition={spring}>
        <motion.span className="text-xs font-medium tracking-widest uppercase" animate={{ opacity: view ? 1 : 0 }}>View</motion.span>
      </motion.div>
    </div>
  );
}

/** Logo splash, once per browser session. */
export function Splash() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (sessionStorage.getItem("artsstory:splash")) return;
    sessionStorage.setItem("artsstory:splash", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), reduce ? 500 : 1300);
    return () => clearTimeout(t);
  }, [reduce]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div aria-hidden className="bg-hero pointer-events-none fixed inset-0 z-[100] grid place-items-center" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ ease: easeExpo, duration: 0.6 }}>
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ease: easeExpo, duration: 0.6 }}>
            <motion.span animate={{ rotate: [0, 180], scale: [0.6, 1.2, 1] }} transition={{ duration: 0.9, ease: easeExpo }}><Sparkles className="h-8 w-8 text-primary" /></motion.span>
            <span className="font-display text-2xl uppercase tracking-[0.3em]">Artsstory</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Animated tooltip for every icon button, driven by its aria-label. */
export function IconTooltips() {
  const [tip, setTip] = useState<{ text: string; x: number; y: number; below: boolean } | null>(null);
  useEffect(() => {
    const sel = ".icon-tip, [data-tip]";
    let el: Element | null = null;
    const show = (target: EventTarget | null) => {
      const t = (target as Element | null)?.closest?.(sel) ?? null;
      if (t === el) return;
      el = t;
      const text = t?.getAttribute("data-tip") ?? t?.getAttribute("aria-label");
      if (!t || !text) return setTip(null);
      const r = t.getBoundingClientRect();
      const below = r.top < 56;
      setTip({ text, x: r.left + r.width / 2, y: below ? r.bottom + 8 : r.top - 8, below });
    };
    const over = (e: Event) => show(e.target);
    const hide = () => { el = null; setTip(null); };
    document.addEventListener("pointerover", over);
    document.addEventListener("focusin", over);
    document.addEventListener("focusout", hide);
    document.addEventListener("pointerdown", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over); document.removeEventListener("focusin", over);
      document.removeEventListener("focusout", hide); document.removeEventListener("pointerdown", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);
  return (
    <AnimatePresence>
      {tip && (
        <motion.div key={tip.text + tip.x} role="tooltip" className="tooltip-bubble pointer-events-none fixed z-[95]" style={{ left: tip.x, top: tip.y, translateX: "-50%", translateY: tip.below ? "0%" : "-100%" }}
          initial={{ opacity: 0, scale: 0.85, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring}>
          {tip.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
