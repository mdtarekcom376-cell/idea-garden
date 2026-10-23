import { HoverFlip, spring } from "@/components/motion";
import { petalBurst } from "@/components/effects";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Sparkles, Home, Compass, Search, Bookmark, Menu, Moon, Sun, X, Instagram, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";
import { setTheme, useIsDark } from "@/lib/theme";
import { useT, type MessageKey } from "@/lib/i18n";
import { z } from "zod";

const nav = [
  { to: "/", label: "nav.home" as MessageKey },
  { to: "/gallery", label: "nav.gallery" as MessageKey },
  { to: "/series", label: "nav.series" as MessageKey },
  { to: "/characters", label: "nav.characters" as MessageKey },
  { to: "/collections", label: "nav.collections" as MessageKey },
  { to: "/about", label: "nav.about" as MessageKey },
] as const;

function ThemeToggle() {
  const dark = useIsDark();
  const tr = useT();
  return (
    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? tr("theme.toLight") : tr("theme.toDark")} className="icon-btn icon-tip overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? "sun" : "moon"} className="grid place-items-center"
          initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={spring}>
          {dark ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function SiteHeader() {
  const tr = useT();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160 && !menu);
    setScrolled(y > 20);
  });
  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }} animate={{ y: hidden ? -100 : 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${scrolled ? "glass-strong" : "border-transparent"}`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label={tr("nav.homeLabel")}>
            <motion.span aria-hidden whileHover={{ rotate: 20, scale: 1.15 }} whileTap={{ scale: 0.8, rotate: 180 }} transition={spring}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); petalBurst(r.left + r.width / 2, r.top + r.height / 2, 36); }}
              className="grid place-items-center"><Sparkles className="h-5 w-5 text-primary" /></motion.span>
            <span className="font-display text-lg tracking-[0.25em] uppercase sm:text-xl">Artsstory</span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label={tr("nav.main")}>
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="nav-link" activeProps={{ className: "nav-link-active" }} activeOptions={{ exact: n.to === "/" }}><HoverFlip text={tr(n.label)} /></Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/search" search={{ q: "" }} aria-label={tr("nav.search")} className="icon-btn icon-tip hidden sm:grid"><Search className="h-4 w-4" /></Link>
            <Link to="/saved" aria-label={tr("nav.saved")} className="icon-btn icon-tip hidden sm:grid"><Bookmark className="h-4 w-4" /></Link>
            <ThemeToggle />
            <button className="icon-btn icon-tip lg:hidden" aria-label={tr("nav.openMenu")} aria-expanded={menu} onClick={() => setMenu(true)}><Menu className="h-4 w-4" /></button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <MobileTabBar onMenu={() => setMenu(true)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tr = useT();
  if (!open) return null;
  const extra = [{ to: "/saved", label: "nav.saved" as MessageKey }, { to: "/contact", label: "nav.contact" as MessageKey }, { to: "/dmca", label: "nav.dmca" as MessageKey }] as const;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[70] bg-hero p-6" role="dialog" aria-modal aria-label={tr("nav.menu")}>
      <div className="flex justify-end"><button autoFocus className="icon-btn" aria-label={tr("nav.closeMenu")} onClick={onClose}><X className="h-4 w-4" /></button></div>
      <nav className="mt-6 flex flex-col gap-1">
        {[...nav, ...extra].map((n, i) => (
          <motion.div key={n.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={n.to} onClick={onClose} className="font-display block py-2 text-4xl" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>{tr(n.label)}</Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}

function MobileTabBar({ onMenu }: { onMenu: () => void }) {
  const tr = useT();
  const cls = "flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground";
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 flex justify-around border-t pb-[env(safe-area-inset-bottom)] md:hidden" aria-label={tr("nav.mobile")}>
      <Link to="/" className={cls} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}><Home className="h-5 w-5" />{tr("nav.home")}</Link>
      <Link to="/gallery" className={cls} activeProps={{ className: "text-primary" }}><Compass className="h-5 w-5" />{tr("nav.explore")}</Link>
      <Link to="/search" search={{ q: "" }} className={cls} activeProps={{ className: "text-primary" }}><Search className="h-5 w-5" />{tr("nav.search")}</Link>
      <Link to="/saved" className={cls} activeProps={{ className: "text-primary" }}><Bookmark className="h-5 w-5" />{tr("nav.saved")}</Link>
      <button onClick={onMenu} className={cls}><Menu className="h-5 w-5" />{tr("nav.menu")}</button>
    </nav>
  );
}

const emailSchema = z.string().trim().email().max(255);

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!emailSchema.safeParse(email).success) { toast.error("Please enter a valid email"); return; }
        setEmail(""); toast.success("You're subscribed — welcome to the magic ✿");
      }}
    >
      <label className="sr-only" htmlFor="nl-email">Email</label>
      <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-pill flex-1" />
      <button className="btn-primary btn-shine btn-arrow">Subscribe</button>
    </form>
  );
}

export function SiteFooter() {
  const cols = [
    { title: "Explore", links: [["/gallery", "Gallery"], ["/series", "Series"], ["/characters", "Characters"], ["/collections", "Collections"], ["/saved", "Saved"]] },
    { title: "Artsstory", links: [["/about", "About"], ["/contact", "Contact"], ["/dmca", "DMCA / Takedown"]] },
    { title: "Legal", links: [["/privacy", "Privacy"], ["/terms", "Terms"]] },
  ] as const;
  return (
    <footer className="mt-24 border-t bg-card/50 pb-24 md:pb-0">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><span className="font-display text-xl tracking-[0.25em] uppercase">Artsstory</span></Link>
          <p className="font-display mt-4 text-2xl">A world of magical moments.</p>
          <div className="mt-4 flex gap-2">
            {[[Instagram, "Instagram"], [Twitter, "X / Twitter"], [Youtube, "YouTube"]].map(([I, l]) => {
              const Icon = I as typeof Instagram;
              return <a key={l as string} href="#" aria-label={l as string} className="icon-btn"><Icon className="h-4 w-4" /></a>;
            })}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([to, l]) => <li key={to}><Link to={to} className="text-sm hover:text-primary">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground md:flex-row md:justify-between">
        <p>© 2026 Artsstory · All artworks credited to their artists.</p>
        <p>Copyright concern? <Link to="/dmca" className="text-primary hover:underline">File a takedown request</Link></p>
      </div>
    </footer>
  );
}
