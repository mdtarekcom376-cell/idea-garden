/** Single registration point for the app-shell service worker. Never registers in dev, preview or iframes. */
const SW_URL = "/sw.js";

function refused() {
  if (!import.meta.env.PROD) return true;
  try { if (window.self !== window.top) return true; } catch { return true; }
  const h = location.hostname;
  const bad = (d: string) => h === d || h.endsWith(`.${d}`);
  if (h.startsWith("id-preview--") || h.startsWith("preview--")) return true;
  if (bad("lovableproject.com") || bad("lovableproject-dev.com") || bad("beta.lovable.dev")) return true;
  return new URLSearchParams(location.search).get("sw") === "off";
}

async function unregisterAppSW() {
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.filter((r) => [r.active, r.waiting, r.installing].some((w) => w?.scriptURL.endsWith(SW_URL))).map((r) => r.unregister()));
}

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (refused()) { void unregisterAppSW(); return; }
  void navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {});
}
