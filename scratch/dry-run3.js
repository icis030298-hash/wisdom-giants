const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Non-Latin locales (we should only wipe these if they contain too much Latin text)
const nonLatinLocales = ['_ar', '_fa', '_he', '_ru', '_uk', '_el', '_zh', '_ja', '_th', '_hi'];

let report = {
  wipedFields: [],
  conjunctionReplacements: [],
  prefixRemovals: [] // We don't have these anymore as they were cleaned, but keep for completeness
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
      // Use parentKey if k is an array index, else use k as the primary locale indicator
      const effectiveKey = isNaN(k) ? k : parentKey;
      processNode(v, effectiveKey, slug);
    });
  } else if (typeof node === 'string') {
    let original = node;
    let current = node;
    let wipe = false;

    // 1. Prefix Removal
    if (current.match(/^\[[a-zA-Z\s]+\]\s*/)) {
      report.prefixRemovals.push({ slug, key: parentKey, match: current.match(/^\[[a-zA-Z\s]+\]\s*/)[0] });
    }

    // 2. Latin character ratio check (only for explicitly non-Latin locales)
    const isNonLatinLocale = nonLatinLocales.some(loc => parentKey.endsWith(loc));
    if (isNonLatinLocale) {
      const latinMatch = current.match(/[a-zA-Z]/g);
      const totalChars = current.replace(/\s/g, '').length;
      
      if (latinMatch && totalChars > 0) {
        const ratio = latinMatch.length / totalChars;
        // If > 30% of characters are Latin, it's considered contaminated
        if (ratio > 0.3) {
          wipe = true;
          report.wipedFields.push({ slug, key: parentKey, ratio: (ratio * 100).toFixed(1) + '%', preview: original.substring(0, 100) });
        }
      }
    }

    // 3. Korean '및' Replacements
    // Only replace if we know the locale and it's NOT Korean
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

console.log("=== DRY RUN REPORT ===");
console.log(`[1] Wiped Fields (Latin Ratio > 30%): ${report.wipedFields.length}`);
console.log(`[2] Korean '및' Replacements: ${report.conjunctionReplacements.length}`);
console.log(`[3] Prefix Removals: ${report.prefixRemovals.length}`);

console.log("\n--- Samples for Wiped Fields ---");
console.log(report.wipedFields.slice(0, 5));

console.log("\n--- Samples for '및' Replacements ---");
console.log(report.conjunctionReplacements.slice(0, 5));
