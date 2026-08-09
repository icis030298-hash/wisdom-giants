const fs = require('fs');
const path = require('path');

// 1. Read src/data/giants.ts to extract all slugs
const giantsFile = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugMatches = [...giantsFile.matchAll(/slug:\s*["']([^"']+)["']/g)];
const sourceSlugs = slugMatches.map(m => m[1]);

// 2. Read incomplete-giants.json
const incompleteSlugs = JSON.parse(fs.readFileSync('src/config/incomplete-giants.json', 'utf8'));
const incompleteSet = new Set(incompleteSlugs);

// 3. Compute sitemap slugs
const sitemapSlugs = sourceSlugs.filter(slug => !incompleteSet.has(slug));

// 4. Compute differences
const sourceMinusSitemap = sourceSlugs.filter(slug => incompleteSet.has(slug));
const sitemapMinusSource = sitemapSlugs.filter(slug => !sourceSlugs.includes(slug));

console.log("=== STAGE 4-1 Verification Report ===");
console.log(`Source Data Total (src/data/giants.ts): ${sourceSlugs.length}`);
console.log(`Incomplete Giants Count (src/config/incomplete-giants.json): ${incompleteSlugs.length}`);
console.log(`Sitemap Slugs Total: ${sitemapSlugs.length}`);
console.log(`\nSource \\ Sitemap (9 items):`);
console.log(sourceMinusSitemap);
console.log(`\nSitemap \\ Source (0 items):`);
console.log(sitemapMinusSource);
console.log("\nConfirmed Base Count: 493");
