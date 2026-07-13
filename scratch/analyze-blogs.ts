import { blogPosts } from '../src/data/blog-posts';

console.log(`Total blog posts: ${blogPosts.length}`);
const allLocales = ['ko', 'en', 'es', 'fr', 'de', 'ja', 'it', 'pt', 'ru', 'zh', 'ar', 'hi', 'tr', 'nl', 'pl', 'vi', 'th', 'id', 'el', 'sv', 'he', 'fa', 'uk', 'cs'];

let missingMap: Record<string, number> = {};

blogPosts.forEach((post, i) => {
  allLocales.forEach(loc => {
    if (!post.translations[loc]) {
      missingMap[loc] = (missingMap[loc] || 0) + 1;
    }
  });
});

console.log('Missing translations by locale:');
console.log(missingMap);
