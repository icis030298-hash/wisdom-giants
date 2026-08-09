const fs = require('fs');

// Count valid giants
const giantsData = fs.readFileSync('./src/lib/giants-data.ts', 'utf8');
const slugs = [...giantsData.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
// Removing duplicates if any
const uniqueSlugs = [...new Set(slugs)];

const incomplete = JSON.parse(fs.readFileSync('./src/config/incomplete-giants.json', 'utf8'));
const validGiants = uniqueSlugs.filter(s => !incomplete.includes(s));

// Count blog posts
const blogData = fs.readFileSync('./src/data/blog-posts.ts', 'utf8');
const blogSlugs = [...blogData.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const uniqueBlogSlugs = [...new Set(blogSlugs)];

// Count locales
const localeStatus = fs.readFileSync('./src/config/locale-status.ts', 'utf8');
let localesCount = (localeStatus.match(/index:\s*true/g) || []).length;

const blogLocalesMatch = localeStatus.match(/INDEXED_BLOG_LOCALES\s*=\s*\[([^\]]+)\]/);
let blogLocalesCount = 0;
let blogLocales = [];
if (blogLocalesMatch) {
    blogLocales = blogLocalesMatch[1].split(',').map(s => s.replace(/['"\s]/g, '')).filter(Boolean);
    blogLocalesCount = blogLocales.length;
}

console.log('Total unique giant slugs in file:', uniqueSlugs.length);
console.log('Valid giants:', validGiants.length);
console.log('Giants URLs:', validGiants.length * localesCount);
console.log('Static pages:', 7 * localesCount);
console.log('Blog lists:', blogLocalesCount);
console.log('Blog posts (if all translated):', uniqueBlogSlugs.length * blogLocalesCount);

// Wait, let's also check translation circuit breaker for blog posts.
// For blog posts, `isBlogTranslationMissing` checks if translation title === english title or if it's missing.
// We can do a rudimentary count for one blog post to see if translations exist.
const firstPost = blogData.split('translations: {')[1];
const translatedLangs = (firstPost.match(/"([^"]+)":\s*\{/g) || []).map(s => s.replace(/["{:\s]/g, ''));
console.log('Languages with translations for first post:', translatedLangs.length);

const totalMax = (validGiants.length * localesCount) + (7 * localesCount) + blogLocalesCount + (uniqueBlogSlugs.length * blogLocalesCount);
console.log('Max Total URLs:', totalMax);
