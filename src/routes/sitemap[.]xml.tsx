import { createFileRoute } from "@tanstack/react-router";
import { artworks, characters, collections, series, tags } from "@/data";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const latest = artworks.reduce((m, a) => (a.created_at > m ? a.created_at : m), "").slice(0, 10);
        const entries: { path: string; lastmod?: string; priority: string }[] = [
          { path: "/", lastmod: latest, priority: "1.0" },
          ...["/gallery", "/series", "/characters", "/collections"].map((path) => ({ path, lastmod: latest, priority: "0.8" })),
          ...["/about", "/contact", "/dmca", "/privacy", "/terms"].map((path) => ({ path, priority: "0.3" })),
          ...artworks.filter((a) => a.status === "published").map((a) => ({ path: `/art/${a.slug}`, lastmod: a.created_at.slice(0, 10), priority: "0.7" })),
          ...series.map((s) => ({ path: `/series/${s.slug}`, priority: "0.6" })),
          ...characters.map((c) => ({ path: `/character/${c.slug}`, priority: "0.5" })),
          ...collections.map((c) => ({ path: `/collections/${c.slug}`, priority: "0.6" })),
          ...tags.map((t) => ({ path: `/tag/${t.slug}`, priority: "0.4" })),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
          .map((e) => `  <url><loc>${SITE_URL}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}<priority>${e.priority}</priority></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
      },
    },
  },
});
