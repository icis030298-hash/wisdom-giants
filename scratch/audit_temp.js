const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const giantsPath = path.join(projectRoot, 'src/data/giants.ts');
const narrativesPath = path.join(projectRoot, 'src/data/final-narratives.json');
const messagesDir = path.join(projectRoot, 'messages');
const imagesDir = path.join(projectRoot, 'public/images/giants');

let output = '';
function log(msg) {
  console.log(msg);
  output += msg + '\n';
}

log('--- 1. 1970년 이후 사망 위인 검출 ---');
let giantsContent = fs.readFileSync(giantsPath, 'utf8');

const giantBlocks = giantsContent.split(/export const giants[^=]*=\s*\[/)[1];
if (!giantBlocks) {
  log('Failed to parse giants.ts');
  process.exit(1);
}

const giantObjects = [];
const objectRegex = /\{([^}]+)\}/g;
let match;
while ((match = objectRegex.exec(giantBlocks)) !== null) {
  const content = match[1];
  const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
  const deathMatch = content.match(/death:\s*(-?\d+)/);
  const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
  const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
  
  if (slugMatch) {
    giantObjects.push({
      slug: slugMatch[1],
      name: nameMatch ? nameMatch[1] : '',
      death: deathMatch ? parseInt(deathMatch[1]) : null,
      category: categoryMatch ? categoryMatch[1] : ''
    });
  }
}

log(`총 ${giantObjects.length}명의 위인 로드 완료.`);

const post1970 = [];
const noDeath = [];
giantObjects.forEach(g => {
  if (g.death !== null && g.death >= 1970) {
    log(`🚨 1970년 이후 사망 위인 발견: ${g.slug} (${g.death}년 사망)`);
    post1970.push(g.slug);
  }
  if (g.death === null) {
    log(`⚠️ 사망 연도 누락 위인 발견: ${g.slug}`);
    noDeath.push(g.slug);
  }
});

log('\n--- 2. Phase 3 신규 위인 데이터 완성 검출 ---');
let narratives = {};
try {
  narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
} catch (e) {
  log('Failed to parse final-narratives.json: ' + e.message);
}

const incomplete = [];
giantObjects.forEach(g => {
  const n = narratives[g.slug];
  const issues = [];
  if (!n) {
    issues.push('final-narratives.json에 데이터 없음');
  } else {
    if (!n.epic_ko && (!n.epic || !n.epic.ko)) issues.push('epic_ko(서사시) 없음');
    if (!n.trials_ko && (!n.trials || !n.trials.ko)) issues.push('trials_ko(시련) 없음');
    if (!n.overcoming_ko && (!n.overcoming || !n.overcoming.ko)) issues.push('overcoming_ko(극복) 없음');
    if (!n.era_ko && (!n.era || !n.era.ko)) issues.push('era_ko 없음');
  }
  if (issues.length > 0) {
    incomplete.push({ slug: g.slug, issues });
  }
});

log(`미완성 위인: ${incomplete.length}명`);
incomplete.forEach(i => {
  log(`- ${i.slug}: ${i.issues.join(', ')}`);
});

log('\n--- 3. 12개 언어 이름 번역 누락 / 한글 포함 검사 ---');
const locales = ['en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh', 'ko'];
const koMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'ko.json'), 'utf8'));
const koSlugs = Object.keys(koMessages.Giants || {});

locales.forEach(loc => {
  if (loc === 'ko') return;
  const filePath = path.join(messagesDir, `${loc}.json`);
  if (!fs.existsSync(filePath)) {
    log(`❌ ${loc}.json 파일 없음`);
    return;
  }
  const langData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const missing = [];
  const hasKorean = [];
  
  koSlugs.forEach(slug => {
    const g = langData.Giants?.[slug];
    if (!g || !g.name) {
      missing.push(slug);
    } else if (/[가-힣]/.test(g.name)) {
      hasKorean.push(slug);
    }
  });
  
  log(`${loc}: 이름 누락 ${missing.length}명, 한글 포함 ${hasKorean.length}명`);
  if (missing.length > 0 && missing.length <= 10) log(`  └ 누락: ${missing.join(', ')}`);
  if (hasKorean.length > 0 && hasKorean.length <= 10) log(`  └ 한글: ${hasKorean.join(', ')}`);
  if (missing.length > 10) log(`  └ 누락 일부: ${missing.slice(0, 10).join(', ')} ...외 ${missing.length - 10}명`);
  if (hasKorean.length > 10) log(`  └ 한글 일부: ${hasKorean.slice(0, 10).join(', ')} ...외 ${hasKorean.length - 10}명`);
});

log('\n--- 4. hi/ru/zh/de 특정 번역 및 영어 누수 검사 ---');
const checkEnglishLeaks = (loc) => {
  const filePath = path.join(messagesDir, `${loc}.json`);
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  log(`[${loc}]`);
  log(`  Debate Room CTA: ${data.Hero?.debateRoomCTA || '❌ 없음'}`);
  log(`  Consult Title: ${data.Consult?.title || '❌ 없음'}`);
  log(`  Consult Subtitle: ${data.Consult?.subtitle || '❌ 없음'}`);
  log(`  Consult Get Advice: ${data.Consult?.getAdvice || '❌ 없음'}`);
};

checkEnglishLeaks('hi');
checkEnglishLeaks('ru');
checkEnglishLeaks('zh');
checkEnglishLeaks('de');

const deData = JSON.parse(fs.readFileSync(path.join(messagesDir, 'de.json'), 'utf8'));
const spinozaDe = deData.Giants?.['baruch-spinoza'];
log(`\n독일어 스피노자 shortDescription: ${spinozaDe?.shortDescription || '❌ 없음'}`);

log('\n--- 5. 이미지 누락 위인 검사 ---');
let imageFiles = [];
if (fs.existsSync(imagesDir)) {
  imageFiles = fs.readdirSync(imagesDir);
}
const missingImages = [];
giantObjects.forEach(g => {
  const hasImage = imageFiles.some(f => f.toLowerCase().includes(g.slug.toLowerCase()));
  if (!hasImage) {
    missingImages.push(g.slug);
  }
});
log(`이미지 누락 위인: ${missingImages.length}명`);
log(missingImages.join(', '));

fs.writeFileSync(path.join(projectRoot, 'scratch/audit_output.txt'), output, 'utf8');
log('Done saving report.');
