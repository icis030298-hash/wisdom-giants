const fs = require('fs');
const path = require('path');

const locales = ['ko', 'en', 'ja', 'ar', 'he'];
const testSlugs = ['bartolomeu-dias', 'thomas-edison', 'aristotle', 'marie-curie', 'genghis-khan'];

function getKoreanJosa(word, josaType) {
  if (!word) return '';
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) {
    if (josaType === 'wa/gwa') return word + '와(과)';
    return word; // fallback
  }
  const hasJongseong = (lastChar - 0xac00) % 28 > 0;
  if (josaType === 'wa/gwa') return word + (hasJongseong ? '과' : '와');
  return word;
}

const emojiMap = {
  'leadership': '👑',
  'science': '🔬',
  'philosophy': '🏛️',
  'arts': '🎨',
  'society': '⚖️',
  'business': '⚓'
};

const ctaMap = {
  ko: 'AI로 직접 대화해보세요.',
  en: 'Chat directly via AI.',
  ja: 'AIで直接対話してみてください。',
  ar: 'تحدث مباشرة عبر الذكاء الاصطناعي.',
  he: 'שוחח ישירות באמצעות בינה מלאכותית.',
};

// Load giants data from workspace
const workspaceDir = 'c:\\Users\\user\\OneDrive\\바탕 화면\\wisdom-giants-20260512T091146Z-3-001\\wisdom-giants';
const giantsDataPath = path.join(workspaceDir, 'src/data/giants.ts');
let giantsDataStr = fs.readFileSync(giantsDataPath, 'utf8');

// Parse giants array
let giants = [];
try {
  const evalStr = giantsDataStr
    .replace(/import { Giant } from '..\/types\/giant';/, '')
    .replace(/export const giants: Giant\[\] =/, 'module.exports =')
    .replace(/export const giantsData = giants;/, '');
  const tmpPath = path.join(__dirname, 'tmp-giants.js');
  fs.writeFileSync(tmpPath, evalStr);
  giants = require('./tmp-giants.js');
  fs.unlinkSync(tmpPath);
} catch (e) {
  console.error("Error loading giants data", e);
}

function getMessages(locale) {
  return JSON.parse(fs.readFileSync(path.join(workspaceDir, `messages/${locale}.json`), 'utf8'));
}

console.log("=== SEO PREVIEW ===\n");

locales.forEach(locale => {
  const messages = getMessages(locale);
  const brandName = messages.brand?.mainTitle || 'Giants Wisdom';
  
  testSlugs.forEach(slug => {
    const giant = giants.find(g => g.slug === slug);
    if (!giant) return;
    
    const giantData = messages.Giants[slug] || {
      name: giant.name,
      headline: giant.headline,
      shortDescription: giant.shortDescription,
      quote: giant.quote
    };
    
    const emoji = emojiMap[giant.category] || '💡';
    const name = giantData.name;
    const shortBio = giantData.headline || giantData.shortDescription || '';
    
    // Construct Title
    let titleBio = shortBio;
    let titleStr = `${emoji} ${name} – ${titleBio} | ${brandName}`;
    if (titleStr.length > 60) {
      const maxBioLen = 60 - (`${emoji} ${name} –  | ${brandName}`.length);
      if (maxBioLen > 10) {
        titleBio = titleBio.slice(0, maxBioLen) + '...';
        titleStr = `${emoji} ${name} – ${titleBio} | ${brandName}`;
      } else {
        titleStr = `${emoji} ${name} | ${brandName}`;
      }
    }
    
    // Construct Description
    let quote = giantData.quote || giant.quote || '';
    let era = giantData.era || giant.era || '';
    let cleanEra = era.replace(/[()]/g, '').trim();
    let eraDisplay = cleanEra ? `(${cleanEra})` : '';
    let cta = ctaMap[locale] || 'Chat directly via AI.';
    
    let descBio = giantData.shortDescription || giantData.headline || '';
    
    let rawDesc = `"${quote}" — ${name}${eraDisplay}. ${descBio} ${locale === 'ko' ? getKoreanJosa(name, 'wa/gwa') + ' ' : ''}${cta}`;
    
    if (rawDesc.length > 155) {
      if (quote.length > 60) {
        quote = quote.slice(0, 57) + '...';
        rawDesc = `"${quote}" — ${name}${eraDisplay}. ${descBio} ${locale === 'ko' ? getKoreanJosa(name, 'wa/gwa') + ' ' : ''}${cta}`;
      }
      if (rawDesc.length > 155) {
         const allowedBioLen = descBio.length - (rawDesc.length - 152);
         if (allowedBioLen > 0) {
            descBio = descBio.slice(0, allowedBioLen) + '...';
            rawDesc = `"${quote}" — ${name}${eraDisplay}. ${descBio} ${locale === 'ko' ? getKoreanJosa(name, 'wa/gwa') + ' ' : ''}${cta}`;
         } else {
            descBio = '';
            rawDesc = `"${quote}" — ${name}${eraDisplay}. ${locale === 'ko' ? getKoreanJosa(name, 'wa/gwa') + ' ' : ''}${cta}`;
         }
      }
    }

    console.log(`[${locale.toUpperCase()}] ${slug}`);
    console.log(`Title: ${titleStr} (Len: ${titleStr.length})`);
    console.log(`Desc : ${rawDesc} (Len: ${rawDesc.length})`);
    console.log('---');
  });
});
