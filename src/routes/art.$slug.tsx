import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { artworks, getArtwork, getRelated } from "@/data";
import { MasonryGrid, MetaPanel, ZoomImage } from "@/components/art";
import { SectionHeading, EmptyState } from "@/components/kit";

export const Route = createFileRoute("/art/$slug")({
  loader: ({ params }) => {
    const a = getArtwork(params.slug);
    if (!a) throw notFound();
    return { slug: a.slug, title: a.title, description: a.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Artsstory` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.title} — Artsstory` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Artwork unavailable — Artsstory" }, { name: "robots", content: "noindex" }],
  }),
  component: ArtPage,
  notFoundComponent: () => <main className="pt-28"><EmptyState title="Artwork not found"><Link to="/gallery" className="text-primary">Back to the gallery</Link></EmptyState></main>,
  errorComponent: () => <main className="pt-28"><EmptyState title="This artwork didn't load" /></main>,
});

function ArtPage() {
  const { slug } = Route.useLoaderData();
  const a = getArtwork(slug)!;
  const idx = artworks.findIndex((x) => x.id === a.id);
  const prev = artworks[(idx - 1 + artworks.length) % artworks.length]!;
  const next = artworks[(idx + 1) % artworks.length]!;
  const router = useRouter();
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight") router.navigate({ to: "/art/$slug", params: { slug: next.slug } });
      if (e.key === "ArrowLeft") router.navigate({ to: "/art/$slug", params: { slug: prev.slug } });
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [next.slug, prev.slug, router]);

  return (
    <main className="pt-20">
      <section className="container-page grid gap-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
        <div className={`relative flex items-center justify-center rounded-[2rem] p-3 md:h-[80vh] ${a.video ? "h-auto py-14 md:py-3" : "h-[60vh]"}`} style={{ backgroundColor: a.dominant_color }}>
          <ZoomImage key={a.id} a={a} layout={false} />
          <Link to="/art/$slug" params={{ slug: prev.slug }} aria-label={`Previous: ${prev.title}`} className="icon-btn-glass icon-tip absolute left-3 top-1/2 -translate-y-1/2 max-md:top-7"><ChevronLeft className="h-5 w-5" /></Link>
          <Link to="/art/$slug" params={{ slug: next.slug }} aria-label={`Next: ${next.title}`} className="icon-btn-glass icon-tip absolute right-3 top-1/2 -translate-y-1/2 max-md:top-7"><ChevronRight className="h-5 w-5" /></Link>
        </div>
        <aside className="lg:py-6"><MetaPanel a={a} /></aside>
      </section>
      <section className="container-page pt-20">
        <SectionHeading title="More like" accent="this" />
        <MasonryGrid key={a.id} items={getRelated(a)} />
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": a.type === "video" ? "VideoObject" : "ImageObject", name: a.title, description: a.description, creator: { "@type": "Person", name: a.credit_name }, width: a.width, height: a.height, uploadDate: a.created_at }) }} />
    </main>
  );
}
