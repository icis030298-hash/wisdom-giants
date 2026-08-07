# Site audit — actionable tasks

- Target: `http://localhost:3001`
- Run: 2026-08-07T12:47:06.178Z → 2026-08-07T13:08:03.608Z
- Stages: 1, 2, 3, 4
- Findings: **470** across **5** types

Detail for every finding is in `audit-report.json`.

## Heading levels skip a level

`heading-skip` — **344** affected

**What is wrong.** Screen-reader users navigate by heading level; a jump from h2 to h4 hides structure. Lighthouse accessibility flags it. Note the checker reports only the FIRST skip per page, so one page can hide several — fix the earliest and re-run.

**Where to look.** Three distinct sources produce almost all of these. (1) "h2 followed by h4": the shared footer — src/components/footer.tsx renders <h2>Giants Wisdom</h2> then <h4> column headings (lines ~97 and ~111). This one affects every page on the site. (2) "h1 followed by h3": blog article bodies, whose markdown starts at "###" — see the markdown renderer used by src/app/[locale]/blog/[slug]/page.tsx and the content in src/data/blog-posts.ts. (3) "h1 followed by h4": pages with no body headings at all, so the footer h4 follows the page h1 directly.

**Fix.** Footer: demote the h2 to a styled div (it is a brand mark, not a section heading) or promote the column h4s to h3. Blog: render markdown "###" as h2, or downshift the whole article by one level.

**Examples**

- `http://localhost:3001/ar/debate` — h1 followed by h3 — full order: h1 > h3 > h3 > h2 > h3 > h3 > h3 > h3 > h2
- `http://localhost:3001/de/blog/rockefeller-monopoly-guide` — h1 followed by h3 — full order: h1 > h3 > h2 > h2 > h2 > h2 > h2 > h2 > h3 > h3 > h3 > h2
- `http://localhost:3001/de/blog/feynman-technique-learning` — h1 followed by h3 — full order: h1 > h3 > h2 > h2 > h2 > h2 > h2 > h2 > h2 > h3 > h3 > h3 > h2
- `http://localhost:3001/de/blog/da-vinci-time-management` — h1 followed by h3 — full order: h1 > h3 > h2 > h2 > h2 > h2 > h2 > h2 > h2 > h3 > h3 > h3 > h2
- `http://localhost:3001/de/blog/overwhelm-focus` — h1 followed by h3 — full order: h1 > h3 > h2 > h2 > h2 > h2 > h2 > h2 > h2 > h3 > h3 > h3 > h2
- …and 339 more (see audit-report.json)

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "http://localhost:3001/ar/debate" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit; the reported "full order" must have no gaps.

---

## Meta description outside 50–160 characters

`meta-description-length` — **74** affected

**What is wrong.** Too short wastes the snippet; too long is truncated mid-sentence.

**Where to look.** generateMetadata for the reported route.

**Fix.** Rewrite to 50–160 characters, keeping the primary keyword early.

**Examples**

- `http://localhost:3001/ar/chats` — 47 chars (want 50–160)
- `http://localhost:3001/ar/privacy` — 186 chars (want 50–160)
- `http://localhost:3001/ar/terms` — 176 chars (want 50–160)
- `http://localhost:3001/de/privacy` — 230 chars (want 50–160)
- `http://localhost:3001/de/terms` — 244 chars (want 50–160)
- …and 69 more (see audit-report.json)

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "http://localhost:3001/ar/chats" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit.

---

## Blog post has no entry for a locale

`blog-translation-absent` — **39** affected

**What is wrong.** The locale silently falls back or 404s.

**Where to look.** src/data/blog-posts.ts, the reported slug.

**Fix.** Inject the missing translation, or confirm the locale is excluded on purpose.

**Examples**

- `lincoln-leadership-depression [ru]` — no translations.ru entry although ru is an indexed blog locale
- `feynman-technique-learning [ru]` — no translations.ru entry although ru is an indexed blog locale
- `poe-obsession-psychology [ru]` — no translations.ru entry although ru is an indexed blog locale
- `tesla-edison-current-war [ru]` — no translations.ru entry although ru is an indexed blog locale
- `ford-automation-paradox [ru]` — no translations.ru entry although ru is an indexed blog locale
- …and 34 more (see audit-report.json)

**Confirm it is fixed.** STAGES=3 node scripts/site-audit.js

---

## Giant narrative missing for some locales (falls back to English)

`narrative-locale-fallback` — **10** affected

**What is wrong.** The page renders English prose under a localised heading — thin/duplicate content for that locale.

**Where to look.** src/data/narratives/<slug>.json, fields epic_<locale> etc.

**Fix.** Translate the missing locales, or accept the fallback deliberately.

**Examples**

- `agatha-christie` — 14/24 locales have no epic_<locale> and fall back to English: de, es, fr, ha, he, id, it, ja, nl, pl, pt, sw, tr, vi
- `al-ghazali` — 8/24 locales have no epic_<locale> and fall back to English: de, ha, id, it, nl, pl, sw, vi
- `ataturk` — 14/24 locales have no epic_<locale> and fall back to English: de, es, fr, ha, he, id, it, ja, nl, pl, pt, sw, tr, vi
- `averroes-ibn-rushd` — 14/24 locales have no epic_<locale> and fall back to English: de, es, fr, ha, he, id, it, ja, nl, pl, pt, sw, tr, vi
- `avicenna-ibn-sina` — 14/24 locales have no epic_<locale> and fall back to English: de, es, fr, ha, he, id, it, ja, nl, pl, pt, sw, tr, vi
- …and 5 more (see audit-report.json)

**Confirm it is fixed.** STAGES=3 node scripts/site-audit.js

---

## Blog translation fails the injection gate

`blog-gate-failure` — **3** affected

**What is wrong.** These are untranslated, truncated, prompt-leaked or duplicated records. Serving them creates index pollution.

**Where to look.** src/data/blog-posts.ts, the reported slug + locale. Gate logic: src/lib/injection-gate.ts (validateTranslationItem).

**Fix.** Re-translate the record, or let the noindex/sitemap filter exclude it.

**Examples**

- `rockefeller-monopoly-guide [fa]` — Arabic character ratio (0.02) is below 0.3 for fa
- `carnegie-gospel-wealth [fa]` — Arabic character ratio (0.02) is below 0.3 for fa
- `maimonides-wisdom [ja]` — Japanese translation contains Korean Hangul characters

**Confirm it is fixed.** STAGES=3 node scripts/site-audit.js — gateFailures must drop.

---
