import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Film,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  User,
  Tag,
  Compass,
  ChevronDown,
  X,
} from "lucide-react";
import { getArtworks, series, characters, tags, type Filters } from "@/data";
import { MasonryGrid } from "@/components/art";
import { EmptyState, PageHero, SkeletonTile } from "@/components/kit";
import { SearchPill } from "@/components/SearchPill";
import { pageMeta } from "@/lib/site";
import { cn } from "@/lib/utils";

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

function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  clearable = true,
}: {
  label: string;
  value?: string | undefined;
  onChange: (v?: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ComponentType<{ className?: string }>;
  clearable?: boolean;
}) {
  const selected = options.find((o) => o.value === value);
  const isActive = Boolean(value);

  return (
    <div className="relative inline-flex items-center shrink-0">
      <label
        className={cn(
          "group relative inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all select-none",
          isActive
            ? "border-primary bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/30"
            : "border-border/80 bg-card/80 text-foreground/85 hover:border-border hover:bg-card hover:text-foreground"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-colors",
              isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}
          />
        )}
        <span className="truncate max-w-[130px]">
          {selected ? selected.label : label}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-y-[1px]",
            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
        >
          <option value="" className="bg-popover text-popover-foreground">
            {label}: All
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-popover text-popover-foreground">
              {o.label}
            </option>
          ))}
        </select>
      </label>
      {clearable && isActive && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          aria-label={`Clear ${label} filter`}
          className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
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
        <div className="sticky top-16 z-30 -mx-4 border-b border-border/80 bg-background/98 px-4 py-3.5 backdrop-blur-2xl md:-mx-8 md:px-8 shadow-sm transition-all">
          {/* Main Controls Row: Segmented Type Switcher + Search + Sort & Clear */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            {/* Segmented Media Switcher */}
            <div className="inline-flex h-11 items-center rounded-full border border-border/80 bg-card/60 p-1 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => set({ type: undefined })}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-all select-none",
                  !filters.type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>All</span>
              </button>
              <button
                type="button"
                onClick={() => set({ type: "image" })}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-all select-none",
                  filters.type === "image"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Images</span>
              </button>
              <button
                type="button"
                onClick={() => set({ type: "video" })}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-all select-none",
                  filters.type === "video"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Film className="h-3.5 w-3.5" />
                <span>Videos</span>
              </button>
            </div>

            {/* Responsive Search Input - fills and balances the center space */}
            <div className="flex-1 sm:mx-3 min-w-[200px] max-w-2xl">
              <SearchPill
                initial={search.q ?? ""}
                className="w-full"
                onQuery={(q) => setQuery(q)}
                onSubmitQuery={(q) => setQuery(q, true)}
              />
            </div>

            {/* Sort & Reset Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <FilterSelect
                label="Sort"
                value={search.sort}
                onChange={(v) => set({ sort: v })}
                options={[
                  { value: "latest", label: "Sort: Latest" },
                  { value: "popular", label: "Sort: Popular" },
                  { value: "liked", label: "Sort: Most liked" },
                ]}
                icon={ArrowUpDown}
                clearable={false}
              />
              {active > 0 && (
                <button
                  type="button"
                  onClick={() => navigate({ search: {}, replace: true })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary hover:bg-primary/20 transition-all select-none"
                  title="Clear all active filters"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset ({active})</span>
                </button>
              )}
            </div>
          </div>

          {/* Secondary Taxonomy Filters Row */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0 pl-1 mr-0.5 select-none">
              <SlidersHorizontal className="h-3 w-3 text-primary" />
              <span>Filters:</span>
            </span>
            <FilterSelect label="Series" value={search.series} onChange={(v) => set({ series: v })} options={series.map((s) => ({ value: s.slug, label: s.name }))} icon={Layers} />
            <FilterSelect label="Character" value={search.character} onChange={(v) => set({ character: v })} options={characters.map((c) => ({ value: c.slug, label: c.name }))} icon={User} />
            <FilterSelect label="Tag" value={search.tag} onChange={(v) => set({ tag: v })} options={tags.map((t) => ({ value: t.slug, label: `#${t.name}` }))} icon={Tag} />
            <FilterSelect label="Orientation" value={search.orientation} onChange={(v) => set({ orientation: v })} options={[{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }, { value: "square", label: "Square" }]} icon={Compass} />
            <FilterSelect label="Resolution" value={search.resolution} onChange={(v) => set({ resolution: v })} options={[{ value: "4K", label: "4K" }, { value: "HD", label: "HD" }]} icon={Sparkles} />
            <span className="ml-auto hidden text-xs text-muted-foreground sm:inline-block shrink-0 pr-1">
              {total} artworks
            </span>
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
