# MatterWorks — Marketing Site

Single-page static site for [matterworks.legal](https://matterworks.legal).
Plain HTML, CSS, and JS in one file — no build step, no framework, no
dependencies.

## Local preview

Just open `index.html` in a browser, or serve it locally:

```
npx serve .
```

## Deploy

Connected to Vercel — push to `main` and it deploys automatically.

## Contact form

The contact form posts to `/api/contact` (a Vercel serverless function,
`api/contact.js`), which sends the submission by email via Resend. It
requires two environment variables set in the Vercel project (Settings →
Environment Variables):

- `RESEND_API_KEY` — API key from your Resend account
- `CONTACT_TO_EMAIL` — inbox that should receive submissions

Optional: `CONTACT_FROM_EMAIL` once a sending domain is verified in Resend
(defaults to `onboarding@resend.dev`). Without `RESEND_API_KEY` and
`CONTACT_TO_EMAIL` set, submissions will fail with a 500 and the form will
show its error state.

This site was previously deployed manually to Netlify via the CLI (not
git-connected). It's now a standalone git repo deploying to Vercel on
every push to `main`.
