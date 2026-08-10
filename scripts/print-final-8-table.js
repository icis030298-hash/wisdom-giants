const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const existingSlugs = new Set();
const slugMatches = giantsContent.match(/slug:\s*["']([^"']+)["']/g) || [];
slugMatches.forEach(m => existingSlugs.add(m.replace(/slug:\s*["']([^"']+)["']/, '$1')));

const dir = path.join(__dirname, '..', 'src', 'data', 'narratives');

const final8 = [
  { slug: 'rain-queen', name: '레인 퀸 (모카모 모자지)', region: '서/남아프리카 (남아공)', costume: '남아프리카 레바다 부족 왕실 장신구 및 어의' },
  { slug: 'murasaki-shikibu', name: '무라사키 시키부', region: '동아시아 (일본)', costume: '헤이안 시대 십이단에 기모노 및 붓' },
  { slug: 'kalidasa', name: '칼리다사', region: '남아시아 (인도)', costume: '고대 인도 굽타 왕조 산스크리트 학자 가사 및 패엽경' },
  { slug: 'aung-san', name: '아웅 산', region: '동남아시아 (미얀마)', costume: '미얀마 전통 의복 파소 및 정장 재킷' },
  { slug: 'pachacuti', name: '파차쿠티', region: '중남미 (잉카 제국)', costume: '잉카 제국 황금 왕관, 태양 문양 로브 및 지휘봉' },
  { slug: 'rumi', name: '잘랄 알딘 루미', region: '중동 (페르시아/수피)', costume: '페르시아 수피 터번, 수피 가운 및 시집' },
  { slug: 'johannes-kepler', name: '요하네스 케플러', region: '유럽 (독일)', costume: '17세기 독일 학자 칼라 로브 및 천구의' },
  { slug: 'hildegard-of-bingen', name: '힐데가르트 폰 빙겐', region: '유럽 (독일)', costume: '중세 수녀원장 의복 및 필사본 양피지' }
];

console.log('=== VERIFYING FINAL 8 CANDIDATES AGAINST EXISTING 493 GIANTS ===\n');

final8.forEach((item, idx) => {
  const isExisting = existingSlugs.has(item.slug);
  const data = JSON.parse(fs.readFileSync(path.join(dir, `${item.slug}.json`), 'utf8'));
  console.log(`| ${item.slug} | ${item.name} | ${data.era_ko} | ${item.region} | ${data.category} | ${data.epic_ko.includes('그녀') || data.epic_ko.includes('여성') || item.slug === 'rain-queen' || item.slug === 'murasaki-shikibu' || item.slug === 'hildegard-of-bingen' ? '여성' : '남성'} | ${item.costume} | ${isExisting ? '🔴 중복' : '✅ 미존재 (100% 신규)'} |`);
});
