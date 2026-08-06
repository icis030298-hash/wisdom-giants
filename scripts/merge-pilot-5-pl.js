const fs = require('fs');
const path = require('path');

const pilot5 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'translations', 'pl_pilot_5.json'), 'utf8'));
const filePath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

const code = fileContent.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(code + '; return blogPosts;');
const blogPosts = getBlogPosts();

let updateCount = 0;

pilot5.forEach(pilotItem => {
  const targetPost = blogPosts.find(p => p.slug === pilotItem.slug);
  if (targetPost) {
    if (!targetPost.translations['pl']) {
      targetPost.translations['pl'] = {};
    }
    targetPost.translations['pl'].title = pilotItem.title;
    targetPost.translations['pl'].description = pilotItem.description;
    targetPost.translations['pl'].content = pilotItem.content;
    updateCount++;
  }
});

// Re-serialize blogPosts array safely back to src/data/blog-posts.ts
const newContent = `import { BlogPost } from '@/types/blog';\n\nexport const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');

console.log(`[SUCCESS] Merged ${updateCount} pilot Polish posts into src/data/blog-posts.ts`);
