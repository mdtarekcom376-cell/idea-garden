import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { suggest } from "@/data";
import { cn } from "@/lib/utils";

export function SearchPill({ className, initial = "", onQuery, autoFocus }: { className?: string; initial?: string; onQuery?: (q: string) => void; autoFocus?: boolean }) {
  const [q, setQ] = useState(initial);
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const items = suggest(q);

  const goTo = (i: number) => {
    const t = items[i]!.to;
    setFocus(false);
    if (t.type === "art") navigate({ to: "/art/$slug", params: { slug: t.slug } });
    else if (t.type === "series") navigate({ to: "/series/$slug", params: { slug: t.slug } });
    else if (t.type === "character") navigate({ to: "/character/$slug", params: { slug: t.slug } });
    else navigate({ to: "/tag/$slug", params: { slug: t.slug } });
  };

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (active >= 0 && items[active]) return goTo(active);
        setFocus(false);
        navigate({ to: "/search", search: { q: q.trim() } });
      }}
    >
      <label className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 shadow-soft focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Search artworks</span>
        <input
          value={q} autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setActive(-1); onQuery?.(e.target.value); }}
          onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
          }}
          placeholder="Search series, characters, tags…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          role="combobox" aria-expanded={focus && items.length > 0} aria-autocomplete="list"
        />
      </label>
      <AnimatePresence>
        {focus && items.length > 0 && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} role="listbox" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border bg-popover p-1.5 shadow-soft">
            {items.map((it, i) => (
              <li key={it.kind + it.label} role="option" aria-selected={i === active}>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); goTo(i); }} className={cn("flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-secondary", i === active && "bg-secondary")}>
                  <span>{it.label}</span><span className="text-xs text-muted-foreground">{it.kind}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </form>
  );
}
