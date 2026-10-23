import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PageHero } from "@/components/kit";
import { ValidatedForm } from "@/components/forms";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA / Takedown — Artsstory" },
      { name: "description", content: "Own an artwork shown on Artsstory? Submit a takedown request and we'll act quickly." },
      { property: "og:title", content: "DMCA / Takedown — Artsstory" },
      { property: "og:description", content: "Submit a copyright takedown request." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dmca,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  artwork_url: z.string().trim().url("Paste the full link to the artwork on Artsstory").max(500),
  original_url: z.string().trim().url("Paste a link to your original work").max(500),
  details: z.string().trim().min(20, "Please describe your claim (at least 20 characters)").max(3000),
  good_faith: z.literal(true, { errorMap: () => ({ message: "Please confirm this statement" }) }),
});

function Dmca() {
  return (
    <main>
      <PageHero eyebrow="Copyright" title="DMCA &" accent="Takedown">
        We respect artists. If you own a piece shown here and want it credited differently or removed, tell us below — we usually respond within 48 hours.
      </PageHero>
      <div className="container-page max-w-2xl pt-10">
        <ValidatedForm
          schema={schema}
          fields={[
            { name: "name", label: "Full name" },
            { name: "email", label: "Email", type: "email" },
            { name: "artwork_url", label: "Artwork link on Artsstory", type: "url", placeholder: "https://artsstory.tech/art/…" },
            { name: "original_url", label: "Link to your original work", type: "url" },
            { name: "details", label: "Details of your claim", type: "textarea" },
            { name: "good_faith", label: "I confirm in good faith that I am the copyright owner (or authorised to act for them) and that this information is accurate.", type: "checkbox" },
          ]}
          submitLabel="Submit request" successTitle="Request received" successText="We'll review your request and reply by email, usually within 48 hours."
        />
      </div>
    </main>
  );
}
