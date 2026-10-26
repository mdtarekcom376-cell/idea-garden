import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { suggest } from "@/data";
import { cn } from "@/lib/utils";

export function SearchPill({ className, initial = "", onQuery, onSubmitQuery, autoFocus }: {
  className?: string; initial?: string; onQuery?: (q: string) => void;
  /** Handle submit in place (e.g. gallery filter) instead of going to /search. */
  onSubmitQuery?: (q: string) => void; autoFocus?: boolean;
}) {
  const [q, setQ] = useState(initial);
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const items = suggest(q);
  const open = focus && items.length > 0;

  // Follow external changes (back/forward, "Clear filters") without fighting the user's typing.
  useEffect(() => { if (document.activeElement !== input.current) setQ(initial); }, [initial]);

  const goTo = (i: number) => {
    const t = items[i]?.to;
    if (!t) return;
    setFocus(false);
    input.current?.blur();
    if (t.type === "art") navigate({ to: "/art/$slug", params: { slug: t.slug } });
    else if (t.type === "series") navigate({ to: "/series/$slug", params: { slug: t.slug } });
    else if (t.type === "character") navigate({ to: "/character/$slug", params: { slug: t.slug } });
    else navigate({ to: "/tag/$slug", params: { slug: t.slug } });
  };

  const update = (v: string) => { setQ(v); setActive(-1); onQuery?.(v); };

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (active >= 0 && items[active]) return goTo(active);
        setFocus(false);
        if (onSubmitQuery) { onSubmitQuery(q.trim()); input.current?.blur(); return; }
        navigate({ to: "/search", search: { q: q.trim() } });
      }}
    >
      <label className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 shadow-soft focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Search artworks</span>
        <input
          ref={input} type="search" enterKeyHint="search" value={q} autoFocus={autoFocus} autoComplete="off" spellCheck={false}
          onChange={(e) => update(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setFocus(true); setActive((a) => Math.min(a + 1, items.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
            if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); setFocus(false); setActive(-1); }
          }}
          placeholder="Search series, characters, tags…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          role="combobox" aria-expanded={open} aria-autocomplete="list" aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        />
        {q && (
          <button type="button" aria-label="Clear search" onMouseDown={(e) => e.preventDefault()} onClick={() => { update(""); input.current?.focus(); }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>
      <AnimatePresence>
        {open && (
          <motion.ul id={listId} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} role="listbox" aria-label="Suggestions" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border bg-popover p-1.5 shadow-soft">
            {items.map((it, i) => (
              <li key={it.kind + it.label} id={`${listId}-${i}`} role="option" aria-selected={i === active}
                onMouseDown={(e) => { e.preventDefault(); goTo(i); }} onMouseEnter={() => setActive(i)}
                className={cn("flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-secondary", i === active && "bg-secondary")}>
                <span>{it.label}</span><span className="text-xs text-muted-foreground">{it.kind}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </form>
  );
}
