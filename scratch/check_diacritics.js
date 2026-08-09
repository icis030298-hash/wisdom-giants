const fs = require('fs');

const cData = JSON.parse(fs.readFileSync('scratch/c_filtered_strict.json', 'utf8'));

// Normalize Arabic/Persian
function normalizeArabic(text) {
  return text
    // Remove Arabic diacritics (tashkeel)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    // Normalize Alef with/without Hamza, Madda to bare Alef
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    // Normalize Ya and Alef Maksura
    .replace(/[\u0649]/g, '\u064A')
    // Normalize Ta Marbuta to Ha
    .replace(/\u0629/g, '\u0647')
    // Normalize Persian Yeh and Kaf
    .replace(/\u06CC/g, '\u064A')
    .replace(/\u06A9/g, '\u0643');
}

// Normalize Hindi (Devanagari)
function normalizeHindi(text) {
  return text
    // Remove Nukta (U+093C)
    .replace(/\u093C/g, '')
    // Replace composed characters with Nukta with their base equivalents
    .replace(/\u0958/g, '\u0915') // क़ -> क
    .replace(/\u0959/g, '\u0916') // ख़ -> ख
    .replace(/\u095A/g, '\u0917') // ग़ -> ग
    .replace(/\u095B/g, '\u091C') // ज़ -> ज
    .replace(/\u095C/g, '\u0921') // ड़ -> ड
    .replace(/\u095D/g, '\u0922') // ढ़ -> ढ
    .replace(/\u095E/g, '\u092B') // फ़ -> फ
    .replace(/\u095F/g, '\u092F'); // य़ -> य
}

const diacriticOnlyDiffs = [];
const otherDiffs = [];

for (const item of cData) {
  if (['ar', 'fa'].includes(item.locale)) {
    const normLocal = normalizeArabic(item.localName);
    const normCorrect = normalizeArabic(item.correctName);
    
    if (normLocal === normCorrect && item.localName !== item.correctName) {
      diacriticOnlyDiffs.push(item);
    } else {
      otherDiffs.push(item);
    }
  } else if (item.locale === 'hi') {
    const normLocal = normalizeHindi(item.localName);
    const normCorrect = normalizeHindi(item.correctName);
    
    if (normLocal === normCorrect && item.localName !== item.correctName) {
      diacriticOnlyDiffs.push(item);
    } else {
      otherDiffs.push(item);
    }
  } else {
    otherDiffs.push(item);
  }
}

console.log(`Diacritic only diffs (hi/ar/fa): ${diacriticOnlyDiffs.length}`);
fs.writeFileSync('scratch/c_diacritic_diffs.json', JSON.stringify(diacriticOnlyDiffs, null, 2));
fs.writeFileSync('scratch/c_other_diffs.json', JSON.stringify(otherDiffs, null, 2));
