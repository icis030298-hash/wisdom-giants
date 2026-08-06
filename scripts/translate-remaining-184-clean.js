const fs = require('fs');
const path = require('path');
const { runQualityGate } = require('./pre-merge-quality-gate.js');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const indexedLocales = ['pl', 'uk', 'id', 'de', 'ha', 'he', 'sw', 'ja', 'el'];

const remainingUntranslated = [];

indexedLocales.forEach(locale => {
  blogPosts.forEach(post => {
    const enTr = post.translations['en'];
    const tr = post.translations[locale];
    if (!tr || (enTr && tr.title === enTr.title)) {
      remainingUntranslated.push({
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

console.log(`Remaining untranslated posts across indexed locales: ${remainingUntranslated.length} items`);

// Group by locale
const byLocale = {};
remainingUntranslated.forEach(item => {
  if (!byLocale[item.locale]) byLocale[item.locale] = [];
  byLocale[item.locale].push(item);
});

Object.keys(byLocale).forEach(loc => {
  console.log(`  -> Locale '${loc}': ${byLocale[loc].length} posts`);
});

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'remaining_184_tasks.json'), JSON.stringify(byLocale, null, 2), 'utf8');
