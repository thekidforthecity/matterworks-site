// Vercel Serverless Function — replaces Netlify Forms for the contact form.
// Runtime: Node.js (default for /api routes, no config needed).
//
// Sends the submission by email via Resend (https://resend.com).
// Requires two environment variables set in the Vercel project:
//   RESEND_API_KEY   - API key from your Resend account
//   CONTACT_TO_EMAIL - inbox that should receive submissions (e.g. hello@matterworkslt.com)
// Optional:
//   CONTACT_FROM_EMAIL - verified sender address in Resend (defaults to onboarding@resend.dev,
//                         which works immediately but looks less trustworthy in inboxes;
//                         verify your own domain in Resend and set this once you can)

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

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || !toEmail) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return res.status(500).json({ error: 'Contact form is not configured yet' });
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `MatterWorks Site <${fromEmail}>`,
        to: [toEmail],
        reply_to: email,
        subject: `New contact form submission from ${firstName} ${lastName}`,
        text: [
          `Name: ${firstName} ${lastName}`,
          `Email: ${email}`,
          `Company: ${company || '(not provided)'}`,
          '',
          'Message:',
          message,
        ].join('\n'),
      }),
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text();
      console.error('Resend API error:', emailRes.status, detail);
      return res.status(502).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
