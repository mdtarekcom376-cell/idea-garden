import { useSyncExternalStore } from "react";

/** Likes & saves stored in localStorage until member accounts exist. */
type Key = "likes" | "saved";
const listeners = new Set<() => void>();
const cache: Record<Key, string[] | null> = { likes: null, saved: null };
const EMPTY: string[] = [];

function read(k: Key): string[] {
  if (typeof window === "undefined") return EMPTY;
  if (!cache[k]) {
    try { cache[k] = JSON.parse(localStorage.getItem(`artsstory:${k}`) || "[]"); } catch { cache[k] = []; }
  }
  return cache[k]!;
}

export function toggleIn(k: Key, id: string) {
  const cur = read(k);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  cache[k] = next;
  localStorage.setItem(`artsstory:${k}`, JSON.stringify(next));
  listeners.forEach((l) => l());
  return next.includes(id);
}

export function useList(k: Key) {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => read(k),
    () => EMPTY,
  );
}
