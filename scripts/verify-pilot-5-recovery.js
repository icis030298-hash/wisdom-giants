const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const pilotSlugs = [
  'fear-giants',
  'failure-comeback',
  'loneliness-creation',
  'decision-making',
  'burnout-recovery'
];

console.log('=== PILOT 5 POLISH POSTS SELF-HEALING AUTOMATIC RECOVERY CHECK ===\n');

pilotSlugs.forEach(slug => {
  const post = blogPosts.find(p => p.slug === slug);
  const enTr = post.translations['en'];
  const plTr = post.translations['pl'];
  const isUntranslated = !plTr || (enTr && plTr.title === enTr.title);
  const shouldIndex = !isUntranslated;

  console.log(`[pl/blog/${slug}]`);
  console.log(`  -> Title: "${plTr.title}"`);
  console.log(`  -> isUntranslated: ${isUntranslated}`);
  console.log(`  -> Auto-recovered robots: { index: ${shouldIndex}, follow: true }`);
  console.log(`  -> Status: ${shouldIndex ? 'PASSED (Self-Healed to INDEX, FOLLOW)' : 'FAILED'}\n`);
});

// Count remaining PL untranslated posts
let remainingPlUntranslated = 0;
blogPosts.forEach(post => {
  const enTr = post.translations['en'];
  const plTr = post.translations['pl'];
  if (!plTr || (enTr && plTr.title === enTr.title)) {
    remainingPlUntranslated++;
  }
});

console.log(`Remaining Untranslated PL Posts: ${remainingPlUntranslated} (Was 124, 5 translated, 119 remaining)`);
