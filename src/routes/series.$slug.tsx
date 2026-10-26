import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { charactersOf, getSeries, queryArtworks } from "@/data";
import { MasonryGrid } from "@/components/art";
import { EmptyState, PageHero, SectionHeading } from "@/components/kit";
import { CharacterCard, Rail } from "@/components/rails";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/series/$slug")({
  loader: ({ params }) => {
    const s = getSeries(params.slug);
    if (!s) throw notFound();
    return { slug: s.slug, name: s.name, description: s.description, image: s.cover };
  },
  head: ({ loaderData }) => loaderData
    ? pageMeta({ title: `${loaderData.name} — Series`, description: loaderData.description, path: `/series/${loaderData.slug}`, image: loaderData.image })
    : pageMeta({ title: "Series unavailable", noindex: true }),
  component: SeriesPage,
  notFoundComponent: () => <main className="pt-28"><EmptyState title="Series not found"><Link to="/series" className="text-primary">See all series</Link></EmptyState></main>,
  errorComponent: () => <main className="pt-28"><EmptyState title="This page didn't load" /></main>,
});

function SeriesPage() {
  const { slug } = Route.useLoaderData();
  const s = getSeries(slug)!;
  const chars = charactersOf(slug);
  const arts = queryArtworks({ series: slug });
  return (
    <main>
      <PageHero eyebrow={`Series · ${arts.length} artworks`} title={s.name} image={s.cover}>{s.description}</PageHero>
      {chars.length > 0 && (
        <section className="container-page pt-12">
          <SectionHeading title="Characters" />
          <Rail>{chars.map((c, i) => <CharacterCard key={c.slug} c={c} i={i} />)}</Rail>
        </section>
      )}
      <section className="container-page pt-16">
        <SectionHeading title="Artworks" />
        <MasonryGrid items={arts} />
      </section>
    </main>
  );
}
