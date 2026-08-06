const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const indexedBlogLocales = [
  'ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru',
  'he', 'el', 'ha', 'sw', 'uk', 'pl', 'id'
];

function isBlogLocaleIndexed(loc) {
  return indexedBlogLocales.includes(loc);
}

function evaluateCircuitBreaker(postsArray) {
  let untranslatedCount = 0;
  let totalEvaluated = 0;
  for (const locale of indexedBlogLocales) {
    if (locale === 'en') continue;
    for (const post of postsArray) {
      totalEvaluated++;
      const enTr = post.translations['en'];
      const tr = post.translations[locale];
      if (!tr || (enTr && tr.title === enTr.title)) {
        untranslatedCount++;
      }
    }
  }
  const ratio = totalEvaluated > 0 ? untranslatedCount / totalEvaluated : 0;
  const isTripped = ratio > 0.6;
  if (isTripped) {
    console.error(`[Circuit Breaker Tripped] Untranslated ratio is ${(ratio * 100).toFixed(1)}% (>60%). Data load suspicious!`);
  }
  return { ratio, isTripped };
}

function getRobotsForPost(locale, slug, postsArray) {
  const post = postsArray.find(p => p.slug === slug);
  if (!post) return { index: false, follow: false };

  const enTranslation = post.translations['en'];
  const currentTranslation = post.translations[locale];

  const isUntranslated = locale !== 'en' && (
    !currentTranslation ||
    (enTranslation && currentTranslation.title === enTranslation.title)
  );

  const { isTripped } = evaluateCircuitBreaker(postsArray);
  const defaultIndex = isBlogLocaleIndexed(locale);
  const shouldIndex = isTripped ? defaultIndex : (defaultIndex && !isUntranslated);

  return {
    isUntranslated,
    isTripped,
    robots: {
      index: shouldIndex,
      follow: true
    }
  };
}

console.log('======================================================');
console.log('=== TEST STEP 1: NORMAL STATE (10.19% Untranslated) ===');
console.log('======================================================');
const normalRes = evaluateCircuitBreaker(blogPosts);
console.log(`Normal State Untranslated Ratio: ${(normalRes.ratio * 100).toFixed(2)}% | Tripped: ${normalRes.isTripped}`);

const sampleUntranslatedNormal = getRobotsForPost('pl', 'peter-the-great-wisdom', blogPosts);
console.log(`pl/blog/peter-the-great-wisdom (Normal) -> index: ${sampleUntranslatedNormal.robots.index}, follow: ${sampleUntranslatedNormal.robots.follow}`);

console.log('\n======================================================');
console.log('=== TEST STEP 2: FORCED CORRUPTED STATE (80% Untranslated) ===');
console.log('======================================================');

// Create a mutated copy of blogPosts where 80% of titles match en title
const corruptedPosts = JSON.parse(JSON.stringify(blogPosts));
corruptedPosts.forEach((p, idx) => {
  if (idx < 160) { // Wipe out translations for 160 out of 195 posts (~82%)
    indexedBlogLocales.forEach(loc => {
      if (p.translations[loc]) {
        p.translations[loc].title = p.translations['en'].title;
      }
    });
  }
});

const corruptedRes = evaluateCircuitBreaker(corruptedPosts);
console.log(`Corrupted State Untranslated Ratio: ${(corruptedRes.ratio * 100).toFixed(2)}% | Tripped: ${corruptedRes.isTripped}`);

const sampleUntranslatedCorrupted = getRobotsForPost('pl', 'peter-the-great-wisdom', corruptedPosts);
console.log(`pl/blog/peter-the-great-wisdom (Corrupted - Tripped) -> index: ${sampleUntranslatedCorrupted.robots.index}, follow: ${sampleUntranslatedCorrupted.robots.follow}`);

if (sampleUntranslatedCorrupted.robots.index === true && corruptedRes.isTripped === true) {
  console.log('\n[SUCCESS VERIFIED]: When untranslated ratio exceeds 60%, Circuit Breaker trips, logs console.error, and PRESERVES index: true to prevent mass de-indexing!');
} else {
  console.error('\n[FAIL]: Circuit Breaker did not block noindex!');
}
