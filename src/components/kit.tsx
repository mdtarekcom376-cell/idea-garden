import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ease = [0.22, 1, 0.36, 1] as const;

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ ease, duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, accent, action, className }: { eyebrow?: string; title: string; accent?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-col justify-between gap-3 md:mb-8 md:flex-row md:items-end", className)}>
      <FadeUp>
        {eyebrow && <p className="mb-2 text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>}
        <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] leading-tight">
          {title} {accent && <em className="text-primary">{accent}</em>}
        </h2>
      </FadeUp>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, accent, children, image }: { eyebrow?: string; title: string; accent?: string; children?: ReactNode; image?: string | undefined }) {
  return (
    <section className="bg-hero relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36">
      <div className="aurora pointer-events-none absolute inset-0" />
      {image && <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />}
      <div className="container-page relative">
        {eyebrow && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.5 }} className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</motion.p>}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.7, delay: 0.05 }} className="mt-3 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95]">
          {title} {accent && <em className="text-primary">{accent}</em>}
        </motion.h1>
        {children && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.7, delay: 0.15 }} className="mt-5 max-w-2xl text-muted-foreground">{children}</motion.div>}
      </div>
    </section>
  );
}

export function Chip({ active, children, className, ...p }: { active?: boolean; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...p} className={cn("chip", active && "chip-active", className)} aria-pressed={active}>
      {children}
    </button>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="font-script text-6xl text-primary">✿</span>
      <h3 className="mt-2 text-3xl">{title}</h3>
      {children && <div className="mt-3 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export function SkeletonTile({ ratio = 1 }: { ratio?: number }) {
  return <div className="shimmer mb-3 break-inside-avoid rounded-3xl md:mb-5" style={{ aspectRatio: String(ratio) }} />;
}
