import { motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

export type Field = { name: string; label: string; type?: "text" | "email" | "url" | "textarea" | "checkbox"; placeholder?: string };

export function ValidatedForm({ fields, schema, submitLabel, successTitle, successText }: {
  fields: Field[]; schema: z.ZodObject<z.ZodRawShape>; submitLabel: string; successTitle: string; successText: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border bg-card p-10 text-center shadow-soft" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-4xl">{successTitle}</h2>
        <p className="mt-2 text-muted-foreground">{successText}</p>
        <button className="btn-ghost mt-6" onClick={() => setDone(false)}>Send another</button>
      </motion.div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5 rounded-3xl border bg-card p-6 shadow-soft md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? fd.get(f.name) === "on" : String(fd.get(f.name) ?? "")]));
        const r = schema.safeParse(data);
        if (!r.success) {
          const errs: Record<string, string> = {};
          for (const i of r.error.issues) errs[String(i.path[0])] ??= i.message;
          setErrors(errs);
          return;
        }
        setErrors({}); setBusy(true);
        setTimeout(() => { setBusy(false); setDone(true); }, 700);
      }}
    >
      {fields.map((f) => {
        const err = errors[f.name];
        const id = `f-${f.name}`;
        if (f.type === "checkbox") {
          return (
            <div key={f.name}>
              <label className="flex items-start gap-3 text-sm"><input id={id} name={f.name} type="checkbox" className="mt-1 h-4 w-4 accent-primary" aria-invalid={!!err} />{f.label}</label>
              {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
            </div>
          );
        }
        return (
          <div key={f.name}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{f.label}</label>
            {f.type === "textarea"
              ? <textarea id={id} name={f.name} rows={5} placeholder={f.placeholder} className="input-field" aria-invalid={!!err} aria-describedby={err ? `${id}-e` : undefined} />
              : <input id={id} name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} className="input-field" aria-invalid={!!err} aria-describedby={err ? `${id}-e` : undefined} />}
            {err && <p id={`${id}-e`} className="mt-1 text-xs text-destructive">{err}</p>}
          </div>
        );
      })}
      <button disabled={busy} className="btn-primary btn-shine btn-arrow w-full sm:w-auto">{busy ? "Sending…" : submitLabel}</button>
    </form>
  );
}
