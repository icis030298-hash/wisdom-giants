const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const nonLatinLocales = ['_ar', '_fa', '_he', '_ru', '_uk', '_el', '_zh', '_ja', '_th', '_hi'];

let report = {
  retranslationTargets: [], // Fields needing retranslation
  eraTranslationTargets: [], // era fields needing translation
  conjunctionReplacements: [],
};

const andMapping = {
  '_fa': ' و ', '_hi': ' और ', '_fr': ' et ', '_ar': ' و ', '_he': ' ו ',
  '_th': ' และ ', '_id': ' dan ', '_tr': ' ve ', '_ru': ' и ', '_ja': ' と ',
  '_zh': ' 与 ', '_uk': ' та ', '_el': ' και ', '_pl': ' i ', '_es': ' y ',
  '_de': ' und ', '_it': ' e ', '_nl': ' en ', '_sw': ' na ', '_pt': ' e ', '_vi': ' và '
};

function processNode(node, parentKey, slug) {
  if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([k, v]) => {
      const effectiveKey = isNaN(k) ? k : parentKey;
      processNode(v, effectiveKey, slug);
    });
  } else if (typeof node === 'string') {
    let current = node;
    let wipe = false;

    // Latin character ratio check
    const isNonLatinLocale = nonLatinLocales.some(loc => parentKey.endsWith(loc));
    if (isNonLatinLocale) {
      const latinMatch = current.match(/[a-zA-Z]/g);
      const totalChars = current.replace(/\s/g, '').length;
      
      if (latinMatch && totalChars > 0) {
        const ratio = latinMatch.length / totalChars;
        if (ratio > 0.3) {
          if (parentKey.startsWith('era_')) {
            // It's an era field; do NOT wipe, just log for translation
            report.eraTranslationTargets.push({ slug, key: parentKey, preview: current.substring(0, 80) });
          } else {
            // It's contaminated. Add to retranslation targets.
            // We will fallback to English later, NOT wipe it empty.
            report.retranslationTargets.push({ slug, key: parentKey, locale: parentKey.split('_')[1], preview: current.substring(0, 80) });
            wipe = true;
          }
        }
      }
    }

    // Korean '및' Replacements
    if (!wipe && current.includes('및')) {
      const localeSuffix = Object.keys(andMapping).find(suffix => parentKey.endsWith(suffix));
      if (localeSuffix) {
        report.conjunctionReplacements.push({ slug, key: parentKey, locale: localeSuffix, preview: current.substring(Math.max(0, current.indexOf('및') - 20), current.indexOf('및') + 20) });
      }
    }
  }
}

Object.entries(data).forEach(([slug, giant]) => {
  processNode(giant, '', slug);
});

console.log("=== DRY RUN REPORT V3 ===");
console.log(`[1] Actual Contaminated Fields (Retranslation Targets - Non Era): ${report.retranslationTargets.length}`);
console.log(`[2] Era Translation Targets (Needs Translation, NOT Wiped): ${report.eraTranslationTargets.length}`);
console.log(`[3] Korean '및' Replacements: ${report.conjunctionReplacements.length}`);

console.log("\n--- Samples for Retranslation Targets ---");
console.log(report.retranslationTargets.slice(0, 3));

console.log("\n--- Samples for Era Translation Targets ---");
console.log(report.eraTranslationTargets.slice(0, 3));

// Save report for agent to process retranslation
fs.writeFileSync('scratch/retranslation-targets.json', JSON.stringify(report.retranslationTargets, null, 2));
