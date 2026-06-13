const fs = require('fs');

const narratives = JSON.parse(
  fs.readFileSync('src/data/final-narratives.json', 'utf8')
);

const QUALITY_ISSUES = [];
const NAPOLEON_STANDARD_LENGTH = 900; // 나폴레옹 서사시 기준 길이

Object.entries(narratives).forEach(([slug, data]) => {
  const epic = data.epic_ko || data.epic?.ko || '';
  const issues = [];

  // 1. 너무 짧음 (700자 미만)
  if (epic.length < 700)
    issues.push(`너무짧음:${epic.length}자`);

  // 2. 마크다운 헤더 노출
  if (/^#{1,3}\s/m.test(epic))
    issues.push('마크다운헤더노출');

  // 3. 교과서 문체 감지 (건조한 문체 - '~했습니다' 과다)
  const politeEndings = (epic.match(/했습니다|입니다|었습니다|있습니다/g) || []).length;
  const epicLen = epic.length / 100;
  if (politeEndings / epicLen > 2.5)
    issues.push(`건조한문체:${politeEndings}회`);

  // 4. 영어 단어 혼입
  const engWords = (epic.match(/\b[a-zA-Z]{5,}\b/g) || [])
    .filter(w => !['Giants', 'Wisdom', 'Napoleon'].includes(w));
  if (engWords.length > 2)
    issues.push(`영어혼입:${engWords.slice(0, 3).join(',')}`);

  // 5. 미완성 표시
  if (epic.includes('데이터 준비') || epic.includes('준비 중'))
    issues.push('미완성페이지');

  if (issues.length > 0) {
    QUALITY_ISSUES.push({ slug, issues, length: epic.length });
  }
});

// 심각도별 분류
const critical = QUALITY_ISSUES.filter(i =>
  i.issues.some(x => x.includes('미완성') || x.includes('너무짧음') || x.includes('마크다운헤더'))
);

const medium = QUALITY_ISSUES.filter(i =>
  !i.issues.some(x => x.includes('미완성') || x.includes('너무짧음') || x.includes('마크다운헤더'))
);

console.log('=== 서사시 품질 감사 결과 ===');
console.log('총 위인:', Object.keys(narratives).length);
console.log('품질 이슈 총계:', QUALITY_ISSUES.length, '명');
console.log('심각 (즉시 재작성):', critical.length, '명');
console.log('보통 (개선 권장):', medium.length, '명');

console.log('\n[심각 - 즉시 재작성 필요]');
critical.forEach(i => console.log(`  ${i.slug} | ${i.issues.join(', ')}`));

console.log('\n[보통 - 개선 권장 (상위 30개)]');
medium.slice(0, 30).forEach(i => console.log(`  ${i.slug} | ${i.issues.join(', ')}`));

// 결과 저장
fs.writeFileSync(
  'scripts/epic-quality-report.json',
  JSON.stringify({ critical, medium, total: QUALITY_ISSUES.length }, null, 2)
);
console.log('\n✅ 보고서 저장: scripts/epic-quality-report.json');
console.log(`\n재작성 예상 대상: ${critical.length + medium.length}명`);
console.log(`예상 API 호출: ${(critical.length + medium.length) * 12}회`);
