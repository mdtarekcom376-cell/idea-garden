import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/kit";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => pageMeta({ title: "Terms of Use", description: "The terms for browsing, sharing and downloading artworks on Artsstory.", path: "/terms" }),
  component: () => (
    <main>
      <PageHero eyebrow="Legal" title="Terms of" accent="Use">Last updated October 2026.</PageHero>
      <article className="container-page max-w-3xl space-y-6 pt-10 text-muted-foreground [&_h2]:text-3xl [&_h2]:text-foreground">
        <h2>Personal use</h2>
        <p>Downloads are for personal, non-commercial use such as wallpapers. All rights remain with the original artists.</p>
        <h2>Credit</h2>
        <p>When sharing, please keep the artist credit and link back to the source.</p>
        <h2>Content removal</h2>
        <p>We remove content on valid request. See our <Link to="/dmca" className="text-primary hover:underline">DMCA page</Link>.</p>
        <h2>Changes</h2>
        <p>We may update these terms; continued use means you accept the latest version.</p>
      </article>
    </main>
  ),
});
