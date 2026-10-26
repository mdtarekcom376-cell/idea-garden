import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeUp, PageHero, SectionHeading } from "@/components/kit";
import { artworks } from "@/data";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => pageMeta({ title: "About", description: "Artsstory is a small team curating high-quality, credited anime art. Our story, mission and team.", path: "/about" }),
  component: About,
});

const team = [
  { name: "Mirei", role: "Founder & curator", art: artworks[0]! },
  { name: "Sora", role: "Editor · cities & night", art: artworks[1]! },
  { name: "Aoi", role: "Editor · scenery & skies", art: artworks[2]! },
];

function About() {
  return (
    <main>
      <PageHero eyebrow="Our story" title="About" accent="Artsstory">A small, devoted team publishing only the finest anime illustrations and clips — in HD and 4K, always credited.</PageHero>
      <section className="container-page grid gap-10 pt-14 md:grid-cols-2">
        <FadeUp>
          <h2 className="text-4xl">The story</h2>
          <p className="mt-4 text-muted-foreground">Artsstory began as a shared folder of wallpapers between friends. It grew into a gallery we wished existed: calm, beautiful, and respectful of the artists behind every piece.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="text-4xl">Our mission</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>✿ Quality over quantity — every piece is hand-picked.</li>
            <li>✿ Credit always — artist name and source on every artwork.</li>
            <li>✿ Fast and calm — no clutter, no noise, just art.</li>
          </ul>
        </FadeUp>
      </section>
      <section className="container-page pt-20">
        <SectionHeading title="The" accent="team" />
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1} className="rounded-3xl border bg-card p-6 text-center shadow-soft">
              <img src={t.art.src} alt="" loading="lazy" className="mx-auto h-28 w-28 rounded-full object-cover" />
              <h3 className="mt-4 text-3xl">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </FadeUp>
          ))}
        </div>
        <p className="mt-10 text-center text-muted-foreground">Own a piece we've shared? <Link to="/dmca" className="text-primary hover:underline">Request a takedown</Link> or <Link to="/contact" className="text-primary hover:underline">say hello</Link>.</p>
        <p className="font-script mt-6 text-center text-4xl text-primary">— The Artsstory team</p>
      </section>
    </main>
  );
}
