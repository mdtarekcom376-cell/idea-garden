/** Site-wide constants. Set VITE_SITE_URL in Vercel if the domain changes. */
export const SITE_NAME = "Artsstory";
export const SITE_URL = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://www.artsstory.tech";
export const SITE_DESCRIPTION = "A curated gallery of HD and 4K anime art and videos. Browse, search, like and save magical moments.";

/** Social profiles; leave a value empty to hide its icon. */
export const SOCIAL: { instagram: string; twitter: string; youtube: string } = {
  instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM ?? "",
  twitter: import.meta.env.VITE_SOCIAL_TWITTER ?? "",
  youtube: import.meta.env.VITE_SOCIAL_YOUTUBE ?? "",
};

export const absoluteUrl = (path = "/") => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

/** Standard head meta for a page: title, description, canonical, Open Graph and Twitter. */
export function pageMeta({ title, description = SITE_DESCRIPTION, path, image, type = "website", noindex }: {
  title: string; description?: string; path?: string; image?: string; type?: string; noindex?: boolean;
}) {
  const full = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const meta: Record<string, string>[] = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
  if (path !== undefined) meta.push({ property: "og:url", content: absoluteUrl(path) });
  if (image) {
    meta.push({ property: "og:image", content: absoluteUrl(image) }, { name: "twitter:image", content: absoluteUrl(image) }, { name: "twitter:card", content: "summary_large_image" });
  }
  if (noindex) meta.push({ name: "robots", content: "noindex" });
  const links = path !== undefined && !noindex ? [{ rel: "canonical", href: absoluteUrl(path) }] : [];
  return { meta, links };
}
