const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const nonLatinLocales = ['_ar', '_fa', '_he', '_ru', '_uk', '_el', '_zh', '_ja', '_th', '_hi'];

let eraTargets = [];

function processNode(node, parentKey, slug) {
  if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([k, v]) => {
      const effectiveKey = isNaN(k) ? k : parentKey;
      processNode(v, effectiveKey, slug);
    });
  } else if (typeof node === 'string') {
    const isNonLatinLocale = nonLatinLocales.some(loc => parentKey.endsWith(loc));
    if (isNonLatinLocale && parentKey.startsWith('era_')) {
      const latinMatch = node.match(/[a-zA-Z]/g);
      const totalChars = node.replace(/\s/g, '').length;
      if (latinMatch && totalChars > 0 && latinMatch.length / totalChars > 0.3) {
        // English fallback - needs translation
        const locale = parentKey.replace('era_', '');
        eraTargets.push({ slug, key: parentKey, locale, currentValue: node });
      }
    }
  }
}

Object.entries(data).forEach(([slug, giant]) => {
  processNode(giant, '', slug);
});

console.log(`Found ${eraTargets.length} era fields needing translation:`);
console.log(JSON.stringify(eraTargets.slice(0, 5), null, 2));
fs.writeFileSync('scratch/era-targets.json', JSON.stringify(eraTargets, null, 2));
