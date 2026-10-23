import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PageHero } from "@/components/kit";
import { ValidatedForm } from "@/components/forms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Artsstory" },
      { name: "description", content: "Get in touch with the Artsstory team — feedback, artist submissions or partnerships." },
      { property: "og:title", content: "Contact — Artsstory" },
      { property: "og:description", content: "Say hello to the Artsstory team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(1, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

function Contact() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="Say" accent="hello">Questions, feedback, or you're an artist who'd like to be featured? We read every message.</PageHero>
      <div className="container-page max-w-2xl pt-10">
        <ValidatedForm
          schema={schema}
          fields={[
            { name: "name", label: "Name" },
            { name: "email", label: "Email", type: "email", placeholder: "you@email.com" },
            { name: "subject", label: "Subject" },
            { name: "message", label: "Message", type: "textarea" },
          ]}
          submitLabel="Send message" successTitle="Message sent" successText="Thank you! We'll get back to you within a few days."
        />
      </div>
    </main>
  );
}
