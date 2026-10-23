import { createFileRoute } from "@tanstack/react-router";
import { collections } from "@/data";
import { PageHero } from "@/components/kit";
import { CollectionCard } from "@/components/rails";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Artsstory" },
      { name: "description", content: "Curated sets of anime art: Sakura Season, Cyberpunk Nights, Above the Clouds and more." },
      { property: "og:title", content: "Collections — Artsstory" },
      { property: "og:description", content: "Curated sets of anime art." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <main>
      <PageHero eyebrow={`${collections.length} curated sets`} title="Our" accent="Collections">Moods and seasons, gathered into small exhibitions.</PageHero>
      <div className="container-page grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => <CollectionCard key={c.slug} c={c} i={i} wide />)}
      </div>
    </main>
  ),
});
