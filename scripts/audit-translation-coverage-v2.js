/**
 * Step 0 (v2): 번역 커버리지 정밀 감사
 * - 이번에 서사 확장이 완료된 335명(Pilot + Batch 1~3)은 기존 번역 여부와 상관없이 '모든 23개 언어 재번역(Override) 대상'으로 분류합니다.
 * - 나머지 150명은 건드리지 않고, 비어있는 신규 12개 언어에 대해서만 번역 필요 여부를 확인합니다.
 */

const fs = require('fs');
const path = require('path');

const LANGS = [
  'en', 'ja', 'zh', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ar', 'hi',
  'bn', 'tr', 'fa', 'pl', 'nl', 'sv', 'vi', 'uk', 'id', 'cs', 'ro', 'hu'
];

function main() {
  const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  const slugs = Object.keys(narratives);
  
  // 1. 서사 확장 완료 인원 추출 (epic_ko가 1800자 이상)
  const expandedSlugs = slugs.filter(s => (narratives[s].epic_ko || '').length >= 1800);
  const unexpandedSlugs = slugs.filter(s => (narratives[s].epic_ko || '').length < 1800);

  console.log(`전체 인원: ${slugs.length}명`);
  console.log(`  - 서사 확장 완료 (재번역 대상): ${expandedSlugs.length}명`);
  console.log(`  - 서사 미완성 (기존 유지 대상): ${unexpandedSlugs.length}명`);

  const translationTasks = {};
  let totalTaskCount = 0;

  LANGS.forEach(lang => {
    translationTasks[lang] = {
      overrideRequired: [], // 재번역 필요 (확장 완료 335명 중)
      newTranslationRequired: [], // 신규 번역 필요 (미완성 150명 중 누락분)
      upToDate: [] // 기존 번역 유지
    };
  });

  // 1) 확장 완료 인원 (335명) -> 23개 언어 무조건 재번역 필요
  expandedSlugs.forEach(slug => {
    LANGS.forEach(lang => {
      translationTasks[lang].overrideRequired.push(slug);
      totalTaskCount++;
    });
  });

  // 2) 미완성 인원 (150명) -> 신규 12개 언어 중 비어있거나 fallback인 경우만 번역
  unexpandedSlugs.forEach(slug => {
    const data = narratives[slug] || {};
    const koText = data.epic_ko || '';
    const enText = data.epic_en || '';

    LANGS.forEach(lang => {
      const fieldName = `epic_${lang}`;
      const langText = data[fieldName] || '';

      let isFallback = false;
      if (!langText) {
        isFallback = true;
      } else if (langText === koText) {
        isFallback = true;
      } else if (lang !== 'en' && langText === enText && enText.length > 50) {
        isFallback = true;
      }

      if (isFallback) {
        translationTasks[lang].newTranslationRequired.push(slug);
        totalTaskCount++;
      } else {
        translationTasks[lang].upToDate.push(slug);
      }
    });
  });

  // 디렉토리 생성 및 결과 저장
  const reportDir = path.resolve('scratch/translations');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const summary = {};
  LANGS.forEach(lang => {
    summary[lang] = {
      overrideCount: translationTasks[lang].overrideRequired.length,
      newCount: translationTasks[lang].newTranslationRequired.length,
      upToDateCount: translationTasks[lang].upToDate.length,
      totalRequired: translationTasks[lang].overrideRequired.length + translationTasks[lang].newTranslationRequired.length
    };
  });

  fs.writeFileSync(
    path.join(reportDir, 'translation-coverage-audit-v2.json'),
    JSON.stringify({ summary, details: translationTasks }, null, 2),
    'utf8'
  );

  console.log('\n=== [V2] 언어별 실제 번역 작업 필요량 요약 ===');
  console.table(Object.entries(summary).map(([lang, stat]) => ({
    '언어': lang,
    '재번역 (Override)': stat.overrideCount,
    '신규 번역 (New)': stat.newCount,
    '기존 유지': stat.upToDateCount,
    '총 번역 필요량': stat.totalRequired
  })));

  console.log(`\n전체 가동이 필요한 총 번역 태스크 수: ${totalTaskCount} 건`);
}

main();
