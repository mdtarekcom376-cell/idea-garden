import { describe, expect, it } from "vitest";
import { absoluteUrl, pageMeta, SITE_URL } from "@/lib/site";
import { formSchemas } from "@/lib/forms";

describe("pageMeta", () => {
  it("adds the site name, canonical link and absolute OG image", () => {
    const { meta, links } = pageMeta({ title: "Gallery", path: "/gallery", image: "/assets/a.jpg" });
    expect(meta).toContainEqual({ title: "Gallery — Artsstory" });
    expect(meta).toContainEqual({ property: "og:image", content: `${SITE_URL}/assets/a.jpg` });
    expect(links).toEqual([{ rel: "canonical", href: `${SITE_URL}/gallery` }]);
  });

  it("marks noindex pages and skips their canonical", () => {
    const { meta, links } = pageMeta({ title: "Saved", path: "/saved", noindex: true });
    expect(meta).toContainEqual({ name: "robots", content: "noindex" });
    expect(links).toEqual([]);
  });

  it("leaves absolute URLs alone", () => {
    expect(absoluteUrl("https://cdn.example.com/x.jpg")).toBe("https://cdn.example.com/x.jpg");
  });
});

describe("form schemas", () => {
  it("requires the DMCA good-faith confirmation", () => {
    const base = { name: "A", email: "a@b.co", artwork_url: "https://x.co/a", original_url: "https://y.co/b", details: "x".repeat(25) };
    expect(formSchemas.dmca.safeParse({ ...base, good_faith: false }).success).toBe(false);
    expect(formSchemas.dmca.safeParse({ ...base, good_faith: true }).success).toBe(true);
  });
});
