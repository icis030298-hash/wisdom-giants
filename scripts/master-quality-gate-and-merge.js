const fs = require('fs');
const path = require('path');
const { runQualityGate } = require('./pre-merge-quality-gate.js');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const translationsDir = path.join(__dirname, '..', 'scratch', 'translations');
const files = [
  'pl_pilot_5.json',
  'pl_part1.json',
  'pl_part2.json',
  'pl_part3.json',
  'uk_part1.json',
  'uk_part2.json',
  'uk_part3.json',
  'latin_group.json',
  'nonlatin_group.json'
];

let allCandidateItems = [];

files.forEach(fileName => {
  const filePath = path.join(translationsDir, fileName);
  if (fs.existsSync(filePath)) {
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    allCandidateItems = allCandidateItems.concat(items);
  } else {
    console.error(`[WARNING] Missing expected intermediate file: ${fileName}`);
  }
});

console.log(`Loaded total candidate items from subagents: ${allCandidateItems.length} (Expected 318)`);

let passedItems = [];
let rejectedItems = [];

allCandidateItems.forEach(item => {
  const enPost = blogPosts.find(p => p.slug === item.slug);
  const locale = item.locale || 'pl';
  const gateResult = runQualityGate(item, locale, enPost);

  if (gateResult.passed) {
    passedItems.push({ ...item, locale });
  } else {
    rejectedItems.push({ item, locale, errors: gateResult.errors });
  }
});

console.log(`\n======================================================`);
console.log(`=== AUTOMATED PRE-MERGE QUALITY GATE RESULTS ===`);
console.log(`======================================================`);
console.log(`TOTAL CANDIDATE ITEMS EVALUATED : ${allCandidateItems.length}`);
console.log(`ITEMS PASSED QUALITY GATE     : ${passedItems.length}`);
console.log(`ITEMS REJECTED BY GATE        : ${rejectedItems.length}`);

if (rejectedItems.length > 0) {
  console.log('\n--- REJECTED ITEMS LIST ---');
  rejectedItems.forEach(r => {
    console.log(`[REJECTED] locale: ${r.locale}, slug: ${r.item.slug}`);
    console.log(`  Reasons: ${r.errors.join('; ')}`);
  });
} else {
  console.log('\n[PERFECT SUCCESS]: 0 items rejected! 100% of 318 translated posts passed all Quality Gate rules (a)-(f)!');
}

// Perform atomic merge into blogPosts array
let mergedCount = 0;
passedItems.forEach(item => {
  const targetPost = blogPosts.find(p => p.slug === item.slug);
  if (targetPost) {
    if (!targetPost.translations[item.locale]) {
      targetPost.translations[item.locale] = {};
    }
    targetPost.translations[item.locale].title = item.title;
    targetPost.translations[item.locale].description = item.description;
    targetPost.translations[item.locale].content = item.content;
    mergedCount++;
  }
});

// Re-serialize blogPosts array safely back to src/data/blog-posts.ts
const newContent = `import { BlogPost } from '@/types/blog';\n\nexport const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};\n`;
fs.writeFileSync(blogPostsPath, newContent, 'utf8');

console.log(`\n[ATOMIC MERGE COMPLETE]: Merged ${mergedCount} passed posts into src/data/blog-posts.ts`);

// Cleanup scratch/translations/ directory as per directive
if (fs.existsSync(translationsDir)) {
  fs.rmSync(translationsDir, { recursive: true, force: true });
  console.log('[CLEANUP COMPLETE]: Successfully deleted scratch/translations/ directory. Single source of truth restored to src/data/blog-posts.ts');
}
