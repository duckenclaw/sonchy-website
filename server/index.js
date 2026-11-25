import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { Resend } from 'resend';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const ATTACHMENTS_DIR = path.join(HERE, 'attachments');

const PORT = Number(process.env.PORT) || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_REPLY_TO = process.env.MAIL_REPLY_TO;
const MAIL_SUBJECT = process.env.MAIL_SUBJECT || 'Материалы от Sonchy';

/** Resend caps a message at 40MB post-base64; stay far below for deliverability. */
const ATTACHMENT_WARN_BYTES = 10 * 1024 * 1024;
const MAX_EMAIL_LENGTH = 254;
/** Requests one IP may make inside RATE_WINDOW_MS before being turned away. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

if (!RESEND_API_KEY || !MAIL_FROM) {
  console.error(
    'Missing required environment variables: RESEND_API_KEY and MAIL_FROM must both be set.\n' +
      'Copy .env.example to .env for local work, or set them in Railway → Variables.',
  );
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

/**
 * The attachments are small and never change at runtime, so they are read once
 * at boot rather than per request.
 * @returns {{ filename: string, content: Buffer }[]}
 */
function loadAttachments() {
  if (!fs.existsSync(ATTACHMENTS_DIR)) {
    console.warn(`No ${ATTACHMENTS_DIR} directory — sending mail without attachments.`);
    return [];
  }

  const files = fs
    .readdirSync(ATTACHMENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .filter((entry) => entry.name !== 'README.md')
    .map((entry) => entry.name)
    .sort();

  if (files.length === 0) {
    console.warn(
      'server/attachments/ is empty — mail will be sent with no files attached. ' +
        'Drop the files to send into that folder and redeploy.',
    );
    return [];
  }

  const attachments = files.map((filename) => ({
    filename,
    content: fs.readFileSync(path.join(ATTACHMENTS_DIR, filename)),
  }));

  const totalBytes = attachments.reduce((sum, file) => sum + file.content.length, 0);
  const totalMb = (totalBytes / 1024 / 1024).toFixed(2);
  console.log(`Loaded ${attachments.length} attachment(s), ${totalMb}MB total:`);
  for (const file of attachments) {
    console.log(`  - ${file.filename} (${(file.content.length / 1024).toFixed(0)}KB)`);
  }
  if (totalBytes > ATTACHMENT_WARN_BYTES) {
    console.warn(
      `Attachments total ${totalMb}MB. Resend's hard cap is 40MB after base64 encoding, ` +
        'but anything this large hurts deliverability — consider linking to the files instead.',
    );
  }

  return attachments;
}

const ATTACHMENTS = loadAttachments();

/** Deliberately permissive — the mail provider is the final judge of an address. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

/** @param {unknown} value */
function isValidEmail(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_EMAIL_LENGTH &&
    EMAIL_PATTERN.test(value)
  );
}

/**
 * In-memory, per-IP throttle. Resets on redeploy and is not shared between
 * instances, which is fine for a single small service.
 * @type {Map<string, number[]>}
 */
const hits = new Map();

/** @param {string} ip */
function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Drop stale entries so the map cannot grow without bound.
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    const recent = times.filter((at) => now - at < RATE_WINDOW_MS);
    if (recent.length === 0) hits.delete(ip);
    else hits.set(ip, recent);
  }
}, RATE_WINDOW_MS).unref();

const app = express();

// Railway terminates TLS upstream, so the client IP arrives in X-Forwarded-For.
app.set('trust proxy', 1);
// The body is a single email address; anything larger is not ours.
app.use(express.json({ limit: '1kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, attachments: ATTACHMENTS.length });
});

app.post('/api/subscribe', async (req, res) => {
  const { email, botField } = req.body ?? {};

  // A filled honeypot means a bot. Look successful, send nothing.
  if (typeof botField === 'string' && botField.trim() !== '') {
    return res.json({ ok: true });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  if (isRateLimited(req.ip ?? 'unknown')) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [email],
      ...(MAIL_REPLY_TO ? { replyTo: MAIL_REPLY_TO } : {}),
      subject: MAIL_SUBJECT,
      html: buildMailHtml(),
      text: buildMailText(),
      ...(ATTACHMENTS.length > 0 ? { attachments: ATTACHMENTS } : {}),
    });

    if (error) {
      // Log the provider's reason; tell the client nothing beyond "it failed".
      console.error('Resend rejected the send:', error);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    return res.json({ ok: true });
  } catch (cause) {
    console.error('Unexpected error while sending:', cause);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
});

// Unmatched API paths answer in JSON rather than falling through to the SPA.
app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, error: 'not_found' });
});

app.use(express.static(DIST_DIR));

/**
 * SPA fallback. BrowserRouter owns the URL, so every unmatched path has to come
 * back as index.html or deep links 404 on reload.
 *
 * Written as app.use, not app.get('*'): Express 5 ships path-to-regexp v8,
 * where a bare '*' pattern throws at startup. This form works on 4 and 5.
 */
app.use((_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
  console.log(`Serving static files from ${DIST_DIR}`);
  console.log(
    `Sending as ${MAIL_FROM}${MAIL_REPLY_TO ? ` (replies to ${MAIL_REPLY_TO})` : ''}`,
  );
});

/** Body of the mail. Edit freely — it is plain HTML. */
function buildMailHtml() {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #232b36;">
      <p>Привет!</p>
      <p>Спасибо за интерес — материалы во вложении к этому письму.</p>
      <p>— Sonchy</p>
    </div>
  `.trim();
}

/** Plain-text alternative. Clients that reject HTML-only mail need this. */
function buildMailText() {
  return [
    'Привет!',
    '',
    'Спасибо за интерес — материалы во вложении к этому письму.',
    '',
    '— Sonchy',
  ].join('\n');
}
