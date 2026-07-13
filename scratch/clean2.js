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

let wipedFieldsCount = 0;
let conjunctionReplacementsCount = 0;

function processNode(node, parentKey, slug) {
  if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([k, v]) => {
      const effectiveKey = isNaN(k) ? k : parentKey;
      processNode(v, effectiveKey, slug);
      
      // Update the object with potentially modified string
      if (typeof v === 'string') {
         // After processing, if the node was modified we should update it
         // Actually, processNode doesn't return the modified string.
      }
    });
  }
}

// Rewriting processNode to mutate the object properly
function mutateNode(node, parentKey) {
  if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([k, v]) => {
      const effectiveKey = isNaN(k) ? k : parentKey;
      if (typeof v === 'object' && v !== null) {
        mutateNode(v, effectiveKey);
      } else if (typeof v === 'string') {
        let current = v;
        let wipe = false;

        const isNonLatinLocale = nonLatinLocales.some(loc => effectiveKey.endsWith(loc));
        if (isNonLatinLocale) {
          const latinMatch = current.match(/[a-zA-Z]/g);
          const totalChars = current.replace(/\s/g, '').length;
          
          if (latinMatch && totalChars > 0) {
            const ratio = latinMatch.length / totalChars;
            if (ratio > 0.3) {
              wipe = true;
              current = ""; // Wipe the field entirely
              wipedFieldsCount++;
            }
          }
        }

        if (!wipe && current.includes('및')) {
          const localeSuffix = Object.keys(andMapping).find(suffix => effectiveKey.endsWith(suffix));
          if (localeSuffix) {
            current = current.replace(/\s*및\s*/g, andMapping[localeSuffix]);
            conjunctionReplacementsCount++;
          }
        }
        
        // Update the value in the object if it changed
        if (current !== v) {
          node[k] = current;
        }
      }
    });
  }
}

Object.entries(data).forEach(([slug, giant]) => {
  mutateNode(giant, '');
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Successfully wiped ${wipedFieldsCount} contaminated fields.`);
console.log(`Successfully replaced ${conjunctionReplacementsCount} '및' conjunctions.`);
