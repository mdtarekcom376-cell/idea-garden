import { z } from "zod";

/** Form schemas shared by the client forms and the /api/forms endpoint. */
export const formSchemas = {
  contact: z.object({
    name: z.string().trim().min(1, "Please enter your name").max(100, "Name must be under 100 characters"),
    email: z.string().trim().email("Please enter a valid email").max(255),
    subject: z.string().trim().min(1, "Please add a subject").max(150),
    message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000, "Message must be under 2000 characters"),
  }),
  dmca: z.object({
    name: z.string().trim().min(1, "Please enter your full name").max(100),
    email: z.string().trim().email("Please enter a valid email").max(255),
    artwork_url: z.string().trim().url("Paste the full link to the artwork on Artsstory").max(500),
    original_url: z.string().trim().url("Paste a link to your original work").max(500),
    details: z.string().trim().min(20, "Please describe your claim (at least 20 characters)").max(3000),
    good_faith: z.literal(true, { errorMap: () => ({ message: "Please confirm this statement" }) }),
  }),
  newsletter: z.object({
    email: z.string().trim().email("Please enter a valid email").max(255),
  }),
};
export type FormKind = keyof typeof formSchemas;

export type SubmitResult = { ok: true } | { ok: false; error: string; fields?: Record<string, string> };

/** POST a form to the server. `website` is a honeypot field bots tend to fill. */
export async function submitForm(kind: FormKind, data: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, data }),
    });
    const body = (await res.json().catch(() => null)) as SubmitResult | null;
    if (res.ok && body?.ok) return { ok: true };
    return body && !body.ok ? body : { ok: false, error: "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "You seem to be offline. Please try again." };
  }
}
