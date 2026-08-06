const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const pilotSlugs = new Set([
  'fear-giants',
  'failure-comeback',
  'loneliness-creation',
  'decision-making',
  'burnout-recovery'
]);

// 1. Gather all untranslated PL posts (excluding pilot 5)
const plUntranslated = [];
blogPosts.forEach(p => {
  if (pilotSlugs.has(p.slug)) return;
  const enTr = p.translations['en'];
  const plTr = p.translations['pl'];
  if (!plTr || (enTr && plTr.title === enTr.title)) {
    plUntranslated.push({ slug: p.slug, enTitle: enTr.title });
  }
});

// 2. Gather all untranslated UK posts
const ukUntranslated = [];
blogPosts.forEach(p => {
  const enTr = p.translations['en'];
  const ukTr = p.translations['uk'];
  if (!ukTr || (enTr && ukTr.title === enTr.title)) {
    ukUntranslated.push({ slug: p.slug, enTitle: enTr.title });
  }
});

// 3. Gather Latin Group (id 20, de 10, ha 10, sw 10)
const latinGroup = [];
['id', 'de', 'ha', 'sw'].forEach(locale => {
  blogPosts.forEach(p => {
    const enTr = p.translations['en'];
    const tr = p.translations[locale];
    if (!tr || (enTr && tr.title === enTr.title)) {
      latinGroup.push({ locale, slug: p.slug, enTitle: enTr.title });
    }
  });
});

// 4. Gather Non-Latin Group (he 10, ru 9, ja 8, el 1)
const nonLatinGroup = [];
['he', 'ru', 'ja', 'el'].forEach(locale => {
  blogPosts.forEach(p => {
    const enTr = p.translations['en'];
    const tr = p.translations[locale];
    if (!tr || (enTr && tr.title === enTr.title)) {
      nonLatinGroup.push({ locale, slug: p.slug, enTitle: enTr.title });
    }
  });
});

console.log(`PL Remaining: ${plUntranslated.length} (Expected 119)`);
console.log(`UK Remaining: ${ukUntranslated.length} (Expected 116)`);
console.log(`Latin Group: ${latinGroup.length} (Expected 50)`);
console.log(`Non-Latin Group: ${nonLatinGroup.length} (Expected 28)`);

const agent1 = plUntranslated.slice(0, 40);
const agent2 = plUntranslated.slice(40, 80);
const agent3 = plUntranslated.slice(80);

const agent4 = ukUntranslated.slice(0, 39);
const agent5 = ukUntranslated.slice(39, 78);
const agent6 = ukUntranslated.slice(78);

const agent7 = latinGroup;
const agent8 = nonLatinGroup;

const totalAllocated = agent1.length + agent2.length + agent3.length +
                       agent4.length + agent5.length + agent6.length +
                       agent7.length + agent8.length;

console.log(`\nAgent 1 (PL Part 1): ${agent1.length} posts`);
console.log(`Agent 2 (PL Part 2): ${agent2.length} posts`);
console.log(`Agent 3 (PL Part 3): ${agent3.length} posts`);
console.log(`Agent 4 (UK Part 1): ${agent4.length} posts`);
console.log(`Agent 5 (UK Part 2): ${agent5.length} posts`);
console.log(`Agent 6 (UK Part 3): ${agent6.length} posts`);
console.log(`Agent 7 (Latin Group): ${agent7.length} posts`);
console.log(`Agent 8 (Non-Latin Group): ${agent8.length} posts`);
console.log(`\nTOTAL ALLOCATED POSTS: ${totalAllocated} (Expected 313)`);

const manifest = {
  agent1,
  agent2,
  agent3,
  agent4,
  agent5,
  agent6,
  agent7,
  agent8
};

const manifestPath = path.join(__dirname, '..', 'scratch', '8_agent_allocation_manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Saved allocation manifest to ${manifestPath}`);
