import { useSyncExternalStore } from "react";

/** English is the source of truth; other locales may be partial and fall back to English. */
const en = {
  "nav.home": "Home", "nav.gallery": "Gallery", "nav.explore": "Explore", "nav.series": "Series", "nav.characters": "Characters",
  "nav.collections": "Collections", "nav.about": "About", "nav.saved": "Saved", "nav.search": "Search", "nav.menu": "Menu",
  "nav.contact": "Contact", "nav.dmca": "DMCA / Takedown", "nav.openMenu": "Open menu", "nav.closeMenu": "Close menu",
  "nav.homeLabel": "Artsstory home", "nav.main": "Main", "nav.mobile": "Mobile",
  "theme.toLight": "Switch to light theme", "theme.toDark": "Switch to dark theme",
  "art.like": "Like", "art.unlike": "Unlike", "art.save": "Save", "art.unsave": "Remove from saved",
  "art.saved": "Saved to favourites", "art.removed": "Removed from favourites", "art.share": "Share", "art.linkCopied": "Link copied",
  "art.download": "Download", "art.view": "View {title}", "art.zoomIn": "Zoom in", "art.zoomOut": "Zoom out",
  "art.prev": "Previous artwork", "art.next": "Next artwork", "art.close": "Close viewer", "art.openFull": "Open full page →",
  "art.characters": "Characters", "art.resolution": "Resolution", "art.type": "Type", "art.published": "Published", "art.likes": "Likes",
  "art.by": "by {name}",
  "video.play": "Play", "video.pause": "Pause", "video.mute": "Mute", "video.unmute": "Unmute", "video.volume": "Volume",
  "video.seek": "Seek", "video.quality": "Quality", "video.fullscreen": "Fullscreen", "video.exitFullscreen": "Exit fullscreen",
  "video.player": "Video player",
  "empty.title": "Nothing here yet",
  "offline.title": "You're offline",
} as const;

export type MessageKey = keyof typeof en;
type Dict = Partial<Record<MessageKey, string>>;
export const LOCALES = { en: { label: "English", dict: en as Dict }, bn: { label: "বাংলা", dict: {} as Dict }, ja: { label: "日本語", dict: {} as Dict } } as const;
export type Locale = keyof typeof LOCALES;

let locale: Locale = "en";
const subs = new Set<() => void>();
export function setLocale(l: Locale) {
  locale = l;
  try { localStorage.setItem("artsstory:locale", l); document.documentElement.lang = l; } catch { /* ignore */ }
  subs.forEach((f) => f());
}
export function initLocale() {
  try { const l = localStorage.getItem("artsstory:locale") as Locale | null; if (l && l in LOCALES && l !== locale) setLocale(l); } catch { /* ignore */ }
}

export function translate(l: Locale, key: MessageKey, vars?: Record<string, string | number>) {
  let s = LOCALES[l].dict[key] ?? en[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
export const t = (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars);

export function useT() {
  const l = useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => locale, () => "en" as Locale);
  return (key: MessageKey, vars?: Record<string, string | number>) => translate(l, key, vars);
}
