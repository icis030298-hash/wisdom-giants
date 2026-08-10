const fs = require('fs');
const path = require('path');

// 1. Existing 493 giant slugs from giants.ts
const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const existingSlugs = new Set();
const slugMatches = giantsContent.match(/slug:\s*["']([^"']+)["']/g) || [];
slugMatches.forEach(m => existingSlugs.add(m.replace(/slug:\s*["']([^"']+)["']/, '$1')));

// 2. Read all narrative files in src/data/narratives/
const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const narrativeFiles = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));

console.log('================================================================');
console.log('=== EXPORTING NEW 457 GIANTS RAW MANIFEST CSV ===');
console.log('================================================================\n');

// Load wikidata-cache.json or Q-ID mappings if existing in scratch/
let qidCache = {};
const cachePath = path.join(__dirname, '..', 'scratch', 'wikidata-cache.json');
if (fs.existsSync(cachePath)) {
  try {
    qidCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    console.log(`Loaded Wikidata cache with ${Object.keys(qidCache).length} entries.`);
  } catch (e) {}
}

const csvRows = [];
// Header
csvRows.push([
  'slug',
  'name_ko',
  'name_en',
  'birth_year',
  'death_year',
  'is_living',
  'era',
  'region',
  'category',
  'wikidata_qid',
  'wikiSlug',
  'epic_ko_length'
]);

let newCount = 0;

narrativeFiles.forEach(file => {
  const slug = file.replace('.json', '');
  const isExisting = existingSlugs.has(slug);

  // We only export the NEW 457 giants as requested
  if (isExisting) return;

  newCount++;
  const filePath = path.join(narrativesDir, file);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const epicKo = data.epic_ko || '';
    const eraKo = data.era_ko || '';
    const text = (eraKo + ' ' + epicKo).toLowerCase();

    // Extract names
    const nameKo = data.name_ko || (data.fact_box && data.fact_box.name) || slug;
    const nameEn = data.name_en || (data.fact_box_en && data.fact_box_en.name) || slug;

    // Extract birth & death years
    let birthYear = data.birth_year || '';
    let deathYear = data.death_year || '';

    if (!birthYear || !deathYear) {
      const yearMatches = eraKo.match(/(\d{1,4})년?\s*~\s*(\d{1,4})년?/);
      if (yearMatches) {
        if (!birthYear) birthYear = yearMatches[1];
        if (!deathYear) deathYear = yearMatches[2];
      }
    }

    // Determine is_living
    let isLiving = data.is_living !== undefined ? data.is_living : false;
    if (text.includes('생존') || text.includes('현재') || (deathYear && parseInt(deathYear, 10) > 2020)) {
      isLiving = true;
    }

    // Determine region
    let region = data.region || '기타';
    if (text.includes('한국') || text.includes('조선') || text.includes('신라') || text.includes('고구려') || text.includes('중국') || text.includes('일본')) region = '동아시아';
    else if (text.includes('태국') || text.includes('베트남') || text.includes('인도네시아') || text.includes('미얀마') || text.includes('크메르')) region = '동남아시아';
    else if (text.includes('인도') || text.includes('무굴') || text.includes('굽타') || text.includes('파키스탄')) region = '남아시아';
    else if (text.includes('이집트') || text.includes('아랍') || text.includes('오스만') || text.includes('페르시아') || text.includes('터키') || text.includes('이스라엘')) region = '중동/북아프리카';
    else if (text.includes('아프리카') || text.includes('앙골라') || text.includes('콩고') || text.includes('말리') || text.includes('에티오피아') || text.includes('남아공')) region = '서/남아프리카';
    else if (text.includes('멕시코') || text.includes('브라질') || text.includes('잉카') || text.includes('아스테카') || text.includes('칠레') || text.includes('페루')) region = '중남미';
    else if (text.includes('그리스') || text.includes('로마') || text.includes('프랑스') || text.includes('영국') || text.includes('독일') || text.includes('이탈리아') || text.includes('러시아') || text.includes('유럽')) region = '유럽';
    else if (text.includes('미국') || text.includes('캐나다')) region = '북미';

    const category = data.category || 'wisdom';

    // Wikidata QID & wikiSlug
    let qid = data.wikidata_qid || data.qid || data.q_id || (qidCache[slug] ? qidCache[slug].qid : '');
    let wikiSlug = data.wikiSlug || data.wikipedia_slug || (qidCache[slug] ? qidCache[slug].wikiSlug : '');

    const epicLength = epicKo.length;

    // Helper to sanitize CSV field
    const clean = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${str}"`;
    };

    csvRows.push([
      clean(slug),
      clean(nameKo),
      clean(nameEn),
      clean(birthYear),
      clean(deathYear),
      clean(isLiving),
      clean(eraKo),
      clean(region),
      clean(category),
      clean(qid),
      clean(wikiSlug),
      clean(epicLength)
    ]);
  } catch (e) {}
});

const csvContent = csvRows.map(r => r.join(',')).join('\n');
const outputPath = path.join(__dirname, '..', 'scratch', 'new_457_giants_manifest.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`Successfully exported ${newCount} new giant entries to:`);
console.log(`file:///${outputPath.replace(/\\/g, '/')}`);
