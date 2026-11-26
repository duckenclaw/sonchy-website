import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { Resend } from 'resend';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const DIST_DIR = path.join(ROOT, 'dist');
/** The PDFs ship as static assets, so they are both mailable and linkable. */
const MATERIALS_DIRS = [
  path.join(DIST_DIR, 'education'),
  path.join(ROOT, 'public', 'education'),
];

const PORT = Number(process.env.PORT) || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_REPLY_TO = process.env.MAIL_REPLY_TO;
const MAIL_SUBJECT = process.env.MAIL_SUBJECT || 'Материалы от Sonchy';
const SITE_URL = (process.env.SITE_URL || 'https://xsonchy.com').replace(/\/+$/, '');

/**
 * Resend's hard cap is 40MB after base64, but most inboxes reject well before
 * that — Gmail and Outlook stop around 25MB. Anything over this is linked
 * rather than attached, so an oversized file degrades instead of bouncing.
 */
const ATTACH_MAX_BYTES = 8 * 1024 * 1024;
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
 * The free materials, keyed by the slug the form posts. Keep these keys in
 * step with `material` in src/pages/education/lectures-data.ts.
 */
const MATERIALS = {
  constructor: { file: 'constructor.pdf', title: 'Конструктор персонажа' },
  speechcard: { file: 'speechcard.pdf', title: 'Речевая карта' },
};

/** @param {string} file */
function findMaterialFile(file) {
  for (const dir of MATERIALS_DIRS) {
    const full = path.join(dir, file);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

/**
 * Read once at boot: the files are static and never change at runtime. Each
 * entry carries a public URL, and the bytes too when it is small enough to
 * attach.
 * @returns {Map<string, { title: string, filename: string, url: string, content: Buffer | null }>}
 */
function loadMaterials() {
  const loaded = new Map();

  for (const [slug, { file, title }] of Object.entries(MATERIALS)) {
    const full = findMaterialFile(file);
    const url = `${SITE_URL}/education/${file}`;

    if (!full) {
      console.error(
        `Material "${slug}": ${file} not found in ${MATERIALS_DIRS.join(' or ')}. ` +
          'Mail for it will link to the site and the link will 404 until the file is added.',
      );
      loaded.set(slug, { title, filename: file, url, content: null });
      continue;
    }

    const content = fs.readFileSync(full);
    const mb = (content.length / 1024 / 1024).toFixed(2);

    if (content.length > ATTACH_MAX_BYTES) {
      console.warn(
        `Material "${slug}": ${file} is ${mb}MB, over the ${ATTACH_MAX_BYTES / 1024 / 1024}MB ` +
          'attach limit — mail will link to it instead of attaching it.',
      );
      loaded.set(slug, { title, filename: file, url, content: null });
      continue;
    }

    console.log(`Material "${slug}": ${file} (${mb}MB, attached)`);
    loaded.set(slug, { title, filename: file, url, content });
  }

  return loaded;
}

const LOADED_MATERIALS = loadMaterials();

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
  res.json({ ok: true, materials: [...LOADED_MATERIALS.keys()] });
});

app.post('/api/subscribe', async (req, res) => {
  const { email, botField, material } = req.body ?? {};

  // A filled honeypot means a bot. Look successful, send nothing.
  if (typeof botField === 'string' && botField.trim() !== '') {
    return res.json({ ok: true });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  // 404 rather than 400: the form maps 400 to "check your address", which
  // would be the wrong thing to tell someone about a slug mismatch.
  const chosen = typeof material === 'string' ? LOADED_MATERIALS.get(material) : undefined;
  if (!chosen) {
    return res.status(404).json({ ok: false, error: 'unknown_material' });
  }

  if (isRateLimited(req.ip ?? 'unknown')) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [email],
      ...(MAIL_REPLY_TO ? { replyTo: MAIL_REPLY_TO } : {}),
      subject: `${MAIL_SUBJECT}: ${chosen.title}`,
      html: buildMailHtml(chosen),
      text: buildMailText(chosen),
      ...(chosen.content
        ? { attachments: [{ filename: chosen.filename, content: chosen.content }] }
        : {}),
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
  console.log(`Materials: ${[...LOADED_MATERIALS.keys()].join(', ') || 'none'}`);
});

/**
 * Body of the mail. Edit freely — it is plain HTML.
 * @param {{ title: string, url: string, content: Buffer | null }} material
 */
function buildMailHtml(material) {
  const delivery = material.content
    ? `<p>«${material.title}» — во вложении к этому письму.</p>
       <p>Если вложение не открывается, файл всегда можно скачать здесь:<br />
       <a href="${material.url}">${material.url}</a></p>`
    : `<p>«${material.title}» можно скачать по ссылке:<br />
       <a href="${material.url}">${material.url}</a></p>`;

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #232b36;">
      <p>Привет!</p>
      <p>Спасибо за интерес — держите материал.</p>
      ${delivery}
      <p>— Sonchy</p>
    </div>
  `.trim();
}

/**
 * Plain-text alternative. Clients that reject HTML-only mail need this.
 * @param {{ title: string, url: string, content: Buffer | null }} material
 */
function buildMailText(material) {
  const delivery = material.content
    ? [
        `«${material.title}» — во вложении к этому письму.`,
        '',
        `Запасная ссылка: ${material.url}`,
      ]
    : [`«${material.title}» можно скачать по ссылке:`, material.url];

  return [
    'Привет!',
    '',
    'Спасибо за интерес — держите материал.',
    '',
    ...delivery,
    '',
    '— Sonchy',
  ].join('\n');
}
