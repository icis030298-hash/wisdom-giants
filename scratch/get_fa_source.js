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

const out = `=== Rockefeller EN Content ===\n${rock.translations.en.content}\n\n=== Carnegie EN Content ===\n${carnegie.translations.en.content}`;
fs.writeFileSync('scratch/fa_source.txt', out, 'utf8');
console.log('Saved fa_source.txt as utf-8');
