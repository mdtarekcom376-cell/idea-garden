import { createFileRoute } from "@tanstack/react-router";
import { collections } from "@/data";
import { PageHero } from "@/components/kit";
import { CollectionCard } from "@/components/rails";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/collections/")({
  head: () => pageMeta({ title: "Collections", description: "Curated sets of anime art: Sakura Season, Cyberpunk Nights, Above the Clouds and more.", path: "/collections" }),
  component: () => (
    <main>
      <PageHero eyebrow={`${collections.length} curated sets`} title="Our" accent="Collections">Moods and seasons, gathered into small exhibitions.</PageHero>
      <div className="container-page grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => <CollectionCard key={c.slug} c={c} i={i} wide />)}
      </div>
    </main>
  ),
});
