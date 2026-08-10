const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const existingSlugs = new Set();
const slugMatches = giantsContent.match(/slug:\s*["']([^"']+)["']/g) || [];
slugMatches.forEach(m => existingSlugs.add(m.replace(/slug:\s*["']([^"']+)["']/, '$1')));

const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const publicGiantsDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const existingImages = new Set(fs.readdirSync(publicGiantsDir).map(f => f.toLowerCase()));

const narrativeFiles = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));

const queue = [];

narrativeFiles.forEach(file => {
  const slug = file.replace('.json', '');

  // 1. Skip bear
  if (slug === 'wojtek') return;

  // 2. Skip if image already exists in public/images/giants/
  if (existingImages.has(`${slug}.jpg`) || existingImages.has(`${slug}.webp`)) return;

  try {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, file), 'utf8'));
    const era = data.era_ko || '';
    const epic = data.epic_ko || '';
    const text = (era + ' ' + epic).toLowerCase();

    // 3. Skip death year > 1990
    const match = text.match(/~(\d{4})/);
    const deathYear = match ? parseInt(match[1], 10) : null;
    if (deathYear && deathYear > 1990) return;

    // Determine category & name
    const nameKo = data.name_ko || (data.fact_box && data.fact_box.name) || slug;
    const nameEn = data.name_en || (data.fact_box_en && data.fact_box_en.name) || slug;
    const category = data.category || 'wisdom';

    // Determine gender
    let gender = 'male';
    if (text.includes('여성') || text.includes('여왕') || text.includes('황후') || text.includes('수녀') || text.includes('그녀') || slug.includes('queen') || slug.includes('empress')) {
      gender = 'female';
    }

    queue.push({
      slug,
      nameKo,
      nameEn,
      category,
      gender,
      era_ko: era
    });
  } catch (e) {}
});

console.log('================================================================');
console.log(`=== GIANTS ILLUSTRATION GENERATION QUEUE: ${queue.length} GIANTS ===`);
console.log('================================================================\n');

console.log('First 10 Giants in Queue:');
queue.slice(0, 10).forEach((g, idx) => console.log(`${idx + 1}. [${g.slug}] (${g.nameKo} / ${g.nameEn}) - ${g.category} - ${g.gender}`));

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'illustration_queue.json'), JSON.stringify(queue, null, 2), 'utf8');
console.log(`\nSaved illustration queue to scratch/illustration_queue.json`);
