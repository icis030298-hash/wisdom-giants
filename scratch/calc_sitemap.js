const incompleteGiants = require('./src/config/incomplete-giants.json');
const { giants } = require('./src/lib/giants-data');
const { blogPosts } = require('./src/data/blog-posts');
const { INDEXED_LOCALES, INDEXED_BLOG_LOCALES } = require('./src/config/locale-status');
const { isBlogTranslationMissing } = require('./src/lib/translation-status');

const validGiants = giants.filter(g => !incompleteGiants.includes(g.slug));
console.log('Valid Giants:', validGiants.length);
console.log('Giant URLs:', validGiants.length * INDEXED_LOCALES.length);
console.log('Static pages:', 7 * INDEXED_LOCALES.length);
console.log('Blog lists:', INDEXED_BLOG_LOCALES.length);

let blogPostUrls = 0;
for (const locale of INDEXED_BLOG_LOCALES) {
  for (const post of blogPosts) {
    if (locale === 'en') {
        blogPostUrls++;
        continue;
    }
    const tr = post.translations[locale];
    const enTr = post.translations['en'];
    if (!isBlogTranslationMissing(tr, enTr)) {
        blogPostUrls++;
    }
  }
}
console.log('Blog post URLs:', blogPostUrls);
console.log('Total URLs:', (validGiants.length * INDEXED_LOCALES.length) + (7 * INDEXED_LOCALES.length) + INDEXED_BLOG_LOCALES.length + blogPostUrls);
