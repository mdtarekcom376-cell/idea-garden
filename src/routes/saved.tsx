import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getArtworksByIds } from "@/data";
import { useList } from "@/lib/library";
import { MasonryGrid } from "@/components/art";
import { Chip, EmptyState, PageHero } from "@/components/kit";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — Artsstory" },
      { name: "description", content: "Your saved and liked anime artworks on Artsstory." },
      { property: "og:title", content: "Saved — Artsstory" },
      { property: "og:description", content: "Your favourite anime art." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const [tab, setTab] = useState<"saved" | "likes">("saved");
  const saved = useList("saved");
  const likes = useList("likes");
  const items = getArtworksByIds(tab === "saved" ? saved : likes);
  return (
    <main>
      <PageHero eyebrow="Your library" title="Saved" accent="Favourites">Stored on this device. Member accounts are coming soon.</PageHero>
      <div className="container-page">
        <div className="flex gap-2 pt-6">
          <Chip active={tab === "saved"} onClick={() => setTab("saved")}>Saved ({saved.length})</Chip>
          <Chip active={tab === "likes"} onClick={() => setTab("likes")}>Liked ({likes.length})</Chip>
        </div>
        <div className="mt-8">
          {items.length ? <MasonryGrid items={items} /> : (
            <EmptyState title={tab === "saved" ? "Nothing saved yet" : "No likes yet"}>
              Tap the {tab === "saved" ? "bookmark" : "heart"} on any artwork to keep it here.
              <div className="mt-4"><Link to="/gallery" className="btn-primary">Explore the gallery</Link></div>
            </EmptyState>
          )}
        </div>
      </div>
    </main>
  );
}
