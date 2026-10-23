import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArtworksByIds, getCollection } from "@/data";
import { MasonryGrid } from "@/components/art";
import { EmptyState, PageHero } from "@/components/kit";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const c = getCollection(params.slug);
    if (!c) throw notFound();
    return { slug: c.slug, name: c.name, description: c.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Collection — Artsstory` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Artsstory` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Collection unavailable — Artsstory" }, { name: "robots", content: "noindex" }],
  }),
  component: CollectionPage,
  notFoundComponent: () => <main className="pt-28"><EmptyState title="Collection not found"><Link to="/collections" className="text-primary">See all collections</Link></EmptyState></main>,
  errorComponent: () => <main className="pt-28"><EmptyState title="This page didn't load" /></main>,
});

function CollectionPage() {
  const { slug } = Route.useLoaderData();
  const c = getCollection(slug)!;
  const arts = getArtworksByIds(c.artworkIds);
  return (
    <main>
      <PageHero eyebrow={`Collection · ${arts.length} pieces`} title={c.name} image={arts[0]?.src}>{c.description}</PageHero>
      <section className="container-page pt-10"><MasonryGrid items={arts} /></section>
    </main>
  );
}
