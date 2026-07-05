const fs = require('fs');
const path = require('path');
const txt = fs.readFileSync('src/data/giants.ts', 'utf-8');
// Extract name and slug
const matches = [...txt.matchAll(/name:\s*['"]([^'"]+)['"].*?slug:\s*['"]([^'"]+)['"]/gs)];
const existing = fs.existsSync('public/images/giants') ? fs.readdirSync('public/images/giants') : [];

const missing = matches.filter(m => {
  const slug = m[2];
  const fileExists = existing.some(f => {
    const base = f.substring(0, f.lastIndexOf('.'));
    // Match either exact slug or underscore-replaced slug
    return base === slug || base === slug.replace(/-/g, '_') || base === 'illust_' + slug || base === 'illust_' + slug.replace(/-/g, '_');
  });
  return !fileExists;
});

const zeroByteGiants = [];
matches.forEach(m => {
  const slug = m[2];
  const possibleFiles = [
    slug + '.jpg', slug + '.png',
    slug.replace(/-/g, '_') + '.jpg', slug.replace(/-/g, '_') + '.png',
    'illust_' + slug + '.jpg', 'illust_' + slug + '.png'
  ];
  for (const f of possibleFiles) {
    const p = path.join('public/images/giants', f);
    if (fs.existsSync(p) && fs.statSync(p).size === 0) {
      zeroByteGiants.push({ name: m[1], slug, file: f });
      break;
    }
  }
});
console.log('Zero byte active giants count:', zeroByteGiants.length);
console.log('Zero byte active giants:', zeroByteGiants.map(z => z.slug));
