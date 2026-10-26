import { HoverFlip, spring } from "@/components/motion";
import { lockScroll, petalBurst } from "@/components/effects";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Home,
  Compass,
  Search,
  Bookmark,
  Menu,
  Moon,
  Sun,
  X,
  Instagram,
  Twitter,
  Youtube,
  Layers,
  Users,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { setTheme, useIsDark } from "@/lib/theme";
import { useT, type MessageKey } from "@/lib/i18n";
import { formSchemas, submitForm } from "@/lib/forms";
import { SOCIAL } from "@/lib/site";
import { SearchPill } from "@/components/SearchPill";
import { Honeypot } from "@/components/forms";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "nav.home" as MessageKey, icon: Home },
  { to: "/gallery", label: "nav.gallery" as MessageKey, icon: Compass },
  { to: "/series", label: "nav.series" as MessageKey, icon: Layers },
  { to: "/characters", label: "nav.characters" as MessageKey, icon: Users },
  { to: "/collections", label: "nav.collections" as MessageKey, icon: Sparkles },
  { to: "/about", label: "nav.about" as MessageKey, icon: Info },
] as const;

const socials = [
  { href: SOCIAL.instagram, label: "Instagram", Icon: Instagram },
  { href: SOCIAL.twitter, label: "X / Twitter", Icon: Twitter },
  { href: SOCIAL.youtube, label: "YouTube", Icon: Youtube },
].filter((s) => s.href);

function ThemeToggle() {
  const dark = useIsDark();
  const tr = useT();
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? tr("theme.toLight") : tr("theme.toDark")}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/60 dark:bg-neutral-800/60 text-foreground hover:bg-card hover:border-border transition-colors cursor-pointer select-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          className="grid place-items-center"
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={spring}
        >
          {dark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function SiteHeader() {
  const tr = useT();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (Math.abs(y - prev) > 4) setHidden(y > prev && y > 160);
  });
  const { pathname } = useLocation();
  useEffect(() => setHidden(false), [pathname]);

  return (
    <>
      <a href="#content" className="sr-only z-[80] rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-3">Skip to content</a>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-130%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-background/90 dark:bg-card/90 p-1.5 sm:p-2 shadow-2xl backdrop-blur-2xl max-w-full overflow-x-auto no-scrollbar">
          {/* Integrated Logo locked inside the navbar */}
          <Link
            to="/"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              petalBurst(r.left + r.width / 2, r.top + r.height / 2, 28);
            }}
            className="flex items-center gap-2 rounded-full pl-3 pr-3.5 py-1.5 text-foreground hover:bg-muted/50 transition-colors shrink-0 select-none group"
            aria-label={tr("nav.homeLabel")}
          >
            <motion.span
              aria-hidden
              whileHover={{ rotate: 20, scale: 1.15 }}
              whileTap={{ scale: 0.8, rotate: 180 }}
              transition={spring}
              className="grid place-items-center"
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.span>
            <span className="font-display text-sm tracking-[0.22em] uppercase font-bold text-foreground">
              Artsstory
            </span>
          </Link>

          {/* Divider */}
          <div className="h-5 w-px bg-border/80 shrink-0 mx-0.5" />

          {/* Capsule Nav Items */}
          <nav className="flex items-center gap-1 sm:gap-1.5 shrink-0" aria-label={tr("nav.main")}>
            {nav.map((n) => {
              const Icon = n.icon;
              const isExact = n.to === "/";
              const isActive = isExact
                ? pathname === "/"
                : pathname.startsWith(n.to);

              return (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: isExact, includeSearch: false }}
                  className={cn(
                    "relative flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-medium tracking-wide transition-all select-none shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "bg-card/60 dark:bg-neutral-800/60 hover:bg-card text-foreground/80 hover:text-foreground border border-border/50 hover:border-border shadow-xs"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavCapsule"
                      className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span>{tr(n.label)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="h-5 w-px bg-border/80 shrink-0 mx-0.5" />

          {/* Integrated Theme Toggle */}
          <ThemeToggle />
        </div>
      </motion.header>
    </>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="relative flex w-full max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        if (!formSchemas.newsletter.safeParse({ email }).success) { toast.error("Please enter a valid email"); return; }
        setBusy(true);
        const website = String(new FormData(e.currentTarget).get("website") ?? "");
        const res = await submitForm("newsletter", { email, website });
        setBusy(false);
        if (!res.ok) { toast.error(res.error); return; }
        setEmail(""); toast.success("You're subscribed — welcome to the magic ✿");
      }}
    >
      <Honeypot />
      <label className="sr-only" htmlFor="nl-email">Email</label>
      <input id="nl-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-pill min-w-0 flex-1" />
      <button type="submit" disabled={busy} className="btn-primary btn-shine btn-arrow">{busy ? "Subscribing…" : "Subscribe"}</button>
    </form>
  );
}

export function SiteFooter() {
  const cols = [
    { title: "Explore", links: [["/gallery", "Gallery"], ["/series", "Series"], ["/characters", "Characters"], ["/collections", "Collections"], ["/search", "Search"], ["/saved", "Saved"]] },
    { title: "Artsstory", links: [["/about", "About"], ["/contact", "Contact"], ["/dmca", "DMCA / Takedown"]] },
    { title: "Legal", links: [["/privacy", "Privacy"], ["/terms", "Terms"]] },
  ] as const;
  return (
    <footer className="relative mt-24 border-t bg-card/50 pb-24 md:pb-0">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-3 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="sm:col-span-3 md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><span className="font-display text-xl tracking-[0.25em] uppercase">Artsstory</span></Link>
          <p className="font-display mt-4 text-2xl">A world of magical moments.</p>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn icon-tip"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          )}
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([to, l]) => <li key={to}><Link to={to} className="text-sm transition-colors hover:text-primary">{l}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-page flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Artsstory · All artworks credited to their artists.</p>
        <p>Copyright concern? <Link to="/dmca" className="text-primary hover:underline">File a takedown request</Link></p>
      </div>
    </footer>
  );
}
