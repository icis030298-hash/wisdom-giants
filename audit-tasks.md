# Site audit — actionable tasks

- Target: `https://www.giantswisdom.com`
- Run: 2026-08-07T11:17:22.628Z → 2026-08-07T11:25:20.145Z
- Stages: 1, 2, 3, 4
- Findings: **1555** across **8** types

Detail for every finding is in `audit-report.json`.

## Heading levels skip a level

`heading-skip` — **984** affected

**What is wrong.** Screen-reader users navigate by heading level; a jump from h2 to h4 hides structure. Lighthouse accessibility flags it. Note the checker reports only the FIRST skip per page, so one page can hide several — fix the earliest and re-run.

**Where to look.** Three distinct sources produce almost all of these. (1) "h2 followed by h4": the shared footer — src/components/footer.tsx renders <h2>Giants Wisdom</h2> then <h4> column headings (lines ~97 and ~111). This one affects every page on the site. (2) "h1 followed by h3": blog article bodies, whose markdown starts at "###" — see the markdown renderer used by src/app/[locale]/blog/[slug]/page.tsx and the content in src/data/blog-posts.ts. (3) "h1 followed by h4": pages with no body headings at all, so the footer h4 follows the page h1 directly.

**Fix.** Footer: demote the h2 to a styled div (it is a brand mark, not a section heading) or promote the column h4s to h3. Blog: render markdown "###" as h2, or downshift the whole article by one level.

**Examples**

- `https://www.giantswisdom.com/ar/giant/katsushika-hokusai` — h2 followed by h4 — full order: h1 > h2 > h2 > h4 > h4
- `https://www.giantswisdom.com/ar/giant/sun-yat-sen` — h2 followed by h4 — full order: h1 > h2 > h2 > h4 > h4
- `https://www.giantswisdom.com/ar/giant/harriet-beecher-stowe` — h2 followed by h4 — full order: h1 > h2 > h2 > h4 > h4
- `https://www.giantswisdom.com/ar/giant/machiavelli` — h2 followed by h4 — full order: h1 > h2 > h2 > h4 > h4
- `https://www.giantswisdom.com/ar/giant/napoleon-bonaparte` — h2 followed by h4 — full order: h1 > h2 > h2 > h4 > h4
- …and 979 more (see audit-report.json)

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "https://www.giantswisdom.com/ar/giant/katsushika-hokusai" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit; the reported "full order" must have no gaps.

---

## Meta description outside 50–160 characters

`meta-description-length` — **324** affected

**What is wrong.** Too short wastes the snippet; too long is truncated mid-sentence.

**Where to look.** generateMetadata for the reported route.

**Fix.** Rewrite to 50–160 characters, keeping the primary keyword early.

**Examples**

- `https://www.giantswisdom.com/ar/giant/al-kindi` — 169 chars (want 50–160)
- `https://www.giantswisdom.com/ar/chats` — 47 chars (want 50–160)
- `https://www.giantswisdom.com/ar/terms` — 176 chars (want 50–160)
- `https://www.giantswisdom.com/ar/privacy` — 186 chars (want 50–160)
- `https://www.giantswisdom.com/de/blog/rockefeller-monopoly-guide` — 178 chars (want 50–160)
- …and 319 more (see audit-report.json)

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "https://www.giantswisdom.com/ar/giant/al-kindi" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit.

---

## No JSON-LD in the served HTML

`jsonld-missing` — **144** affected

**What is wrong.** Without structured data the page cannot earn rich results.

**Where to look.** The page component. Note: JSON-LD present only inside the self.__next_f flight payload does NOT count — it is not in the DOM the crawler parses.

**Fix.** Render <script type="application/ld+json"> from the server component, outside any Suspense boundary that bails.

**Examples**

- `https://www.giantswisdom.com/ar/test` — no <script type="application/ld+json"> in HTML
- `https://www.giantswisdom.com/ar/chats` — no <script type="application/ld+json"> in HTML
- `https://www.giantswisdom.com/ar/terms` — no <script type="application/ld+json"> in HTML
- `https://www.giantswisdom.com/ar/debate` — no <script type="application/ld+json"> in HTML
- `https://www.giantswisdom.com/ar/privacy` — no <script type="application/ld+json"> in HTML
- …and 139 more (see audit-report.json)

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "https://www.giantswisdom.com/ar/test" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit; jsonLdTags must be > 0 and every block must JSON.parse.

---

## No navigation links in the served HTML

`nav-missing` — **48** affected

**What is wrong.** Crawlers discover the rest of the site through these links, and users cannot leave the page.

**Where to look.** The page component — <Navigation /> must be rendered from the server component, not from inside a Suspense boundary that bails to CSR.

**Fix.** Render <Navigation /> in page.tsx, as [locale]/page.tsx and blog/[slug]/page.tsx do.

**Examples**

- `https://www.giantswisdom.com/ar/test` — no links inside any <nav>
- `https://www.giantswisdom.com/ar/about` — no links inside any <nav>
- `https://www.giantswisdom.com/de/test` — no links inside any <nav>
- `https://www.giantswisdom.com/de/about` — no links inside any <nav>
- `https://www.giantswisdom.com/el/test` — no links inside any <nav>
- …and 43 more (see audit-report.json)

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "https://www.giantswisdom.com/ar/test" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit; navLinks should match the other page types.

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

## Page does not have exactly one h1

`h1-count` — **3** affected

**What is wrong.** Zero h1 usually means the content never reached the HTML; more than one dilutes the page topic and trips Lighthouse SEO.

**Where to look.** The page component and any shared layout/hero that also renders a heading.

**Fix.** Keep a single h1 per page; demote the rest to h2.

**Examples**

- `https://www.giantswisdom.com/de/blog/al-ghazali-wisdom` — expected exactly 1 h1, found 2
- `https://www.giantswisdom.com/id/blog/ibn-sina-wisdom` — expected exactly 1 h1, found 2
- `https://www.giantswisdom.com/ru/blog/al-ghazali-wisdom` — expected exactly 1 h1, found 2

**Reproduce**

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "https://www.giantswisdom.com/de/blog/al-ghazali-wisdom" > /tmp/page.html
```

**Confirm it is fixed.** Re-run this audit — h1Count must be 1.

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
