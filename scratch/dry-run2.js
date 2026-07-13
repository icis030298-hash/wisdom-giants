const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Non-Latin locales
const nonLatinLocales = ['_ar', '_fa', '_he', '_ru', '_uk', '_el', '_zh', '_ja', '_th', '_hi'];

let report = {
  wipedFields: [],
  conjunctionReplacements: [],
  prefixRemovals: []
};

// Traverse object recursively
function processNode(node, currentKey, slug) {
  if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([k, v]) => {
      processNode(v, k, slug);
    });
  } else if (typeof node === 'string') {
    let original = node;
    let current = node;
    let modified = false;
    let wipe = false;

    // 1. Prefix Removal
    if (current.match(/^\[[a-zA-Z\s]+\]\s*/)) {
      report.prefixRemovals.push({ slug, key: currentKey, match: current.match(/^\[[a-zA-Z\s]+\]\s*/)[0] });
    }

    // 2. Latin character ratio check (for non-Latin locales)
    const localeSuffix = nonLatinLocales.find(loc => currentKey.endsWith(loc));
    if (localeSuffix) {
      const latinMatch = current.match(/[a-zA-Z]/g);
      const totalChars = current.replace(/\s/g, '').length;
      
      if (latinMatch && totalChars > 0) {
        const ratio = latinMatch.length / totalChars;
        // If more than 30% of the characters are Latin, we consider it contaminated
        if (ratio > 0.3) {
          wipe = true;
          report.wipedFields.push({ slug, key: currentKey, ratio: (ratio * 100).toFixed(1) + '%', preview: original.substring(0, 100) });
        }
      }
    }

    // 3. Korean '및' Replacements
    if (!wipe && current.includes('및')) {
      report.conjunctionReplacements.push({ slug, key: currentKey, preview: current.substring(Math.max(0, current.indexOf('및') - 20), current.indexOf('및') + 20) });
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
console.log(report.wipedFields.slice(0, 10));

console.log("\n--- Samples for '및' Replacements ---");
console.log(report.conjunctionReplacements.slice(0, 10));

fs.writeFileSync('scratch/dry-run-output.json', JSON.stringify(report, null, 2));
