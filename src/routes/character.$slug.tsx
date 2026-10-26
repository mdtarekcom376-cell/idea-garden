import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCharacter, getSeries, queryArtworks, coverOfCharacter } from "@/data";
import { MasonryGrid } from "@/components/art";
import { EmptyState, PageHero, SectionHeading } from "@/components/kit";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/character/$slug")({
  loader: ({ params }) => {
    const c = getCharacter(params.slug);
    if (!c) throw notFound();
    return { slug: c.slug, name: c.name, bio: c.bio, image: coverOfCharacter(c.slug)?.src };
  },
  head: ({ loaderData }) => loaderData
    ? pageMeta({ title: `${loaderData.name} — Character`, description: `${loaderData.name}: ${loaderData.bio} See every artwork featuring them.`, path: `/character/${loaderData.slug}`, ...(loaderData.image ? { image: loaderData.image } : {}), type: "profile" })
    : pageMeta({ title: "Character unavailable", noindex: true }),
  component: CharacterPage,
  notFoundComponent: () => <main className="pt-28"><EmptyState title="Character not found"><Link to="/characters" className="text-primary">See all characters</Link></EmptyState></main>,
  errorComponent: () => <main className="pt-28"><EmptyState title="This page didn't load" /></main>,
});

function CharacterPage() {
  const { slug } = Route.useLoaderData();
  const c = getCharacter(slug)!;
  const s = getSeries(c.series);
  const arts = queryArtworks({ character: slug });
  return (
    <main>
      <PageHero eyebrow="Character" title={c.name} image={coverOfCharacter(slug)?.src}>
        <p>{c.bio}</p>
        {s && <p className="mt-2">From <Link to="/series/$slug" params={{ slug: s.slug }} className="text-primary hover:underline">{s.name}</Link></p>}
      </PageHero>
      <section className="container-page pt-12">
        <SectionHeading title={`${arts.length} artworks`} />
        {arts.length ? <MasonryGrid items={arts} /> : <EmptyState title="No artworks yet" />}
      </section>
    </main>
  );
}
