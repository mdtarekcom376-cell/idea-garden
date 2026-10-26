// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Generates /sw.js with Workbox into the directory the *client* build actually lands in.
 * The deploy target decides that directory (Vercel: .vercel/output/static, Lovable: dist/client, …),
 * and vite-plugin-pwa only knows the root outDir, so its sw.js never shipped.
 */
function serviceWorker(): Plugin {
  return {
    name: "artsstory:service-worker",
    apply: "build",
    applyToEnvironment: (env) => env.name === "client",
    async writeBundle() {
      const outDir = this.environment.config.build.outDir;
      const { generateSW } = await import("workbox-build");
      const { count, warnings } = await generateSW({
        globDirectory: outDir,
        swDest: `${outDir}/sw.js`,
        globPatterns: ["offline.html", "icons/*.png", "manifest.webmanifest", "assets/*.{js,css,woff2}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        navigateFallback: null,
        sourcemap: false,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => request.mode === "navigate" && !url.pathname.startsWith("/~oauth") && !url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: { cacheName: "pages", networkTimeoutSeconds: 4, precacheFallback: { fallbackURL: "/offline.html" } },
          },
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/assets/"),
            handler: "CacheFirst",
            options: { cacheName: "assets", expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      });
      for (const w of warnings) this.warn(w);
      this.info(`service worker: precached ${count} files into ${outDir}/sw.js`);
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [serviceWorker()],
  },
});
