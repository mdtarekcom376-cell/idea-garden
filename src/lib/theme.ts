import { useSyncExternalStore } from "react";

export type ThemePref = "light" | "dark" | "system";
const KEY = "artsstory:theme";

/** Inline before paint to avoid a flash: stored choice, else OS preference. */
export const themeInitScript = `try{var t=localStorage.getItem('${KEY}');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}`;

const subs = new Set<() => void>();
const isDark = () => document.documentElement.classList.contains("dark");
function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  subs.forEach((f) => f());
}

export function setTheme(pref: ThemePref) {
  if (pref === "system") localStorage.removeItem(KEY); else localStorage.setItem(KEY, pref);
  apply(pref === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : pref === "dark");
}

/** Follow OS changes while the user hasn't chosen explicitly. */
export function watchSystemTheme() {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const on = (e: MediaQueryListEvent) => { if (!localStorage.getItem(KEY)) apply(e.matches); };
  mq.addEventListener("change", on);
  return () => mq.removeEventListener("change", on);
}

export function useIsDark() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, isDark, () => false);
}
export const onThemeChange = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
