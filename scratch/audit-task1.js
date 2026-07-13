const fs = require('fs');
const path = require('path');

const locales = ['ko', 'en', 'ja', 'de', 'es', 'fr', 'it', 'pt', 'ar', 'zh', 'nl', 'ru', 'hi', 'id', 'pl', 'sw', 'th', 'tr', 'uk', 'vi', 'el', 'fa', 'he', 'ha'];
const nonLatinLocales = ['ar', 'fa', 'he', 'ru', 'uk', 'el', 'zh', 'ja', 'th', 'hi'];

const dataPath = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const factLayerDir = 'src/data/fact-layers';

const report = {};
locales.forEach(loc => {
  report[loc] = {
    contaminated: 0,
    koreanLeak: 0,
    eraUntranslated: 0,
    factLayerExists: false,
    factLayerKoreanYear: 0,
    missingGiants: 0
  };
});

// Check final-narratives.json
Object.entries(data).forEach(([slug, giant]) => {
  locales.forEach(loc => {
    let hasTranslation = false;
    
    // Check if basic fields exist for the locale
    const suffix = `_${loc}`;
    const keysToCheck = [`description${suffix}`, `trials${suffix}`, `overcoming${suffix}`];
    let missingCount = 0;
    
    keysToCheck.forEach(k => {
      if (!giant[k]) {
        missingCount++;
      } else {
        hasTranslation = true;
        let val = giant[k];
        
        // Check for Korean leak '및'
        if (loc !== 'ko' && val.includes('및')) {
          report[loc].koreanLeak++;
        }
        
        // Check for contamination (Latin ratio > 30% in non-Latin locales)
        if (nonLatinLocales.includes(loc)) {
          const latinMatch = val.match(/[a-zA-Z]/g);
          const totalChars = val.replace(/\s/g, '').length;
          if (latinMatch && totalChars > 0 && latinMatch.length / totalChars > 0.3) {
            report[loc].contaminated++;
          }
        }
      }
    });

    // Check wisdom
    if (giant.wisdom) {
        Object.values(giant.wisdom).forEach(w => {
           const wKeyQuote = `quote${suffix}`;
           const wKeyMeaning = `meaning${suffix}`;
           [wKeyQuote, wKeyMeaning].forEach(k => {
               if (w[k]) {
                   hasTranslation = true;
                   let val = w[k];
                   if (loc !== 'ko' && val.includes('및')) report[loc].koreanLeak++;
                   if (nonLatinLocales.includes(loc)) {
                       const latinMatch = val.match(/[a-zA-Z]/g);
                       const totalChars = val.replace(/\s/g, '').length;
                       if (latinMatch && totalChars > 0 && latinMatch.length / totalChars > 0.3) {
                         report[loc].contaminated++;
                       }
                   }
               }
           });
        });
    }
    
    if (missingCount === keysToCheck.length) {
       report[loc].missingGiants++;
    }

    // Check era
    const eraKey = `era${suffix}`;
    if (giant[eraKey]) {
        const val = giant[eraKey];
        if (loc !== 'en' && val.includes('Century Giant')) {
            report[loc].eraUntranslated++;
        }
    }
  });
});

// Check fact-layers
locales.forEach(loc => {
  const flPath = path.join(factLayerDir, `fact-layer-${loc}.json`);
  if (fs.existsSync(flPath)) {
    report[loc].factLayerExists = true;
    const flData = JSON.parse(fs.readFileSync(flPath, 'utf8'));
    Object.values(flData).forEach(giant => {
       if (giant.timeline) {
           giant.timeline.forEach(item => {
               if (item.year && item.year.includes('년')) {
                   report[loc].factLayerKoreanYear++;
               }
           });
       }
    });
  }
});

console.log(JSON.stringify(report, null, 2));
