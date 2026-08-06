const fs = require('fs');
const path = require('path');
const { runQualityGate } = require('./pre-merge-quality-gate.js');

const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const blogPostsCode = fs.readFileSync(blogPostsPath, 'utf8');
const cleanCode = blogPostsCode.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

console.log('=== TEST 1: TEST PILOT 5 APPROVED POLISH POSTS AGAINST CURRENT QUALITY GATE ===');
const pilotPath = path.join(__dirname, '..', 'scratch', 'translations', 'pl_pilot_5.json');
if (fs.existsSync(pilotPath)) {
  const pilotItems = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
  pilotItems.forEach((item, idx) => {
    const enPost = blogPosts.find(p => p.slug === item.slug);
    const gateResult = runQualityGate(item, 'pl', enPost);
    console.log(`Pilot Item ${idx + 1} [${item.slug}]: passed = ${gateResult.passed}`);
    if (!gateResult.passed) {
      console.log(`  -> Errors: ${gateResult.errors.join('; ')}`);
    }
  });
} else {
  // Extract pilot 5 directly from blogPosts
  const pilotSlugs = ['fear-giants', 'failure-comeback', 'loneliness-creation', 'decision-making', 'burnout-recovery'];
  pilotSlugs.forEach((slug, idx) => {
    const post = blogPosts.find(p => p.slug === slug);
    const plTr = post.translations['pl'];
    const item = { slug, title: plTr.title, description: plTr.description, content: plTr.content };
    const gateResult = runQualityGate(item, 'pl', post);
    console.log(`Pilot Item ${idx + 1} [${slug}]: passed = ${gateResult.passed}`);
    if (!gateResult.passed) {
      console.log(`  -> Errors: ${gateResult.errors.join('; ')}`);
    }
  });
}

console.log('\n=== TEST 2: INSPECT REJECTED SENTENCES FROM pl_31_out.json ===');
const pl31Path = path.join(__dirname, '..', 'scratch', 'translations_90', 'pl_31_out.json');
if (fs.existsSync(pl31Path)) {
  const pl31Items = JSON.parse(fs.readFileSync(pl31Path, 'utf8'));
  pl31Items.forEach((item, idx) => {
    const enPost = blogPosts.find(p => p.slug === item.slug);
    const gateResult = runQualityGate(item, 'pl', enPost);
    console.log(`Item ${idx + 1} [${item.slug}]: passed = ${gateResult.passed}`);
    if (!gateResult.passed) {
      console.log(`  -> Errors: ${gateResult.errors.join('; ')}`);
      // Find triggering continuous English text
      const englishSequenceRegex = /[a-zA-Z]{3,}(?:\s+[a-zA-Z]{3,}){7,}/g;
      const matches = item.content.match(englishSequenceRegex);
      if (matches) {
        console.log(`  -> Triggering English Sequences (Count: ${matches.length}):`);
        matches.slice(0, 3).forEach(m => console.log(`     "${m}"`));
      }
    }
  });
} else {
  console.log('scratch/translations_90/pl_31_out.json NOT FOUND');
}
