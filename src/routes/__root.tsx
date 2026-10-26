import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Petals } from "@/components/Petals";
import { themeInitScript, watchSystemTheme } from "@/lib/theme";
import { initLocale } from "@/lib/i18n";
import { registerServiceWorker } from "@/lib/pwa";
import { MotionConfig, motion } from "motion/react";
import { useLocation } from "@tanstack/react-router";
import { SmoothScroll, GlowCursor, IconTooltips } from "@/components/effects";
import { Toaster } from "@/components/ui/sonner";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import ogImage from "@/assets/art-1.jpg";

function NotFoundComponent() {
  return (
    <main className="bg-hero relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="relative max-w-md text-center">
        <p className="font-script text-6xl text-primary">✿</p>
        <h1 className="mt-2 text-[clamp(4rem,14vw,8rem)] leading-none">404</h1>
        <h2 className="mt-4 text-3xl">This page drifted away</h2>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Try the gallery or search for something magical.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary btn-shine">Go home</Link>
          <Link to="/gallery" className="btn-ghost">Browse the gallery</Link>
          <Link to="/search" className="btn-ghost">Search</Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f06ba0", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#221828", media: "(prefers-color-scheme: dark)" },
      { name: "color-scheme", content: "light dark" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: SITE_NAME },
      { name: "application-name", content: SITE_NAME },
      { name: "format-detection", content: "telephone=no" },
      { title: `${SITE_NAME} — A world of magical anime moments` },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: absoluteUrl(ogImage) },
      { property: "og:image:alt", content: "Artsstory — curated anime art" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: absoluteUrl(ogImage) },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => { initLocale(); registerServiceWorker(); return watchSystemTheme(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <SiteHeader />
      <Petals />
      <PageTransition />
      <GlowCursor />
      <IconTooltips />
      <SiteFooter />
      <Toaster position="bottom-center" />
      </MotionConfig>
    </QueryClientProvider>
  );
}

// The first (server-rendered) page must be visible before JS loads; only later navigations animate in.
let hydrated = false;

function PageTransition() {
  const { pathname } = useLocation();
  const animateIn = hydrated;
  useEffect(() => { hydrated = true; }, []);
  return (
    <motion.div id="content" tabIndex={-1} className="min-h-[70vh] outline-none" key={pathname} initial={animateIn ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      <Outlet />
    </motion.div>
  );
}
