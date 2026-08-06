const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const indexedLocales = ['ko', 'en', 'es', 'fr', 'it', 'pt', 'el', 'ja', 'ru', 'de', 'ha', 'he', 'sw', 'id', 'uk', 'pl'];

console.log('======================================================');
console.log('=== POST-MERGE LOCAL AUDIT & UNTRANSLATED BREAKDOWN ===');
console.log('======================================================\n');

let totalIndexedUntranslated = 0;
const localeStats = {};

indexedLocales.forEach(locale => {
  let untranslated = 0;
  let translated = 0;
  blogPosts.forEach(post => {
    const enTr = post.translations['en'];
    const tr = post.translations[locale];
    if (locale === 'en') {
      translated++;
    } else if (!tr || (enTr && tr.title === enTr.title)) {
      untranslated++;
    } else {
      translated++;
    }
  });
  localeStats[locale] = { translated, untranslated };
  totalIndexedUntranslated += untranslated;
  console.log(`[Locale: ${locale.padEnd(5)}] Translated: ${String(translated).padStart(3)} | Untranslated (NOINDEX): ${String(untranslated).padStart(3)}`);
});

console.log(`\nTOTAL INDEXED UNTRANSLATED POSTS REMAINING: ${totalIndexedUntranslated}`);

// Calculate blog.xml total entries (16 list entries + indexed posts)
let totalBlogXmlEntries = 16;
indexedLocales.forEach(locale => {
  totalBlogXmlEntries += localeStats[locale].translated;
});

console.log(`\nEXPECTED SITEMAP blog.xml URL COUNT: ${totalBlogXmlEntries}`);
