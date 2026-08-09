const fs = require('fs');
const path = require('path');

const slug = 'agatha-christie';
const locale = 'de';

const narrativePath = path.join(process.cwd(), 'src/data/narratives', `${slug}.json`);
const narrative = JSON.parse(fs.readFileSync(narrativePath, 'utf-8'));

const getFieldText = (obj, fieldName) => {
  if (!obj) return '';
  const key = `${fieldName}_${locale}`;
  let text = '';
  const hasValue = obj[key] && obj[key].trim().length > 0;
  
  let isDummyHebrew = false;
  if (locale === 'he' && hasValue) {
    const hebrewCharRegex = /[\u0590-\u05ff]/;
    if (!hebrewCharRegex.test(obj[key])) {
      isDummyHebrew = true;
    }
  }

  if (hasValue && !isDummyHebrew) {
    text = obj[key];
  } else {
    text = obj[`${fieldName}_en`] || '';
  }
  return text.replace(/^\[(?:RTL\s+)?[a-z]{2,3}\]\s*/i, '').trim();
};

const NARRATIVE_LOCALES = [
  'ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'
];
const hasNarrativeLocale = NARRATIVE_LOCALES.includes(locale);

const formattedNarrative = narrative ? {
  epic: getFieldText(narrative, 'epic'),
  trials: hasNarrativeLocale ? getFieldText(narrative, 'trials') : undefined,
  overcoming: hasNarrativeLocale ? getFieldText(narrative, 'overcoming') : undefined,
  era: hasNarrativeLocale ? getFieldText(narrative, 'era') : undefined,
  wisdom: (Array.isArray(narrative.wisdom) ? narrative.wisdom : []).map((w) => ({
    quote: getFieldText(w, 'quote'),
    meaning: getFieldText(w, 'meaning')
  })),
  fact_box: narrative[`fact_box_${locale}`] || narrative.fact_box
} : null;

console.log('formattedNarrative:', JSON.stringify({
  epicLength: formattedNarrative.epic ? formattedNarrative.epic.length : 0,
  trialsLength: formattedNarrative.trials ? formattedNarrative.trials.length : 0,
  overcomingLength: formattedNarrative.overcoming ? formattedNarrative.overcoming.length : 0,
  era: formattedNarrative.era,
  wisdomCount: formattedNarrative.wisdom.length,
  hasFactBox: !!formattedNarrative.fact_box
}, null, 2));
