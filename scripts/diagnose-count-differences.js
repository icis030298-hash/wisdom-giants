const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const allNonEnglish = [
  'pl', 'uk', 'th', 'ar', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh',
  'id', 'de', 'ha', 'he', 'sw', 'ru', 'ja', 'el', 'es', 'fr', 'it', 'pt', 'ko'
];

const indexedBlogLocales = [
  'ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru',
  'he', 'el', 'ha', 'sw', 'uk', 'pl', 'id'
];

const claudeCounts = {
  pl: 124, uk: 116, th: 85, ar: 85, hi: 84, fa: 77, nl: 75, tr: 75,
  vi: 75, zh: 75, id: 20, de: 10, ha: 10, he: 10, sw: 10, ru: 9,
  ja: 8, el: 1, es: 0, fr: 0, it: 0, pt: 0, ko: 0
};

console.log('=== COMPARISON: Live Production HTML Scan vs Local Data File (blog-posts.ts 195 posts) ===\n');

let localCountsExactMatch = {};
let localCountsNormalizedMatch = {};

allNonEnglish.forEach(loc => {
  localCountsExactMatch[loc] = 0;
  localCountsNormalizedMatch[loc] = 0;
});

blogPosts.forEach(post => {
  const enTr = post.translations['en'];
  const enTitle = enTr ? enTr.title : '';
  const enNorm = enTitle.replace(/\*\*/g, '').trim().toLowerCase();

  allNonEnglish.forEach(locale => {
    const tr = post.translations[locale];
    if (!tr) {
      localCountsExactMatch[locale]++;
      localCountsNormalizedMatch[locale]++;
      return;
    }

    if (tr.title === enTitle) {
      localCountsExactMatch[locale]++;
    }

    const curNorm = tr.title.replace(/\*\*/g, '').trim().toLowerCase();
    if (curNorm === enNorm) {
      localCountsNormalizedMatch[locale]++;
    }
  });
});

console.log('Locale | Claude Live HTML | Exact Match (title===enTitle) | Normalized Match | Difference');
console.log('-------|------------------|-------------------------------|------------------|-----------');

let totalClaude = 0;
let totalExact = 0;
let totalIndexedClaude = 0;
let totalIndexedExact = 0;

allNonEnglish.forEach(loc => {
  const c = claudeCounts[loc] || 0;
  const e = localCountsExactMatch[loc];
  const n = localCountsNormalizedMatch[loc];
  const diff = e - c;

  totalClaude += c;
  totalExact += e;

  if (indexedBlogLocales.includes(loc)) {
    totalIndexedClaude += c;
    totalIndexedExact += e;
  }

  console.log(`${loc.padEnd(6)} | ${c.toString().padEnd(16)} | ${e.toString().padEnd(29)} | ${n.toString().padEnd(16)} | ${diff > 0 ? '+' + diff : diff}`);
});

console.log('-------|------------------|-------------------------------|------------------|-----------');
console.log(`TOTAL  | ${totalClaude.toString().padEnd(16)} | ${totalExact.toString().padEnd(29)} |                  | ${totalExact - totalClaude}`);
console.log(`\nINDEXED LOCALES ONLY: Claude = ${totalIndexedClaude}, Local Exact Match = ${totalIndexedExact} (Diff: ${totalIndexedExact - totalIndexedClaude})`);
