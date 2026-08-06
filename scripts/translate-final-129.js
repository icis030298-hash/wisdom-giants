const fs = require('fs');
const path = require('path');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const indexedLocales = ['pl', 'uk', 'id', 'de', 'ha', 'sw', 'ja', 'el'];

const remainingList = [];

indexedLocales.forEach(locale => {
  blogPosts.forEach(post => {
    const enTr = post.translations['en'];
    const tr = post.translations[locale];
    if (!tr || (enTr && tr.title === enTr.title)) {
      remainingList.push({
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

console.log(`Extracted remaining untranslated list: ${remainingList.length} items (Expected 129)`);

// Group by locale
const byLoc = {};
remainingList.forEach(item => {
  if (!byLoc[item.locale]) byLoc[item.locale] = [];
  byLoc[item.locale].push(item);
});

Object.keys(byLoc).forEach(l => {
  console.log(`  Locale '${l}': ${byLoc[l].length} posts`);
});

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'final_129_tasks.json'), JSON.stringify(byLoc, null, 2), 'utf8');
