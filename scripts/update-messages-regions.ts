import fs from 'fs';
import path from 'path';

const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'] as const;

const regionalTranslations: Record<string, Record<string, string>> = {
  ko: {
    all: "전체 지역",
    "east-asia": "동아시아",
    europe: "유럽",
    americas: "북미·남미",
    "middle-east-turkey": "중동·터키",
    africa: "아프리카",
    "south-southeast-asia": "남아시아·동남아시아"
  },
  en: {
    all: "All Regions",
    "east-asia": "East Asia",
    europe: "Europe",
    americas: "Americas",
    "middle-east-turkey": "Middle East & Turkey",
    africa: "Africa",
    "south-southeast-asia": "South & Southeast Asia"
  },
  de: {
    all: "Alle Regionen",
    "east-asia": "Ostasien",
    europe: "Europa",
    americas: "Amerika",
    "middle-east-turkey": "Naher Osten & Türkei",
    africa: "Afrika",
    "south-southeast-asia": "Süd- & Südostasien"
  },
  ja: {
    all: "すべての地域",
    "east-asia": "東アジア",
    europe: "ヨーロッパ",
    americas: "南北アメリカ",
    "middle-east-turkey": "中東・トルコ",
    africa: "アフリカ",
    "south-southeast-asia": "南アジア・東南アジア"
  },
  es: {
    all: "Todas las regiones",
    "east-asia": "Asia Oriental",
    europe: "Europa",
    americas: "América",
    "middle-east-turkey": "Oriente Medio y Turquía",
    africa: "África",
    "south-southeast-asia": "Asia del Sur y Sudeste Asiático"
  },
  fr: {
    all: "Toutes les régions",
    "east-asia": "Asie de l'Est",
    europe: "Europe",
    americas: "Amériques",
    "middle-east-turkey": "Moyen-Orient et Turquie",
    africa: "Afrique",
    "south-southeast-asia": "Asie du Sud et du Sud-Est"
  },
  it: {
    all: "Tutte le regioni",
    "east-asia": "Asia orientale",
    europe: "Europa",
    americas: "Americhe",
    "middle-east-turkey": "Medio Oriente e Turchia",
    africa: "Africa",
    "south-southeast-asia": "Asia meridionale e sud-orientale"
  },
  pt: {
    all: "Todas as regiões",
    "east-asia": "Ásia Oriental",
    europe: "Europa",
    americas: "Américas",
    "middle-east-turkey": "Oriente Médio e Turquia",
    africa: "África",
    "south-southeast-asia": "Sul e Sudeste Asiático"
  },
  ar: {
    all: "جميع المناطق",
    "east-asia": "شرق آسيا",
    europe: "أوروبا",
    americas: "الأمريكتان",
    "middle-east-turkey": "الشرق الأوسط وتركيا",
    africa: "أفريقيا",
    "south-southeast-asia": "جنوب وجنوب شرق آسيا"
  },
  hi: {
    all: "सभी क्षेत्र",
    "east-asia": "पूर्वी एशिया",
    europe: "यूरोप",
    americas: "अमेरिका",
    "middle-east-turkey": "मध्य पूर्व और तुर्की",
    africa: "अफ़्रीका",
    "south-southeast-asia": "दक्षिण और दक्षिण-पूर्व एशिया"
  },
  ru: {
    all: "Все регионы",
    "east-asia": "Восточная Азия",
    europe: "Европа",
    americas: "Америка",
    "middle-east-turkey": "Ближний Восток и Турция",
    africa: "Африка",
    "south-southeast-asia": "Южная и Юго-Восточная Азия"
  },
  zh: {
    all: "所有地区",
    "east-asia": "东亚",
    europe: "欧洲",
    americas: "美洲",
    "middle-east-turkey": "中东和土耳其",
    africa: "非洲",
    "south-southeast-asia": "南亚和东南亚"
  }
};

function run() {
  for (const locale of LOCALES) {
    const filePath = path.resolve(process.cwd(), `messages/${locale}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found: ${filePath}`);
      continue;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);

    // 1. Add regional translations to GiantsGrid
    if (json.GiantsGrid) {
      json.GiantsGrid.regions = regionalTranslations[locale];
    } else {
      console.warn(`Warning: GiantsGrid key missing in ${locale}.json`);
    }

    // 2. Update Landing.guide.selectGiantDesc (replace 140 with 500)
    if (json.Landing && json.Landing.guide && json.Landing.guide.selectGiantDesc) {
      json.Landing.guide.selectGiantDesc = json.Landing.guide.selectGiantDesc.replace('140', '500');
    }

    // 3. Update About.epicTitle (replace 140 with 500)
    if (json.About && json.About.epicTitle) {
      json.About.epicTitle = json.About.epicTitle.replace('140', '500');
    }

    // Write back JSON
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
    console.log(`Updated messages/${locale}.json`);
  }
}

run();
