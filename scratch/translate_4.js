const fs = require('fs');

const inFile = 'c:\\Users\\user\\OneDrive\\바탕 화면\\wisdom-giants-20260512T091146Z-3-001\\wisdom-giants\\scratch\\sw_year_fix_in_4.json';

const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));

const translations = {
  "January": "Januari",
  "February": "Februari",
  "March": "Machi",
  "April": "Aprili",
  "May": "Mei",
  "June": "Juni",
  "July": "Julai",
  "August": "Agosti",
  "September": "Septemba",
  "October": "Oktoba",
  "November": "Novemba",
  "December": "Desemba"
};

function translateString(str) {
  let translated = str;

  translated = translated.replace(/c\.\s*/g, "takriban ");
  translated = translated.replace(/BCE/g, "KK");
  translated = translated.replace(/CE/g, "BK");
  translated = translated.replace(/Post-/g, "Baada ya ");
  translated = translated.replace(/Post /g, "Baada ya ");
  translated = translated.replace(/Posthumous/g, "Baada ya kifo");
  translated = translated.replace(/before/g, "kabla ya");
  translated = translated.replace(/Age/g, "umri wa miaka");
  
  // Century
  translated = translated.replace(/(\d+)(st|nd|rd|th)\s+Century/g, "Karne ya $1");

  // Dates with month
  const monthRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+),\s+(\d+)/;
  translated = translated.replace(monthRegex, (match, m, d, y) => `${d} ${translations[m]} ${y}`);

  const monthYearRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+)/;
  translated = translated.replace(monthYearRegex, (match, m, y) => `${translations[m]} ${y}`);

  const parenMonthRegex = /\((January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+)\)/;
  translated = translated.replace(parenMonthRegex, (match, m, d) => `(${d} ${translations[m]})`);
  
  const dMyRegex = /(\d+)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+)/;
  translated = translated.replace(dMyRegex, (match, d, m, y) => `${d} ${translations[m]} ${y}`);
  
  translated = translated.replace(/Late\s+/g, "Mwishoni mwa ");
  translated = translated.replace(/Early\s+/g, "Mwanzoni mwa ");
  translated = translated.replace(/Mid\s+/g, "Katikati ya ");

  return translated.trim();
}

const outData = {};
for (const slug in data) {
  outData[slug] = {};
  for (const key in data[slug]) {
    outData[slug][key] = translateString(data[slug][key]);
  }
}

fs.writeFileSync('c:\\Users\\user\\OneDrive\\바탕 화면\\wisdom-giants-20260512T091146Z-3-001\\wisdom-giants\\scratch\\temp_translated.json', JSON.stringify(outData, null, 2));
