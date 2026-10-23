import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Easing tokens — mirrored as CSS vars in styles.css */
export const easeExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;
export const easeSpring = [0.34, 1.56, 0.64, 1] as const;
export const spring = { type: "spring", stiffness: 260, damping: 24 } as const;
const viewport = { once: true, margin: "-40px" } as const;

type Base = { children: ReactNode; delay?: number; className?: string };

export function FadeUp({ children, delay = 0, className }: Base) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: reduce ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ ease: easeExpo, duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className }: Base) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ ease: easeExpo, duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const staggerParent = (gap: number, delay: number): Variants => ({ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } });
const staggerChild: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { ease: easeExpo, duration: 0.6 } } };

export function Stagger({ children, className, gap = 0.08, delay = 0 }: Base & { gap?: number }) {
  return (
    <motion.div variants={staggerParent(Math.min(0.12, Math.max(0.06, gap)), delay)} initial="hidden" whileInView="show" viewport={viewport} className={className}>
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className }: Omit<Base, "delay">) {
  return <motion.div variants={staggerChild} className={className}>{children}</motion.div>;
}

export function Float({ children, className, amp = 10 }: Omit<Base, "delay"> & { amp?: number }) {
  const reduce = useReducedMotion();
  // stable per-instance offset, computed after mount to avoid hydration mismatch
  const [seed, setSeed] = useState<{ d: number; o: number } | null>(null);
  useEffect(() => setSeed({ d: 5 + Math.random() * 3, o: Math.random() * 3 }), []);
  if (reduce || !seed) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} animate={{ y: [-amp, amp, -amp], rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: seed.d, delay: -seed.o, repeat: Infinity, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
}

/** Words rise in one by one. Real text stays in the DOM via sr-only. */
export function StaggerText({ text, className, delay = 0, as: Tag = "span" }: { text: string; className?: string; delay?: number; as?: "span" | "p" }) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden initial="hidden" whileInView="show" viewport={viewport} variants={staggerParent(0.06, delay)}>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span className="inline-block" variants={{ hidden: { y: "105%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { ease: easeExpo, duration: 0.6 } } }}>
              {w}{i < words.length - 1 ? "\u00a0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

function useCycle(n: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => { if (n < 2) return; const t = setInterval(() => setI((v) => (v + 1) % n), ms); return () => clearInterval(t); }, [n, ms]);
  return i;
}

/** 3D flip cycling between words. */
export function FlipText({ words, className, interval = 2600 }: { words: string[]; className?: string; interval?: number }) {
  const i = useCycle(words.length, interval);
  return (
    <span className={cn("relative inline-block [perspective:600px]", className)}>
      <span className="sr-only">{words[0]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span aria-hidden key={words[i]} className="inline-block" initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: -90, opacity: 0 }} transition={{ ease: easeExpo, duration: 0.5 }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Soft fade + slide cycling, for subtitles/eyebrows. */
export function FlipFadeText({ words, className, interval = 3200 }: { words: string[]; className?: string; interval?: number }) {
  const i = useCycle(words.length, interval);
  return (
    <span className={cn("relative inline-grid", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span aria-hidden key={words[i]} className="col-start-1 row-start-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ ease: easeExpo, duration: 0.5 }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Hover flip for nav links: text rolls up to a duplicate. */
export function HoverFlip({ text }: { text: string }) {
  return (
    <span className="group/flip relative inline-block overflow-hidden align-bottom">
      <span className="flip-a inline-block">{text}</span>
      <span aria-hidden className="flip-b absolute inset-x-0 top-full inline-block">{text}</span>
    </span>
  );
}

/** Hand-drawn underline + sparkle that draws on viewport enter. */
export function DrawUnderline({ className }: { className?: string }) {
  const d = useMemo(() => "M2 9 C 40 2, 80 14, 120 7 S 180 3, 198 8", []);
  return (
    <svg aria-hidden viewBox="0 0 220 18" className={cn("h-3 w-40 text-primary", className)} fill="none">
      <motion.path d={d} stroke="currentColor" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={viewport} transition={{ ease: easeInOut, duration: 0.7, delay: 0.3 }} />
      <motion.path d="M210 2 L212 7 L217 9 L212 11 L210 16 L208 11 L203 9 L208 7 Z" fill="currentColor" initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={viewport} transition={{ ...spring, delay: 0.9 }} style={{ transformOrigin: "210px 9px" }} />
    </svg>
  );
}
