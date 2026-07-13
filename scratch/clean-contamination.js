const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let changes = 0;

// Mapping of 'and' for languages where '및' leaked
const andMapping = {
  '_fa': ' و ',
  '_hi': ' और ',
  '_fr': ' et ',
  '_ar': ' و ',
  '_he': ' ו',
  '_th': ' และ ',
  '_id': ' dan ',
  '_tr': ' ve ',
  '_ru': ' и ',
  '_ja': ' と ',
  '_zh': ' 与 ',
  '_uk': ' та ',
  '_el': ' και ',
  '_pl': ' i ',
  '_es': ' y ',
  '_de': ' und ',
  '_it': ' e ',
  '_nl': ' en ',
  '_sw': ' na ',
  '_pt': ' e ',
  '_vi': ' và '
};

Object.entries(data).forEach(([slug, giant]) => {
  Object.entries(giant).forEach(([key, val]) => {
    if (typeof val !== 'string') return;
    
    let original = val;
    let current = val;
    
    // 1. Remove [lang] prefixes at start (e.g. [RTL fa], [ar])
    current = current.replace(/^\[[a-zA-Z\s]+\]\s*/g, '');
    
    // 2. Remove Reversed English debug text
    // The exact pattern is often: ".yloponom lautcelletni rieht ot taerht a sa tpircs lanoitan a deweiv ohw..."
    // We will match blocks of reversed text words
    const reversedWords = ['yloponom', 'lautcelletni', 'taerht', 'deweiv', 'tpircs', 'lanoitan', 'tniap', 'sgnidliub'];
    let containsReversed = reversedWords.some(w => current.includes(w));
    if (containsReversed) {
      // Find the reversed sentence and remove it. Usually it's a block of latin chars and spaces.
      current = current.replace(/[a-zA-Z\s\.,]{20,}/g, (match) => {
        if (reversedWords.some(w => match.includes(w))) {
          return ''; // Strip the corrupted text block
        }
        return match;
      });
    }
    
    // 3. Replace '및' with the correct conjunction
    if (current.includes('및')) {
      const localeSuffix = Object.keys(andMapping).find(suffix => key.endsWith(suffix));
      if (localeSuffix) {
        current = current.replace(/\s*및\s*/g, andMapping[localeSuffix]);
      } else {
        current = current.replace(/\s*및\s*/g, ' and ');
      }
    }
    
    current = current.trim();
    
    if (current !== original) {
      giant[key] = current;
      changes++;
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Cleaned ${changes} contaminated fields in final-narratives.json`);
