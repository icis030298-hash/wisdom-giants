const fs = require('fs');

// Fix remaining 8 skipped/malformed era fields directly
const narrativesPath = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const fixes = {
  'confucius': {
    era_fa: 'غول قرن ۶-۵ قبل از میلاد (دوره بهار و پاییز)',
    era_th: 'ยักษ์แห่งศตวรรษที่ 6-5 ก่อนคริสต์ศักราช (ยุคชุนชิว)',
    era_el: 'Γίγαντας του 6ου-5ου αιώνα π.Χ. (Εποχή Άνοιξης και Φθινοπώρου)',
    era_uk: 'Гігант VI-V ст. до н.е. (Період Весни та Осені)',
  },
  'leonardo-da-vinci': {
    era_fa: 'غول رنسانس (۱۴۵۲~۱۵۱۹)',
    era_th: 'ยักษ์แห่งยุคฟื้นฟูศิลปวิทยา (1452~1519)',
    era_el: 'Γίγαντας της Αναγέννησης (1452~1519)',
    era_uk: 'Гігант Ренесансу (1452~1519)',
  },
  'marie-curie': {
    era_fa: 'غول قرن ۱۹-۲۰ام (۱۸۶۷~۱۹۳۴)',
    era_th: 'ยักษ์แห่งศตวรรษที่ 19-20 (1867~1934)',
    era_el: 'Γίγαντας του 19ου-20ού αιώνα (1867~1934)',
    era_uk: 'Гігант XIX-XX ст. (1867~1934)',
  },
  'isaac-newton': {
    era_fa: 'غول قرن ۱۷-۱۸ام (۱۶۴۳~۱۷۲۷)',
    era_th: 'ยักษ์แห่งศตวรรษที่ 17-18 (1643~1727)',
    era_el: 'Γίγαντας του 17ου-18ου αιώνα (1643~1727)',
    era_uk: 'Гігант XVII-XVIII ст. (1643~1727)',
  }
};

let applied = 0;
Object.entries(fixes).forEach(([slug, fields]) => {
  Object.entries(fields).forEach(([key, value]) => {
    if (data[slug]) {
      data[slug][key] = value;
      applied++;
      console.log(`Fixed ${slug}.${key}: "${value}"`);
    }
  });
});

fs.writeFileSync(narrativesPath, JSON.stringify(data, null, 2));
console.log(`\nApplied ${applied} manual era fixes.`);
