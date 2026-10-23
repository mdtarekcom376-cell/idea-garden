import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTag, queryArtworks, tags } from "@/data";
import { MasonryGrid } from "@/components/art";
import { EmptyState, PageHero } from "@/components/kit";

export const Route = createFileRoute("/tag/$slug")({
  loader: ({ params }) => {
    const t = getTag(params.slug);
    if (!t) throw notFound();
    return { slug: t.slug, name: t.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `#${loaderData.name} anime art — Artsstory` },
          { name: "description", content: `Curated anime artworks tagged #${loaderData.name}.` },
          { property: "og:title", content: `#${loaderData.name} — Artsstory` },
          { property: "og:description", content: `Anime art tagged #${loaderData.name}.` },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Tag unavailable — Artsstory" }, { name: "robots", content: "noindex" }],
  }),
  component: TagPage,
  notFoundComponent: () => <main className="pt-28"><EmptyState title="Tag not found"><Link to="/gallery" className="text-primary">Back to the gallery</Link></EmptyState></main>,
  errorComponent: () => <main className="pt-28"><EmptyState title="This page didn't load" /></main>,
});

function TagPage() {
  const { slug, name } = Route.useLoaderData();
  const arts = queryArtworks({ tag: slug });
  return (
    <main>
      <PageHero eyebrow={`Tag · ${arts.length} artworks`} title={`#${name}`}>
        <div className="flex flex-wrap gap-2">
          {tags.filter((t) => t.slug !== slug).map((t) => <Link key={t.slug} to="/tag/$slug" params={{ slug: t.slug }} className="chip">#{t.name}</Link>)}
        </div>
      </PageHero>
      <section className="container-page pt-10"><MasonryGrid items={arts} /></section>
    </main>
  );
}
