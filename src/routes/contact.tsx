import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/kit";
import { ValidatedForm } from "@/components/forms";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta({ title: "Contact", description: "Get in touch with the Artsstory team — feedback, artist submissions or partnerships.", path: "/contact" }),
  component: Contact,
});

function Contact() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="Say" accent="hello">Questions, feedback, or you're an artist who'd like to be featured? We read every message.</PageHero>
      <div className="container-page max-w-2xl pt-10">
        <ValidatedForm
          kind="contact"
          fields={[
            { name: "name", label: "Name", autoComplete: "name" },
            { name: "email", label: "Email", type: "email", placeholder: "you@email.com", autoComplete: "email" },
            { name: "subject", label: "Subject" },
            { name: "message", label: "Message", type: "textarea" },
          ]}
          submitLabel="Send message" successTitle="Message sent" successText="Thank you! We'll get back to you within a few days."
        />
      </div>
    </main>
  );
}
