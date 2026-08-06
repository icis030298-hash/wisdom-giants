const fs = require('fs');
const path = require('path');
const { runQualityGate } = require('./pre-merge-quality-gate.js');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const plPath = path.join(__dirname, '..', 'scratch', 'translations_90', 'pl_31_out.json');
const othersPath = path.join(__dirname, '..', 'scratch', 'translations_last', 'others_59.json');

let itemsToMerge = [];

if (fs.existsSync(plPath)) {
  const items = JSON.parse(fs.readFileSync(plPath, 'utf8'));
  console.log(`Loaded PL items: ${items.length}`);
  itemsToMerge = itemsToMerge.concat(items);
}

if (fs.existsSync(othersPath)) {
  const items = JSON.parse(fs.readFileSync(othersPath, 'utf8'));
  console.log(`Loaded Others items: ${items.length}`);
  itemsToMerge = itemsToMerge.concat(items);
}

console.log(`Total candidate items to merge: ${itemsToMerge.length} (Expected 90)`);

let passedItems = [];
let rejectedItems = [];

itemsToMerge.forEach(item => {
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
console.log(`=== QUALITY GATE EVALUATION ON FINAL 90 ITEMS ===`);
console.log(`======================================================`);
console.log(`TOTAL CANDIDATE ITEMS EVALUATED : ${itemsToMerge.length}`);
console.log(`ITEMS PASSED QUALITY GATE     : ${passedItems.length}`);
console.log(`ITEMS REJECTED BY GATE        : ${rejectedItems.length}`);

if (rejectedItems.length > 0) {
  console.log('\n--- REJECTED ITEMS LIST ---');
  rejectedItems.forEach(r => {
    console.log(`[REJECTED] locale: ${r.item.locale}, slug: ${r.item.slug}`);
    console.log(`  Reasons: ${r.errors.join('; ')}`);
  });
}

// Atomically merge passed items into blogPosts array
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
['translations', 'translations_rem', 'translations_final', 'translations_last', 'translations_90', 'tasks', 'tasks_rem', 'tasks_final', 'tasks_last', 'tasks_90'].forEach(subDir => {
  const targetPath = path.join(__dirname, '..', 'scratch', subDir);
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`[CLEANUP COMPLETE]: Successfully deleted scratch/${subDir}/ directory.`);
  }
});
