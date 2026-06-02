const fs = require('fs');
const content = fs.readFileSync('src/data/giants.ts', 'utf8');

// Extract slugs and death years together
const giants = [];
const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
const deathMatches = [...content.matchAll(/death:\s*(\d+|null|undefined)/g)];

slugMatches.forEach((m, i) => {
  const deathRaw = deathMatches[i]?.[1];
  const death = deathRaw && deathRaw !== 'null' && deathRaw !== 'undefined' ? parseInt(deathRaw) : null;
  const status = !death ? '⚠️ NO_DEATH_YEAR' :
    death >= 1970 ? '🚨 POST_1970' : '✅';
  giants.push({slug: m[1], death, status});
});

console.log('Total:', giants.length);
giants.filter(g => g.status !== '✅')
  .forEach(g => console.log(
    g.status, g.slug, '→', g.death || 'UNKNOWN'
  ));
console.log('\n✅ Safe giants:', giants.filter(g => g.status === '✅').length);
