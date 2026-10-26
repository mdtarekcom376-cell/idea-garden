import { createFileRoute } from "@tanstack/react-router";
import { formSchemas, type FormKind } from "@/lib/forms";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

// Best-effort per-instance rate limit (serverless instances don't share memory).
const hits = new Map<string, number[]>();
function limited(ip: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

const titles: Record<FormKind, string> = { contact: "New contact message", dmca: "New DMCA / takedown request", newsletter: "New newsletter subscriber" };

/**
 * Receives contact, DMCA and newsletter submissions and forwards them to FORM_WEBHOOK_URL
 * (Slack / Discord / Zapier / Make / Formspree-style JSON webhook).
 */
export const Route = createFileRoute("/api/forms")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (limited(ip)) return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);

        const body = (await request.json().catch(() => null)) as { kind?: string; data?: Record<string, unknown> } | null;
        const kind = body?.kind as FormKind | undefined;
        if (!kind || !(kind in formSchemas) || !body?.data || typeof body.data !== "object") return json({ ok: false, error: "Invalid request." }, 400);

        // Honeypot: pretend success so bots move on.
        if (typeof body.data["website"] === "string" && body.data["website"]) return json({ ok: true });

        const parsed = formSchemas[kind].safeParse(body.data);
        if (!parsed.success) {
          const fields: Record<string, string> = {};
          for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
          return json({ ok: false, error: "Please check the highlighted fields.", fields }, 422);
        }

        const webhook = process.env.FORM_WEBHOOK_URL;
        const lines = Object.entries(parsed.data).map(([k, v]) => `• ${k}: ${String(v)}`);
        const text = `${titles[kind]}\n${lines.join("\n")}`;
        if (!webhook) {
          console.warn(`[forms] FORM_WEBHOOK_URL is not set; ${kind} submission was not delivered.\n${text}`);
          if (process.env.NODE_ENV === "production") return json({ ok: false, error: "This form is temporarily unavailable. Please try again later." }, 503);
          return json({ ok: true });
        }
        try {
          const res = await fetch(webhook, {
            method: "POST",
            headers: { "content-type": "application/json" },
            // `text` for Slack, `content` for Discord, structured fields for everything else.
            body: JSON.stringify({ kind, text, content: text.slice(0, 1900), data: parsed.data, submitted_at: new Date().toISOString() }),
          });
          if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
          return json({ ok: true });
        } catch (e) {
          console.error("[forms] delivery failed", e);
          return json({ ok: false, error: "We couldn't send that right now. Please try again shortly." }, 502);
        }
      },
    },
  },
});
