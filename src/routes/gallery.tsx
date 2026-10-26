import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getArtworks, series, characters, tags, type Filters } from "@/data";
import { MasonryGrid } from "@/components/art";
import { Chip, EmptyState, PageHero, SkeletonTile } from "@/components/kit";
import { SearchPill } from "@/components/SearchPill";
import { pageMeta } from "@/lib/site";

type O = string | undefined;
type GallerySearch = { q?: O; type?: O; series?: O; character?: O; tag?: O; orientation?: O; resolution?: O; sort?: O };
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/gallery")({
  validateSearch: (s: Record<string, unknown>): GallerySearch => ({
    q: str(s["q"]), type: str(s["type"]), series: str(s["series"]), character: str(s["character"]),
    tag: str(s["tag"]), orientation: str(s["orientation"]), resolution: str(s["resolution"]), sort: str(s["sort"]),
  }),
  head: () => pageMeta({ title: "Gallery", description: "Explore the full Artsstory collection: filter anime art by series, character, tag, orientation and resolution.", path: "/gallery" }),
  component: GalleryPage,
});

const PAGE = 12;

export function toFilters(s: GallerySearch): Filters {
  const pick = <T extends string>(v: string | undefined, ok: readonly T[]) => (ok.includes(v as T) ? (v as T) : undefined);
  return {
    q: s.q, series: s.series, character: s.character, tag: s.tag,
    type: pick(s.type, ["image", "video"] as const),
    orientation: pick(s.orientation, ["portrait", "landscape", "square"] as const),
    resolution: pick(s.resolution, ["4K", "HD"] as const),
    sort: pick(s.sort, ["latest", "popular", "liked"] as const),
  };
}

function Select({ label, value, onChange, options }: { label: string; value?: string | undefined; onChange: (v?: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} className={`chip appearance-none pr-8 ${value ? "chip-active" : ""}`}>
        <option value="">{label}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▾</span>
    </label>
  );
}

function GalleryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/gallery" });
  const filters = toFilters(search);
  const set = (patch: Partial<GallerySearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);
  const setQuery = (q: string, now = false) => {
    clearTimeout(typing.current);
    const apply = () => set({ q: q.trim() || undefined });
    if (now) apply(); else typing.current = setTimeout(apply, 250);
  };
  useEffect(() => () => clearTimeout(typing.current), []);

  const [limit, setLimit] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const key = JSON.stringify(filters);
  useEffect(() => setLimit(PAGE), [key]);
  const { items, nextCursor, total } = getArtworks({ cursor: 0, limit, filters });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || nextCursor === null) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !loading) {
        setLoading(true);
        setTimeout(() => { setLimit((l) => l + PAGE); setLoading(false); }, 500);
      }
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [nextCursor, loading]);

  const active = Object.entries(search).filter(([k, v]) => v && k !== "sort").length;

  return (
    <main>
      <PageHero eyebrow={`${total} artworks`} title="Our Magical" accent="Gallery">Filter by world, face or feeling. Everything here is hand-picked and credited.</PageHero>
      <div className="container-page">
        <div className="sticky top-16 z-30 -mx-4 bg-background/85 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              <Chip active={!filters.type} onClick={() => set({ type: undefined })}>All</Chip>
              <Chip active={filters.type === "image"} onClick={() => set({ type: "image" })}>Images</Chip>
              <Chip active={filters.type === "video"} onClick={() => set({ type: "video" })}>Videos</Chip>
            </div>
            <SearchPill initial={search.q ?? ""} className="lg:w-80" onQuery={(q) => setQuery(q)} onSubmitQuery={(q) => setQuery(q, true)} />
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            <Select label="Series" value={search.series} onChange={(v) => set({ series: v })} options={series.map((s) => ({ value: s.slug, label: s.name }))} />
            <Select label="Character" value={search.character} onChange={(v) => set({ character: v })} options={characters.map((c) => ({ value: c.slug, label: c.name }))} />
            <Select label="Tag" value={search.tag} onChange={(v) => set({ tag: v })} options={tags.map((t) => ({ value: t.slug, label: `#${t.name}` }))} />
            <Select label="Orientation" value={search.orientation} onChange={(v) => set({ orientation: v })} options={[{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }, { value: "square", label: "Square" }]} />
            <Select label="Resolution" value={search.resolution} onChange={(v) => set({ resolution: v })} options={[{ value: "4K", label: "4K" }, { value: "HD", label: "HD" }]} />
            <Select label="Sort: Latest" value={search.sort} onChange={(v) => set({ sort: v })} options={[{ value: "popular", label: "Popular" }, { value: "liked", label: "Most liked" }, { value: "latest", label: "Latest" }]} />
            {active > 0 && <button className="chip text-primary" onClick={() => navigate({ search: {}, replace: true })}>Clear ({active})</button>}
          </div>
        </div>

        <div className="mt-6">
          {items.length === 0 ? (
            <EmptyState title="No magic found">Try removing a filter or searching for something else.<div className="mt-4"><button className="btn-ghost" onClick={() => navigate({ search: {} })}>Reset filters</button></div></EmptyState>
          ) : (
            <>
              <MasonryGrid items={items} />
              {loading && <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">{[0.8, 1.2, 1, 0.7].map((r, i) => <SkeletonTile key={i} ratio={r} />)}</div>}
              <div ref={sentinel} className="h-4" />
              {nextCursor === null && total > PAGE && <p className="font-script py-10 text-center text-3xl text-primary">You've seen it all ✿</p>}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
