import fs from 'fs';
import path from 'path';

const categoryTranslations: Record<string, Record<string, string>> = {
  ko: {
    leadership: "정치·리더십",
    science: "과학·혁신",
    philosophy: "철학·사상",
    arts: "문학·예술",
    society: "인권·사회",
    business: "탐험·비즈니스"
  },
  en: {
    leadership: "Leadership",
    science: "Science",
    philosophy: "Philosophy",
    arts: "Arts",
    society: "Society",
    business: "Business"
  },
  de: {
    leadership: "Führung",
    science: "Wissenschaft",
    philosophy: "Philosophie",
    arts: "Kunst",
    society: "Gesellschaft",
    business: "Business"
  },
  ja: {
    leadership: "リーダーシップ",
    science: "科学",
    philosophy: "哲学",
    arts: "芸術",
    society: "社会",
    business: "ビジネス"
  },
  es: {
    leadership: "Liderazgo",
    science: "Ciencia",
    philosophy: "Filosofía",
    arts: "Arte",
    society: "Sociedad",
    business: "Negocios"
  },
  fr: {
    leadership: "Leadership",
    science: "Science",
    philosophy: "Philosophie",
    arts: "Arts",
    society: "Société",
    business: "Business"
  },
  it: {
    leadership: "Leadership",
    science: "Scienza",
    philosophy: "Filosofia",
    arts: "Arte",
    society: "Società",
    business: "Business"
  },
  pt: {
    leadership: "Liderança",
    science: "Ciência",
    philosophy: "Filosofia",
    arts: "Arte",
    society: "Sociedade",
    business: "Negócios"
  }
};

const messagesDir = path.resolve(process.cwd(), 'messages');
const locales = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt'];

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (data.GiantsGrid && data.GiantsGrid.categories) {
    data.GiantsGrid.categories = categoryTranslations[locale];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated categories in ${locale}.json`);
  } else {
    console.warn(`⚠️ GiantsGrid.categories not found in ${locale}.json`);
  }
});
