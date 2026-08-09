const fs = require('fs');
const path = require('path');

// Read TypeScript file and strip export interfaces for CommonJS test
let src = fs.readFileSync('src/data/about-translations.ts', 'utf8');
src = src.replace(/export interface[\s\S]*?(?=export const)/m, '');
src = src.replace(/export const aboutTranslations:[^=]+=/, 'const aboutTranslations =');
const aboutTranslations = (new Function(`${src}\nreturn aboutTranslations;`))();

const pilots = ['ko', 'en', 'ja', 'ar', 'tr', 'zh'];

console.log('=== About Page Pilot Translations Verification ===');
pilots.forEach(loc => {
  const t = aboutTranslations[loc];
  if (!t) {
    console.error(`[FAIL] ${loc}: Missing translation`);
    return;
  }
  const keys = ['title', 'p1', 'p2', 'h1', 'quote', 'p3', 'h2', 'p4', 'h3', 'p5', 'p6', 'signature'];
  const missing = keys.filter(k => !t[k] || !t[k].trim());
  if (missing.length > 0) {
    console.error(`[FAIL] ${loc}: Missing keys ${missing.join(', ')}`);
  } else {
    console.log(`[PASS] [${loc}]: Title: "${t.title}" | Signature: "${t.signature}"`);
  }
});
