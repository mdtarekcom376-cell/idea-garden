import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/kit";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta({ title: "Privacy Policy", description: "How Artsstory handles your data: what we store, why, and your choices.", path: "/privacy" }),
  component: () => (
    <main>
      <PageHero eyebrow="Legal" title="Privacy" accent="Policy">Last updated October 2026.</PageHero>
      <article className="container-page max-w-3xl space-y-6 pt-10 text-muted-foreground [&_h2]:text-3xl [&_h2]:text-foreground">
        <h2>What we store</h2>
        <p>Your likes, saved artworks and theme preference are stored only in your browser. We don't require an account to browse.</p>
        <h2>Messages you send</h2>
        <p>When you use the contact or takedown forms, we use your name and email only to reply to you.</p>
        <h2>Analytics</h2>
        <p>We may collect anonymous usage statistics (pages viewed, searches) to improve the gallery. We never sell personal data.</p>
        <h2>Your choices</h2>
        <p>Clear your browser storage at any time to remove likes and saves. Contact us to delete any message you've sent.</p>
      </article>
    </main>
  ),
});
