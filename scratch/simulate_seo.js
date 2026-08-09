const fs = require('fs');
const path = require('path');

const workspaceDir = 'c:\\Users\\user\\OneDrive\\바탕 화면\\wisdom-giants-20260512T091146Z-3-001\\wisdom-giants';

// 1. Get raw giant data by extracting JSON from giants.ts (crudely but safely)
const giantsDataPath = path.join(workspaceDir, 'src/data/giants.ts');
let giantsDataStr = fs.readFileSync(giantsDataPath, 'utf8');
const regex = /\{[\s\S]*?slug:\s*['"]([^'"]+)['"][\s\S]*?category:\s*['"]([^'"]+)['"][\s\S]*?\}/g;
let match;
const giantCategories = {};
while ((match = regex.exec(giantsDataStr)) !== null) {
  giantCategories[match[1]] = match[2];
}

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

function cleanEraString(era) {
  if (!era) return '';
  return era.replace(/[()]/g, '').trim();
}

console.log("=== SEO Title & Description Preview ===");

locales.forEach(locale => {
  const messagesPath = path.join(workspaceDir, `messages/${locale}.json`);
  if (!fs.existsSync(messagesPath)) return;
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
  const brandName = messages.brand?.mainTitle || 'Giants Wisdom';

  console.log(`\n--- LOCALE: ${locale.toUpperCase()} (Brand: ${brandName}) ---`);

  testSlugs.forEach(slug => {
    const giantData = messages.Giants[slug];
    if (!giantData) return;
    
    const category = giantCategories[slug] || 'philosophy';
    
    const emojiMap = {
      'leadership': '👑',
      'science': '🔬',
      'philosophy': '🏛️',
      'arts': '🎨',
      'society': '⚖️',
      'business': '⚓',
    };
    const emoji = emojiMap[category] || '💡';
    const name = giantData.name;

    let shortBio = giantData.headline || giantData.shortDescription || '';
    let titleBio = shortBio;
    let titleStr = `${emoji} ${name} – ${titleBio} | ${brandName}`;
    
    if (titleStr.length > 60) {
      const maxBioLen = 60 - (`${emoji} ${name} –  | ${brandName}`.length);
      if (maxBioLen > 5) {
        titleBio = titleBio.slice(0, maxBioLen) + '...';
        titleStr = `${emoji} ${name} – ${titleBio} | ${brandName}`;
      } else {
        titleStr = `${emoji} ${name} | ${brandName}`;
      }
    }

    let quote = giantData.quote || '';
    const eraClean = cleanEraString(giantData.era || '');
    const eraDisplay = eraClean ? `(${eraClean})` : '';

    const ctaMap = {
      ko: 'AI로 직접 대화해보세요.',
      en: 'Chat directly via AI.',
      ja: 'AIで直接対話してみてください。',
      ar: 'تحدث مباشرة عبر الذكاء الاصطناعي.',
      he: 'שוחח ישירות באמצעות בינה מלאכותית.',
    };
    const cta = ctaMap[locale] || 'Chat directly via AI.';
    const koJosa = locale === 'ko' ? getKoreanJosa(name, 'wa/gwa') + ' ' : '';
    let descBio = giantData.shortDescription || giantData.headline || '';

    let quotePart = quote ? `"${quote}" — ` : '';
    let rawDesc = `${quotePart}${name}${eraDisplay}. ${descBio} ${koJosa}${cta}`;

    if (rawDesc.length > 155) {
      if (quote.length > 60) {
        quote = quote.slice(0, 57) + '...';
        quotePart = `"${quote}" — `;
        rawDesc = `${quotePart}${name}${eraDisplay}. ${descBio} ${koJosa}${cta}`;
      }
      if (rawDesc.length > 155) {
         const allowedBioLen = descBio.length - (rawDesc.length - 152);
         if (allowedBioLen > 0) {
            descBio = descBio.slice(0, allowedBioLen) + '...';
            rawDesc = `${quotePart}${name}${eraDisplay}. ${descBio} ${koJosa}${cta}`;
         } else {
            rawDesc = `${quotePart}${name}${eraDisplay}. ${koJosa}${cta}`;
         }
      }
    }
    
    console.log(`[${slug}]`);
    console.log(`TITLE (${titleStr.length}자): ${titleStr}`);
    console.log(`DESC  (${rawDesc.length}자): ${rawDesc}`);
  });
});
