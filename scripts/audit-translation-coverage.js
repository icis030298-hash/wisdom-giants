/**
 * Step 0: 번역 커버리지 감사 (Translation Coverage Audit)
 * 485명의 인물 서사를 분석하여 언어별로 실제 번역된 서사의 커버리지 상태를 파악합니다.
 * 단순 en/ko 폴백 텍스트인지 실제 번역 텍스트인지 판단합니다.
 */

const fs = require('fs');
const path = require('path');

const LANGS = [
  'ko', 'en', 'ja', 'zh', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ar', 'hi',
  'bn', 'tr', 'fa', 'pl', 'nl', 'sv', 'vi', 'uk', 'id', 'cs', 'ro', 'hu'
];

function main() {
  const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  const slugs = Object.keys(narratives);
  const totalSlugs = slugs.length;

  console.log(`감사 대상 총 슬러그 수: ${totalSlugs}`);

  const coverageReport = {};
  const details = {};

  LANGS.forEach(lang => {
    coverageReport[lang] = {
      total: totalSlugs,
      translated: 0,
      fallbackOrMissing: 0,
      coveragePercent: 0
    };
    details[lang] = {
      translatedSlugs: [],
      fallbackSlugs: []
    };
  });

  slugs.forEach(slug => {
    const data = narratives[slug] || {};
    const koText = data.epic_ko || '';

    LANGS.forEach(lang => {
      const fieldName = `epic_${lang}`;
      const langText = data[fieldName] || '';

      // 번역 완료 기준 판단:
      // 1. 해당 언어 필드가 존재하고 빈 문자열이 아니어야 함
      // 2. 한국어(ko)가 아님에도 한국어 텍스트와 정확히 똑같으면 안 됨 (폴백 상태 의심)
      // 3. 영어(en)가 아님에도 영어 텍스트와 정확히 똑같으며, 길이가 10자 이상인 경우 폴백 의심
      const enText = data.epic_en || '';
      
      let isFallback = false;
      if (!langText) {
        isFallback = true;
      } else if (lang !== 'ko' && langText === koText) {
        isFallback = true;
      } else if (lang !== 'en' && lang !== 'ko' && langText === enText && enText.length > 50) {
        isFallback = true;
      }

      if (isFallback) {
        coverageReport[lang].fallbackOrMissing++;
        details[lang].fallbackSlugs.push(slug);
      } else {
        coverageReport[lang].translated++;
        details[lang].translatedSlugs.push(slug);
      }
    });
  });

  // 커버리지 백분율 계산
  LANGS.forEach(lang => {
    coverageReport[lang].coveragePercent = Math.round((coverageReport[lang].translated / totalSlugs) * 100);
  });

  // 보고서 디렉토리 생성
  const reportDir = path.resolve('scratch/translations');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // 결과 저장
  fs.writeFileSync(
    path.join(reportDir, 'translation-coverage-audit.json'),
    JSON.stringify({ summary: coverageReport, details }, null, 2),
    'utf8'
  );

  console.log('\n=== 언어별 번역 커버리지 요약 ===');
  console.table(Object.entries(coverageReport).map(([lang, stat]) => ({
    '언어': lang,
    '전체 대상': stat.total,
    '실제 번역됨': stat.translated,
    '미번역/폴백': stat.fallbackOrMissing,
    '커버리지 (%)': `${stat.coveragePercent}%`
  })));
}

main();
