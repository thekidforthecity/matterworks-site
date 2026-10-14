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
`api/contact.js`), which forwards the submission to a Google Apps Script
web app attached to the "Form Fills" Google Sheet. The script
(`google-apps-script/contact-form.gs`) appends a row to the sheet and emails
a notification to max@matterworks.legal.

The function needs one environment variable in the Vercel project
(Settings → Environment Variables):

- `SHEET_WEBHOOK_URL` — the Apps Script web app URL (ends in `/exec`)

To change the script: open the sheet → Extensions → Apps Script, edit, then
Deploy → Manage deployments → edit the existing deployment → New version.
Keeping the same deployment keeps the URL. Without `SHEET_WEBHOOK_URL` set,
submissions fail with a 500 and the form shows its error state.

The contact section also offers a Calendly "Book an intro call" button as an
alternative to the form.

This site was previously deployed manually to Netlify via the CLI (not
git-connected). It's now a standalone git repo deploying to Vercel on
every push to `main`.
