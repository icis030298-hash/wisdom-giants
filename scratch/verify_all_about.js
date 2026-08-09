const fs = require('fs');

let src = fs.readFileSync('src/data/about-translations.ts', 'utf8');
src = src.replace(/export interface[\s\S]*?(?=export const)/m, '');
src = src.replace(/export const aboutTranslations:[^=]+=/, 'const aboutTranslations =');
const aboutTranslations = (new Function(`${src}\nreturn aboutTranslations;`))();

const ALL_LOCALES = [
  'ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'
];

console.log('=== About Page All 24 Languages Verification ===');
let failures = 0;

ALL_LOCALES.forEach(loc => {
  const t = aboutTranslations[loc];
  if (!t) {
    console.error(`[FAIL] ${loc}: Missing translation object!`);
    failures++;
    return;
  }
  const keys = ['title', 'p1', 'p2', 'h1', 'quote', 'p3', 'h2', 'p4', 'h3', 'p5', 'p6', 'signature'];
  const missing = keys.filter(k => !t[k] || !t[k].trim());
  if (missing.length > 0) {
    console.error(`[FAIL] ${loc}: Missing keys ${missing.join(', ')}`);
    failures++;
  } else {
    console.log(`[PASS] [${loc}]: Title: "${t.title}" | Signature: "${t.signature}"`);
  }
});

console.log(`\nTotal checked: ${ALL_LOCALES.length} | Failures: ${failures}`);
