import { createFileRoute } from "@tanstack/react-router";
import { characters } from "@/data";
import { PageHero } from "@/components/kit";
import { CharacterCard } from "@/components/rails";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Characters — Artsstory" },
      { name: "description", content: "Meet every character featured across the Artsstory anime gallery." },
      { property: "og:title", content: "Characters — Artsstory" },
      { property: "og:description", content: "Every character in our gallery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <main>
      <PageHero eyebrow={`${characters.length} characters`} title="The" accent="Characters">Heroes, spirits and quiet dreamers from every world.</PageHero>
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-8 pt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {characters.map((c, i) => <CharacterCard key={c.slug} c={c} i={i} wide />)}
      </div>
    </main>
  ),
});
