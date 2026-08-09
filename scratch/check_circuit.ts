const { blogPosts } = require('./src/data/blog-posts');
const { INDEXED_BLOG_LOCALES } = require('./src/config/locale-status');
const { isBlogTranslationMissing } = require('./src/lib/translation-status');

let untranslatedCount = 0;
let totalEvaluated = 0;
for (const loc of INDEXED_BLOG_LOCALES) {
    if (loc === 'en') continue;
    for (const p of blogPosts) {
        totalEvaluated++;
        const enTr = p.translations['en'];
        const tr = p.translations[loc];
        if (isBlogTranslationMissing(tr, enTr)) {
            untranslatedCount++;
        }
    }
}
const circuitBreakerTripped = totalEvaluated > 0 && (untranslatedCount / totalEvaluated) > 0.6;
console.log('Total evaluated:', totalEvaluated);
console.log('Untranslated count:', untranslatedCount);
console.log('Circuit breaker tripped:', circuitBreakerTripped);
console.log('Untranslated ratio:', (untranslatedCount / totalEvaluated * 100).toFixed(1) + '%');
console.log('Expected blog post URLs in sitemap:', circuitBreakerTripped ? (blogPosts.length * INDEXED_BLOG_LOCALES.length) : (blogPosts.length * INDEXED_BLOG_LOCALES.length - untranslatedCount));

