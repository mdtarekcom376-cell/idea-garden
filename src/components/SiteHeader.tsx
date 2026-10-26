import { HoverFlip, spring } from "@/components/motion";
import { lockScroll, petalBurst } from "@/components/effects";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Home, Compass, Search, Bookmark, Menu, Moon, Sun, X, Instagram, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";
import { setTheme, useIsDark } from "@/lib/theme";
import { useT, type MessageKey } from "@/lib/i18n";
import { formSchemas, submitForm } from "@/lib/forms";
import { SOCIAL } from "@/lib/site";
import { SearchPill } from "@/components/SearchPill";
import { Honeypot } from "@/components/forms";

const nav = [
  { to: "/", label: "nav.home" as MessageKey },
  { to: "/gallery", label: "nav.gallery" as MessageKey },
  { to: "/series", label: "nav.series" as MessageKey },
  { to: "/characters", label: "nav.characters" as MessageKey },
  { to: "/collections", label: "nav.collections" as MessageKey },
  { to: "/about", label: "nav.about" as MessageKey },
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
    <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? tr("theme.toLight") : tr("theme.toDark")} className="icon-btn icon-tip overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? "sun" : "moon"} className="grid place-items-center"
          initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={spring}>
          {dark ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function Logo({ burst = false }: { burst?: boolean }) {
  const tr = useT();
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" aria-label={tr("nav.homeLabel")}>
      <motion.span aria-hidden whileHover={{ rotate: 20, scale: 1.15 }} whileTap={{ scale: 0.8, rotate: 180 }} transition={spring}
        onClick={burst ? (e) => { e.preventDefault(); e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); petalBurst(r.left + r.width / 2, r.top + r.height / 2, 36); } : undefined}
        className="grid place-items-center"><Sparkles className="h-5 w-5 text-primary" /></motion.span>
      <span className="font-display text-lg tracking-[0.25em] uppercase sm:text-xl">Artsstory</span>
    </Link>
  );
}

export function SiteHeader() {
  const tr = useT();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Small deltas (momentum jitter) don't toggle the header.
    if (Math.abs(y - prev) > 4) setHidden(y > prev && y > 160);
    setScrolled(y > 20);
  });
  const { pathname } = useLocation();
  useEffect(() => setHidden(false), [pathname]);
  const closeMenu = () => { setMenu(false); menuBtn.current?.focus({ preventScroll: true }); };

  return (
    <>
      <a href="#content" className="sr-only z-[80] rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-3">Skip to content</a>
      <motion.header
        initial={false} animate={{ y: hidden && !menu ? "-100%" : "0%" }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? "glass-strong shadow-[0_1px_0_0_var(--border)]" : "border-transparent"}`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo burst />
          <nav className="hidden items-center gap-7 lg:flex" aria-label={tr("nav.main")}>
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="nav-link py-2" activeProps={{ className: "nav-link-active", "aria-current": "page" }} activeOptions={{ exact: n.to === "/", includeSearch: false }}><HoverFlip text={tr(n.label)} /></Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/search" aria-label={tr("nav.search")} className="icon-btn icon-tip hidden md:grid"><Search className="h-4 w-4" /></Link>
            <Link to="/saved" aria-label={tr("nav.saved")} className="icon-btn icon-tip hidden md:grid" activeProps={{ className: "!bg-primary-soft text-primary" }}><Bookmark className="h-4 w-4" /></Link>
            <ThemeToggle />
            <button ref={menuBtn} type="button" className="icon-btn icon-tip lg:hidden" aria-label={tr("nav.openMenu")} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(true)}><Menu className="h-4 w-4" /></button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menu} onClose={closeMenu} />
      <MobileTabBar onMenu={() => setMenu(true)} menuOpen={menu} />
    </>
  );
}

const extra = [
  { to: "/saved", label: "nav.saved" as MessageKey },
  { to: "/contact", label: "nav.contact" as MessageKey },
  { to: "/dmca", label: "nav.dmca" as MessageKey },
] as const;

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tr = useT();
  const { pathname } = useLocation();
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  // Close when the route changes (e.g. after a search submit).
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } close.current(); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close.current(); }
      if (e.key === "Tab" && panel.current) {
        // Keep focus inside the menu.
        const els = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, [tabindex]:not([tabindex='-1'])");
        const firstEl = els[0], last = els[els.length - 1];
        if (!firstEl || !last) return;
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); firstEl.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { unlock(); window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel} id="mobile-menu" key="menu"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="bg-hero fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] md:px-8"
          role="dialog" aria-modal="true" aria-label={tr("nav.menu")}
        >
          <div className="aurora pointer-events-none absolute inset-0" />
          <div className="relative flex h-16 shrink-0 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button type="button" autoFocus className="icon-btn" aria-label={tr("nav.closeMenu")} onClick={onClose}><X className="h-4 w-4" /></button>
            </div>
          </div>
          <SearchPill className="relative mt-4" />
          <nav className="relative mt-6 flex flex-col" aria-label={tr("nav.menu")}>
            {[...nav, ...extra].map((n, i) => (
              <motion.div key={n.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}>
                <Link to={n.to} onClick={onClose} className="font-display block py-1.5 text-4xl transition-colors hover:text-primary" activeProps={{ className: "text-primary", "aria-current": "page" }} activeOptions={{ exact: n.to === "/", includeSearch: false }}>{tr(n.label)}</Link>
              </motion.div>
            ))}
          </nav>
          <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-10 text-sm text-muted-foreground">
            <Link to="/privacy" onClick={onClose} className="hover:text-primary">Privacy</Link>
            <Link to="/terms" onClick={onClose} className="hover:text-primary">Terms</Link>
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileTabBar({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  const tr = useT();
  const cls = "flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground transition-colors";
  const active = { className: "text-primary font-medium", "aria-current": "page" as const };
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 flex justify-around border-t pb-[env(safe-area-inset-bottom)] md:hidden" aria-label={tr("nav.mobile")}>
      <Link to="/" className={cls} activeProps={active} activeOptions={{ exact: true, includeSearch: false }}><Home className="h-5 w-5" />{tr("nav.home")}</Link>
      <Link to="/gallery" className={cls} activeProps={active} activeOptions={{ includeSearch: false }}><Compass className="h-5 w-5" />{tr("nav.explore")}</Link>
      <Link to="/search" className={cls} activeProps={active} activeOptions={{ includeSearch: false }}><Search className="h-5 w-5" />{tr("nav.search")}</Link>
      <Link to="/saved" className={cls} activeProps={active}><Bookmark className="h-5 w-5" />{tr("nav.saved")}</Link>
      <button type="button" onClick={onMenu} aria-expanded={menuOpen} aria-controls="mobile-menu" className={cls}><Menu className="h-5 w-5" />{tr("nav.menu")}</button>
    </nav>
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
