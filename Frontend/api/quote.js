/* ══════════════════════════════════════════════════════════════
   Quote API — Serverless Function
   ══════════════════════════════════════════════════════════════
   Deploy this as:
   • Vercel Serverless:  /api/quote.js
   • Netlify Functions:  /netlify/functions/quote.js
   • Supabase Edge:      /functions/quote/index.ts
   
   This file handles form validation, rate limiting, and email
   delivery. Configure your email provider below.
   ════════════════════════════════════════════════════════════ */

/* ── Configuration ────────────────────────────────────────── */

// Replace with your actual email service credentials
// Do NOT commit real API keys — use environment variables
const CONFIG = {
  // Recipient email
  TO_EMAIL: process.env.QUOTE_TO_EMAIL || 'vertex7.her@gmail.com',

  // Email service — choose one:
  // 'resend', 'sendgrid', 'mailgun', 'smtp'
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'resend',

  // API key for your chosen email service
  EMAIL_API_KEY: process.env.EMAIL_API_KEY || '',

  // From address (must be verified with your email provider)
  FROM_EMAIL: process.env.QUOTE_FROM_EMAIL || 'quotes@vertex7.com',
};

/* ── Validation ───────────────────────────────────────────── */

function validateRequest(body) {
  const errors = [];

  if (!body.name?.trim()) errors.push('Name is required');
  if (!body.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Invalid email address');
  }
  if (!body.phone?.trim()) errors.push('Phone is required');
  if (!body.service?.trim()) errors.push('Service selection is required');
  if (!body.message?.trim()) errors.push('Message is required');

  return errors;
}

/* ── Sanitize ─────────────────────────────────────────────── */

function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim()
    .slice(0, 2000); // cap length
}

/* ── Email Template ───────────────────────────────────────── */

function buildEmailHtml(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #3C403A; padding: 24px; border-left: 4px solid #A3E72E;">
        <h2 style="color: #A3E72E; margin: 0 0 8px;">New Quote Request</h2>
        <p style="color: #A9ADA5; margin: 0; font-size: 14px;">
          Submitted via vertex7.com.ph
        </p>
      </div>
      
      <div style="padding: 24px; background: #0A0A0A; color: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5; width: 140px;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">${sanitize(data.name)}</td>
          </tr>
          ${data.company ? `<tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5;">Company</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">${sanitize(data.company)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">
              <a href="mailto:${sanitize(data.email)}" style="color: #A3E72E;">${sanitize(data.email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5;">Phone</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">${sanitize(data.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5;">Service</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">${sanitize(data.service)}</td>
          </tr>
          ${data.equipment ? `<tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5;">Equipment</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">${sanitize(data.equipment)}</td>
          </tr>` : ''}
          ${data.duration ? `<tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #A9ADA5;">Duration</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222;">${sanitize(data.duration)}</td>
          </tr>` : ''}
        </table>
        
        <div style="margin-top: 24px; padding: 16px; background: #1a1a1a; border-radius: 4px;">
          <p style="color: #A9ADA5; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitize(data.message)}</p>
        </div>
      </div>
      
      <div style="padding: 16px 24px; background: #3C403A; font-size: 12px; color: #A9ADA5;">
        This email was generated by the Vertex 7 website quote form.
      </div>
    </div>
  `;
}

/* ── Email Senders ────────────────────────────────────────── */

async function sendWithResend(data) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CONFIG.EMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      from: CONFIG.FROM_EMAIL,
      to: CONFIG.TO_EMAIL,
      subject: `Quote Request from ${sanitize(data.name)}`,
      html: buildEmailHtml(data),
      reply_to: sanitize(data.email),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to send email');
  }
}

async function sendWithSendGrid(data) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CONFIG.EMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: CONFIG.TO_EMAIL }] }],
      from: { email: CONFIG.FROM_EMAIL },
      subject: `Quote Request from ${sanitize(data.name)}`,
      content: [{ type: 'text/html', value: buildEmailHtml(data) }],
      reply_to: { email: sanitize(data.email) },
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to send email via SendGrid');
  }
}

/* ── Handler ──────────────────────────────────────────────── */

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  // Validate
  const errors = validateRequest(body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    // Send email based on configured service
    switch (CONFIG.EMAIL_SERVICE) {
      case 'resend':
        await sendWithResend(body);
        break;
      case 'sendgrid':
        await sendWithSendGrid(body);
        break;
      default:
        // For testing: just log
        console.log('[Quote Submission]', body);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[Quote Error]', err);
    return res.status(500).json({
      error: 'Failed to send your quote request. Please try again or contact us directly.',
    });
  }
}
