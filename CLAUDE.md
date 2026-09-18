# MatterWorks — Marketing Site

## What this is
Single-page static marketing site for MatterWorks, a legal technology
consulting and development company (matterworkslt.com / matterworks.legal).
One HTML file (`index.html`), no build step, no framework, no dependencies.
Deploys to Vercel as a static site with an `/api` serverless function for
the contact form.

## History
This project previously lived uncommitted inside a different repo
(`basis-legal`, which is a separate, unrelated company's site). It was
split out into its own repo on 2026-09-18 and moved from manual Netlify
CLI deploys to a git-connected Vercel project.

## File structure
- `index.html` — the entire site: HTML, CSS (inline `<style>`), and JS
  (inline `<script>`) in one file. Team headshots are embedded/linked as
  image files alongside it.
- `blog.html`, `claude-legal-post*.html` — additional static pages.
- `api/contact.js` — Vercel serverless function that sends contact-form
  submissions by email via Resend. Requires `RESEND_API_KEY` and
  `CONTACT_TO_EMAIL` environment variables in the Vercel project (see
  README.md).
- No `package.json`, no bundler, no build step for the site itself.

## Deploy
- Hosted on Vercel, connected to this GitHub repo — pushes to `main`
  auto-deploy.
- Custom domain: `matterworks.legal` (and/or `matterworkslt.com` — confirm
  which is canonical and set the other to redirect).
- Contact form requires `RESEND_API_KEY` and `CONTACT_TO_EMAIL` set in
  Vercel → Settings → Environment Variables.

## Conventions when editing
- Keep it a single static HTML file per page unless explicitly asked to
  restructure into a framework.
- Don't invent stats, testimonials, or people's names/credentials that
  weren't explicitly provided.
