const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const existingSlugs = new Set();
const slugMatches = giantsContent.match(/slug:\s*["']([^"']+)["']/g) || [];
slugMatches.forEach(m => existingSlugs.add(m.replace(/slug:\s*["']([^"']+)["']/, '$1')));

const dir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const freshCandidates = [];

files.forEach(f => {
  const slug = f.replace('.json', '');
  if (existingSlugs.has(slug)) return; // 100% exclude existing

  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const era = data.era_ko || '';
    const epic = data.epic_ko || '';
    const text = (era + ' ' + epic).toLowerCase();

    // Death year <= 1970 check
    const match = text.match(/~(\d{4})/);
    const deathYear = match ? parseInt(match[1], 10) : null;
    if (deathYear && deathYear > 1970) return;

    // Filter multi-person
    if (slug.includes('sisters') || slug.includes('brothers') || slug.includes('twins')) return;

    // Region tagger
    let region = '기타';
    if (text.includes('한국') || text.includes('조선') || text.includes('신라') || text.includes('고구려') || text.includes('일본') || text.includes('중국')) region = '동아시아';
    else if (text.includes('태국') || text.includes('미얀마') || text.includes('베트남') || text.includes('인도네시아')) region = '동남아시아';
    else if (text.includes('인도') || text.includes('굽타') || text.includes('마우리아')) region = '남아시아';
    else if (text.includes('아랍') || text.includes('페르시아') || text.includes('이집트') || text.includes('오스만') || text.includes('바빌론')) region = '중동';
    else if (text.includes('아프리카') || text.includes('앙골라') || text.includes('말리') || text.includes('에티오피아') || text.includes('남아공') || text.includes('레바다')) region = '아프리카';
    else if (text.includes('멕시코') || text.includes('아스테카') || text.includes('마야') || text.includes('칠레') || text.includes('브라질')) region = '중남미';
    else if (text.includes('독일') || text.includes('프랑스') || text.includes('영국') || text.includes('그리스') || text.includes('로마')) region = '유럽';

    // Gender tagger
    let gender = '남성';
    if (text.includes('여성') || text.includes('여왕') || text.includes('황후') || text.includes('수녀') || text.includes('그녀') || slug.includes('queen') || slug.includes('empress')) gender = '여성';

    freshCandidates.push({
      slug,
      nameKo: data.name_ko || slug,
      era,
      region,
      category: data.category || 'wisdom',
      gender,
      epic
    });
  } catch (e) {}
});

console.log(`Found ${freshCandidates.length} guaranteed 100% fresh candidates!\n`);

// Group by region and pick 8 optimal diverse fresh candidates
const selected8 = [
  freshCandidates.find(c => c.slug === 'rain-queen') || freshCandidates.find(c => c.region === '아프리카' && c.gender === '여성'),
  freshCandidates.find(c => c.region === '동아시아' && c.gender === '여성'),
  freshCandidates.find(c => c.slug === 'hildegard-of-bingen') || freshCandidates.find(c => c.region === '유럽' && c.gender === '여성'),
  freshCandidates.find(c => c.slug === 'kalidasa') || freshCandidates.find(c => c.region === '남아시아'),
  freshCandidates.find(c => c.slug === 'aung-san') || freshCandidates.find(c => c.region === '동남아시아'),
  freshCandidates.find(c => c.slug === 'sor-juana-ines-de-la-cruz') || freshCandidates.find(c => c.region === '중남미'),
  freshCandidates.find(c => c.region === '중동' && c.gender === '남성'),
  freshCandidates.find(c => c.region === '유럽' && c.category === 'science' && c.gender === '남성')
];

console.log('=== GUARANTEED 100% FRESH 8 PILOT CANDIDATES ===\n');
selected8.forEach((c, idx) => {
  if (c) {
    const isExist = existingSlugs.has(c.slug);
    console.log(`| ${idx + 1} | \`${c.slug}\` | ${c.nameKo} | ${c.era} | ${c.region} | ${c.category} | ${c.gender} | ${isExist ? '🔴 중복' : '✅ 미존재 (100% 신규)'} |`);
  }
});
