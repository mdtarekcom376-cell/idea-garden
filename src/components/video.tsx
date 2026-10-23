import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, Settings, Volume2, VolumeX } from "lucide-react";
import { type Artwork, type VideoMedia, formatDuration, resolutionOf } from "@/data";
import { useT } from "@/lib/i18n";
import { spring } from "@/components/motion";

/** Full player with custom controls. MP4 today; `media.hls` can be wired to hls.js later. */
export function VideoPlayer({ media, title, autoPlay = false }: { media: VideoMedia; title: string; autoPlay?: boolean }) {
  const t = useT();
  const wrap = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(media.duration);
  const [vol, setVol] = useState(1);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState(media.sources[0]!.label);
  const [menu, setMenu] = useState(false);
  const [fs, setFs] = useState(false);
  const [idle, setIdle] = useState(false);
  const src = media.sources.find((s) => s.label === quality)?.src ?? media.sources[0]!.src;

  useEffect(() => { const f = () => setFs(document.fullscreenElement === wrap.current); document.addEventListener("fullscreenchange", f); return () => document.removeEventListener("fullscreenchange", f); }, []);
  useEffect(() => { if (!playing) return setIdle(false); const id = setTimeout(() => setIdle(true), 2500); return () => clearTimeout(id); }, [playing, time]);

  const toggle = () => { const el = v.current!; if (el.paused) void el.play(); else el.pause(); };
  const changeQuality = (label: typeof quality) => {
    const el = v.current!; const at = el.currentTime; const was = !el.paused;
    setQuality(label); setMenu(false);
    requestAnimationFrame(() => { el.currentTime = at; if (was) void el.play(); });
  };
  const fullscreen = () => { if (document.fullscreenElement) void document.exitFullscreen(); else void wrap.current?.requestFullscreen(); };
  const onKey = (e: React.KeyboardEvent) => {
    const el = v.current!;
    if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowRight") el.currentTime += 5;
    else if (e.key === "ArrowLeft") el.currentTime -= 5;
    else if (e.key === "f") fullscreen();
    else if (e.key === "m") setMuted((m) => !m);
  };

  return (
    <div ref={wrap} tabIndex={0} onKeyDown={onKey} onPointerMove={() => setIdle(false)} onClick={(e) => e.stopPropagation()}
      role="region" aria-label={`${t("video.player")}: ${title}`}
      className={`video-shell group/player ${idle ? "cursor-none" : ""}`}>
      <video ref={v} key={src} src={src} poster={media.poster} playsInline preload="metadata" autoPlay={autoPlay}
        muted={muted} onClick={toggle}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => { setDur(e.currentTarget.duration || media.duration); e.currentTarget.volume = vol; }}
        className="h-full w-full object-contain" />
      <AnimatePresence>
        {!playing && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} transition={spring}
            onClick={toggle} aria-label={t("video.play")} className="video-big-play icon-tip absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Play className="h-7 w-7 translate-x-0.5 fill-current" />
          </motion.button>
        )}
      </AnimatePresence>
      <div className={`video-controls transition-opacity duration-300 ${idle ? "opacity-0" : "opacity-100"}`}>
        <input type="range" min={0} max={dur || 0} step={0.1} value={time} aria-label={t("video.seek")}
          onChange={(e) => { v.current!.currentTime = Number(e.target.value); }}
          className="video-range w-full" style={{ ["--p" as string]: `${dur ? (time / dur) * 100 : 0}%` }} />
        <div className="mt-2 flex items-center gap-2">
          <button onClick={toggle} aria-label={playing ? t("video.pause") : t("video.play")} className="video-btn icon-tip">
            {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </button>
          <button onClick={() => setMuted((m) => !m)} aria-label={muted || vol === 0 ? t("video.unmute") : t("video.mute")} className="video-btn icon-tip">
            {muted || vol === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : vol} aria-label={t("video.volume")}
            onChange={(e) => { const n = Number(e.target.value); setVol(n); setMuted(n === 0); v.current!.volume = n; }}
            className="video-range hidden w-20 sm:block" style={{ ["--p" as string]: `${(muted ? 0 : vol) * 100}%` }} />
          <span className="ml-1 text-xs tabular-nums opacity-90">{formatDuration(time)} / {formatDuration(dur)}</span>
          <div className="relative ml-auto">
            <button onClick={() => setMenu((m) => !m)} aria-label={t("video.quality")} aria-expanded={menu} className="video-btn icon-tip"><Settings className="h-4 w-4" /></button>
            <AnimatePresence>
              {menu && (
                <motion.ul role="menu" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={spring}
                  className="video-menu absolute bottom-12 right-0">
                  {media.sources.map((s) => (
                    <li key={s.label}><button role="menuitemradio" aria-checked={s.label === quality} onClick={() => changeQuality(s.label)}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm ${s.label === quality ? "bg-primary text-primary-foreground" : "hover:bg-primary-soft hover:text-foreground"}`}>{s.label}</button></li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <button onClick={fullscreen} aria-label={fs ? t("video.exitFullscreen") : t("video.fullscreen")} className="video-btn icon-tip">
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Grid tile media: poster + badges; muted loop preview on hover (desktop) or when centered (touch). */
export function VideoTileMedia({ a, onLoad, loaded }: { a: Artwork; onLoad: () => void; loaded: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const media = a.video!;
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current?.parentElement; if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(!!e?.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (active) { el.src ||= media.preview; void el.play().catch(() => {}); } else el.pause();
  }, [active, media.preview]);
  return (
    <div className="relative h-full w-full"
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setActive(false); }}>
      <img src={media.poster} alt={a.title} width={a.width} height={a.height} loading="lazy" decoding="async" onLoad={onLoad}
        className={`h-full w-full object-cover transition-[opacity,filter] duration-700 ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`} />
      <video ref={ref} muted loop playsInline preload="none" aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`} />
      <span className="badge-glass absolute left-3 top-3"><Play className="h-3 w-3 fill-current" /> {resolutionOf(a)} · {formatDuration(media.duration)}</span>
    </div>
  );
}
