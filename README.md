# Idea To Project Garden

build

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://idea-to-project-garden.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e2ad840-74d5-46bb-94cc-26a2a73eb0c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deploying to Vercel

Vercel builds with `vite build`; Nitro detects Vercel and writes `.vercel/output` (SSR function + static files, including `/sw.js`).

Set these environment variables in the Vercel project (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical domain for SEO tags and the sitemap (defaults to `https://www.artsstory.tech`) |
| `FORM_WEBHOOK_URL` | Where contact, DMCA and newsletter submissions are delivered (Slack/Discord/Zapier/Make webhook). Required for forms to work in production. |
| `VITE_SOCIAL_INSTAGRAM`, `VITE_SOCIAL_TWITTER`, `VITE_SOCIAL_YOUTUBE` | Optional social profile links; icons are hidden when empty |

Checks before shipping: `npx tsc --noEmit`, `npm test`, `npm run build`.
