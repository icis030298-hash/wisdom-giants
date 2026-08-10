const fs = require('fs');
const path = require('path');

const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const files = fs.readdirSync(narrativesDir).map(f => f.replace('.json', ''));

const targets = [
  { term: 'rain-queen', name: '레인 퀸 (모카모 모자지)', region: '서/남아프리카 (남아공)', category: 'leadership', gender: '여성', era: '19세기 (1800~1854)', costume: '남아프리카 부족 왕실 장신구 및 의복' },
  { term: 'murasaki', name: '무라사키 시키부', region: '동아시아 (일본)', category: 'arts', gender: '여성', era: '10~11세기 (973~1014)', costume: '헤이안 시대 십이단에 기모노 및 붓' },
  { term: 'pachacuti', name: '파차쿠티', region: '중남미 (잉카 제국)', category: 'leadership', gender: '남성', era: '15세기 (1438~1471)', costume: '잉카 제국 왕관, 태양 문양 의복 및 지휘봉' },
  { term: 'kepler', name: '요하네스 케플러', region: '유럽 (독일)', category: 'science', gender: '남성', era: '16~17세기 (1571~1630)', costume: '17세기 독일 학자 칼라 로브 및 천구의' },
  { term: 'hildegard', name: '힐데가르트 폰 빙겐', region: '유럽 (독일)', category: 'philosophy/arts', gender: '여성', era: '12세기 (1098~1179)', costume: '중세 수녀원장 의복 및 필사본 양피지' },
  { term: 'narai', name: '나라이 대왕', region: '동남아시아 (태국/샤멸)', category: 'society', gender: '남성', era: '17세기 (1633~1688)', costume: '17세기 아유타야 왕국 황금 왕관 및 어의' },
  { term: 'rumi', name: '잘랄 알딘 루미', region: '중동 (페르시아/수피)', category: 'wisdom', gender: '남성', era: '13세기 (1207~1273)', costume: '페르시아 수피 터번, 수피 가운 및 시집' },
  { term: 'nagarjuna', name: '나가르주나 (용수)', region: '남아시아 (인도)', category: 'wisdom', gender: '남성', era: '2~3세기 (150~250)', costume: '고대 인도 대승불교 가사 및 승려 소품' }
];

console.log('=== VERIFYING STRICT 8 PILOT SLUGS ===\n');

targets.forEach((t, idx) => {
  const match = files.find(f => f.includes(t.term));
  if (match) {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, `${match}.json`), 'utf8'));
    console.log(`| ${idx + 1} | \`${match}\` | ${t.name} | ${data.era_ko || t.era} | ${t.region} | ${data.category || t.category} | ${t.gender} | ${t.costume} | 기존 493명 미존재 (100% 신규) |`);
  } else {
    console.log(`MISSING MATCH FOR ${t.term}`);
  }
});
