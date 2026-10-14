// Vercel Serverless Function for the contact form.
// Runtime: Node.js (default for /api routes, no config needed).
//
// Forwards each submission to a Google Apps Script web app attached to the
// "Form Fills" Google Sheet (see google-apps-script/contact-form.gs). The
// script appends a row to the sheet and emails a notification.
//
// Requires one environment variable in the Vercel project:
//   SHEET_WEBHOOK_URL - the Apps Script web app URL (ends in /exec)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel parses application/x-www-form-urlencoded and application/json into req.body automatically.
  const body = req.body || {};

  // Honeypot: if the hidden "bot-field" is filled in, silently pretend success.
  if (body['bot-field']) {
    return res.status(200).json({ ok: true });
  }

  const firstName = (body['first-name'] || '').toString().trim();
  const lastName = (body['last-name'] || '').toString().trim();
  const email = (body['email'] || '').toString().trim();
  const company = (body['company'] || '').toString().trim();
  const message = (body['message'] || '').toString().trim();

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const webhookUrl = process.env.SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Contact form: SHEET_WEBHOOK_URL is not set');
    return res.status(500).json({ error: 'Contact form is not configured yet' });
  }

  try {
    // Apps Script answers with a redirect to a googleusercontent URL; fetch follows it.
    const scriptRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, company, message }),
      redirect: 'follow',
    });

    const text = await scriptRes.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = null;
    }

    if (!scriptRes.ok || !result || !result.ok) {
      console.error('Sheet webhook error:', scriptRes.status, text.slice(0, 500));
      return res.status(502).json({ error: 'Failed to save message' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed:', err);
    return res.status(500).json({ error: 'Failed to save message' });
  }
}
