import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { type Character, type Collection, type Series, coverOfCharacter, countBySeries, getArtworksByIds, getSeries } from "@/data";
import { ease } from "@/components/kit";

export function Rail({ children }: { children: React.ReactNode }) {
  return <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">{children}</div>;
}

export function SeriesCard({ s, i = 0, wide }: { s: Series; i?: number; wide?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease, delay: (i % 4) * 0.06 }} className={wide ? "" : "w-64 shrink-0 snap-start sm:w-72"}>
      <Link to="/series/$slug" params={{ slug: s.slug }} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
        <img src={s.cover} alt={s.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-overlay/80 via-overlay/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/80">{countBySeries(s.slug)} artworks</p>
          <h3 className="mt-1 text-3xl text-primary-foreground">{s.name}</h3>
        </div>
      </Link>
    </motion.div>
  );
}

export function CharacterCard({ c, i = 0, wide }: { c: Character; i?: number; wide?: boolean }) {
  const cover = coverOfCharacter(c.slug);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease, delay: (i % 6) * 0.05 }} className={wide ? "" : "w-36 shrink-0 snap-start sm:w-40"}>
      <Link to="/character/$slug" params={{ slug: c.slug }} className="group block text-center">
        <div className="mx-auto aspect-square overflow-hidden rounded-full border-4 border-card shadow-soft">
          {cover && <img src={cover.src} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
        </div>
        <p className="font-display mt-3 text-xl group-hover:text-primary">{c.name}</p>
        <p className="text-xs text-muted-foreground">{getSeries(c.series)?.name}</p>
      </Link>
    </motion.div>
  );
}

export function CollectionCard({ c, i = 0, wide }: { c: Collection; i?: number; wide?: boolean }) {
  const arts = getArtworksByIds(c.artworkIds).slice(0, 3);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease, delay: (i % 3) * 0.08 }} className={wide ? "" : "w-72 shrink-0 snap-start sm:w-80"}>
      <Link to="/collections/$slug" params={{ slug: c.slug }} className="group block rounded-3xl border bg-card p-3 shadow-soft">
        <div className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl">
          {arts.map((a, k) => (
            <img key={a.id} src={a.src} alt="" loading="lazy" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${k === 0 ? "col-span-2 row-span-2" : ""}`} />
          ))}
        </div>
        <div className="px-2 pb-1 pt-3">
          <h3 className="text-2xl group-hover:text-primary">{c.name}</h3>
          <p className="text-sm text-muted-foreground">{c.description} · {c.artworkIds.length} pieces</p>
        </div>
      </Link>
    </motion.div>
  );
}
