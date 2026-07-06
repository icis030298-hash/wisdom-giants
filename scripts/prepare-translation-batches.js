const fs = require('fs');
const path = require('path');

const TARGET_LANGS = [
  'ha', 'sw', 'vi', 'id', 'nl', 'tr', 'pl', 'fa', 'el', 'uk', 'he', 'th', 'hi', 'fr'
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
  const enMsg = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8')).Giants || {};
  const koMsg = JSON.parse(fs.readFileSync(path.join(messagesDir, 'ko.json'), 'utf8')).Giants || {};

  const msgItems = {}; // lang -> array of message items
  const narrativeItems = {}; // lang -> array of narrative items
  
  TARGET_LANGS.forEach(lang => {
    msgItems[lang] = [];
    narrativeItems[lang] = [];
  });

  // 1. Scan messages
  TARGET_LANGS.forEach(lang => {
    const msgPath = path.join(messagesDir, `${lang}.json`);
    if (!fs.existsSync(msgPath)) return;
    const msg = JSON.parse(fs.readFileSync(msgPath, 'utf8'));
    const giantsMsg = msg.Giants || {};

    slugs.forEach(slug => {
      const gMsg = giantsMsg[slug];
      const enGMsg = enMsg[slug] || {};
      const koGMsg = koMsg[slug] || {};
      
      const fields = ['name', 'headline', 'shortDescription', 'quote', 'pain', 'recovery', 'era'];
      
      fields.forEach(field => {
        const val = gMsg ? gMsg[field] : null;
        if (checkIsDummyOrFallback(val, lang, enGMsg[field], koGMsg[field])) {
          const sourceText = enGMsg[field] || koGMsg[field] || '';
          if (sourceText) {
            msgItems[lang].push({
              type: 'message',
              slug,
              field,
              sourceText
            });
          }
        }
      });
    });
  });

  // 2. Scan narratives
  slugs.forEach(slug => {
    const nData = narratives[slug] || {};
    const enData = nData;
    const koData = nData;

    TARGET_LANGS.forEach(lang => {
      const nFields = ['epic', 'trials', 'overcoming', 'era'];
      nFields.forEach(field => {
        const val = nData[`${field}_${lang}`];
        const enVal = enData[`${field}_en`];
        const koVal = koData[`${field}_ko`];
        if (checkIsDummyOrFallback(val, lang, enVal, koVal)) {
          const sourceText = enVal || koVal || '';
          if (sourceText) {
            narrativeItems[lang].push({
              type: 'narrative',
              slug,
              field,
              sourceText
            });
          }
        }
      });

      const wisdoms = nData.wisdom || [];
      wisdoms.forEach((w, idx) => {
        const enQuote = w.quote_en;
        const koQuote = w.quote_ko;
        const enMeaning = w.meaning_en;
        const koMeaning = w.meaning_ko;

        if (checkIsDummyOrFallback(w[`quote_${lang}`], lang, enQuote, koQuote)) {
          const sourceText = enQuote || koQuote || '';
          if (sourceText) {
            narrativeItems[lang].push({
              type: 'wisdom_quote',
              slug,
              field: `wisdom.${idx}.quote`,
              sourceText
            });
          }
        }

        if (checkIsDummyOrFallback(w[`meaning_${lang}`], lang, enMeaning, koMeaning)) {
          const sourceText = enMeaning || koMeaning || '';
          if (sourceText) {
            narrativeItems[lang].push({
              type: 'wisdom_meaning',
              slug,
              field: `wisdom.${idx}.meaning`,
              sourceText
            });
          }
        }
      });
    });
  });

  // Save to JSON files
  const outDir = path.join(process.cwd(), 'scratch/translation_batches');
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  let totalItems = 0;
  let totalBatches = 0;

  TARGET_LANGS.forEach(lang => {
    const langDir = path.join(outDir, lang);
    let batchIndex = 0;

    // Messages: Batch size 150 (short texts)
    const mList = msgItems[lang];
    if (mList.length > 0) {
      if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
      const batchSize = 150;
      for (let i = 0; i < mList.length; i += batchSize) {
        const chunk = mList.slice(i, i + batchSize);
        const batchFile = path.join(langDir, `msg_batch_${batchIndex++}.json`);
        fs.writeFileSync(batchFile, JSON.stringify(chunk, null, 2), 'utf8');
        totalItems += chunk.length;
        totalBatches++;
      }
    }

    // Narratives: Batch size 15 (long texts)
    const nList = narrativeItems[lang];
    if (nList.length > 0) {
      if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
      const batchSize = 15;
      for (let i = 0; i < nList.length; i += batchSize) {
        const chunk = nList.slice(i, i + batchSize);
        const batchFile = path.join(langDir, `nar_batch_${batchIndex++}.json`);
        fs.writeFileSync(batchFile, JSON.stringify(chunk, null, 2), 'utf8');
        totalItems += chunk.length;
        totalBatches++;
      }
    }
  });

  console.log(`Optimized: Generated ${totalBatches} batches containing ${totalItems} translation items.`);
}

main();
