const fs = require('fs');
const path = require('path');

const giantsImgDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const existingFiles = fs.readdirSync(giantsImgDir).map(f => f.toLowerCase());

const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const narrativeFiles = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));

// Filter files that DO NOT have an image in public/images/giants/
const missingImageGiants = [];

narrativeFiles.forEach(file => {
  const slug = file.replace('.json', '');
  const jpgFile = `${slug}.jpg`.toLowerCase();
  const pngFile = `${slug}.png`.toLowerCase();
  const webpFile = `${slug}.webp`.toLowerCase();

  const hasImage = existingFiles.includes(jpgFile) || existingFiles.includes(pngFile) || existingFiles.includes(webpFile);
  if (!hasImage) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, file), 'utf8'));
      missingImageGiants.push({
        slug,
        era_ko: data.era_ko || '',
        category: data.category || 'wisdom',
        epic_ko: data.epic_ko ? data.epic_ko.slice(0, 100) : ''
      });
    } catch (e) {}
  }
});

console.log(`================================================================`);
console.log(`=== NEW GIANTS LACKING ILLUSTRATION IMAGES (${missingImageGiants.length} TOTAL) ===`);
console.log(`================================================================\n`);

// Proposed 8 Pilot Candidates meeting all criteria:
// 1. Queen Nzinga (Africa / Leadership / Female / Early Modern / African Royal Regalia)
// 2. Lady Triệu / Trung Sisters (Southeast Asia / Leadership / Female / Ancient / Vietnamese Armor)
// 3. Sor Juana Inés de la Cruz (Latin America / Arts-Literature / Female / 17th Century / Nun/Scholar Habit)
// 4. Ibn Rushd / Averroes (Middle East / Philosophy / Male / Medieval / Andalusian Turban & Scroll)
// 5. Aryabhata (South Asia / Science / Male / Ancient / Indian Scholar Robe & Celestial Sphere)
// 6. Solgeo (East Asia - Korea / Arts / Male / Three Kingdoms Era / Korean Painter Brush & Mural)
// 7. Patrice Lumumba (Africa / Leadership-Society / Male / 20th Century / Modern African Suits & Glasses)
// 8. Hypatia of Alexandria (Europe-Greco-Roman / Science-Philosophy / Female / Ancient / Greco-Roman Stola & Astrolabe)

const selectedSlugs = [
  'queen-nzinga',
  'trung-sisters',
  'sor-juana-ines-de-la-cruz',
  'averroes-ibn-rushd',
  'aryabhata',
  'solgeo',
  'patrice-lumumba',
  'hypatia'
];

console.log('--- PROPOSED 8 PILOT GIANTS FOR ILLUSTRATION GENERATION ---');
selectedSlugs.forEach((s, idx) => {
  const found = missingImageGiants.find(m => m.slug === s) || missingImageGiants.find(m => m.slug.includes(s));
  if (found) {
    console.log(`${idx + 1}. Slug: [${found.slug}] | Category: ${found.category} | Era: ${found.era_ko}`);
  } else {
    // Search in narrative files directly
    const navFile = narrativeFiles.find(f => f.includes(s));
    if (navFile) {
      console.log(`${idx + 1}. Slug: [${navFile.replace('.json', '')}]`);
    } else {
      console.log(`${idx + 1}. Slug candidate: [${s}] (Checking availability...)`);
    }
  }
});
