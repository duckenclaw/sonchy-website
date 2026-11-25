# Email capture setup

The `/education` page has a section where a visitor leaves their email and immediately
receives a mail from `creative@xsonchy.com` with the files in `server/attachments/`.

This is a one-time setup. Work through it top to bottom; the whole thing takes about
half an hour, most of which is waiting for DNS.

**How it fits together**

```
visitor → POST /api/subscribe → Express (server/index.js) → Resend → visitor's inbox
```

The same Railway service now serves the built site _and_ the API. Nothing stores the
submitted addresses — the server sends the mail and forgets. There is no mailing list.

---

## 1. Resend account and domain

1. Sign up at [resend.com](https://resend.com) (free plan is enough — see §8).
2. **Domains → Add Domain** → enter `xsonchy.com`, pick the region closest to your
   audience (EU for Russia/Europe).
3. Resend shows a **Records** table: a DKIM `TXT`, an SPF `TXT`, and an `MX` (or
   `CNAME`) for the `send.xsonchy.com` return path.

Leave this tab open — you copy these into Namecheap next. **The exact names and values
are generated for your domain, so copy them verbatim from that table.** Do not use
values from any guide, including this one.

> Resend suggests a subdomain (e.g. `mail.xsonchy.com`) for best deliverability. We are
> verifying the root domain so we can send as `creative@xsonchy.com`. That is supported;
> a subdomain would force the sender to be `creative@mail.xsonchy.com`.

## 2. Namecheap DNS

Namecheap → **Domain List** → `xsonchy.com` → **Manage** → **Advanced DNS** →
**Add New Record**, once per row in Resend's table.

Two things that trip people up:

- **Hosts are relative.** Where Resend shows `send.xsonchy.com`, Namecheap's Host field
  takes `send`. Where Resend shows the bare domain, enter `@`. Never paste the full
  domain into the Host field — you will end up with `send.xsonchy.com.xsonchy.com`.
- **Do not touch the existing `A` / `CNAME` records** that point `xsonchy.com` at
  Railway. You are only adding records, never editing or deleting.

Then go back to Resend and press **Verify DNS Records**. This usually completes in under
15 minutes; DNS can legitimately take up to 72 hours. Keep checking until the domain
shows **Verified**.

> **Will this break email to `@xsonchy.com`?** No. The `MX` record you add is on the
> `send` subdomain, which only handles bounce reports. Mail addressed to
> `@xsonchy.com` is governed by the root `@` MX records, which you are not touching —
> so a real mailbox can be added later without conflict.

## 3. About `creative@xsonchy.com`

Verifying the domain lets Resend **send** as `creative@xsonchy.com` even though no
mailbox exists behind it. Outgoing mail works; **replies to it go nowhere.**

So set `MAIL_REPLY_TO` (next steps) to an address you actually read. Then a reply from a
visitor lands in a real inbox even though the `From:` line reads `creative@xsonchy.com`.

If you later want `creative@xsonchy.com` to genuinely receive mail, that is a separate
purchase — Namecheap Private Email, Zoho Mail (has a free tier), or Google Workspace —
and it needs **root** `MX` records, which the provider will give you. It does not change
anything in this setup.

## 4. API key

Resend → **API Keys** → **Create API Key**:

- Permission: **Sending access** only (not full access)
- Domain: `xsonchy.com`

Copy it now — Resend shows it once. It starts with `re_`.

**Never commit this key.** `.env` is gitignored; `.env.example` holds only dummies.

## 5. Railway

Open the existing service for this repo.

**Variables tab** — add three:

| Variable         | Value                           |
| ---------------- | ------------------------------- |
| `RESEND_API_KEY` | the `re_…` key from §4          |
| `MAIL_FROM`      | `Sonchy <creative@xsonchy.com>` |
| `MAIL_REPLY_TO`  | an inbox you actually read      |

Optionally `MAIL_SUBJECT` to override the default subject line.

**Do not set `PORT`.** Railway injects it, and the server reads it from the environment.

**Settings → Deploy** — this repo had no `railway.json` or `nixpacks.toml`, so the
service was running on Railway's auto-detection, which for a Vite project serves the
static `dist/` folder. **Adding a Node server changes that**, so confirm:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Healthcheck Path**: `/api/health`

If a static-site or Caddy setting is configured, clear it — the Express server now does
the static serving itself.

> **Bonus fix:** the old static setup had no SPA rewrite, so hard-reloading a deep link
> like `/services/consulting` returned a 404. The Express server returns `index.html`
> for unmatched paths, which fixes that.

## 6. The attachment files

Put the files to be emailed in **`server/attachments/`**, commit, and push. Railway
redeploys and picks them up.

- Every file in that folder is attached to every mail. Dotfiles and `README.md` are skipped.
- They are read **once at startup** — a new file needs a redeploy, not just an upload.
- Keep the total under **~10MB**. Resend's hard cap is 40MB after base64 encoding, but
  anything near that gets filtered as spam. For bigger files, link to them in the mail
  body instead (`buildMailHtml()` at the bottom of `server/index.js`).

With the folder empty, the server still boots and sends the mail with no attachments,
logging a warning — so you can test the flow before the files exist.

## 7. Verify, and what to do when it breaks

**Locally:**

```bash
cp .env.example .env    # then paste the real RESEND_API_KEY
npm run build
npm start               # http://localhost:3000
```

Submit the form at `http://localhost:3000/education`. Then check **Resend → Emails** —
every attempt shows up there with its delivery status. That log is always the first place
to look.

| Symptom                                      | Cause                                                                                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `validation_error`, "domain is not verified" | §2 not finished. Check the domain shows **Verified**.                                                                              |
| "from address not allowed"                   | `MAIL_FROM` is not on the verified domain. It must be `@xsonchy.com`.                                                              |
| Mail sends locally, 500 on Railway           | Variables not set on the service, or set on the wrong service.                                                                     |
| `/api/subscribe` returns HTML, not JSON      | The server is not running — Railway is still serving static files. Re-check §5's Start Command.                                    |
| Blank page in production                     | `npm run build` did not run, so `dist/` is missing.                                                                                |
| Mail lands in spam                           | Expected at first for a brand-new sending domain. Add a DMARC record (`_dmarc` TXT, `v=DMARC1; p=none;`) and let reputation build. |
| `429` from the form                          | The rate limiter (5 submissions per IP per 10 minutes). Expected while testing.                                                    |
| Nothing arrives, Resend log clean            | Over the 100/day free cap — the log will say so.                                                                                   |

## 8. Limits and costs

Resend's free plan: **3,000 emails/month, 100/day**, 3 domains, 1 webhook, 30-day log
retention. The API rate limit is 10 requests/second on every plan.

Two things worth knowing about this implementation:

- The per-IP rate limiter lives in memory, so **it resets on every redeploy** and is not
  shared across instances. Fine for one small service; if you ever scale to several, it
  stops being a real limit.
- **No addresses are stored anywhere** — not in a database, not in a file, not in a
  Resend audience. This is deliberate. If you later want a mailing list, that is a new
  feature: either push the address to a Resend Audience, or add a database.

---

## Files involved

| Path                                    | What it does                                               |
| --------------------------------------- | ---------------------------------------------------------- |
| `server/index.js`                       | Express server: the API, the static site, the SPA fallback |
| `server/attachments/`                   | Files attached to every mail                               |
| `.env.example`                          | Template for `.env` (local) and Railway's Variables        |
| `src/pages/education/email-section.tsx` | The form                                                   |
| `src/pages/education/education-data.ts` | All the section's visible copy                             |

To change the **section's wording**, edit `education-data.ts`. To change the **mail
body**, edit `buildMailHtml()` / `buildMailText()` at the bottom of `server/index.js`.

## Local development

Two terminals, because Vite serves the SPA and Express serves the API:

```bash
npm run dev          # http://localhost:5173 — the site
npm run dev:server   # http://localhost:3000 — the API
```

Vite proxies `/api` to port 3000, so use `localhost:5173` and the form just works.
