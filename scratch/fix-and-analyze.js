const fs = require('fs');

const finalNarrativesPath = 'src/data/final-narratives.json';
const fn = JSON.parse(fs.readFileSync(finalNarrativesPath, 'utf-8'));

// 1. Fix Theodora
if (fn['theodora'] && fn['theodora'].epic_ko) {
  const text = fn['theodora'].epic_ko;
  const paragraphs = text.split('\n\n');
  if (paragraphs.length >= 2 && paragraphs[0] === paragraphs[1]) {
    paragraphs.splice(0, 1);
    fn['theodora'].epic_ko = paragraphs.join('\n\n');
    fs.writeFileSync(finalNarrativesPath, JSON.stringify(fn, null, 2));
    console.log('Theodora duplicate paragraph fixed.');
  } else {
    console.log('Theodora duplicate paragraph not found or already fixed.');
  }
}

// 2. Find worst offenders for pronoun density
const pronounRegex = /(그는|그녀는|그가|그녀가|그의|그녀의|그에게|그녀에게|그를|그녀를)/g;
let densities = [];

// Focus on the recently converted 150 giants (Batch 5, 6, 7/Final)
// We'll just scan all of them to be safe, but report the top ones.
Object.keys(fn).forEach(slug => {
  const text = fn[slug].epic_ko;
  if (!text) return;
  
  const match = text.match(pronounRegex);
  const count = match ? match.length : 0;
  const length = text.length;
  if (length === 0) return;
  
  const density = (count / length) * 100; // Pronouns per 100 characters
  densities.push({ slug, count, length, density, text });
});

densities.sort((a, b) => b.density - a.density);

console.log('\n--- Top 10 Worst Offenders (High Pronoun Density) ---');
for (let i = 0; i < 10; i++) {
  const item = densities[i];
  console.log(`${i+1}. ${item.slug} (Density: ${item.density.toFixed(2)} per 100 chars, Count: ${item.count}, Length: ${item.length})`);
}

// Extract top 3 for rewriting samples
fs.writeFileSync('scratch/worst-offenders.json', JSON.stringify(densities.slice(0, 3), null, 2));
console.log('\nTop 3 worst offenders saved to scratch/worst-offenders.json for rewriting.');
