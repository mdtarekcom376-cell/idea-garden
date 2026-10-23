import { createFileRoute, Link } from "@tanstack/react-router";
import { queryArtworks, series, characters, tags } from "@/data";
import { MasonryGrid } from "@/components/art";
import { EmptyState, PageHero, SectionHeading } from "@/components/kit";
import { SearchPill } from "@/components/SearchPill";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: typeof s["q"] === "string" ? s["q"] : undefined }),
  head: () => ({
    meta: [
      { title: "Search — Artsstory" },
      { name: "description", content: "Search curated anime art by title, series, character, artist or tag." },
      { property: "og:title", content: "Search — Artsstory" },
      { property: "og:description", content: "Find anime art on Artsstory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const term = q.trim().toLowerCase();
  const arts = term ? queryArtworks({ q: term }) : [];
  const ser = term ? series.filter((s) => s.name.toLowerCase().includes(term)) : [];
  const chars = term ? characters.filter((c) => c.name.toLowerCase().includes(term)) : [];
  return (
    <main>
      <PageHero eyebrow="Search" title={term ? `"${q}"` : "Find your"} accent={term ? undefined : "magic"}>
        <SearchPill key={q} initial={q} autoFocus={!term} className="max-w-xl" />
      </PageHero>
      <div className="container-page pt-10">
        {!term ? (
          <div>
            <h2 className="mb-4 text-2xl">Popular tags</h2>
            <div className="flex flex-wrap gap-2">{tags.map((t) => <Link key={t.slug} to="/tag/$slug" params={{ slug: t.slug }} className="chip">#{t.name}</Link>)}</div>
          </div>
        ) : arts.length + ser.length + chars.length === 0 ? (
          <EmptyState title="Nothing found">No results for "{q}". Try a series name like "Skybound" or a tag like "moon".</EmptyState>
        ) : (
          <>
            {(ser.length > 0 || chars.length > 0) && (
              <div className="mb-10 flex flex-wrap gap-2">
                {ser.map((s) => <Link key={s.slug} to="/series/$slug" params={{ slug: s.slug }} className="chip">Series · {s.name}</Link>)}
                {chars.map((c) => <Link key={c.slug} to="/character/$slug" params={{ slug: c.slug }} className="chip">Character · {c.name}</Link>)}
              </div>
            )}
            <SectionHeading title={`${arts.length} artworks`} />
            <MasonryGrid items={arts} />
          </>
        )}
      </div>
    </main>
  );
}
