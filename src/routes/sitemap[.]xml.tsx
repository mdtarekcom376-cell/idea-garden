import { createFileRoute } from "@tanstack/react-router";
import { artworks, characters, collections, series, tags } from "@/data";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const paths = [
          "/", "/gallery", "/series", "/characters", "/collections", "/about", "/contact", "/dmca", "/privacy", "/terms",
          ...artworks.map((a) => `/art/${a.slug}`),
          ...series.map((s) => `/series/${s.slug}`),
          ...characters.map((c) => `/character/${c.slug}`),
          ...tags.map((t) => `/tag/${t.slug}`),
          ...collections.map((c) => `/collections/${c.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
