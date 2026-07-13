const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let report = {
  prefixRemovals: [],
  reversedEnglishRemovals: [],
  emptyFieldsGenerated: [],
  conjunctionReplacements: [],
  englishLeaksIgnored: [] // Just to show we found them but ignored them
};

const reversedWords = ['yloponom', 'lautcelletni', 'taerht', 'deweiv', 'tpircs', 'lanoitan', 'tniap', 'sgnidliub'];
const andMapping = {
  '_fa': ' و ', '_hi': ' और ', '_fr': ' et ', '_ar': ' و ', '_he': ' ו',
  '_th': ' และ ', '_id': ' dan ', '_tr': ' ve ', '_ru': ' и ', '_ja': ' と ',
  '_zh': ' 与 ', '_uk': ' та ', '_el': ' και ', '_pl': ' i ', '_es': ' y ',
  '_de': ' und ', '_it': ' e ', '_nl': ' en ', '_sw': ' na ', '_pt': ' e ', '_vi': ' và '
};

Object.entries(data).forEach(([slug, giant]) => {
  Object.entries(giant).forEach(([key, val]) => {
    if (typeof val !== 'string') return;
    
    let current = val;
    let modified = false;
    
    // 1. Prefix Removal
    if (current.match(/^\[[a-zA-Z\s]+\]\s*/)) {
      const match = current.match(/^\[[a-zA-Z\s]+\]\s*/)[0];
      report.prefixRemovals.push({ slug, key, match });
      current = current.replace(/^\[[a-zA-Z\s]+\]\s*/g, '');
      modified = true;
    }
    
    // 2. Reversed English Deletion
    let containsReversed = reversedWords.some(w => current.includes(w));
    if (containsReversed) {
      const originalText = current;
      current = current.replace(/[a-zA-Z\s\.,]{20,}/g, (match) => {
        if (reversedWords.some(w => match.includes(w))) {
          report.reversedEnglishRemovals.push({ slug, key, removed: match });
          return ''; 
        }
        return match;
      });
      current = current.trim();
      modified = true;
      if (current === '') {
        report.emptyFieldsGenerated.push({ slug, key, original: originalText });
      }
    }
    
    // 3. Korean '및' Replacement
    if (current.includes('및')) {
      const localeSuffix = Object.keys(andMapping).find(suffix => key.endsWith(suffix));
      const replacement = localeSuffix ? andMapping[localeSuffix] : ' and ';
      report.conjunctionReplacements.push({ slug, key, replacement, preview: current.substring(Math.max(0, current.indexOf('및') - 20), current.indexOf('및') + 20) });
      current = current.replace(/\s*및\s*/g, replacement);
      modified = true;
    }
  });
});

console.log("=== DRY RUN REPORT ===");
console.log(`[1] Language Prefixes to Remove: ${report.prefixRemovals.length}`);
console.log(`[2] Reversed English Chunks to Delete: ${report.reversedEnglishRemovals.length}`);
console.log(`   -> Fields that will become EMPTY: ${report.emptyFieldsGenerated.length}`);
console.log(`[3] Korean '및' Conjunctions to Replace: ${report.conjunctionReplacements.length}`);

console.log("\n--- Samples for [1] Prefix Removals ---");
console.log(report.prefixRemovals.slice(0, 5));

console.log("\n--- Samples for [2] Empty Fields Generated (Needs Re-translation) ---");
console.log(report.emptyFieldsGenerated.slice(0, 5));

console.log("\n--- Samples for [3] '및' Replacements ---");
console.log(report.conjunctionReplacements.slice(0, 5));

// Don't save the file! Dry run only.
