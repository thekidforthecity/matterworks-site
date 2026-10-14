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
- `blog.html` (hand-maintained index) and one `*.html` file per post —
  additional static pages. Clean URLs come from `vercel.json`.
- `api/contact.js` — Vercel serverless function that forwards contact-form
  submissions to a Google Apps Script web app, which appends a row to the
  "Form Fills" Google Sheet and emails a notification. Requires the
  `SHEET_WEBHOOK_URL` environment variable in the Vercel project.
- `google-apps-script/contact-form.gs` — source of that Apps Script, kept
  here for reference; the live copy is deployed from inside the sheet.
- No `package.json`, no bundler, no build step for the site itself.

## Deploy
- Hosted on Vercel, connected to this GitHub repo — pushes to `main`
  auto-deploy.
- Custom domain: `matterworks.legal` (DNS at GoDaddy; `www` redirects to
  apex). Moved off the old Netlify deploy on 2026-10-14.
- Contact form requires `SHEET_WEBHOOK_URL` set in Vercel → Settings →
  Environment Variables (see README.md).

## Conventions when editing
- Keep it a single static HTML file per page unless explicitly asked to
  restructure into a framework.
- Don't invent stats, testimonials, or people's names/credentials that
  weren't explicitly provided.
