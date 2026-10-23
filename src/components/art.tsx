import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Heart, Bookmark, Play, X, ChevronLeft, ChevronRight, Download, Share2, ExternalLink, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { type Artwork, getSeries, getCharacter, resolutionOf } from "@/data";
import { toggleIn, useList } from "@/lib/library";
import { ease } from "@/components/kit";
import { spring } from "@/components/motion";
import { petalBurst } from "@/components/effects";
import { useMotionValue, useSpring, useTransform } from "motion/react";

export async function shareArtwork(a: Artwork) {
  const url = `${window.location.origin}/art/${a.slug}`;
  if (navigator.share) { try { await navigator.share({ title: a.title, url }); return; } catch { /* cancelled */ } }
  await navigator.clipboard?.writeText(url);
  toast.success("Link copied");
}

export function LikeButton({ a, size = "sm" }: { a: Artwork; size?: "sm" | "lg" }) {
  const likes = useList("likes");
  const on = likes.includes(a.id);
  return (
    <motion.button
      whileTap={{ scale: 1.35 }} transition={spring}
      onClick={(e) => { e.stopPropagation(); const now = toggleIn("likes", a.id); if (now) { const r = e.currentTarget.getBoundingClientRect(); petalBurst(r.left + r.width / 2, r.top + r.height / 2, 10); } }}
      aria-label={on ? "Unlike" : "Like"} aria-pressed={on}
      className={size === "sm" ? "icon-btn-glass icon-tip" : "icon-btn icon-tip"}
    >
      <motion.span key={String(on)} initial={{ scale: on ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }} className="grid place-items-center"><Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : ""}`} /></motion.span>
    </motion.button>
  );
}

export function SaveButton({ a, size = "sm" }: { a: Artwork; size?: "sm" | "lg" }) {
  const saved = useList("saved");
  const on = saved.includes(a.id);
  return (
    <motion.button
      whileTap={{ scale: 1.25 }}
      onClick={(e) => { e.stopPropagation(); const now = toggleIn("saved", a.id); toast(now ? "Saved to favourites" : "Removed from favourites"); }}
      aria-label={on ? "Remove from saved" : "Save"} aria-pressed={on}
      className={size === "sm" ? "icon-btn-glass icon-tip" : "icon-btn icon-tip"}
    >
      <Bookmark className={`h-4 w-4 ${on ? "fill-primary text-primary" : ""}`} />
    </motion.button>
  );
}

export function ArtCard({ a, index = 0, onOpen }: { a: Artwork; index?: number; onOpen?: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), spring);
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), spring);
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
  };
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.92, y: 24 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.6, ease, delay: (index % 4) * 0.09 }}
      onPointerMove={tilt} onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      data-cursor="view"
      className="card-glow group relative mb-3 break-inside-avoid overflow-hidden rounded-3xl shadow-soft md:mb-5"
      style={{ backgroundColor: a.dominant_color, aspectRatio: String(a.aspect), rotateX, rotateY, transformPerspective: 900 }}
    >
      <Link
        to="/art/$slug" params={{ slug: a.slug }}
        onClick={(e) => { if (onOpen && !e.metaKey && !e.ctrlKey) { e.preventDefault(); onOpen(); } }}
        className="block h-full w-full focus-visible:outline-none" aria-label={`View ${a.title}`}
      >
        <motion.img
          layoutId={`art-${a.id}`} src={a.src} alt={`${a.title} — ${getSeries(a.series)?.name}`}
          width={a.width} height={a.height} loading="lazy" decoding="async" onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-[transform,opacity,filter] duration-700 ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
        />
      </Link>
      {a.type === "video" && (
        <span className="badge-glass absolute left-3 top-3"><Play className="h-3 w-3 fill-current" /> {resolutionOf(a)}</span>
      )}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-overlay/75 to-transparent p-4 opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <p className="font-script text-xl leading-tight text-primary-foreground transition-[transform,opacity] duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:text-2xl">{a.title}</p>
        <p className="text-xs text-primary-foreground/80">{getSeries(a.series)?.name}</p>
      </figcaption>
      <div className="absolute right-2.5 top-2.5 flex flex-col gap-2 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <LikeButton a={a} />
        <SaveButton a={a} />
      </div>
    </motion.figure>
  );
}

export function MasonryGrid({ items, cols = "default" }: { items: Artwork[]; cols?: "default" | "wide" }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className={cols === "wide" ? "columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-5" : "columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4"}>
        {items.map((a, i) => <ArtCard key={a.id} a={a} index={i} onOpen={() => setOpen(i)} />)}
      </div>
      <Viewer items={items} index={open} setIndex={setOpen} />
    </>
  );
}

export function MetaPanel({ a }: { a: Artwork }) {
  const s = getSeries(a.series);
  return (
    <div>
      {s && <Link to="/series/$slug" params={{ slug: s.slug }} className="text-xs uppercase tracking-widest text-primary hover:underline">{s.name}</Link>}
      <h2 className="mt-2 text-4xl leading-tight">{a.title}</h2>
      <a href={a.credit_url} target="_blank" rel="noreferrer" className="font-script inline-flex items-center gap-1 text-2xl text-primary">
        by {a.credit_name} <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <p className="mt-4 text-sm text-muted-foreground">{a.description}</p>
      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
        <dt className="text-muted-foreground">Characters</dt>
        <dd className="flex flex-wrap gap-x-2">
          {a.characters.map((c) => <Link key={c} to="/character/$slug" params={{ slug: c }} className="hover:text-primary">{getCharacter(c)?.name}</Link>)}
        </dd>
        <dt className="text-muted-foreground">Resolution</dt><dd>{resolutionOf(a)} · {a.width}×{a.height}</dd>
        <dt className="text-muted-foreground">Type</dt><dd className="capitalize">{a.type}</dd>
        <dt className="text-muted-foreground">Published</dt><dd>{new Date(a.created_at).toLocaleDateString("en", { dateStyle: "medium" })}</dd>
        <dt className="text-muted-foreground">Likes</dt><dd>{a.like_count.toLocaleString("en")}</dd>
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        {a.tags.map((t) => <Link key={t} to="/tag/$slug" params={{ slug: t }} className="chip">#{t}</Link>)}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <LikeButton a={a} size="lg" />
        <SaveButton a={a} size="lg" />
        <button onClick={() => shareArtwork(a)} aria-label="Share" className="icon-btn icon-tip"><Share2 className="h-4 w-4" /></button>
        <a href={a.src} download={`${a.slug}.jpg`} className="btn-primary btn-shine flex-1"><Download className="h-4 w-4" /> Download</a>
      </div>
    </div>
  );
}

export function ZoomImage({ a, layout = true }: { a: Artwork; layout?: boolean }) {
  const [zoom, setZoom] = useState(false);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <motion.img
        {...(layout ? { layoutId: `art-${a.id}` } : {})} src={a.src} alt={a.title}
        animate={{ scale: zoom ? 2 : 1 }} transition={{ ease, duration: 0.5 }}
        drag={zoom} dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
        onDoubleClick={() => setZoom((z) => !z)}
        className={`max-h-full max-w-full rounded-2xl object-contain ${zoom ? "cursor-grab" : "cursor-zoom-in"}`}
        onClick={(e) => e.stopPropagation()}
      />
      <button onClick={(e) => { e.stopPropagation(); setZoom((z) => !z); }} aria-label={zoom ? "Zoom out" : "Zoom in"} className="icon-btn-glass icon-tip absolute bottom-3 right-3">
        {zoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Viewer({ items, index, setIndex }: { items: Artwork[]; index: number | null; setIndex: (i: number | null) => void }) {
  const a = index === null ? null : items[index];
  const go = (d: number) => index !== null && setIndex((index + d + items.length) % items.length);
  useEffect(() => {
    if (index === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  });
  return (
    <AnimatePresence>
      {a && (
        <motion.div role="dialog" aria-modal aria-label={a.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-overlay/90 backdrop-blur-md md:flex-row md:overflow-hidden">
          <motion.div
            className="relative flex h-[62vh] shrink-0 items-center justify-center p-4 md:h-auto md:flex-1 md:p-10"
            onClick={() => setIndex(null)}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.3}
            onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1); }}
          >
            <ZoomImage key={a.id} a={a} />
            <button aria-label="Previous artwork" onClick={(e) => { e.stopPropagation(); go(-1); }} className="icon-btn-glass icon-tip absolute left-3 top-1/2 -translate-y-1/2"><ChevronLeft className="h-5 w-5" /></button>
            <button aria-label="Next artwork" onClick={(e) => { e.stopPropagation(); go(1); }} className="icon-btn-glass icon-tip absolute right-3 top-1/2 -translate-y-1/2"><ChevronRight className="h-5 w-5" /></button>
          </motion.div>
          <motion.aside initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ ease, duration: 0.5 }} className="relative w-full bg-card p-6 md:w-[26rem] md:overflow-y-auto md:p-8">
            <button aria-label="Close viewer" autoFocus onClick={() => setIndex(null)} className="icon-btn icon-tip absolute right-4 top-4"><X className="h-4 w-4" /></button>
            <MetaPanel a={a} />
            <Link to="/art/$slug" params={{ slug: a.slug }} className="mt-6 inline-flex text-sm text-primary hover:underline">Open full page →</Link>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
