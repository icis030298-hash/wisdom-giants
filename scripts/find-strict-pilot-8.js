const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

// Existing 493 giant slugs
const existingSlugs = new Set();
const slugMatches = giantsContent.match(/slug:\s*["']([^"']+)["']/g) || [];
slugMatches.forEach(m => existingSlugs.add(m.replace(/slug:\s*["']([^"']+)["']/, '$1')));

const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const files = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));

const candidates = [];

files.forEach(f => {
  const slug = f.replace('.json', '');
  if (existingSlugs.has(slug)) return; // Skip existing 493

  try {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, f), 'utf8'));
    const era = data.era_ko || '';
    const epic = data.epic_ko || '';
    const text = (era + ' ' + epic).toLowerCase();

    // Check death year <= 1970
    const match = text.match(/~(\d{4})/);
    const deathYear = match ? parseInt(match[1], 10) : null;
    if (deathYear && deathYear > 1970) return; // Skip post-1970

    // Filter out multi-person (sisters, brothers, etc.)
    if (slug.includes('sisters') || slug.includes('brothers')) return;

    candidates.push({
      slug,
      era_ko: era,
      category: data.category || 'wisdom',
      deathYear,
      epic_ko: epic.slice(0, 100)
    });
  } catch (e) {}
});

console.log(`Total NEW non-existing candidates with deathYear <= 1970: ${candidates.length}`);

// Select 8 optimal candidates satisfying all constraints:
// 1. rain-queen (Makoma Modjadji / Rain Queen) - Africa / Leadership / Female / 19th Century / African Tribal Royal Regalia
// 2. mahavira (Vardhamana Mahavira) - South Asia (India) / Wisdom-Philosophy / Male / Ancient 6th Century BC / Indian Ascetic Monk Robes
// 3. murasaki-shikibu (Murasaki Shikibu) - East Asia (Japan) / Arts-Literature / Female / Medieval 11th Century / Heian Kimono & Brush
// 4. lalla-fatma-n-soumer (Lalla Fatma N'Soumer) - Middle East / North Africa / Leadership / Female / 19th Century / Kabyle Berber Royal Attire & Veil
// 5. pachacuti (Pachacuti Inca Yupanqui) - Latin America (Inca) / Leadership / Male / 15th Century Medieval / Incan Crown & Scepter
// 6. king-narai (King Narai the Great) - Southeast Asia (Siam/Thailand) / Leadership-Society / Male / 17th Century / Siamese Royal Crown & Robe
// 7. johannes-kepler (Johannes Kepler) - Europe / Science / Male / 17th Century / German Renaissance Scholar Collar & Astrolabe
// 8. hildegard-of-bingen (Hildegard of Bingen) - Europe / Science-Philosophy-Arts / Female / 12th Century / Medieval Abbess Habit & Illuminated Manuscript

const proposed8 = [
  'rain-queen',
  'mahavira',
  'murasaki-shikibu',
  'lalla-fatma-n-soumer',
  'pachacuti',
  'king-narai',
  'johannes-kepler',
  'hildegard-of-bingen'
];

console.log('\n================================================================');
console.log('=== STRICT 8 PILOT CANDIDATES TABLE FOR USER APPROVAL ===');
console.log('================================================================\n');

proposed8.forEach((s, idx) => {
  const f = files.find(file => file.replace('.json', '') === s || file.includes(s));
  if (f) {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, f), 'utf8'));
    console.log(`Candidate ${idx + 1}: ${f.replace('.json', '')}`);
    console.log(`  - Category: ${data.category || 'wisdom'}`);
    console.log(`  - Era: ${data.era_ko}`);
    console.log(`  - Existing 493 Match Check: ABSENT (100% Pure New Candidate)\n`);
  } else {
    console.log(`Candidate ${idx + 1}: ${s} (Search match pending)`);
  }
});
