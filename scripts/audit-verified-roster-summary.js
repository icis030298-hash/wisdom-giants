const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== 500 ROSTER FULL VERIFICATION AUDIT & SUMMARY ===');
console.log('================================================================\n');

// 1. Read existing 493 giants from giants.ts
const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

// Parse name, slug, era from giants.ts
const existingGiantsMap = new Map(); // normalized name -> { slug, name, era }
const giantBlockRegex = /id:\s*["']([^"']+)["'][\s\S]*?name:\s*["']([^"']+)["'][\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?era:\s*["']([^"']+)["']/g;
let match;
while ((match = giantBlockRegex.exec(giantsContent)) !== null) {
  const [_, id, name, slug, era] = match;
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
  existingGiantsMap.set(normalizedName, { id, name, slug, era });
}

console.log(`1. Existing Original Giants in giants.ts: ${existingGiantsMap.size} giants`);

// 2. Read all narrative files in src/data/narratives/
const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const narrativeFiles = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));

console.log(`2. Total narrative JSON files in src/data/narratives/: ${narrativeFiles.length} files`);

// Identify new giants (files not present in existingGiantsMap slugs)
const existingSlugs = new Set(Array.from(existingGiantsMap.values()).map(g => g.slug));

let totalNewNarratives = 0;
let regionCounts = {};
let categoryCounts = {};
let regionCategoryCross = {};
let maleCount = 0;
let femaleCount = 0;
let unknownGenderCount = 0;
let diedAfter1970 = [];
let overlapsWithExisting = [];
let placeholderPatterns = [];

// Name normalization helper
function norm(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
}

// Extract year helper
function parseDeathYear(eraStr, epicKo) {
  const match = (eraStr + ' ' + epicKo).match(/~(\d{4})/);
  if (match) return parseInt(match[1], 10);
  const match2 = (eraStr + ' ' + epicKo).match(/(\d{4})년/);
  if (match2) return parseInt(match2[1], 10);
  return null;
}

narrativeFiles.forEach(file => {
  const slug = file.replace('.json', '');
  const isNew = !existingSlugs.has(slug);

  try {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, file), 'utf8'));

    // Extract name
    const nameKo = data.name_ko || (data.fact_box && data.fact_box.name) || slug;
    const nameEn = data.name_en || (data.fact_box_en && data.fact_box_en.name) || slug;
    const category = data.category || 'wisdom';
    const eraKo = data.era_ko || '';

    // Region infering helper
    let region = '기타/미정';
    const text = (eraKo + ' ' + (data.epic_ko || '')).toLowerCase();
    if (text.includes('한국') || text.includes('조선') || text.includes('신라') || text.includes('고구려') || text.includes('백제') || text.includes('중국') || text.includes('일본') || text.includes('한나라') || text.includes('당나라') || text.includes('송나라') || text.includes('명나라') || text.includes('청나라')) region = '동아시아';
    else if (text.includes('베트남') || text.includes('인도네시아') || text.includes('태국') || text.includes('캄보디아') || text.includes('크메르') || text.includes('미얀마') || text.includes('필리핀')) region = '동남아시아';
    else if (text.includes('인도') || text.includes('무굴') || text.includes('굽타') || text.includes('마우리아') || text.includes('파키스탄') || text.includes('방글라데시')) region = '남아시아';
    else if (text.includes('이집트') || text.includes('바빌로니아') || text.includes('아랍') || text.includes('오스만') || text.includes('페르시아') || text.includes('이란') || text.includes('이라크') || text.includes('코르도바') || text.includes('안달루시아') || text.includes('이스라엘')) region = '중동/북아프리카';
    else if (text.includes('아프리카') || text.includes('앙골라') || text.includes('콩고') || text.includes('말리') || text.includes('에티오피아') || text.includes('나이지리아') || text.includes('줄루') || text.includes('남아프리카')) region = '서/남아프리카';
    else if (text.includes('멕시코') || text.includes('브라질') || text.includes('잉카') || text.includes('아스테카') || text.includes('아르헨티나') || text.includes('칠레') || text.includes('페루') || text.includes('쿠바')) region = '중남미';
    else if (text.includes('그리스') || text.includes('로마') || text.includes('프랑스') || text.includes('영국') || text.includes('독일') || text.includes('이탈리아') || text.includes('러시아') || text.includes('스페인') || text.includes('유럽')) region = '유럽';
    else if (text.includes('미국') || text.includes('캐나다')) region = '북미';

    // Check placeholder pattern
    if (!data.epic_ko || data.epic_ko.length < 150 || data.epic_ko.includes('생애 미상') || data.epic_ko.includes('내용 준비 중')) {
      placeholderPatterns.push({ slug, reason: 'Short epic_ko (<150 chars) or placeholder text' });
    }

    // Gender detection helper
    let gender = '남성';
    if (text.includes('여성') || text.includes('여왕') || text.includes('황후') || text.includes('수녀') || text.includes('그녀') || text.includes('자매')) {
      gender = '여성';
      femaleCount++;
    } else {
      maleCount++;
    }

    // Death year check (> 1970)
    const deathYear = parseDeathYear(eraKo, data.epic_ko || '');
    if (deathYear && deathYear > 1970) {
      diedAfter1970.push({ slug, nameKo, deathYear, eraKo });
    }

    // Overlap check with existing 493 giants
    if (isNew) {
      const normSlug = norm(slug);
      for (const [existingNorm, existingObj] of existingGiantsMap.entries()) {
        if (normSlug.includes(existingNorm) || existingNorm.includes(normSlug) || norm(nameKo).includes(existingNorm)) {
          overlapsWithExisting.push({
            newSlug: slug,
            newName: nameKo,
            existingSlug: existingObj.slug,
            existingName: existingObj.name
          });
          break;
        }
      }
    }

    if (!regionCounts[region]) regionCounts[region] = 0;
    regionCounts[region]++;

    if (!categoryCounts[category]) categoryCounts[category] = 0;
    categoryCounts[category]++;

    if (!regionCategoryCross[region]) regionCategoryCross[region] = {};
    if (!regionCategoryCross[region][category]) regionCategoryCross[region][category] = 0;
    regionCategoryCross[region][category]++;

  } catch (e) {}
});

console.log('\n================================================================');
console.log('=== VERIFIED ROSTER SUMMARY AUDIT RESULTS ===');
console.log('================================================================\n');

console.log('1. REGION BREAKDOWN (지역별 인원 수):');
Object.keys(regionCounts).forEach(r => console.log(`   - ${r}: ${regionCounts[r]}명`));

console.log('\n2. CATEGORY BREAKDOWN (분야별 인원 수):');
Object.keys(categoryCounts).forEach(c => console.log(`   - ${c}: ${categoryCounts[c]}명`));

console.log('\n3. GENDER RATIO (성별 비율):');
console.log(`   - 여성: ${femaleCount}명 (${(femaleCount / narrativeFiles.length * 100).toFixed(1)}%)`);
console.log(`   - 남성: ${maleCount}명 (${(maleCount / narrativeFiles.length * 100).toFixed(1)}%)`);

console.log(`\n4. DEATH YEAR > 1970 COUNT: ${diedAfter1970.length}명`);
if (diedAfter1970.length > 0) {
  console.log('   Sample figures dying after 1970:');
  diedAfter1970.slice(0, 10).forEach(d => console.log(`   - [${d.slug}] (${d.deathYear}년 사망): ${d.eraKo}`));
}

console.log(`\n5. OVERLAPS WITH EXISTING 493 GIANTS: ${overlapsWithExisting.length}명`);
if (overlapsWithExisting.length > 0) {
  console.log('   Overlapping figures:');
  overlapsWithExisting.forEach(o => console.log(`   - New [${o.newSlug}] overlaps with existing [${o.existingSlug}] (${o.existingName})`));
}

console.log(`\n6. PLACEHOLDER PATTERNS DETECTED: ${placeholderPatterns.length}건`);
if (placeholderPatterns.length > 0) {
  placeholderPatterns.forEach(p => console.log(`   - [${p.slug}]: ${p.reason}`));
}
