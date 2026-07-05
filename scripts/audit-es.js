const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const narrativesData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const giants = Object.keys(narrativesData);
console.log(`Total giants: ${giants.length}`);

let missingEsCount = 0;
let identicalToEnCount = 0;
let partiallyEnglishCount = 0;
const report = [];

// Helper to check if a text is likely English (even if not strictly identical)
function isLikelyEnglish(text) {
  if (!text) return false;
  // Simple check: if it contains very common English words like " the ", " of ", " and ", " is ", " to "
  // but doesn't contain Spanish specific characters like "ñ", "á", "é", "í", "ó", "ú", "¿", "¡"
  const lowercase = text.toLowerCase();
  const englishWords = [' the ', ' of ', ' and ', ' is ', ' to ', ' was ', ' with ', ' that ', ' his ', ' her '];
  const spanishChars = /[ñáéíóú¿¡]/i;
  
  let englishWordCount = 0;
  englishWords.forEach(word => {
    if (lowercase.includes(word)) englishWordCount++;
  });
  
  const hasSpanishChars = spanishChars.test(text);
  
  // If it has multiple common English words and no Spanish-specific characters, it's highly likely English
  return englishWordCount >= 3 && !hasSpanishChars;
}

giants.forEach(slug => {
  const data = narrativesData[slug];
  const issues = [];
  
  // Check era
  if (data.era_en && !data.era_es) {
    issues.push('era_es missing');
  } else if (data.era_en && data.era_es === data.era_en) {
    issues.push('era_es identical to era_en');
  }

  // Check epic
  if (data.epic_en && !data.epic_es) {
    issues.push('epic_es missing');
  } else if (data.epic_en && data.epic_es === data.epic_en) {
    issues.push('epic_es identical to epic_en');
  } else if (isLikelyEnglish(data.epic_es)) {
    issues.push('epic_es looks like English');
  }

  // Check trials
  if (data.trials_en && !data.trials_es) {
    issues.push('trials_es missing');
  } else if (data.trials_en && data.trials_es === data.trials_en) {
    issues.push('trials_es identical to trials_en');
  } else if (isLikelyEnglish(data.trials_es)) {
    issues.push('trials_es looks like English');
  }

  // Check overcoming
  if (data.overcoming_en && !data.overcoming_es) {
    issues.push('overcoming_es missing');
  } else if (data.overcoming_en && data.overcoming_es === data.overcoming_en) {
    issues.push('overcoming_es identical to overcoming_en');
  } else if (isLikelyEnglish(data.overcoming_es)) {
    issues.push('overcoming_es looks like English');
  }

  // Check wisdom array
  if (data.wisdom && Array.isArray(data.wisdom)) {
    data.wisdom.forEach((w, idx) => {
      if (w.quote_en && !w.quote_es) {
        issues.push(`wisdom[${idx}].quote_es missing`);
      } else if (w.quote_en && w.quote_es === w.quote_en) {
        issues.push(`wisdom[${idx}].quote_es identical to quote_en`);
      } else if (isLikelyEnglish(w.quote_es)) {
        issues.push(`wisdom[${idx}].quote_es looks like English`);
      }

      if (w.meaning_en && !w.meaning_es) {
        issues.push(`wisdom[${idx}].meaning_es missing`);
      } else if (w.meaning_en && w.meaning_es === w.meaning_en) {
        issues.push(`wisdom[${idx}].meaning_es identical to meaning_en`);
      } else if (isLikelyEnglish(w.meaning_es)) {
        issues.push(`wisdom[${idx}].meaning_es looks like English`);
      }
    });
  }

  if (issues.length > 0) {
    report.push({ slug, issues });
    if (issues.some(iss => iss.includes('missing'))) missingEsCount++;
    if (issues.some(iss => iss.includes('identical'))) identicalToEnCount++;
    if (issues.some(iss => iss.includes('looks like English'))) partiallyEnglishCount++;
  }
});

console.log(`\nAudit finished!`);
console.log(`Giants with issues: ${report.length} / ${giants.length}`);
console.log(`- Missing any Spanish field: ${missingEsCount}`);
console.log(`- Identical to English: ${identicalToEnCount}`);
console.log(`- Text looks like English (false Spanish translations): ${partiallyEnglishCount}`);

console.log('\n--- Details of top 20 problematic giants ---');
report.slice(0, 20).forEach(r => {
  console.log(`- ${r.slug}:`);
  r.issues.forEach(iss => console.log(`    * ${iss}`));
});

if (report.length > 20) {
  console.log(`... and ${report.length - 20} more giants have issues.`);
}
