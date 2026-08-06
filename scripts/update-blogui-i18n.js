const fs = require('fs');
const path = require('path');

const categoryTranslations = {
  ar: { art: "فن", arts: "فنون", science: "علوم", society: "مجتمع", business: "أعمال" },
  de: { art: "Kunst", arts: "Künste", science: "Wissenschaft", society: "Gesellschaft", business: "Wirtschaft" },
  el: { art: "Τέχνη", arts: "Τέχνες", science: "Επιστήμη", society: "Κοινωνία", business: "Επιχειρήσεις" },
  en: { art: "Art", arts: "Arts", science: "Science", society: "Society", business: "Business" },
  es: { art: "Arte", arts: "Artes", science: "Ciencia", society: "Sociedad", business: "Negocios" },
  fa: { art: "هنر", arts: "هنرها", science: "علم", society: "جامعه", business: "تجارت" },
  fr: { art: "Art", arts: "Arts", science: "Science", society: "Société", business: "Affaires" },
  ha: { art: "Fasaha", arts: "Fasaha", science: "Kimiyya", society: "Al'umma", business: "Kasuwanci" },
  he: { art: "אמנות", arts: "אמנויות", science: "מדע", society: "חברה", business: "עסקים" },
  hi: { art: "कला", arts: "कलाएं", science: "विज्ञान", society: "समाज", business: "व्यापार" },
  id: { art: "Seni", arts: "Seni", science: "Sains", society: "Masyarakat", business: "Bisnis" },
  it: { art: "Arte", arts: "Arti", science: "Scienza", society: "Società", business: "Affari" },
  ja: { art: "芸術", arts: "芸術", science: "科学", society: "社会", business: "ビジネス" },
  ko: { art: "예술", arts: "예술", science: "과학", society: "사회", business: "비즈니스" },
  nl: { art: "Kunst", arts: "Kunsten", science: "Wetenschap", society: "Samenleving", business: "Zakelijk" },
  pl: { art: "Sztuka", arts: "Sztuka", science: "Nauka", society: "Społeczeństwo", business: "Biznes" },
  pt: { art: "Arte", arts: "Artes", science: "Ciência", society: "Sociedade", business: "Negócios" },
  ru: { art: "Искусство", arts: "Искусство", science: "Наука", society: "Общество", business: "Бизнес" },
  sw: { art: "Sanaa", arts: "Sanaa", science: "Sayansi", society: "Jamii", business: "Biashara" },
  th: { art: "ศิลปะ", arts: "ศิลปะ", science: "วิทยาศาสตร์", society: "สังคม", business: "ธุรกิจ" },
  tr: { art: "Sanat", arts: "Sanatlar", science: "Bilim", society: "Toplum", business: "İş" },
  uk: { art: "Мистецтво", arts: "Мистецтво", science: "Наука", society: "Суспільство", business: "Бізнес" },
  vi: { art: "Nghệ thuật", arts: "Nghệ thuật", science: "Khoa học", society: "Xã hội", business: "Kinh doanh" },
  zh: { art: "艺术", arts: "艺术", science: "科学", society: "社会", business: "商业" }
};

const messagesDir = path.join(__dirname, '..', 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

let updatedCount = 0;
files.forEach(file => {
  const lang = path.basename(file, '.json');
  const filePath = path.join(messagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.BlogUI) {
    data.BlogUI = {};
  }

  const translations = categoryTranslations[lang] || categoryTranslations.en;
  let changed = false;

  for (const [key, val] of Object.entries(translations)) {
    if (!data.BlogUI[key]) {
      data.BlogUI[key] = val;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    updatedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Finished updating ${updatedCount} message files.`);
