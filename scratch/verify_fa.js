const fs = require('fs');

function loadBlogPosts() {
  const file = 'src/data/blog-posts.ts';
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^\s*import[^;]*;\s*$/gm, '');
  src = src.replace(/^export interface[\s\S]*?(?=export const blogPosts)/m, '');
  src = src.replace(/export\s+const\s+blogPosts\s*:\s*[A-Za-z0-9_[\]]+\s*=/, 'const blogPosts =');
  return new Function(`${src}\nreturn blogPosts;`)();
}

const blogPosts = loadBlogPosts();
const rock = blogPosts.find(p => p.slug === 'rockefeller-monopoly-guide');
const carnegie = blogPosts.find(p => p.slug === 'carnegie-gospel-wealth');

[rock, carnegie].forEach(p => {
  const content = p.translations.fa.content;
  const arabicCount = (content.match(/[\u0600-\u06FF]/g) || []).length;
  const latinCount = (content.match(/[a-zA-Z]/g) || []).length;
  console.log(`${p.slug} [fa]: 아랍문자 ${arabicCount}개 / 라틴문자 ${latinCount}개 (아랍문자 비율 ${(arabicCount/(arabicCount+latinCount)*100).toFixed(1)}%)`);
  console.log(`Content (First 150 chars): ${content.substring(0, 150)}...\n`);
});
