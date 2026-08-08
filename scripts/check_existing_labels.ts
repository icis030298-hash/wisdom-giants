import { blogPosts } from '../src/data/blog-posts';

console.log('=== EXISTING ZH TITLES WITH LABELS ===');
let zhCount = 0;
blogPosts.forEach(p => {
  const zhTitle = p.translations['zh']?.title;
  if (zhTitle && (zhTitle.includes('[' || zhTitle.includes('【')))) {
    if (zhCount < 10) console.log(`[${p.slug}] ${zhTitle}`);
    zhCount++;
  }
});
console.log(`Total zh titles with brackets: ${zhCount}`);

console.log('\n=== EXISTING TR TITLES WITH LABELS ===');
let trCount = 0;
blogPosts.forEach(p => {
  const trTitle = p.translations['tr'];
  if (trTitle && trTitle.title && (trTitle.title.includes('[') || trTitle.title.includes('Dev'))) {
    if (trCount < 10) console.log(`[${p.slug}] ${trTitle.title}`);
    trCount++;
  }
});
console.log(`Total tr titles with brackets: ${trCount}`);
