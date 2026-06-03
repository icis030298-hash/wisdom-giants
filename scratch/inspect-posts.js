const fs = require('fs');
const path = require('path');

const BLOG_POSTS_PATH = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const TEMP_JS_PATH = path.join(__dirname, 'temp-inspect.js');

if (!fs.existsSync(BLOG_POSTS_PATH)) {
  console.log(`File not found: ${BLOG_POSTS_PATH}`);
  process.exit(1);
}

let content = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');
content = content.replace(/export interface BlogPost[\s\S]*?\n\}/g, '');
content = content.replace(/export const blogPosts: BlogPost\[\] =/g, 'const blogPosts =');
content += '\nmodule.exports = { blogPosts };';

fs.writeFileSync(TEMP_JS_PATH, content, 'utf8');

const { blogPosts } = require(TEMP_JS_PATH);
const post = blogPosts.find(p => p.slug === 'joan-of-arc-conviction');

if (post) {
  console.log("KO TITLE:", post.translations.ko.title);
  console.log("KO CONTENT SNIPPET:\n", post.translations.ko.content);
  console.log("------------------------");
  console.log("EN TITLE:", post.translations.en.title);
  console.log("EN CONTENT SNIPPET:\n", post.translations.en.content);
} else {
  console.log("Joan of Arc post not found!");
}

try {
  fs.unlinkSync(TEMP_JS_PATH);
} catch (err) {}
