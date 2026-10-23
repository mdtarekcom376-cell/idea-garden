import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { artworks, characters, collections, series, queryArtworks, getSeries } from "@/data";
import { MasonryGrid } from "@/components/art";
import { SectionHeading, FadeUp, ease } from "@/components/kit";
import { Rail, SeriesCard, CharacterCard, CollectionCard } from "@/components/rails";
import { NewsletterForm } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artsstory — A world of magical anime moments" },
      { name: "description", content: "A curated gallery of HD and 4K anime art and videos. Browse, search, like and save magical moments." },
      { property: "og:title", content: "Artsstory — A world of magical anime moments" },
      { property: "og:description", content: "Curated HD & 4K anime art gallery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const words = ["Magical", "Dreamy", "Colorful"];
const slides = artworks.filter((a) => a.featured && a.aspect < 1.05).slice(0, 4);
const SLIDE_MS = 6000;

function Hero() {
  const [w, setW] = useState(0);
  const [s, setS] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]);
  const yText = useTransform(scrollY, [0, 600], [0, -40]);
  useEffect(() => { const t = setInterval(() => setW((v) => (v + 1) % words.length), 2600); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setTimeout(() => setS((v) => (v + 1) % slides.length), SLIDE_MS); return () => clearTimeout(t); }, [s]);
  const cur = slides[s]!;

  return (
    <section className="bg-hero relative overflow-hidden pt-24 md:pt-28">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="container-page relative grid items-center gap-12 pb-16 md:grid-cols-2 md:pb-24">
        <motion.div style={{ y: yText }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.6 }} className="text-xs uppercase tracking-[0.3em] text-primary">Curated anime art · HD & 4K</motion.p>
          <h1 className="mt-4 text-[clamp(2.75rem,7vw,6rem)] leading-[0.95]">
            {["A", "World", "of"].map((t, i) => (
              <motion.span key={t} className="mr-[0.25em] inline-block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.7, delay: 0.1 + i * 0.1 }}>{t}</motion.span>
            ))}
            <br />
            <span className="sr-only">Magical</span>
            <span aria-hidden className="relative inline-block min-w-[5ch] italic text-primary [perspective:600px]">
              <AnimatePresence mode="wait">
                <motion.span key={words[w]} className="inline-block" initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: -90, opacity: 0 }} transition={{ ease, duration: 0.5 }}>{words[w]}</motion.span>
              </AnimatePresence>
            </span>{" "}
            <motion.span className="inline-block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.7, delay: 0.5 }}>Moments</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.7, delay: 0.6 }} className="mt-6 max-w-md text-muted-foreground">
            Hand-picked illustrations and cinematic clips from the worlds you love — quality over quantity, always credited.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ease, duration: 0.7, delay: 0.75 }} className="mt-8 flex flex-wrap gap-3">
            <Link to="/gallery" className="btn-primary btn-shine btn-arrow group px-7">Explore the gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            <Link to="/collections" className="btn-ghost">Collections</Link>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md pr-10 md:pr-14">
          <motion.div style={{ y }} className="relative aspect-[4/5]">
            <AnimatePresence>
              <motion.div key={cur.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease }}>
                <Link to="/art/$slug" params={{ slug: cur.slug }} aria-label={`View ${cur.title}`}>
                  <img src={cur.src} alt={cur.title} className="h-full w-full rounded-[2rem] object-cover shadow-soft" />
                </Link>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={cur.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-script absolute -bottom-7 -left-3 rotate-[-6deg] text-3xl text-primary">"{cur.title}"</motion.p>
            </AnimatePresence>
          </motion.div>
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2" role="tablist" aria-label="Featured slides">
            {slides.map((sl, i) => (
              <div key={sl.id} className="flex flex-col items-center gap-2">
                <button role="tab" aria-selected={i === s} onClick={() => setS(i)} aria-label={`Slide ${i + 1}: ${sl.title}`} className={`grid h-9 w-9 place-items-center text-xs tabular-nums transition-colors ${i === s ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground"}`}>0{i + 1}</button>
                {i === s && (
                  <div className="h-12 w-px overflow-hidden bg-border">
                    <motion.div key={s} className="h-full w-full origin-top bg-primary" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const featured = artworks.filter((a) => a.featured);
  const trending = queryArtworks({ sort: "popular" }).slice(0, 8);
  const latest = queryArtworks({ sort: "latest" }).slice(0, 8);
  const editorial = artworks.slice(8, 11);
  return (
    <main>
      <Hero />

      <section className="container-page pt-16">
        <SectionHeading eyebrow="Hand-picked" title="Featured" accent="Artworks" action={<Link to="/gallery" className="group inline-flex items-center gap-1 text-sm text-primary">View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>} />
        <MasonryGrid items={featured} />
      </section>

      <section className="container-page pt-20">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.4fr] md:gap-14">
          <FadeUp>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">The collection</p>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[1]">Our Magical <em className="text-primary">Gallery</em></h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Every piece is chosen by hand for colour, mood and craft. From sakura kingdoms to neon cities, we gather the moments that make you stop scrolling.
            </p>
            <p className="font-script mt-4 text-3xl text-primary">"quality over quantity"</p>
            <Link to="/gallery" className="btn-primary btn-shine btn-arrow mt-6">Browse {artworks.length} artworks <ArrowRight className="h-4 w-4" /></Link>
          </FadeUp>
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {editorial.map((a, i) => (
              <FadeUp key={a.id} delay={i * 0.1} className={i === 0 ? "row-span-2" : ""}>
                <Link to="/art/$slug" params={{ slug: a.slug }} className="group block h-full overflow-hidden rounded-3xl shadow-soft">
                  <img src={a.src} alt={a.title} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 ? "h-full min-h-72" : "aspect-square"}`} />
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pt-20">
        <SectionHeading eyebrow="Most viewed" title="Trending" accent="now" action={<Link to="/gallery" search={{ sort: "popular" }} className="text-sm text-primary">See all →</Link>} />
        <MasonryGrid items={trending} />
      </section>

      <section className="container-page pt-20">
        <SectionHeading eyebrow="Worlds" title="Series" action={<Link to="/series" className="text-sm text-primary">All series →</Link>} />
        <Rail>{series.map((s, i) => <SeriesCard key={s.slug} s={s} i={i} />)}</Rail>
      </section>

      <section className="container-page pt-20">
        <SectionHeading eyebrow="Faces" title="Characters" action={<Link to="/characters" className="text-sm text-primary">All characters →</Link>} />
        <Rail>{characters.map((c, i) => <CharacterCard key={c.slug} c={c} i={i} />)}</Rail>
      </section>

      <section className="container-page pt-20">
        <SectionHeading eyebrow="Curated sets" title="Collections" action={<Link to="/collections" className="text-sm text-primary">All collections →</Link>} />
        <Rail>{collections.map((c, i) => <CollectionCard key={c.slug} c={c} i={i} />)}</Rail>
      </section>

      <section className="container-page pt-20">
        <SectionHeading eyebrow="Fresh" title="Latest" accent="uploads" action={<Link to="/gallery" search={{ sort: "latest" }} className="text-sm text-primary">See all →</Link>} />
        <MasonryGrid items={latest} />
      </section>

      <section className="container-page pt-20">
        <FadeUp className="bg-hero relative overflow-hidden rounded-[2rem] p-8 shadow-soft md:p-14">
          <div className="aurora pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight">New magic, <em className="text-primary">every week</em></h2>
              <p className="mt-2 text-muted-foreground">One gentle email with our latest picks from {getSeries("petal-guardians")?.name} and beyond.</p>
            </div>
            <NewsletterForm />
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
