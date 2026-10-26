import { createFileRoute } from "@tanstack/react-router";
import { series } from "@/data";
import { PageHero } from "@/components/kit";
import { SeriesCard } from "@/components/rails";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/series/")({
  head: () => pageMeta({ title: "Series", description: "Browse every anime world on Artsstory, from Petal Guardians to Dragon Peaks.", path: "/series" }),
  component: () => (
    <main>
      <PageHero eyebrow={`${series.length} worlds`} title="Every" accent="Series">Step into a world and see every piece we've gathered from it.</PageHero>
      <div className="container-page grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {series.map((s, i) => <SeriesCard key={s.slug} s={s} i={i} wide />)}
      </div>
    </main>
  ),
});
