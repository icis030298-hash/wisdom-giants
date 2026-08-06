const fs = require('fs');
const path = require('path');
const { runQualityGate } = require('./pre-merge-quality-gate.js');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const indexedLocales = ['pl', 'id', 'de', 'ha', 'sw', 'ja', 'el'];

const remaining90 = [];

indexedLocales.forEach(locale => {
  blogPosts.forEach(post => {
    const enTr = post.translations['en'];
    const tr = post.translations[locale];
    if (!tr || (enTr && tr.title === enTr.title)) {
      remaining90.push({
        locale,
        slug: post.slug,
        giantSlug: post.giantSlug,
        category: post.category,
        enTitle: enTr.title,
        enDescription: enTr.description,
        enContent: enTr.content
      });
    }
  });
});

console.log(`Extracted remaining 90 posts: ${remaining90.length} items`);

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'remaining_90_raw.json'), JSON.stringify(remaining90, null, 2), 'utf8');
