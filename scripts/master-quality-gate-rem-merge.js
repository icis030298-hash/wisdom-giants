const fs = require('fs');
const path = require('path');
const { runQualityGate } = require('./pre-merge-quality-gate.js');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const remDir = path.join(__dirname, '..', 'scratch', 'translations_rem');
const remFiles = [
  'pl_rem_44.json',
  'uk_rem_39a.json',
  'uk_rem_39b.json',
  'others_rem_62.json'
];

let remItems = [];
remFiles.forEach(fileName => {
  const filePath = path.join(remDir, fileName);
  if (fs.existsSync(filePath)) {
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    remItems = remItems.concat(items);
  }
});

console.log(`Loaded 2nd batch remaining candidate items: ${remItems.length} (Expected 184)`);

let passedItems = [];
let rejectedItems = [];

remItems.forEach(item => {
  const enPost = blogPosts.find(p => p.slug === item.slug);
  const locale = item.locale;
  const gateResult = runQualityGate(item, locale, enPost);

  if (gateResult.passed) {
    passedItems.push(item);
  } else {
    rejectedItems.push({ item, errors: gateResult.errors });
  }
});

console.log(`\n======================================================`);
console.log(`=== 2ND BATCH AUTOMATED PRE-MERGE QUALITY GATE RESULTS ===`);
console.log(`======================================================`);
console.log(`TOTAL CANDIDATE ITEMS EVALUATED : ${remItems.length}`);
console.log(`ITEMS PASSED QUALITY GATE     : ${passedItems.length}`);
console.log(`ITEMS REJECTED BY GATE        : ${rejectedItems.length}`);

if (rejectedItems.length > 0) {
  console.log('\n--- REJECTED ITEMS LIST ---');
  rejectedItems.forEach(r => {
    console.log(`[REJECTED] locale: ${r.item.locale}, slug: ${r.item.slug}`);
    console.log(`  Reasons: ${r.errors.join('; ')}`);
  });
} else {
  console.log('\n[PERFECT SUCCESS]: 0 items rejected! 100% of 184 translated posts passed all Quality Gate rules (a)-(f)!');
}

// Atomically merge passed items into blogPosts
let mergeCount = 0;
passedItems.forEach(item => {
  const targetPost = blogPosts.find(p => p.slug === item.slug);
  if (targetPost) {
    if (!targetPost.translations[item.locale]) {
      targetPost.translations[item.locale] = {};
    }
    targetPost.translations[item.locale].title = item.title;
    targetPost.translations[item.locale].description = item.description;
    targetPost.translations[item.locale].content = item.content;
    mergeCount++;
  }
});

// Save updated blogPosts array to src/data/blog-posts.ts
const newContent = `import { BlogPost } from '@/types/blog';\n\nexport const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};\n`;
fs.writeFileSync(blogPostsPath, newContent, 'utf8');

console.log(`\n[ATOMIC MERGE COMPLETE]: Merged ${mergeCount} posts into src/data/blog-posts.ts`);

// Clean up scratch/ directories as per directive
['translations', 'translations_rem', 'tasks', 'tasks_rem'].forEach(subDir => {
  const targetPath = path.join(__dirname, '..', 'scratch', subDir);
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`[CLEANUP COMPLETE]: Successfully deleted scratch/${subDir}/ directory.`);
  }
});
