const fs = require('fs');

const raw = fs.readFileSync('src/data/blog-posts.ts', 'utf8');

// Find slugs that are missing translations for specific locales
// Each blog post starts with "slug": "..."
// Extract all slug + locale pairs

// Find all slug positions
const slugMatches = [...raw.matchAll(/"slug"\s*:\s*"([^"]+)"/g)];
const partialLocales = ['ar', 'zh', 'ru', 'hi'];

partialLocales.forEach(locale => {
  const pattern = new RegExp(`"${locale}"\\s*:\\s*\\{`, 'g');
  const localeMatches = [...raw.matchAll(pattern)];
  const count = localeMatches.length;
  console.log(`${locale}: has ${count}/120 translations. Missing ${120 - count}.`);
});

// Also scan to find slugs present but lacking specific locales
// This is harder to do without parsing the full TS... 
// Let's just note the counts for now
console.log("\nNote: Need to identify exactly which slugs are missing for ar/zh/ru/hi");
