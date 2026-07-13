const fs = require('fs');

// Translation map for era strings
// Pattern: "Xth Century Giant (YYYY~YYYY)" -> translated
const eraTranslations = {
  fa: { // Persian
    template: (century, start, end) => `غول قرن ${century} (${start}~${end})`,
    centuries: {
      '15th': '۱۵ام', '16th': '۱۶ام', '17th': '۱۷ام', '18th': '۱۸ام',
      '19th': '۱۹ام', '20th': '۲۰ام', '21st': '۲۱ام', '14th': '۱۴ام',
      '13th': '۱۳ام', '12th': '۱۲ام', '11th': '۱۱ام', '10th': '۱۰ام',
      '9th': '۹ام', '8th': '۸ام', '7th': '۷ام', '6th': '۶ام',
      '5th': '۵ام', '4th': '۴ام', '3rd': '۳ام', '2nd': '۲ام', '1st': '۱ام',
      '18th-19th': '۱۸-۱۹ام'
    }
  },
  th: { // Thai
    template: (century, start, end) => `ยักษ์แห่งศตวรรษที่ ${century} (${start}~${end})`,
    centuries: {
      '15th': '15', '16th': '16', '17th': '17', '18th': '18',
      '19th': '19', '20th': '20', '21st': '21', '14th': '14',
      '13th': '13', '12th': '12', '11th': '11', '10th': '10',
      '9th': '9', '8th': '8', '7th': '7', '6th': '6',
      '5th': '5', '4th': '4', '3rd': '3', '2nd': '2', '1st': '1',
      '18th-19th': '18-19'
    }
  },
  el: { // Greek
    template: (century, start, end) => `Γίγαντας του ${century} αιώνα (${start}~${end})`,
    centuries: {
      '15th': '15ου', '16th': '16ου', '17th': '17ου', '18th': '18ου',
      '19th': '19ου', '20th': '20ού', '21st': '21ου', '14th': '14ου',
      '13th': '13ου', '12th': '12ου', '11th': '11ου', '10th': '10ου',
      '9th': '9ου', '8th': '8ου', '7th': '7ου', '6th': '6ου',
      '5th': '5ου', '4th': '4ου', '3rd': '3ου', '2nd': '2ου', '1st': '1ου',
      '18th-19th': '18ου-19ου'
    }
  },
  uk: { // Ukrainian
    template: (century, start, end) => `Гігант ${century} століття (${start}~${end})`,
    centuries: {
      '15th': '15-го', '16th': '16-го', '17th': '17-го', '18th': '18-го',
      '19th': '19-го', '20th': '20-го', '21st': '21-го', '14th': '14-го',
      '13th': '13-го', '12th': '12-го', '11th': '11-го', '10th': '10-го',
      '9th': '9-го', '8th': '8-го', '7th': '7-го', '6th': '6-го',
      '5th': '5-го', '4th': '4-го', '3rd': '3-го', '2nd': '2-го', '1st': '1-го',
      '18th-19th': '18-19-го'
    }
  },
  ar: { // Arabic
    template: (century, start, end) => `عملاق القرن ${century} (${start}~${end})`,
    centuries: {
      '15th': 'الخامس عشر', '16th': 'السادس عشر', '17th': 'السابع عشر', '18th': 'الثامن عشر',
      '19th': 'التاسع عشر', '20th': 'العشرين', '21st': 'الحادي والعشرين', '14th': 'الرابع عشر',
      '13th': 'الثالث عشر', '12th': 'الثاني عشر', '11th': 'الحادي عشر', '10th': 'العاشر',
      '9th': 'التاسع', '8th': 'الثامن', '7th': 'السابع', '6th': 'السادس',
      '5th': 'الخامس', '4th': 'الرابع', '3rd': 'الثالث', '2nd': 'الثاني', '1st': 'الأول',
      '18th-19th': 'الثامن عشر والتاسع عشر'
    }
  },
  he: { // Hebrew
    template: (century, start, end) => `ענק המאה ה-${century} (${start}~${end})`,
    centuries: {
      '15th': '15', '16th': '16', '17th': '17', '18th': '18',
      '19th': '19', '20th': '20', '21st': '21', '14th': '14',
      '13th': '13', '12th': '12', '11th': '11', '10th': '10',
      '9th': '9', '8th': '8', '7th': '7', '6th': '6',
      '5th': '5', '4th': '4', '3rd': '3', '2nd': '2', '1st': '1',
      '18th-19th': '18-19'
    }
  },
  ru: { // Russian
    template: (century, start, end) => `Гигант ${century} века (${start}~${end})`,
    centuries: {
      '15th': 'XV', '16th': 'XVI', '17th': 'XVII', '18th': 'XVIII',
      '19th': 'XIX', '20th': 'XX', '21st': 'XXI', '14th': 'XIV',
      '13th': 'XIII', '12th': 'XII', '11th': 'XI', '10th': 'X',
      '9th': 'IX', '8th': 'VIII', '7th': 'VII', '6th': 'VI',
      '5th': 'V', '4th': 'IV', '3rd': 'III', '2nd': 'II', '1st': 'I',
      '18th-19th': 'XVIII-XIX'
    }
  },
  zh: { // Chinese
    template: (century, start, end) => `${century}世纪伟人 (${start}~${end})`,
    centuries: {
      '15th': '15', '16th': '16', '17th': '17', '18th': '18',
      '19th': '19', '20th': '20', '21st': '21', '14th': '14',
      '13th': '13', '12th': '12', '11th': '11', '10th': '10',
      '9th': '9', '8th': '8', '7th': '7', '6th': '6',
      '5th': '5', '4th': '4', '3rd': '3', '2nd': '2', '1st': '1',
      '18th-19th': '18-19'
    }
  },
  ja: { // Japanese
    template: (century, start, end) => `${century}世紀の巨人 (${start}~${end})`,
    centuries: {
      '15th': '15', '16th': '16', '17th': '17', '18th': '18',
      '19th': '19', '20th': '20', '21st': '21', '14th': '14',
      '13th': '13', '12th': '12', '11th': '11', '10th': '10',
      '9th': '9', '8th': '8', '7th': '7', '6th': '6',
      '5th': '5', '4th': '4', '3rd': '3', '2nd': '2', '1st': '1',
      '18th-19th': '18-19'
    }
  },
  hi: { // Hindi
    template: (century, start, end) => `${century}वीं सदी के महापुरुष (${start}~${end})`,
    centuries: {
      '15th': '15', '16th': '16', '17th': '17', '18th': '18',
      '19th': '19', '20th': '20', '21st': '21', '14th': '14',
      '13th': '13', '12th': '12', '11th': '11', '10th': '10',
      '9th': '9', '8th': '8', '7th': '7', '6th': '6',
      '5th': '5', '4th': '4', '3rd': '3', '2nd': '2', '1st': '1',
      '18th-19th': '18-19'
    }
  }
};

function parseEra(rawValue) {
  // Normalize RTL reversed text: reverse the string to get actual content
  let value = rawValue.trim();
  // Check if it looks reversed (starts with ')' which means it was reversed in RTL)
  if (value.startsWith(')')) {
    value = value.split('').reverse().join('');
  }
  // Match "Xth[-Yth] Century Giant (YYYY~YYYY)"
  const match = value.match(/([\w\-]+)\s+Century Giant \((\d+)~(\d+)\)/i);
  if (match) {
    return { century: match[1], start: match[2], end: match[3] };
  }
  return null;
}

function translateEra(locale, rawValue) {
  const parsed = parseEra(rawValue);
  if (!parsed) return null;
  const { century, start, end } = parsed;
  const t = eraTranslations[locale];
  if (!t) return null;
  const centuryLabel = t.centuries[century.toLowerCase()] || century;
  return t.template(centuryLabel, start, end);
}

// Apply
const narrativesPath = 'src/data/final-narratives.json';
const targets = JSON.parse(fs.readFileSync('scratch/era-targets.json', 'utf8'));
const data = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

let applied = 0;

targets.forEach(({ slug, key, locale, currentValue }) => {
  const translated = translateEra(locale, currentValue);
  if (translated && data[slug]) {
    data[slug][key] = translated;
    applied++;
    console.log(`${slug}.${key}: "${currentValue}" -> "${translated}"`);
  } else {
    console.warn(`Skipped ${slug}.${key}: could not translate "${currentValue}"`);
  }
});

fs.writeFileSync(narrativesPath, JSON.stringify(data, null, 2));
console.log(`\nApplied ${applied}/${targets.length} era translations.`);
