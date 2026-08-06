const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const untranslatedPlPosts = [];

blogPosts.forEach(post => {
  const enTr = post.translations['en'];
  const plTr = post.translations['pl'];
  if (!plTr || (enTr && plTr.title === enTr.title)) {
    untranslatedPlPosts.push({
      slug: post.slug,
      giantSlug: post.giantSlug,
      category: post.category,
      enTitle: enTr ? enTr.title : '',
      enDescription: enTr ? enTr.description : '',
      enContent: enTr ? enTr.content : ''
    });
  }
});

console.log(`Total untranslated PL posts found: ${untranslatedPlPosts.length}`);
const pilot5 = untranslatedPlPosts.slice(0, 5);

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'pl_pilot_5_raw.json'), JSON.stringify(pilot5, null, 2), 'utf8');
console.log('Saved 5 pilot posts to scratch/pl_pilot_5_raw.json');
pilot5.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.slug}] ${p.enTitle}`);
});
