const fs = require('fs');
const path = require('path');

const LANGS = [
  'en', 'ko', 'ja', 'zh', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ar', 'hi',
  'bn', 'tr', 'fa', 'pl', 'nl', 'sv', 'vi', 'uk', 'id', 'cs', 'ro', 'hu',
  'el', 'ha', 'he', 'sw', 'th'
];

function checkIsDummyOrFallback(text, lang, enText, koText) {
  if (!text || text.trim() === '') return true;
  if (text.includes("데이터 준비 중...")) return true;
  if (text.startsWith("[RTL he]")) return true;
  if (text.startsWith("[vi]")) return true;
  if (lang !== 'ko' && text === koText && koText.length > 10) return true;
  if (lang !== 'en' && text === enText && enText.length > 10) return true;
  return false;
}

function main() {
  const narrativesPath = path.join(process.cwd(), 'src/data/final-narratives.json');
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  const slugs = Object.keys(narratives);
  
  const messagesDir = path.join(process.cwd(), 'messages');
  const availableLangs = fs.readdirSync(messagesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
  
  const report = {
    totalGiants: slugs.length,
    languages: availableLangs.length,
    messagesCoverage: {},
    narrativesCoverage: {},
    anomalies: []
  };

  availableLangs.forEach(lang => {
    report.messagesCoverage[lang] = {
      totalFields: 0,
      missingOrDummy: 0,
      missingSlugs: []
    };
    report.narrativesCoverage[lang] = {
      totalFields: 0,
      missingOrDummy: 0
    };
    
    // Check Messages
    const msgPath = path.join(messagesDir, `${lang}.json`);
    const msg = JSON.parse(fs.readFileSync(msgPath, 'utf8'));
    const giantsMsg = msg.Giants || {};
    
    // Check Narratives
    let enMsg = {};
    let koMsg = {};
    if (fs.existsSync(path.join(messagesDir, 'en.json'))) enMsg = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8')).Giants || {};
    if (fs.existsSync(path.join(messagesDir, 'ko.json'))) koMsg = JSON.parse(fs.readFileSync(path.join(messagesDir, 'ko.json'), 'utf8')).Giants || {};

    slugs.forEach(slug => {
      // 1. Audit Messages (UI, Cards)
      const gMsg = giantsMsg[slug];
      const enGMsg = enMsg[slug] || {};
      const koGMsg = koMsg[slug] || {};
      
      const msgFields = ['name', 'headline', 'shortDescription', 'quote', 'pain', 'recovery', 'era'];
      if (!gMsg) {
        report.messagesCoverage[lang].missingSlugs.push(slug);
        report.messagesCoverage[lang].missingOrDummy += msgFields.length;
        report.messagesCoverage[lang].totalFields += msgFields.length;
      } else {
        msgFields.forEach(field => {
          report.messagesCoverage[lang].totalFields++;
          if (checkIsDummyOrFallback(gMsg[field], lang, enGMsg[field], koGMsg[field])) {
            report.messagesCoverage[lang].missingOrDummy++;
          }
        });
      }

      // 2. Audit Narratives
      const nData = narratives[slug] || {};
      const nFields = ['epic', 'trials', 'overcoming', 'era'];
      nFields.forEach(field => {
        report.narrativesCoverage[lang].totalFields++;
        const val = nData[`${field}_${lang}`];
        if (checkIsDummyOrFallback(val, lang, nData[`${field}_en`], nData[`${field}_ko`])) {
          report.narrativesCoverage[lang].missingOrDummy++;
        }
      });
      
      // Wisdom arrays
      const wisdoms = nData.wisdom || [];
      wisdoms.forEach(w => {
        report.narrativesCoverage[lang].totalFields += 2; // quote and meaning
        if (checkIsDummyOrFallback(w[`quote_${lang}`], lang, w[`quote_en`], w[`quote_ko`])) {
          report.narrativesCoverage[lang].missingOrDummy++;
        }
        if (checkIsDummyOrFallback(w[`meaning_${lang}`], lang, w[`meaning_en`], w[`meaning_ko`])) {
          report.narrativesCoverage[lang].missingOrDummy++;
        }
      });
    });
  });

  const outputPath = path.join(process.cwd(), 'scratch/full_translation_audit_report.json');
  if (!fs.existsSync(path.join(process.cwd(), 'scratch'))) {
    fs.mkdirSync(path.join(process.cwd(), 'scratch'));
  }
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Audit complete. Total Giants: ${slugs.length}`);
  console.log(`Results saved to ${outputPath}`);
}

main();
