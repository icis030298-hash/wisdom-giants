const { blogPosts } = require('./src/data/blog-posts.ts');

// Count how many blog posts have each locale translated vs English fallback
const locales = ['ko', 'en', 'ja', 'de', 'es', 'fr', 'it', 'pt', 'ar', 'zh', 'nl', 'ru', 'hi', 'id', 'pl', 'sw', 'th', 'tr', 'uk', 'vi', 'el', 'fa', 'he', 'ha'];

const report = {};
locales.forEach(locale => {
  report[locale] = { translated: 0, missing: 0, englishFallback: 0 };
});

blogPosts.forEach(post => {
  locales.forEach(locale => {
    if (!post.translations[locale]) {
      report[locale].missing++;
    } else {
      // Check if it's an English fallback (same as 'en' content)
      const enTitle = post.translations['en']?.title || '';
      const localeTitle = post.translations[locale]?.title || '';
      if (localeTitle === enTitle && locale !== 'en') {
        report[locale].englishFallback++;
      } else {
        report[locale].translated++;
      }
    }
  });
});

console.log("Blog Posts Translation Coverage:");
locales.forEach(locale => {
  const r = report[locale];
  const total = blogPosts.length;
  console.log(`${locale}: translated=${r.translated} | english_fallback=${r.englishFallback} | missing=${r.missing}`);
});
