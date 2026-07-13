const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const nonLatinLocales = ['_ar', '_fa', '_he', '_ru', '_uk', '_el', '_zh', '_ja', '_th', '_hi'];

const andMapping = {
  '_fa': ' و ', '_hi': ' और ', '_fr': ' et ', '_ar': ' و ', '_he': ' ו ',
  '_th': ' และ ', '_id': ' dan ', '_tr': ' ve ', '_ru': ' и ', '_ja': ' と ',
  '_zh': ' 与 ', '_uk': ' та ', '_el': ' και ', '_pl': ' i ', '_es': ' y ',
  '_de': ' und ', '_it': ' e ', '_nl': ' en ', '_sw': ' na ', '_pt': ' e ', '_vi': ' và '
};

let fallbackCount = 0;
let conjunctionCount = 0;

function getFallback(giant, currentKey) {
  const parts = currentKey.split('_');
  if (parts.length > 1) {
    const base = parts.slice(0, -1).join('_');
    const enKey = `${base}_en`;
    if (giant[enKey]) return giant[enKey];
  }
  return null; // Should not happen for standard keys
}

function mutateNode(node, parentKey, giantContext) {
  if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([k, v]) => {
      const effectiveKey = isNaN(k) ? k : parentKey;
      if (typeof v === 'object' && v !== null) {
        mutateNode(v, effectiveKey, giantContext);
      } else if (typeof v === 'string') {
        let current = v;
        let replaceWithFallback = false;

        const isNonLatinLocale = nonLatinLocales.some(loc => effectiveKey.endsWith(loc));
        if (isNonLatinLocale) {
          const latinMatch = current.match(/[a-zA-Z]/g);
          const totalChars = current.replace(/\s/g, '').length;
          
          if (latinMatch && totalChars > 0) {
            const ratio = latinMatch.length / totalChars;
            if (ratio > 0.3 && !effectiveKey.startsWith('era_')) {
              replaceWithFallback = true;
            }
          }
        }

        if (replaceWithFallback) {
          const fallbackString = getFallback(giantContext, effectiveKey);
          if (fallbackString) {
            current = fallbackString;
            fallbackCount++;
          }
        } else if (current.includes('및')) {
          const localeSuffix = Object.keys(andMapping).find(suffix => effectiveKey.endsWith(suffix));
          if (localeSuffix) {
            current = current.replace(/\s*및\s*/g, andMapping[localeSuffix]);
            conjunctionCount++;
          }
        }
        
        if (current !== v) {
          node[k] = current;
        }
      }
    });
  }
}

Object.entries(data).forEach(([slug, giant]) => {
  // Pass 'giant' as context so we can fetch the English fallback for nested objects (like wisdom)
  // Wait, if it's nested in wisdom, giant.wisdom.quote_en is needed, not giant.quote_en.
  // We can pass the parent node itself as the context for fallback fetching!
  function mutateNodeWithLocalContext(node, parentKey) {
    if (typeof node === 'object' && node !== null) {
      Object.entries(node).forEach(([k, v]) => {
        const effectiveKey = isNaN(k) ? k : parentKey;
        if (typeof v === 'object' && v !== null) {
          mutateNodeWithLocalContext(v, effectiveKey);
        } else if (typeof v === 'string') {
          let current = v;
          let replaceWithFallback = false;

          const isNonLatinLocale = nonLatinLocales.some(loc => effectiveKey.endsWith(loc));
          if (isNonLatinLocale) {
            const latinMatch = current.match(/[a-zA-Z]/g);
            const totalChars = current.replace(/\s/g, '').length;
            if (latinMatch && totalChars > 0) {
              const ratio = latinMatch.length / totalChars;
              if (ratio > 0.3 && !effectiveKey.startsWith('era_')) {
                replaceWithFallback = true;
              }
            }
          }

          if (replaceWithFallback) {
            const base = effectiveKey.split('_').slice(0, -1).join('_');
            const enKey = `${base}_en`;
            if (node[enKey]) {
              current = node[enKey];
              fallbackCount++;
            }
          } else if (current.includes('및')) {
            const localeSuffix = Object.keys(andMapping).find(suffix => effectiveKey.endsWith(suffix));
            if (localeSuffix) {
              current = current.replace(/\s*및\s*/g, andMapping[localeSuffix]);
              conjunctionCount++;
            }
          }
          
          if (current !== v) {
            node[k] = current;
          }
        }
      });
    }
  }

  mutateNodeWithLocalContext(giant, '');
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Replaced ${fallbackCount} contaminated fields with English fallback.`);
console.log(`Replaced ${conjunctionCount} '및' conjunctions.`);
