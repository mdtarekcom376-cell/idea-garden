import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState, useCallback } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { artworks, characters, collections, series, queryArtworks, getSeries } from "@/data";
import { MasonryGrid } from "@/components/art";
import { SectionHeading, FadeUp, ease } from "@/components/kit";
import { Rail, SeriesCard, CharacterCard, CollectionCard } from "@/components/rails";
import { NewsletterForm } from "@/components/SiteHeader";
import { pageMeta } from "@/lib/site";
import heroBgClean from "@/assets/hero-bg-clean.jpg";

export const Route = createFileRoute("/")({
  head: () => pageMeta({ title: "Artsstory — A world of magical anime moments", path: "/" }),
  component: Index,
});

const HERO_SLIDES = [
  {
    id: "madoka",
    num: "01",
    tagLine: ["MAGICAL GIRLS", "ART", "DREAMS"],
    titlePrefix: "A World",
    titleAccent: "Magical",
    titleSuffix: "Moments",
    desc: "Explore a collection of beautiful illustrations and moments from the magical world of Madoka.",
    quote: "Even\nsmall hopes\ncan change\nthe world.",
    btnText: "EXPLORE GALLERY",
    btnTo: "/gallery",
    bg: heroBgClean,
  },
  {
    id: "petal-guardians",
    num: "02",
    tagLine: ["PETAL GUARDIANS", "SAKURA", "KINGDOM"],
    titlePrefix: "Kingdom",
    titleAccent: "Endless",
    titleSuffix: "Petals",
    desc: "Magical guardians who protect an ancient realm where cherry blossoms drift through eternal twilight.",
    quote: "Where blossoms fall,\nmagic begins.",
    btnText: "EXPLORE SERIES",
    btnTo: "/series/petal-guardians",
    bg: artworks[0]?.src || heroBgClean,
  },
  {
    id: "starlight-express",
    num: "03",
    tagLine: ["STARLIGHT EXPRESS", "GALAXY", "COSMOS"],
    titlePrefix: "Journey on the",
    titleAccent: "Starlight",
    titleSuffix: "Express",
    desc: "A celestial train gliding across mirror lakes beneath infinite starry nebulas and glowing auroras.",
    quote: "Follow the stars\nacross the lake.",
    btnText: "VIEW COLLECTION",
    btnTo: "/collections/starlit-waters",
    bg: artworks[4]?.src || heroBgClean,
  },
  {
    id: "kaze-city",
    num: "04",
    tagLine: ["KAZE CITY", "CYBERPUNK", "NEON"],
    titlePrefix: "Reflections in",
    titleAccent: "Neon",
    titleSuffix: "Rain",
    desc: "Neon-soaked rooftops, solitary couriers and midnight wanderers in the gleaming city of tomorrow.",
    quote: "Every raindrop\nholds a dream.",
    btnText: "EXPLORE CITY",
    btnTo: "/series/kaze-city",
    bg: artworks[1]?.src || heroBgClean,
  },
];

function Hero() {
  const [s, setS] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cur = HERO_SLIDES[s]!;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setMouse({ x, y });
  }, []);

  const handleBurst = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent("artsstory:burst", {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, count: 24 },
      })
    );
  };

  const scrollToContent = () => {
    const target = document.getElementById("featured-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight - 80, behavior: "smooth" });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] md:min-h-screen flex flex-col justify-between overflow-hidden bg-background pt-24 pb-12 select-none"
    >
      {/* FULL BLEED BACKGROUND LAYER WITH PARALLAX */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.div
            key={cur.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: 1,
              scale: 1.04,
              x: mouse.x * -10,
              y: mouse.y * -8,
            }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{
              opacity: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
              x: { duration: 0.3, ease: "easeOut" },
              y: { duration: 0.3, ease: "easeOut" },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={cur.bg}
              alt={cur.titleAccent}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_30%] md:object-center select-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Atmospheric Light Overlays */}
        {/* Left read gradient (ensures 100% typography contrast on all screens) */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-transparent md:max-w-3xl" />
        {/* Soft bottom blend to seamlessly merge into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {/* Top subtle fade for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/70 to-transparent" />
      </div>

      {/* FOREGROUND HERO CONTENT CONTAINER */}
      <div className="container-page relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 md:py-12">
        {/* Left Column: Eyebrow, Title, Subtitle, CTA Button */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Category Breadcrumb/Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-foreground/80 drop-shadow-sm">
                <span>{cur.tagLine[0]}</span>
                <span className="text-pink-500/80 font-bold text-[10px]">✕</span>
                <span className="text-pink-600 dark:text-pink-400 font-script text-xl normal-case tracking-normal px-0.5">
                  {cur.tagLine[1]}
                </span>
                <span className="text-pink-500/80 font-bold text-[10px]">✕</span>
                <span>{cur.tagLine[2]}</span>
              </div>

              {/* Main Display Headline */}
              <h1 className="mt-4 font-display text-[clamp(2.75rem,6.8vw,5.75rem)] font-medium leading-[0.95] tracking-tight text-foreground drop-shadow-sm">
                <span>{cur.titlePrefix}</span> <br />
                <span>of </span>
                <span className="font-display italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 drop-shadow-sm">
                  {cur.titleAccent}
                </span> <br />
                <span>{cur.titleSuffix}</span>
              </h1>

              {/* Description Paragraph */}
              <p className="mt-5 max-w-md text-sm md:text-base leading-relaxed text-muted-foreground/90 font-normal">
                {cur.desc}
              </p>

              {/* High-Tech Explore Gallery CTA Button */}
              <div className="mt-8 flex items-center gap-4">
                <Link
                  to={cur.btnTo}
                  onClick={handleBurst}
                  className="relative group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-white bg-gradient-to-r from-[#e63973] via-[#ff6b9d] to-[#e63973] bg-[length:200%_auto] shadow-[0_10px_25px_rgba(230,57,115,0.45)] hover:shadow-[0_16px_38px_rgba(230,57,115,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">{cur.btnText}</span>
                  <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-in-out" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center / Right Spacer for the full bleed characters to shine */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />
      </div>

      {/* RIGHT SIDE CALLIGRAPHY QUOTE */}
      <div className="hidden lg:block absolute right-24 xl:right-32 bottom-20 xl:bottom-28 select-none pointer-events-none z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={cur.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="font-script text-3xl xl:text-4xl leading-[1.18] text-pink-700/85 dark:text-pink-300/90 rotate-[-2.5deg] drop-shadow-[0_2px_14px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] whitespace-pre-line"
          >
            {cur.quote}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* RIGHT EDGE VERTICAL SLIDE INDICATORS (01, 02, 03, 04, DOWN ARROW) */}
      <div
        className="absolute right-4 sm:right-8 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20 select-none"
        role="tablist"
        aria-label="Hero visual slides"
      >
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={i === s}
            onClick={() => setS(i)}
            aria-label={`Slide ${slide.num}: ${slide.titleAccent}`}
            className={`group relative flex items-center justify-center text-xs tabular-nums transition-all ${
              i === s
                ? "font-bold text-foreground scale-110"
                : "font-medium text-muted-foreground/60 hover:text-foreground hover:scale-105"
            }`}
          >
            <span>{slide.num}</span>
            {i === s && (
              <motion.span
                layoutId="heroSlideActiveIndicator"
                className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
          </button>
        ))}

        {/* Down Arrow / Scroll to Content */}
        <button
          onClick={scrollToContent}
          aria-label="Scroll to content"
          className="mt-3 p-1 text-muted-foreground/70 hover:text-foreground transition-all duration-300 hover:translate-y-1"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* BOTTOM-LEFT NOTCH / CURVED SHELF (Matches the curved cutout in the user mockup) */}
      <div className="absolute -bottom-px left-0 z-20 hidden md:block pointer-events-none">
        <div className="flex items-end">
          <div className="h-10 w-72 lg:w-84 bg-background rounded-tr-3xl border-t border-r border-border/30 shadow-sm flex items-center px-6">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground/80 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Featured Exhibition
            </span>
          </div>
          <svg className="w-7 h-10 fill-background" viewBox="0 0 28 40">
            <path d="M0 40 L0 0 C 0 22 14 40 28 40 Z" />
          </svg>
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

      <section id="featured-section" className="container-page pt-16">
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
