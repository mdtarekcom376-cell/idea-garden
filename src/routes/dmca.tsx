import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/kit";
import { ValidatedForm } from "@/components/forms";
import { pageMeta, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/dmca")({
  head: () => pageMeta({ title: "DMCA / Takedown", description: "Own an artwork shown on Artsstory? Submit a takedown request and we'll act quickly.", path: "/dmca" }),
  component: Dmca,
});

function Dmca() {
  return (
    <main>
      <PageHero eyebrow="Copyright" title="DMCA &" accent="Takedown">
        We respect artists. If you own a piece shown here and want it credited differently or removed, tell us below — we usually respond within 48 hours.
      </PageHero>
      <div className="container-page max-w-2xl pt-10">
        <ValidatedForm
          kind="dmca"
          fields={[
            { name: "name", label: "Full name", autoComplete: "name" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "artwork_url", label: "Artwork link on Artsstory", type: "url", placeholder: `${SITE_URL}/art/…` },
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
