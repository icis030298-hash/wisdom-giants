#!/usr/bin/env node
/**
 * scripts/site-audit.js — whole-site SEO / rendering / data audit.
 *
 *   node scripts/site-audit.js                      # production
 *   BASE_URL=http://localhost:3000 node scripts/site-audit.js
 *   STAGES=3,4 node scripts/site-audit.js           # data stages only, no network
 *   SAMPLE_PER_TYPE=5 node scripts/site-audit.js    # smaller stage-2 sample
 *
 * Stages
 *   1  every sitemap URL -> HEAD, list everything that is not 200
 *   2  sampled raw HTML -> render / SEO assertions
 *   3  static data scan (no network) via src/lib/injection-gate.ts
 *   4  cross-check: sitemap membership vs. what the page/data says about robots
 *
 * Outputs audit-report.json (detail) and audit-tasks.md (actionable), plus a
 * console summary.
 *
 * Run with a raised heap — src/data/blog-posts.ts is ~37MB of source:
 *   node --max-old-space-size=8192 scripts/site-audit.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = (process.env.BASE_URL || 'https://www.giantswisdom.com').replace(/\/$/, '');
const STAGES = (process.env.STAGES || '1,2,3,4').split(',').map(s => s.trim());
const SAMPLE_PER_TYPE = Number(process.env.SAMPLE_PER_TYPE || 20);
const HEAD_CHUNK = Number(process.env.HEAD_CHUNK || 40);
const HTML_CHUNK = Number(process.env.HTML_CHUNK || 6);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 30000);
const OUT_JSON = process.env.OUT_JSON || path.join(process.cwd(), 'audit-report.json');
const OUT_MD = process.env.OUT_MD || path.join(process.cwd(), 'audit-tasks.md');

const CRAWLER_UA =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

// 24 locales, mirrored from src/config/locale-status.ts (verified at runtime).
const EXPECTED_HREFLANG = 25; // 24 locales + x-default

// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------

/**
 * Every problem is recorded as one finding. `type` groups them in audit-tasks.md,
 * so keep the string stable — it is what the follow-up work is organised by.
 */
const findings = [];
function addFinding(type, url, detail, extra) {
  findings.push({ type, url, detail, ...(extra || {}) });
}

const stats = {
  baseUrl: BASE_URL,
  startedAt: new Date().toISOString(),
  stagesRun: [],
  stage1: null,
  stage2: null,
  stage3: null,
  stage4: null,
};

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

/**
 * Removes the RSC flight payload before any counting.
 *
 * Next serialises the whole component tree into `self.__next_f.push([...])`
 * script blocks. Those blocks contain escaped copies of every tag on the page,
 * so a naive regex over the raw response reports h1s and JSON-LD that are not
 * actually in the DOM the crawler parses. Strip them first; count after.
 */
function stripFlightPayload(raw) {
  return raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, m =>
    m.includes('self.__next_f') ? '' : m
  );
}

/** Index just past the `</div>` that closes the div opened at `from`. */
function endOfDiv(html, from) {
  const re = /<\/?div\b/gi;
  re.lastIndex = from;
  let depth = 1;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === '/' ? -1 : 1;
    if (depth === 0) return html.indexOf('>', m.index) + 1;
  }
  return html.length;
}

/**
 * Puts React's out-of-order streamed chunks back where they belong.
 *
 * When a Suspense boundary resolves after the shell has already flushed, React
 * emits the content at the END of the document inside `<div hidden id="S:n">`
 * and leaves a `<template id="B:n">` at the real position; an inline script
 * moves it at parse time. Raw byte order therefore shows the footer before the
 * page heading, which makes any order-sensitive check (heading hierarchy, "is
 * the h1 first") report nonsense. Reconstruct the post-relocation order first.
 */
function reconstructStreamedHtml(html) {
  const opens = [...html.matchAll(/<div hidden id="S:([^"]+)">/g)];
  if (!opens.length) return { html, relocated: 0 };

  const blocks = opens.map(m => {
    const contentStart = m.index + m[0].length;
    const closeEnd = endOfDiv(html, contentStart);
    return {
      id: m[1],
      start: m.index,
      end: closeEnd,
      content: html.slice(contentStart, closeEnd - '</div>'.length),
    };
  });

  // Excise the trailing hidden blocks (back to front, so offsets stay valid)…
  let out = html;
  for (const b of [...blocks].reverse()) out = out.slice(0, b.start) + out.slice(b.end);

  // …then drop each one into its placeholder.
  let relocated = 0;
  for (const b of blocks) {
    const placeholder = new RegExp(`<template id="B:${b.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>\\s*</template>`);
    if (placeholder.test(out)) {
      out = out.replace(placeholder, b.content);
      relocated++;
    }
  }
  return { html: out, relocated };
}

function countMatches(html, re) {
  return (html.match(re) || []).length;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function request(url, { method = 'GET', redirect = 'manual' } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();
  try {
    const res = await fetch(url, {
      method,
      redirect,
      headers: { 'user-agent': CRAWLER_UA },
      signal: ctrl.signal,
    });
    const body = method === 'GET' ? await res.text() : '';
    return {
      ok: true,
      status: res.status,
      location: res.headers.get('location'),
      cache: res.headers.get('x-vercel-cache') || res.headers.get('x-nextjs-cache'),
      ms: Date.now() - startedAt,
      body,
    };
  } catch (err) {
    return { ok: false, status: 0, error: err.name === 'AbortError' ? 'timeout' : err.message, ms: Date.now() - startedAt, body: '' };
  } finally {
    clearTimeout(timer);
  }
}

/** Runs `worker` over `items` with a fixed number of parallel slots. */
async function pooled(items, size, worker, onProgress) {
  const out = [];
  let index = 0;
  let done = 0;
  const slots = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (index < items.length) {
      const i = index++;
      out[i] = await worker(items[i], i);
      done++;
      if (onProgress && done % Math.max(1, Math.floor(items.length / 20)) === 0) {
        onProgress(done, items.length);
      }
    }
  });
  await Promise.all(slots);
  return out;
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/** Rewrites a sitemap URL (always canonical/production) onto BASE_URL. */
function toBase(url) {
  try {
    const u = new URL(url);
    return BASE_URL + u.pathname + u.search;
  } catch {
    return null;
  }
}

function classify(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const locale = parts[0] || '';
  if (parts[1] === 'giant' && parts[2]) return { locale, type: 'giant', slug: parts[2] };
  if (parts[1] === 'blog' && parts[2]) return { locale, type: 'blog', slug: parts[2] };
  return { locale, type: 'static', slug: parts.slice(1).join('/') || '(root)' };
}

/** Evenly spaced sample so we do not only ever look at the first N slugs. */
function sample(list, n) {
  if (list.length <= n) return list.slice();
  const step = list.length / n;
  const out = [];
  for (let i = 0; i < n; i++) out.push(list[Math.floor(i * step)]);
  return out;
}

// ---------------------------------------------------------------------------
// Stage 1 — every sitemap URL, HEAD
// ---------------------------------------------------------------------------

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

async function collectSitemapUrls() {
  const rootUrl = `${BASE_URL}/sitemap.xml`;
  const root = await request(rootUrl);
  if (!root.ok || root.status !== 200) {
    addFinding('sitemap-unreachable', rootUrl, `sitemap.xml returned ${root.status || root.error}`);
    return { urls: [], children: [] };
  }

  const isIndex = /<sitemapindex/i.test(root.body);
  if (!isIndex) return { urls: parseLocs(root.body), children: [rootUrl] };

  const children = parseLocs(root.body).map(toBase).filter(Boolean);
  const urls = [];
  for (const child of children) {
    const res = await request(child);
    if (!res.ok || res.status !== 200) {
      addFinding('sitemap-child-unreachable', child, `child sitemap returned ${res.status || res.error}`);
      continue;
    }
    urls.push(...parseLocs(res.body));
  }
  return { urls, children };
}

async function stage1() {
  console.log(`\n[1/4] sitemap sweep — ${BASE_URL}`);
  const { urls, children } = await collectSitemapUrls();
  console.log(`      ${children.length} child sitemaps, ${urls.length} URLs`);

  const targets = urls.map(toBase).filter(Boolean);
  const results = [];
  for (let i = 0; i < targets.length; i += HEAD_CHUNK) {
    const chunk = targets.slice(i, i + HEAD_CHUNK);
    const chunkResults = await pooled(chunk, HEAD_CHUNK, url =>
      request(url, { method: 'HEAD' }).then(r => ({ url, ...r }))
    );
    results.push(...chunkResults);
    process.stdout.write(`\r      HEAD ${Math.min(i + HEAD_CHUNK, targets.length)}/${targets.length}`);
  }
  process.stdout.write('\n');

  const bad = results.filter(r => r.status !== 200);
  for (const r of bad) {
    const label = r.status === 0 ? `request failed (${r.error})` : `HTTP ${r.status}`;
    addFinding(
      r.status >= 300 && r.status < 400 ? 'sitemap-url-redirects' : 'sitemap-url-not-200',
      r.url,
      r.location ? `${label} -> ${r.location}` : label
    );
  }

  stats.stage1 = {
    childSitemaps: children.length,
    urlsInSitemap: urls.length,
    checked: results.length,
    ok: results.length - bad.length,
    bad: bad.length,
  };
  console.log(`      ${results.length - bad.length}/${results.length} returned 200`);
  return urls;
}

// ---------------------------------------------------------------------------
// Stage 2 — sampled HTML assertions
// ---------------------------------------------------------------------------

function auditHtml(url, locale, raw) {
  const problems = [];
  const stripped = stripFlightPayload(raw);
  const { html, relocated } = reconstructStreamedHtml(stripped);

  // --- client-side-rendering bailout -------------------------------------
  // The marker itself is not a failure: a <Suspense>-isolated client subtree
  // legitimately bails. It is only a failure when the bailed boundary sits
  // ABOVE the h1, because then it swallowed the whole page and the crawler
  // gets a loading shell instead of the content.
  const bailoutAt = html.indexOf('BAILOUT_TO_CLIENT_SIDE_RENDERING');
  const h1At = html.search(/<h1[\s>]/i);
  const bailout =
    bailoutAt === -1 ? 'none' : h1At !== -1 && bailoutAt > h1At ? 'after-h1' : 'before-h1';
  if (bailout === 'before-h1') {
    problems.push({
      type: 'csr-bailout-swallows-page',
      detail:
        h1At === -1
          ? 'BAILOUT_TO_CLIENT_SIDE_RENDERING present and no h1 in HTML — crawler sees a loading shell'
          : `BAILOUT marker at ${bailoutAt} precedes h1 at ${h1At}`,
    });
  }

  // --- headings -----------------------------------------------------------
  const headings = [...html.matchAll(/<(h[1-6])[\s>]/gi)].map(m => m[1].toLowerCase());
  const h1Count = headings.filter(h => h === 'h1').length;
  if (h1Count !== 1) {
    problems.push({ type: 'h1-count', detail: `expected exactly 1 h1, found ${h1Count}` });
  }
  const sequence = headings.join(' > ');
  let prev = 0;
  for (const h of headings) {
    const level = Number(h[1]);
    if (prev && level > prev + 1) {
      problems.push({
        type: 'heading-skip',
        detail: `h${prev} followed by h${level} — full order: ${sequence}`,
      });
      break;
    }
    prev = level;
  }
  if (h1Count === 1 && headings.length && headings[0] !== 'h1') {
    problems.push({
      type: 'h1-not-first-heading',
      detail: `first heading is ${headings[0]}, h1 appears at position ${headings.indexOf('h1') + 1} — full order: ${sequence}`,
    });
  }

  // --- JSON-LD ------------------------------------------------------------
  const ldBlocks = [...html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )];
  const ldTypes = [];
  for (const [, body] of ldBlocks) {
    try {
      const parsed = JSON.parse(body);
      ldTypes.push(parsed['@type'] || '(no @type)');
    } catch (err) {
      problems.push({ type: 'jsonld-invalid', detail: `JSON.parse failed: ${err.message}` });
    }
  }
  if (ldBlocks.length === 0) {
    problems.push({ type: 'jsonld-missing', detail: 'no <script type="application/ld+json"> in HTML' });
  }

  // --- canonical ----------------------------------------------------------
  const canonicalTag = (html.match(/<link[^>]+rel="canonical"[^>]*>/i) || [])[0];
  const canonical = canonicalTag ? attr(canonicalTag, 'href') : null;
  if (!canonical) {
    problems.push({ type: 'canonical-missing', detail: 'no <link rel="canonical">' });
  } else {
    let cPath = canonical;
    try { cPath = new URL(canonical).pathname; } catch { /* relative */ }
    if (cPath !== `/${locale}` && !cPath.startsWith(`/${locale}/`)) {
      problems.push({
        type: 'canonical-wrong-locale',
        detail: `canonical "${canonical}" is not under /${locale}/`,
      });
    }
  }

  // --- hreflang -----------------------------------------------------------
  const hreflangs = [...html.matchAll(/<link[^>]+hreflang="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  if (hreflangs.length !== EXPECTED_HREFLANG) {
    problems.push({
      type: 'hreflang-count',
      detail: `expected ${EXPECTED_HREFLANG} hreflang links, found ${hreflangs.length}`,
    });
  }

  // --- meta description ---------------------------------------------------
  const descTag = (html.match(/<meta[^>]+name="description"[^>]*>/i) || [])[0];
  const description = descTag ? attr(descTag, 'content') : null;
  if (!description || !description.trim()) {
    problems.push({ type: 'meta-description-missing', detail: 'no meta description' });
  } else if (description.length < 50 || description.length > 160) {
    problems.push({
      type: 'meta-description-length',
      detail: `${description.length} chars (want 50–160)`,
    });
  }

  // --- navigation ---------------------------------------------------------
  const navBlocks = html.match(/<nav[\s\S]*?<\/nav>/gi) || [];
  const navLinks = navBlocks.join('').match(/<a\s/gi) || [];
  if (navLinks.length === 0) {
    problems.push({ type: 'nav-missing', detail: 'no links inside any <nav>' });
  }

  // --- images -------------------------------------------------------------
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const noAlt = imgs.filter(t => {
    const a = attr(t, 'alt');
    return a === null || a.trim() === '';
  });
  if (noAlt.length) {
    problems.push({ type: 'img-alt-missing', detail: `${noAlt.length}/${imgs.length} <img> without alt` });
  }

  const robotsTag = (html.match(/<meta[^>]+name="robots"[^>]*>/i) || [])[0];
  const robots = robotsTag ? (attr(robotsTag, 'content') || '') : '';

  return {
    url,
    locale,
    bailout,
    streamedChunksRelocated: relocated,
    h1Count,
    jsonLdTags: ldBlocks.length,
    jsonLdTypes: ldTypes,
    canonical,
    hreflangCount: hreflangs.length,
    descriptionLength: description ? description.length : 0,
    navLinks: navLinks.length,
    imgCount: imgs.length,
    imgMissingAlt: noAlt.length,
    robots,
    noindex: /noindex/i.test(robots),
    bytes: raw.length,
    problems,
  };
}

async function stage2(sitemapUrls) {
  console.log(`\n[2/4] sampled HTML — up to ${SAMPLE_PER_TYPE} per locale x type`);

  const buckets = new Map();
  for (const raw of sitemapUrls) {
    const target = toBase(raw);
    if (!target) continue;
    const { locale, type } = classify(new URL(target).pathname);
    const key = `${locale}|${type}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(target);
  }

  const targets = [];
  for (const [key, list] of [...buckets.entries()].sort()) {
    const [locale] = key.split('|');
    for (const url of sample(list, SAMPLE_PER_TYPE)) targets.push({ url, locale });
  }
  console.log(`      ${buckets.size} buckets, ${targets.length} pages to fetch`);

  const pages = [];
  await pooled(
    targets,
    HTML_CHUNK,
    async ({ url, locale }) => {
      const res = await request(url);
      if (!res.ok || res.status !== 200) {
        addFinding('sample-fetch-failed', url, `HTTP ${res.status || res.error}`);
        return;
      }
      const audited = auditHtml(url, locale, res.body);
      audited.ms = res.ms;
      audited.cache = res.cache;
      pages.push(audited);
      for (const p of audited.problems) addFinding(p.type, url, p.detail);
    },
    (done, total) => process.stdout.write(`\r      GET ${done}/${total}`)
  );
  process.stdout.write('\n');

  const clean = pages.filter(p => p.problems.length === 0).length;
  stats.stage2 = {
    samplePerType: SAMPLE_PER_TYPE,
    buckets: buckets.size,
    fetched: pages.length,
    clean,
    withProblems: pages.length - clean,
  };
  console.log(`      ${clean}/${pages.length} pages clean`);
  return pages;
}

// ---------------------------------------------------------------------------
// Stage 3 — static data scan (no network)
// ---------------------------------------------------------------------------

/**
 * src/data/blog-posts.ts cannot be imported: it does `import { BlogPost } from
 * "../types/blog"`, and that module does not exist (SWC erases the type-only
 * import at build time, so the app never notices). Evaluate the literal instead.
 */
function loadBlogPosts() {
  const file = path.join(process.cwd(), 'src/data/blog-posts.ts');
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^\s*import[^;]*;\s*$/gm, '');
  src = src.replace(/^export interface[\s\S]*?(?=export const blogPosts)/m, '');
  const before = src;
  src = src.replace(/export\s+const\s+blogPosts\s*:\s*[A-Za-z0-9_[\]]+\s*=/, 'const blogPosts =');
  if (src === before) {
    throw new Error('blog-posts.ts no longer matches the expected `export const blogPosts: BlogPost[] =` shape');
  }
  return new Function(`${src}\nreturn blogPosts;`)();
}

async function stage3() {
  console.log('\n[3/4] static data scan');

  // Reuse the production gate so this script and the injection pipeline can
  // never disagree about what counts as a valid translation.
  const { validateTranslationItem, VALID_LOCALES } = await import('../src/lib/injection-gate.ts');
  const { isBlogTranslationMissing } = await import('../src/lib/translation-status.ts');
  const { isBlogLocaleIndexed } = await import('../src/config/locale-status.ts');

  const posts = loadBlogPosts();
  console.log(`      ${posts.length} blog posts x ${VALID_LOCALES.length} locales`);

  // slug -> title per locale, so the gate can catch duplicate titles.
  const titlesByLocale = new Map();
  for (const locale of VALID_LOCALES) {
    const map = new Map();
    for (const post of posts) {
      const t = post.translations?.[locale];
      if (t?.title) map.set(post.slug, t.title);
    }
    titlesByLocale.set(locale, map);
  }

  let checked = 0;
  let gateFailures = 0;
  // Locales outside INDEXED_BLOG_LOCALES are deliberately not published, so a
  // missing translation there is policy, not a defect. Counted, not reported.
  let absentByPolicy = 0;
  const byLocale = {};
  for (const post of posts) {
    const en = post.translations?.en;
    for (const locale of VALID_LOCALES) {
      const t = post.translations?.[locale];
      if (!t) {
        if (isBlogLocaleIndexed(locale)) {
          addFinding('blog-translation-absent', `${post.slug} [${locale}]`, `no translations.${locale} entry although ${locale} is an indexed blog locale`);
          byLocale[locale] = (byLocale[locale] || 0) + 1;
        } else {
          absentByPolicy++;
        }
        continue;
      }
      checked++;
      const result = validateTranslationItem(
        {
          slug: post.slug,
          locale,
          title: t.title || '',
          description: t.description || '',
          content: t.content || '',
          enTitle: en?.title,
        },
        titlesByLocale.get(locale)
      );
      if (!result.valid) {
        gateFailures++;
        byLocale[locale] = (byLocale[locale] || 0) + 1;
        addFinding('blog-gate-failure', `${post.slug} [${locale}]`, result.reasons.join('; '), {
          slug: post.slug,
          locale,
          reasons: result.reasons,
        });
      }
    }
  }

  // Narratives: one JSON per giant, with *_<locale> fields.
  const narrativeDir = path.join(process.cwd(), 'src/data/narratives');
  let narrativeFiles = [];
  let narrativeIssues = 0;
  if (fs.existsSync(narrativeDir)) {
    narrativeFiles = fs.readdirSync(narrativeDir).filter(f => f.endsWith('.json'));
    for (const file of narrativeFiles) {
      const slug = file.replace(/\.json$/, '');
      let data;
      try {
        data = JSON.parse(fs.readFileSync(path.join(narrativeDir, file), 'utf-8'));
      } catch (err) {
        narrativeIssues++;
        addFinding('narrative-unparseable', file, err.message);
        continue;
      }
      if (!data.epic_en || !String(data.epic_en).trim()) {
        narrativeIssues++;
        addFinding('narrative-missing-en-epic', slug, 'epic_en is empty — every locale falls back to nothing');
      }
      const missing = VALID_LOCALES.filter(l => {
        const epic = data[`epic_${l}`];
        const trials = data[`trials_${l}`];
        const overcoming = data[`overcoming_${l}`];
        return !epic || !String(epic).trim() || !trials || !String(trials).trim() || !overcoming || !String(overcoming).trim();
      });
      if (missing.length) {
        narrativeIssues++;
        addFinding(
          'narrative-locale-fallback',
          slug,
          `${missing.length}/${VALID_LOCALES.length} locales are missing narrative fields (epic/trials/overcoming): ${missing.join(', ')}`,
          { slug, missingLocales: missing }
        );
      }
    }
  }

  stats.stage3 = {
    posts: posts.length,
    locales: VALID_LOCALES.length,
    translationsChecked: checked,
    absentByPolicy,
    gateFailures,
    gateFailuresByLocale: byLocale,
    narrativeFiles: narrativeFiles.length,
    narrativeIssues,
  };
  console.log(`      ${gateFailures} gate failures across ${checked} translations`);
  console.log(`      ${narrativeIssues} narrative issues across ${narrativeFiles.length} files`);

  return { posts, isBlogTranslationMissing, VALID_LOCALES };
}

// ---------------------------------------------------------------------------
// Stage 4 — sitemap membership vs. robots
// ---------------------------------------------------------------------------

async function stage4(sitemapUrls, pages, dataCtx) {
  console.log('\n[4/4] sitemap <-> robots cross-check');

  const { isLocaleIndexed, isBlogLocaleIndexed } = await import('../src/config/locale-status.ts');
  const incompletePath = path.join(process.cwd(), 'src/config/incomplete-giants.json');
  const incomplete = new Set(
    fs.existsSync(incompletePath) ? JSON.parse(fs.readFileSync(incompletePath, 'utf-8')) : []
  );

  const inSitemap = new Set();
  for (const raw of sitemapUrls) {
    const t = toBase(raw);
    if (t) inSitemap.add(new URL(t).pathname.replace(/\/$/, '') || '/');
  }

  // (a) data says "should not be indexed" but the URL is in the sitemap
  let dataMismatches = 0;
  if (dataCtx) {
    const { posts, isBlogTranslationMissing } = dataCtx;
    for (const post of posts) {
      const en = post.translations?.en;
      for (const locale of Object.keys(post.translations || {})) {
        // English is compared against itself, so isBlogTranslationMissing would
        // always return true (title === en.title). Production exempts it in both
        // places that use the predicate — src/app/sitemap/[id]/route.ts and
        // src/app/[locale]/blog/[slug]/page.tsx — so this must too.
        if (locale === 'en') continue;
        const p = `/${locale}/blog/${post.slug}`;
        const listed = inSitemap.has(p);
        const shouldIndex =
          isBlogLocaleIndexed(locale) && !isBlogTranslationMissing(post.translations[locale], en);
        if (listed && !shouldIndex) {
          dataMismatches++;
          addFinding(
            'sitemap-lists-noindex-blog',
            `${BASE_URL}${p}`,
            'in sitemap although the translation gate / locale policy says it should not be indexed'
          );
        }
      }
    }
  }

  // (b) giant URLs in the sitemap for an incomplete giant or a non-indexed locale
  let giantMismatches = 0;
  for (const p of inSitemap) {
    const parts = p.split('/').filter(Boolean);
    if (parts[1] !== 'giant' || !parts[2]) continue;
    const [locale, , slug] = parts;
    if (incomplete.has(slug)) {
      giantMismatches++;
      addFinding('sitemap-lists-incomplete-giant', `${BASE_URL}${p}`, `"${slug}" is in incomplete-giants.json (page renders noindex)`);
    } else if (!isLocaleIndexed(locale)) {
      giantMismatches++;
      addFinding('sitemap-lists-noindex-locale', `${BASE_URL}${p}`, `locale "${locale}" is not indexed per locale-status.ts`);
    }
  }

  // (c) sampled pages whose actual robots meta disagrees with sitemap membership
  let liveMismatches = 0;
  for (const page of pages) {
    const p = new URL(page.url).pathname.replace(/\/$/, '') || '/';
    const listed = inSitemap.has(p);
    if (listed && page.noindex) {
      liveMismatches++;
      addFinding('sitemap-lists-noindex-page', page.url, `page serves robots "${page.robots}" but is listed in the sitemap`);
    }
  }

  stats.stage4 = {
    sitemapPaths: inSitemap.size,
    dataMismatches,
    giantMismatches,
    liveMismatches,
  };
  console.log(`      ${dataMismatches + giantMismatches + liveMismatches} mismatches`);
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

/**
 * Everything a follow-up agent needs per problem type: what is wrong, how big it
 * is, where to look, how to reproduce, how to know it is fixed.
 */
const PLAYBOOK = {
  'csr-bailout-swallows-page': {
    title: 'Page bails out to client-side rendering above the h1',
    why: 'A client component calls useSearchParams() (or similar) with no <Suspense> boundary between it and the page root. During prerender React drops the whole enclosing boundary, so the crawler receives the loading shell instead of the page.',
    where: 'src/app/[locale]/**/page.tsx and the client component it renders; look for useSearchParams / useParams without a wrapping <Suspense>.',
    fix: 'Wrap only the offending client subtree in <Suspense fallback={...}>, keeping the server-rendered heading, image and JSON-LD outside it. See the fix in src/app/[locale]/giant/[slug]/page.tsx.',
    verify: 'Re-run this audit; the marker must move after the h1, or disappear.',
  },
  'h1-count': {
    title: 'Page does not have exactly one h1',
    why: 'Zero h1 usually means the content never reached the HTML; more than one dilutes the page topic and trips Lighthouse SEO.',
    where: 'The page component and any shared layout/hero that also renders a heading.',
    fix: 'Keep a single h1 per page; demote the rest to h2.',
    verify: 'Re-run this audit — h1Count must be 1.',
  },
  'heading-skip': {
    title: 'Heading levels skip a level',
    why: 'Screen-reader users navigate by heading level; a jump from h2 to h4 hides structure. Lighthouse accessibility flags it. Note the checker reports only the FIRST skip per page, so one page can hide several — fix the earliest and re-run.',
    where:
      'Three distinct sources produce almost all of these. (1) "h2 followed by h4": the shared footer — src/components/footer.tsx renders <h2>Giants Wisdom</h2> then <h4> column headings (lines ~97 and ~111). This one affects every page on the site. (2) "h1 followed by h3": blog article bodies, whose markdown starts at "###" — see the markdown renderer used by src/app/[locale]/blog/[slug]/page.tsx and the content in src/data/blog-posts.ts. (3) "h1 followed by h4": pages with no body headings at all, so the footer h4 follows the page h1 directly.',
    fix: 'Footer: demote the h2 to a styled div (it is a brand mark, not a section heading) or promote the column h4s to h3. Blog: render markdown "###" as h2, or downshift the whole article by one level.',
    verify: 'Re-run this audit; the reported "full order" must have no gaps.',
  },
  'h1-not-first-heading': {
    title: 'h1 is not the first heading in the document',
    why: 'Headings before the h1 (typically a nav/menu or a decorative block) make the document outline start mid-tree; assistive tech reads the page as if it began in a subsection.',
    where: 'Whatever renders before the page hero — src/components/navigation.tsx, shared layout blocks, and the page component itself.',
    fix: 'Demote pre-h1 headings to non-heading elements (a styled div/span) or move the h1 above them.',
    verify: 'Re-run this audit; the reported heading order must start with h1.',
  },
  'jsonld-missing': {
    title: 'No JSON-LD in the served HTML',
    why: 'Without structured data the page cannot earn rich results.',
    where: 'The page component. Note: JSON-LD present only inside the self.__next_f flight payload does NOT count — it is not in the DOM the crawler parses.',
    fix: 'Render <script type="application/ld+json"> from the server component, outside any Suspense boundary that bails.',
    verify: 'Re-run this audit; jsonLdTags must be > 0 and every block must JSON.parse.',
  },
  'jsonld-invalid': {
    title: 'JSON-LD block does not parse',
    why: 'Malformed structured data is ignored wholesale by search engines.',
    where: 'The dangerouslySetInnerHTML JSON.stringify call for the reported page.',
    fix: 'Ensure the object is serialisable and no template interpolation breaks the JSON.',
    verify: 'Re-run this audit; jsonld-invalid must be 0.',
  },
  'canonical-missing': {
    title: 'No canonical link',
    why: 'Duplicate-content risk across 24 locale variants.',
    where: 'generateMetadata -> alternates.canonical, via buildSEOAlternates in src/config/locale-status.ts.',
    fix: 'Return alternates.canonical for the page.',
    verify: 'Re-run this audit.',
  },
  'canonical-wrong-locale': {
    title: 'Canonical points outside the page locale',
    why: 'A ko page canonicalising to /en tells Google to drop the ko version entirely.',
    where: 'buildSEOAlternates in src/config/locale-status.ts and the page generateMetadata.',
    fix: 'Canonical must be /{locale}{path} for the locale being rendered.',
    verify: 'Re-run this audit.',
  },
  'hreflang-count': {
    title: 'Unexpected number of hreflang links',
    why: 'Missing hreflang entries break locale targeting; extras point at pages that may not exist.',
    where: 'buildHreflang in src/lib/locales.ts and buildSEOAlternates.',
    fix: `Emit ${EXPECTED_HREFLANG} links (24 locales + x-default) on every localised page.`,
    verify: 'Re-run this audit.',
  },
  'meta-description-missing': {
    title: 'No meta description',
    why: 'Google writes its own snippet, usually worse than an authored one.',
    where: 'generateMetadata for the reported route.',
    fix: 'Return a localised description.',
    verify: 'Re-run this audit.',
  },
  'meta-description-length': {
    title: 'Meta description outside 50–160 characters',
    why: 'Too short wastes the snippet; too long is truncated mid-sentence.',
    where: 'generateMetadata for the reported route.',
    fix: 'Rewrite to 50–160 characters, keeping the primary keyword early.',
    verify: 'Re-run this audit.',
  },
  'nav-missing': {
    title: 'No navigation links in the served HTML',
    why: 'Crawlers discover the rest of the site through these links, and users cannot leave the page.',
    where: 'The page component — <Navigation /> must be rendered from the server component, not from inside a Suspense boundary that bails to CSR.',
    fix: 'Render <Navigation /> in page.tsx, as [locale]/page.tsx and blog/[slug]/page.tsx do.',
    verify: 'Re-run this audit; navLinks should match the other page types.',
  },
  'img-alt-missing': {
    title: 'Images without alt text',
    why: 'Screen readers announce nothing, and image search cannot index them. Lighthouse accessibility failure.',
    where: 'The component rendering the reported page.',
    fix: 'Add descriptive alt, or alt="" for purely decorative images.',
    verify: 'Re-run this audit.',
  },
  'blog-gate-failure': {
    title: 'Blog translation fails the injection gate',
    why: 'These are untranslated, truncated, prompt-leaked or duplicated records. Serving them creates index pollution.',
    where: 'src/data/blog-posts.ts, the reported slug + locale. Gate logic: src/lib/injection-gate.ts (validateTranslationItem).',
    fix: 'Re-translate the record, or let the noindex/sitemap filter exclude it.',
    verify: 'STAGES=3 node scripts/site-audit.js — gateFailures must drop.',
  },
  'blog-translation-absent': {
    title: 'Blog post has no entry for a locale',
    why: 'The locale silently falls back or 404s.',
    where: 'src/data/blog-posts.ts, the reported slug.',
    fix: 'Inject the missing translation, or confirm the locale is excluded on purpose.',
    verify: 'STAGES=3 node scripts/site-audit.js',
  },
  'narrative-locale-fallback': {
    title: 'Giant narrative missing for some locales (falls back to English)',
    why: 'The page renders English prose under a localised heading — thin/duplicate content for that locale.',
    where: 'src/data/narratives/<slug>.json, fields epic_<locale> etc.',
    fix: 'Translate the missing locales, or accept the fallback deliberately.',
    verify: 'STAGES=3 node scripts/site-audit.js',
  },
  'narrative-missing-en-epic': {
    title: 'Giant narrative has no English epic',
    why: 'English is the fallback for every other locale, so an empty epic_en leaves all 24 locales with nothing.',
    where: 'src/data/narratives/<slug>.json',
    fix: 'Author epic_en.',
    verify: 'STAGES=3 node scripts/site-audit.js',
  },
  'sitemap-url-not-200': {
    title: 'Sitemap URL does not return 200',
    why: 'Submitting non-200 URLs wastes crawl budget and can trigger Search Console errors.',
    where: 'The sitemap route (src/app/sitemap/[id]) and the data it derives URLs from.',
    fix: 'Either restore the page or stop listing the URL.',
    verify: 'STAGES=1 node scripts/site-audit.js',
  },
  'sitemap-url-redirects': {
    title: 'Sitemap URL redirects',
    why: 'Sitemaps should list final URLs only.',
    where: 'next.config.mjs redirects, src/middleware.ts, and the sitemap route.',
    fix: 'List the redirect target instead.',
    verify: 'STAGES=1 node scripts/site-audit.js',
  },
  'sitemap-lists-noindex-blog': {
    title: 'Sitemap lists a blog URL the gate treats as untranslated',
    why: 'The page serves noindex while the sitemap invites Google to crawl it — contradictory signals.',
    where: 'src/app/sitemap/[id] filtering vs. isBlogTranslationMissing in src/lib/translation-status.ts.',
    fix: 'Apply the same predicate in both places.',
    verify: 'STAGES=3,4 node scripts/site-audit.js',
  },
  'sitemap-lists-incomplete-giant': {
    title: 'Sitemap lists a giant marked incomplete',
    why: 'The page renders robots noindex; listing it contradicts that.',
    where: 'src/config/incomplete-giants.json vs. the sitemap route.',
    fix: 'Exclude incomplete giants from the sitemap, or complete the data.',
    verify: 'STAGES=4 node scripts/site-audit.js',
  },
  'sitemap-lists-noindex-locale': {
    title: 'Sitemap lists a locale that is not indexed',
    why: 'Contradicts locale-status.ts.',
    where: 'src/config/locale-status.ts vs. the sitemap route.',
    fix: 'Filter the sitemap by isLocaleIndexed.',
    verify: 'STAGES=4 node scripts/site-audit.js',
  },
  'sitemap-lists-noindex-page': {
    title: 'Live page serves noindex but is listed in the sitemap',
    why: 'Directly contradictory signals to the crawler.',
    where: 'generateMetadata robots flag for that route vs. the sitemap route.',
    fix: 'Make both derive from one predicate.',
    verify: 'Re-run this audit.',
  },
};

function fallbackPlaybook(type) {
  return {
    title: type,
    why: '(no playbook entry yet — add one in scripts/site-audit.js PLAYBOOK)',
    where: '—',
    fix: '—',
    verify: 'Re-run this audit.',
  };
}

function writeReports() {
  const byType = new Map();
  for (const f of findings) {
    if (!byType.has(f.type)) byType.set(f.type, []);
    byType.get(f.type).push(f);
  }
  const grouped = [...byType.entries()].sort((a, b) => b[1].length - a[1].length);

  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        ...stats,
        finishedAt: new Date().toISOString(),
        totalFindings: findings.length,
        findingsByType: Object.fromEntries(grouped.map(([t, l]) => [t, l.length])),
        findings,
      },
      null,
      2
    )
  );

  const md = [];
  md.push('# Site audit — actionable tasks');
  md.push('');
  md.push(`- Target: \`${BASE_URL}\``);
  md.push(`- Run: ${stats.startedAt} → ${new Date().toISOString()}`);
  md.push(`- Stages: ${stats.stagesRun.join(', ')}`);
  md.push(`- Findings: **${findings.length}** across **${grouped.length}** types`);
  md.push('');
  md.push('Detail for every finding is in `audit-report.json`.');
  md.push('');

  if (!grouped.length) {
    md.push('No problems found.');
  }

  for (const [type, list] of grouped) {
    const pb = PLAYBOOK[type] || fallbackPlaybook(type);
    md.push(`## ${pb.title}`);
    md.push('');
    md.push(`\`${type}\` — **${list.length}** affected`);
    md.push('');
    md.push(`**What is wrong.** ${pb.why}`);
    md.push('');
    md.push(`**Where to look.** ${pb.where}`);
    md.push('');
    md.push(`**Fix.** ${pb.fix}`);
    md.push('');
    md.push('**Examples**');
    md.push('');
    for (const f of list.slice(0, 5)) {
      md.push(`- \`${f.url}\` — ${f.detail}`);
    }
    if (list.length > 5) md.push(`- …and ${list.length - 5} more (see audit-report.json)`);
    md.push('');
    const sampleUrl = list[0].url;
    if (/^https?:\/\//.test(sampleUrl)) {
      md.push('**Reproduce**');
      md.push('');
      md.push('```bash');
      md.push(`curl -s -A "${CRAWLER_UA}" "${sampleUrl}" > /tmp/page.html`);
      md.push('```');
      md.push('');
    }
    md.push(`**Confirm it is fixed.** ${pb.verify}`);
    md.push('');
    md.push('---');
    md.push('');
  }

  fs.writeFileSync(OUT_MD, md.join('\n'));
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  // REGEN=<audit-report.json> rewrites audit-tasks.md from findings already on
  // disk — for when only the playbook text changed and a re-crawl would be waste.
  if (process.env.REGEN) {
    const prior = JSON.parse(fs.readFileSync(process.env.REGEN, 'utf-8'));
    Object.assign(stats, prior);
    findings.push(...prior.findings);
    writeReports();
    console.log(`Regenerated ${OUT_MD} from ${process.env.REGEN} (${findings.length} findings)`);
    return;
  }

  console.log('Site audit');
  console.log(`  BASE_URL       ${BASE_URL}`);
  console.log(`  stages         ${STAGES.join(', ')}`);
  console.log(`  sample/type    ${SAMPLE_PER_TYPE}`);

  let sitemapUrls = [];
  let pages = [];
  let dataCtx = null;

  const needSitemap = STAGES.includes('1') || STAGES.includes('2') || STAGES.includes('4');

  if (STAGES.includes('1')) {
    stats.stagesRun.push('1');
    sitemapUrls = await stage1();
  } else if (needSitemap) {
    const collected = await collectSitemapUrls();
    sitemapUrls = collected.urls;
  }

  if (STAGES.includes('2')) {
    stats.stagesRun.push('2');
    pages = await stage2(sitemapUrls);
  }

  if (STAGES.includes('3')) {
    stats.stagesRun.push('3');
    dataCtx = await stage3();
  }

  if (STAGES.includes('4')) {
    stats.stagesRun.push('4');
    await stage4(sitemapUrls, pages, dataCtx);
  }

  writeReports();

  const byType = findings.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] || 0) + 1;
    return acc;
  }, {});

  const checked =
    (stats.stage1?.checked || 0) + (stats.stage2?.fetched || 0) + (stats.stage3?.translationsChecked || 0);
  const failed = findings.length;

  console.log('\n' + '='.repeat(64));
  console.log('SUMMARY');
  console.log('='.repeat(64));
  console.log(`  checked        ${checked}`);
  console.log(`  findings       ${failed}`);
  if (stats.stage1) console.log(`  stage 1        ${stats.stage1.ok}/${stats.stage1.checked} URLs returned 200`);
  if (stats.stage2) console.log(`  stage 2        ${stats.stage2.clean}/${stats.stage2.fetched} sampled pages clean`);
  if (stats.stage3) console.log(`  stage 3        ${stats.stage3.gateFailures} gate failures / ${stats.stage3.translationsChecked} translations`);
  if (stats.stage4) console.log(`  stage 4        ${stats.stage4.dataMismatches + stats.stage4.giantMismatches + stats.stage4.liveMismatches} sitemap/robots mismatches`);
  console.log('');
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(6)}  ${type}`);
  }
  console.log('');
  console.log(`  report         ${OUT_JSON}`);
  console.log(`  tasks          ${OUT_MD}`);
}

main().catch(err => {
  console.error('\nAudit failed:', err);
  process.exit(1);
});
