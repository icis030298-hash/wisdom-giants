import fs from 'fs';
import path from 'path';

const VALID_CATEGORIES = [
  'leadership', 'science', 'philosophy', 'arts', 'society', 'business'
];

const ALL_LOCALES = [
  'ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'
];

const LANGUAGE_PATTERNS = {
  ko: /[가-힣]/,
  ja: /[\u3040-\u30FF\u4E00-\u9FAF]/,
  ar: /[\u0600-\u06FF]/,
  hi: /[\u0900-\u097F]/,
  ru: /[\u0400-\u04FF]/,
  zh: /[\u4E00-\u9FFF]/,
  de: /[äöüÄÖÜß]/,
  es: /[áéíóúñ¿¡]/,
  fr: /[àâæçéèêëîïôœùûüÿ]/,
  it: /[àèéìíîòóùú]/,
  pt: /[ãâáàéêíóôõúç]/,
  en: /^[a-zA-Z\s.,!?'"()-]+$/
};

const ENGLISH_WORD = /\b[a-zA-Z]{5,}\b/g;
const ALLOWED_ENGLISH = [
  'Giants', 'Wisdom', 'AI', 'DNA', 'MBTI',
  'Google', 'Firebase', 'Gemini'
];

function getValuesText(data) {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return data.map(val => getValuesText(val)).join(' ');
  }
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data)
      .filter(([key]) => key !== 'id' && key !== 'slug') // Skip technical fields
      .map(([_, val]) => getValuesText(val))
      .join(' ');
  }
  return '';
}

function isEnglishText(text) {
  // Use unique English stopwords that do not overlap with other European languages
  const englishStopwords = /\b(the|and|that|was|with|from|have|had|his|her|their|they|which|about|were|been)\b/gi;
  const matches = text.match(englishStopwords) || [];
  const totalWords = text.split(/\s+/).length || 1;
  return matches.length >= 3 && (matches.length / totalWords) > 0.015;
}

function getOverlapRatio(textA, textB) {
  const wordsA = new Set(textA.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const wordsB = new Set(textB.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  
  let intersection = 0;
  wordsA.forEach(w => {
    if (wordsB.has(w)) intersection++;
  });
  return intersection / Math.min(wordsA.size, wordsB.size);
}

const report = {
  totalGiants: 0,
  summary: {
    categoryErrors: [],
    emptyFields: {},
    englishLeaks: {},
    missingLocales: {}
  }
};

async function main() {
  console.log('\n=== 1. 카테고리 감사 ===');
  const giantsContent = fs.readFileSync('src/data/giants.ts', 'utf8');

  const slugs = [...giantsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const categories = [...giantsContent.matchAll(/category:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

  report.totalGiants = slugs.length;
  console.log('총 위인 수:', slugs.length);

  slugs.forEach((slug, i) => {
    const cat = categories[i];
    if (!VALID_CATEGORIES.includes(cat)) {
      report.summary.categoryErrors.push({ slug, cat });
      console.log('❌ 잘못된 카테고리:', slug, '→', cat);
    }
  });

  console.log('카테고리 오류:', report.summary.categoryErrors.length, '개');

  console.log('\n=== 2. 서사시 감사 ===');
  const narrativesPath = 'src/data/final-narratives.json';
  if (!fs.existsSync(narrativesPath)) {
    console.error('Narratives file src/data/final-narratives.json not found!');
    process.exit(1);
  }
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

  slugs.forEach(slug => {
    const n = narratives[slug];
    if (!n) {
      if (!report.summary.emptyFields['all']) report.summary.emptyFields['all'] = [];
      report.summary.emptyFields['all'].push({ slug, reason: 'No narrative entry found' });
      return;
    }

    ALL_LOCALES.forEach(lang => {
      const epicKey = `epic_${lang}`;
      const trialsKey = `trials_${lang}`;
      const overcomingKey = `overcoming_${lang}`;

      const epic = n[epicKey] || '';
      const trials = n[trialsKey] || '';
      const overcoming = n[overcomingKey] || '';

      // 2-1: 비어있는 필드 체크 (최소 100자 이상이어야 정상)
      if (!epic || epic.length < 100) {
        if (!report.summary.emptyFields[lang]) report.summary.emptyFields[lang] = [];
        report.summary.emptyFields[lang].push({ slug, field: 'epic', length: epic.length });
      }

      // 2-2: 영어 누수 체크 (비영어권 언어)
      if (lang !== 'en' && epic) {
        const enEpic = n['epic_en'] || '';
        const isLatinLang = ['de', 'es', 'fr', 'it', 'pt'].includes(lang);
        let isLeaked = false;

        if (enEpic) {
          // If translation matches the English source by more than 65%, it is leaked
          const overlap = getOverlapRatio(epic, enEpic);
          isLeaked = overlap > 0.65;
        }

        // Additional check for non-Latin languages to make sure they contain native characters
        if (!isLeaked && !isLatinLang) {
          const pattern = LANGUAGE_PATTERNS[lang];
          if (pattern && !pattern.test(epic)) {
            isLeaked = true;
          }
        }

        if (isLeaked) {
          const engWords = (epic.match(ENGLISH_WORD) || []).filter(w => !ALLOWED_ENGLISH.includes(w));
          const engRatio = engWords.length / (epic.split(/\s+/).length || 1);
          if (!report.summary.englishLeaks[lang]) report.summary.englishLeaks[lang] = [];
          report.summary.englishLeaks[lang].push({
            slug,
            engRatio: Math.round(engRatio * 100) + '%',
            sample: epic.substring(0, 80),
            topEngWords: [...new Set(engWords)].slice(0, 5)
          });
        }
      }
    });
  });

  console.log('\n=== 3. 언어팩 감사 ===');
  const enData = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
  const enGiants = enData.Giants || {};
  const enUiKeys = Object.keys(enData).filter(k => k !== 'Giants');

  ALL_LOCALES.forEach(locale => {
    if (locale === 'en') return;

    let locData;
    const fileLoc = `messages/${locale}.json`;
    try {
      locData = JSON.parse(fs.readFileSync(fileLoc, 'utf8'));
    } catch (e) {
      console.log('❌ 파일 없음:', locale);
      report.summary.missingLocales[locale] = '파일 없음';
      return;
    }

    const locGiants = locData.Giants || {};
    const issues = [];

    // 3-1: Giants 번역 완성도
    const enSlugs = Object.keys(enGiants);
    const locSlugs = Object.keys(locGiants);
    const missingGiants = enSlugs.filter(s => !locSlugs.includes(s));

    if (missingGiants.length > 0) {
      issues.push({
        type: 'missing_giants',
        count: missingGiants.length,
        slugs: missingGiants
      });
    }

    // 3-2: UI 섹션 번역 완성도
    const missingSections = [];
    enUiKeys.forEach(section => {
      if (!locData[section]) {
        missingSections.push(section);
      }
    });

    if (missingSections.length > 0) {
      issues.push({
        type: 'missing_ui_sections',
        sections: missingSections
      });
    }

    // 3-3: Giants 필드 내 영어 누수 (Giants의 한글/다국어 이름/타이틀 내 영어)
    let engLeakCount = 0;
    const leakedGiants = [];
    Object.entries(locGiants).forEach(([slug, giantData]) => {
      if (!giantData) return;
      
      const text = getValuesText(giantData);
      const enText = getValuesText(enGiants[slug]) || '';
      const isLatin = ['de', 'es', 'fr', 'it', 'pt'].includes(locale);
      let isLeaked = false;
      let engWords = [];

      if (isLatin) {
        if (enText) {
          const overlap = getOverlapRatio(text, enText);
          isLeaked = overlap > 0.65;
        }
        engWords = (text.match(ENGLISH_WORD) || []).filter(w => !ALLOWED_ENGLISH.includes(w));
      } else {
        const pattern = LANGUAGE_PATTERNS[locale];
        if (!pattern) return;
        engWords = (text.match(ENGLISH_WORD) || []).filter(w => !ALLOWED_ENGLISH.includes(w));
        const hasNativeChars = pattern.test(text);
        isLeaked = engWords.length > 15 || !hasNativeChars;
      }

      if (isLeaked) {
        engLeakCount++;
        leakedGiants.push({ slug, engWords: [...new Set(engWords)].slice(0, 5) });
      }
    });

    if (engLeakCount > 0) {
      issues.push({
        type: 'english_leak_in_giants',
        count: engLeakCount,
        details: leakedGiants
      });
    }

    if (issues.length > 0) {
      report.summary.missingLocales[locale] = issues;
      console.log(`\n${locale}:`, issues.map(i => i.type).join(', '));
    } else {
      console.log(`✅ ${locale}: 정상`);
    }
  });

  const reportData = {
    timestamp: new Date().toISOString(),
    totalGiants: report.totalGiants,
    summary: {
      categoryErrors: {
        count: report.summary.categoryErrors.length,
        list: report.summary.categoryErrors
      },
      epicIssues: {
        emptyByLang: Object.entries(report.summary.emptyFields).map(([lang, items]) => ({
          lang,
          count: items.length,
          slugs: items.map(i => i.slug)
        })),
        englishLeaksByLang: Object.entries(report.summary.englishLeaks).map(([lang, items]) => ({
          lang,
          count: items.length,
          slugs: items.map(i => i.slug),
          worstCases: items.slice(0, 5)
        }))
      },
      localeIssues: report.summary.missingLocales
    }
  };

  fs.writeFileSync(
    'scripts/audit-report.json',
    JSON.stringify(reportData, null, 2),
    'utf-8'
  );

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━');
  console.log('감사 완료!');
  console.log('보고서: scripts/audit-report.json');
  console.log('━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);
