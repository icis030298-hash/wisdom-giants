const fs = require('fs');
const path = require('path');

const BLOG_POSTS_PATH = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const TEMP_JS_PATH = path.join(__dirname, 'temp-blog-posts.js');

if (!fs.existsSync(BLOG_POSTS_PATH)) {
  console.log(`File not found: ${BLOG_POSTS_PATH}`);
  process.exit(1);
}

let content = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');

// Strip interface definitions and TS typing
content = content.replace(/export interface BlogPost[\s\S]*?\n\}/g, '');
content = content.replace(/export const blogPosts: BlogPost\[\] =/g, 'const blogPosts =');
content += '\nmodule.exports = { blogPosts };';

fs.writeFileSync(TEMP_JS_PATH, content, 'utf8');

const { blogPosts } = require(TEMP_JS_PATH);
const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

console.log('==========================================');
console.log('Auditing blog-posts.ts for Korean Pollution...');
console.log('==========================================');

let totalPolluted = 0;

blogPosts.forEach((post) => {
  const translations = post.translations || {};
  for (const locale in translations) {
    if (locale === 'ko') continue; // Skip Korean translations
    
    const trans = translations[locale];
    for (const key in trans) {
      const val = trans[key];
      if (typeof val === 'string' && koreanRegex.test(val)) {
        console.log(`  [POLLUTED] Post slug: "${post.slug}" | Locale: "${locale}" | Key: "${key}"`);
        console.log(`             Val snippet: "${val.substring(0, 100)}..."`);
        totalPolluted++;
      }
    }
  }
});

console.log('==========================================');
console.log(`Audit Complete. Found ${totalPolluted} polluted entries.`);
console.log('==========================================');

// Clean up
try {
  fs.unlinkSync(TEMP_JS_PATH);
} catch (err) {
  // Ignore
}
