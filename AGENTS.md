<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Artwork data is mock content in src/lib/artworks.ts until a backend is added; UI reads only through that module so swapping to a real source stays local.

- Animations go through src/components/motion (wrappers + easing tokens) and src/components/effects.tsx (global cursor, splash, tooltips, smooth scroll); keeps motion consistent and reduced-motion handled in one place.
- UI strings go through src/lib/i18n.ts (`useT`/`t`); English dict is the source of truth and other locales fall back to it.
- Theme state lives in src/lib/theme.ts (inline init script prevents flash; no stored choice = follow OS).
- Video media is described by `Artwork.video.sources[]` (+ optional `hls`) so streaming can be added without UI changes.
- Service worker registers only via src/lib/pwa.ts (refuses dev/preview/iframes, `?sw=off` kill switch); vite-plugin-pwa generates /sw.js.
