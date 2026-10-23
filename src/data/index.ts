import i1 from "@/assets/art-1.jpg";
import i2 from "@/assets/art-2.jpg";
import i3 from "@/assets/art-3.jpg";
import i4 from "@/assets/art-4.jpg";
import i6 from "@/assets/art-6.jpg";
import i7 from "@/assets/art-7.jpg";
import i8 from "@/assets/art-8.jpg";
import i9 from "@/assets/art-9.jpg";
import i10 from "@/assets/art-10.jpg";
import i11 from "@/assets/art-11.jpg";
import i12 from "@/assets/art-12.jpg";

/* ---------- Types (mirror the planned DB schema) ---------- */
export type MediaType = "image" | "video";
export type Status = "draft" | "scheduled" | "published" | "archived";
export type Series = { id: string; slug: string; name: string; description: string; cover: string };
export type Character = { id: string; slug: string; name: string; series: string; bio: string };
export type Tag = { id: string; slug: string; name: string };
export type Collection = { id: string; slug: string; name: string; description: string; artworkIds: string[] };
export type Artwork = {
  id: string; slug: string; type: MediaType; title: string; description: string;
  series: string; characters: string[]; tags: string[];
  credit_name: string; credit_url: string;
  width: number; height: number; aspect: number; dominant_color: string; blurhash: string;
  status: Status; featured: boolean; view_count: number; like_count: number; created_at: string;
  src: string;
  /** Present when type === "video". Sources are listed so HLS can be added later without UI changes. */
  video?: VideoMedia;
};
export type VideoSource = { label: "Auto" | "1080p" | "720p" | "480p"; src: string; type: "video/mp4" | "application/x-mpegURL" };
export type VideoMedia = { duration: number; poster: string; preview: string; sources: VideoSource[]; hls?: string };

const IMG = [
  { src: i1, w: 1024, h: 1280, c: "#f6c6d8" }, { src: i2, w: 1280, h: 832, c: "#3b1d5e" },
  { src: i3, w: 832, h: 1280, c: "#f3c79a" }, { src: i4, w: 1024, h: 1024, c: "#6f6ac2" },
  { src: i6, w: 1280, h: 768, c: "#2a2f7a" }, { src: i7, w: 1024, h: 1280, c: "#6b4a3a" },
  { src: i8, w: 1024, h: 1024, c: "#b8402c" }, { src: i9, w: 1280, h: 832, c: "#f1d3e2" },
  { src: i10, w: 832, h: 1216, c: "#6e8a55" }, { src: i11, w: 1024, h: 1024, c: "#5fc9d9" },
  { src: i12, w: 1024, h: 1280, c: "#e7b77f" },
];

/* Placeholder public sample clips — swap for real MP4/HLS from storage later. */
const SAMPLE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const CLIPS = [
  { file: "ForBiggerBlazes.mp4", duration: 15 }, { file: "ForBiggerEscapes.mp4", duration: 15 },
  { file: "ForBiggerFun.mp4", duration: 60 }, { file: "ForBiggerJoyrides.mp4", duration: 15 },
  { file: "ForBiggerMeltdowns.mp4", duration: 15 }, { file: "ForBiggerEscapes.mp4", duration: 15 },
];
const videoFor = (i: number, poster: string): VideoMedia => {
  const c = CLIPS[i % CLIPS.length]!; const src = SAMPLE + c.file;
  return { duration: c.duration, poster, preview: src, sources: [
    { label: "Auto", src, type: "video/mp4" }, { label: "720p", src, type: "video/mp4" }, { label: "480p", src, type: "video/mp4" },
  ] };
};
let videoCount = 0;

/* ---------- Taxonomy ---------- */
const S = (slug: string, name: string, description: string, img: number): Series => ({ id: slug, slug, name, description, cover: IMG[img]!.src });
export const series: Series[] = [
  S("petal-guardians", "Petal Guardians", "Magical guardians who protect a kingdom where cherry blossoms never fall.", 0),
  S("kaze-city", "Kaze City", "Neon-soaked streets and rainy nights in a city that never sleeps.", 1),
  S("skybound", "Skybound", "Floating islands, airships and the dreamers who sail between them.", 2),
  S("spirit-blade", "Spirit Blade", "A wandering swordsman and the moonlit fox spirits who guide him.", 3),
  S("starlight-express", "Starlight Express", "A train that runs across a mirror lake beneath the galaxy.", 4),
  S("lavender-academy", "Lavender Academy", "A cozy school of magic hidden inside an endless library.", 5),
  S("shrine-tales", "Shrine Tales", "Lantern-lit shrines, autumn leaves and quiet legends.", 6),
  S("dragon-peaks", "Dragon Peaks", "Ancient dragons soaring over misty mountain temples.", 7),
];

const C = (slug: string, name: string, s: string, bio: string): Character => ({ id: slug, slug, name, series: s, bio });
export const characters: Character[] = [
  C("hana", "Hana", "petal-guardians", "Keeper of the sakura wand."),
  C("momo", "Momo", "petal-guardians", "A cheerful apprentice guardian."),
  C("sakuya", "Sakuya", "petal-guardians", "The quiet queen of blossoms."),
  C("rin", "Rin", "kaze-city", "A courier who loves the rain."),
  C("kaito", "Kaito", "kaze-city", "Hacker of the neon skyline."),
  C("kiko", "Kiko", "skybound", "A girl who dreams of the far isles."),
  C("captain-aoi", "Captain Aoi", "skybound", "Pilot of the airship Hibari."),
  C("ren", "Ren", "spirit-blade", "A swordsman bound to the moon."),
  C("kohaku", "Kohaku", "spirit-blade", "The nine-tailed silver fox."),
  C("yume", "Yume", "starlight-express", "The train's mysterious conductor."),
  C("hoshi", "Hoshi", "starlight-express", "A passenger collecting stars."),
  C("lili", "Lili", "lavender-academy", "Top student of spellcraft."),
  C("professor-sage", "Professor Sage", "lavender-academy", "Head librarian and archmage."),
  C("noir", "Noir", "lavender-academy", "Lili's sleepy black cat."),
  C("akane", "Akane", "shrine-tales", "Shrine maiden of the red gates."),
  C("tsubaki", "Tsubaki", "shrine-tales", "A lantern spirit."),
  C("ryu", "Ryu", "dragon-peaks", "The white dragon of dawn."),
  C("mei", "Mei", "dragon-peaks", "A monk who speaks with dragons."),
  C("sylva", "Sylva", "skybound", "Forest spirit of the lower isles."),
  C("marin", "Marin", "starlight-express", "Guardian of the crystal palace under the lake."),
];

const tagNames = ["sakura", "night", "scenery", "fantasy", "magic", "city", "moon", "sunset", "spirits", "cozy", "dragon", "water", "autumn", "neon", "sky"];
export const tags: Tag[] = tagNames.map((n) => ({ id: n, slug: n, name: n }));

/* ---------- Artworks (30) ---------- */
type Seed = [title: string, s: string, chars: string[], tags: string[], img: number, type?: MediaType];
const seeds: Seed[] = [
  ["Sakura Wand", "petal-guardians", ["hana"], ["sakura", "magic", "fantasy"], 0],
  ["Neon Rain", "kaze-city", ["rin"], ["city", "night", "neon"], 1, "video"],
  ["Isles of Dusk", "skybound", ["kiko"], ["scenery", "sunset", "sky"], 2],
  ["Moonlit Foxes", "spirit-blade", ["ren", "kohaku"], ["moon", "spirits", "night"], 3],
  ["Galaxy Line", "starlight-express", ["yume"], ["night", "scenery", "water"], 4, "video"],
  ["The Quiet Spell", "lavender-academy", ["lili", "noir"], ["magic", "cozy"], 5],
  ["Autumn Torii", "shrine-tales", ["akane"], ["autumn", "sunset"], 6],
  ["Dawn Dragon", "dragon-peaks", ["ryu"], ["dragon", "sakura", "sky"], 7],
  ["Firefly Grove", "skybound", ["sylva"], ["fantasy", "spirits", "magic"], 8],
  ["Crystal Depths", "starlight-express", ["marin"], ["water", "fantasy"], 9],
  ["Airship Harbor", "skybound", ["captain-aoi"], ["sky", "sunset", "city"], 10],
  ["Blossom Oath", "petal-guardians", ["sakuya", "hana"], ["sakura", "fantasy"], 0],
  ["Midnight Courier", "kaze-city", ["kaito"], ["neon", "city"], 1],
  ["Cloud Sailor", "skybound", ["kiko", "captain-aoi"], ["sky", "scenery"], 2, "video"],
  ["Silver Tail", "spirit-blade", ["kohaku"], ["spirits", "moon"], 3],
  ["Star Collector", "starlight-express", ["hoshi"], ["night", "sky"], 4],
  ["Library Lights", "lavender-academy", ["professor-sage"], ["cozy", "magic"], 5, "video"],
  ["Lantern Path", "shrine-tales", ["tsubaki"], ["autumn", "spirits"], 6],
  ["Temple in the Mist", "dragon-peaks", ["mei"], ["dragon", "scenery"], 7],
  ["Wishing Woods", "skybound", ["sylva"], ["fantasy", "magic"], 8],
  ["Koi Palace", "starlight-express", ["marin"], ["water", "magic"], 9, "video"],
  ["Golden Departure", "skybound", ["captain-aoi"], ["sunset", "sky"], 10],
  ["Petal Storm", "petal-guardians", ["momo"], ["sakura", "magic"], 0],
  ["Rainy Crossing", "kaze-city", ["rin", "kaito"], ["night", "neon", "water"], 1],
  ["Sunset Watch", "skybound", ["kiko"], ["sunset", "scenery"], 2],
  ["Blade of Moonlight", "spirit-blade", ["ren"], ["moon", "night"], 3, "video"],
  ["Mirror Lake", "starlight-express", ["yume", "hoshi"], ["water", "night"], 4],
  ["Midnight Study", "lavender-academy", ["lili"], ["cozy", "night"], 5],
  ["Red Gate Dusk", "shrine-tales", ["akane", "tsubaki"], ["autumn", "sunset"], 6],
  ["Wings over Peaks", "dragon-peaks", ["ryu", "mei"], ["dragon", "sky"], 7],
];
const artists = [["Mirei", "https://example.com/mirei"], ["Sora K.", "https://example.com/sora"], ["Aoi", "https://example.com/aoi"]] as const;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const artworks: Artwork[] = seeds.map(([title, s, chars, tg, img, type = "image"], i) => {
  const m = IMG[img]!;
  const [cn, cu] = artists[i % 3]!;
  const d = new Date(Date.UTC(2026, 9, 22) - i * 86400000 * 2);
  return {
    id: String(i + 1), slug: slugify(title), type, title,
    description: `${title} — an original illustration from ${series.find((x) => x.slug === s)!.name}.`,
    series: s, characters: chars, tags: tg, credit_name: cn, credit_url: cu,
    width: m.w, height: m.h, aspect: m.w / m.h, dominant_color: m.c, blurhash: "",
    status: "published", featured: i < 8, view_count: 1200 + ((i * 7919) % 9000),
    like_count: 80 + ((i * 3571) % 900), created_at: d.toISOString(), src: m.src,
    ...(type === "video" ? { video: videoFor(videoCount++, m.src) } : {}),
  };
});

export const collections: Collection[] = [
  { id: "1", slug: "sakura-season", name: "Sakura Season", description: "Pink skies and falling petals.", artworkIds: ["1", "8", "12", "23"] },
  { id: "2", slug: "cyberpunk-nights", name: "Cyberpunk Nights", description: "Neon, rain and electric dreams.", artworkIds: ["2", "13", "24"] },
  { id: "3", slug: "above-the-clouds", name: "Above the Clouds", description: "Islands and airships in endless skies.", artworkIds: ["3", "11", "14", "22", "25"] },
  { id: "4", slug: "moon-and-spirits", name: "Moon & Spirits", description: "Quiet nights with mystical companions.", artworkIds: ["4", "15", "26", "18"] },
  { id: "5", slug: "cozy-magic", name: "Cozy Magic", description: "Warm libraries and gentle spells.", artworkIds: ["6", "17", "28", "9"] },
  { id: "6", slug: "starlit-waters", name: "Starlit Waters", description: "Lakes, oceans and galaxies reflected.", artworkIds: ["5", "10", "21", "27", "16"] },
];

/* ---------- Data access (swap these for real API calls later) ---------- */
export type Sort = "latest" | "popular" | "liked";
export type Filters = { q?: string | undefined; type?: MediaType | "all" | undefined; series?: string | undefined; character?: string | undefined; tag?: string | undefined; orientation?: "portrait" | "landscape" | "square" | undefined; resolution?: "4K" | "HD" | undefined; sort?: Sort | undefined };

export const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
export const resolutionOf = (a: Artwork) => (a.width >= 1024 ? "4K" : "HD");
export const orientationOf = (a: Artwork) => (a.aspect > 1.1 ? "landscape" : a.aspect < 0.9 ? "portrait" : "square");

export function queryArtworks(f: Filters = {}): Artwork[] {
  const q = f.q?.trim().toLowerCase();
  let list = artworks.filter((a) => {
    if (a.status !== "published") return false;
    if (f.type && f.type !== "all" && a.type !== f.type) return false;
    if (f.series && a.series !== f.series) return false;
    if (f.character && !a.characters.includes(f.character)) return false;
    if (f.tag && !a.tags.includes(f.tag)) return false;
    if (f.orientation && orientationOf(a) !== f.orientation) return false;
    if (f.resolution && resolutionOf(a) !== f.resolution) return false;
    if (q) {
      const hay = [a.title, getSeries(a.series)?.name ?? "", a.credit_name, ...a.tags, ...a.characters.map((c) => getCharacter(c)?.name ?? "")].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const sort = f.sort ?? "latest";
  list = [...list].sort((a, b) => sort === "popular" ? b.view_count - a.view_count : sort === "liked" ? b.like_count - a.like_count : b.created_at.localeCompare(a.created_at));
  return list;
}

export function getArtworks({ cursor = 0, limit = 12, filters = {} }: { cursor?: number; limit?: number; filters?: Filters } = {}) {
  const all = queryArtworks(filters);
  const items = all.slice(cursor, cursor + limit);
  return { items, nextCursor: cursor + limit < all.length ? cursor + limit : null, total: all.length };
}

export const getArtwork = (slug: string) => artworks.find((a) => a.slug === slug);
export const getArtworksByIds = (ids: string[]) => ids.map((id) => artworks.find((a) => a.id === id)).filter((a): a is Artwork => !!a);
export const getRelated = (a: Artwork, n = 8) =>
  artworks.filter((x) => x.id !== a.id).map((x) => ({ x, s: (x.series === a.series ? 3 : 0) + x.tags.filter((t) => a.tags.includes(t)).length })).sort((p, q) => q.s - p.s).slice(0, n).map((p) => p.x);
export const getSeries = (slug: string) => series.find((s) => s.slug === slug);
export const getCharacter = (slug: string) => characters.find((c) => c.slug === slug);
export const getTag = (slug: string) => tags.find((t) => t.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const charactersOf = (seriesSlug: string) => characters.filter((c) => c.series === seriesSlug);
export const coverOfCharacter = (slug: string) => artworks.find((a) => a.characters.includes(slug));
export const countBySeries = (slug: string) => artworks.filter((a) => a.series === slug).length;

export function suggest(q: string, n = 6) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const out: { label: string; kind: string; to: { type: "art" | "series" | "character" | "tag"; slug: string } }[] = [];
  for (const x of series) if (x.name.toLowerCase().includes(s)) out.push({ label: x.name, kind: "Series", to: { type: "series", slug: x.slug } });
  for (const x of characters) if (x.name.toLowerCase().includes(s)) out.push({ label: x.name, kind: "Character", to: { type: "character", slug: x.slug } });
  for (const x of tags) if (x.name.includes(s)) out.push({ label: `#${x.name}`, kind: "Tag", to: { type: "tag", slug: x.slug } });
  for (const x of artworks) if (x.title.toLowerCase().includes(s)) out.push({ label: x.title, kind: "Artwork", to: { type: "art", slug: x.slug } });
  return out.slice(0, n);
}
