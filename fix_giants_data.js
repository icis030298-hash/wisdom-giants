const fs = require('fs');
const path = require('path');

const errorGiants = ['ataturk', 'rosa-parks', 'simone-de-beauvoir', 'hannah-arendt', 'agatha-christie', 'queen-elizabeth-i', 'averroes-ibn-rushd', 'avicenna-ibn-sina', 'zarathushtra'];

for (const slug of errorGiants) {
  const filePath = path.join(process.cwd(), 'src/data/narratives', `${slug}.json`);
  if (!fs.existsSync(filePath)) continue;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 1. Fix wisdom
  if (typeof data.wisdom === 'string') {
    const text = data.wisdom;
    data.wisdom = [
      {
        quote_en: "Core Philosophy",
        meaning_en: text
      }
    ];
  } else if (!Array.isArray(data.wisdom)) {
    data.wisdom = [];
  }

  // 2. Fix fact_box
  if (!data.fact_box) {
    data.fact_box = {
      one_line_summary: "Data under review.",
      key_achievements: ["Data is being updated."],
      legacy_statement: "Legacy is being updated."
    };
  }
  
  // ensure other localized fact_boxes are objects as well if needed, but fact_box is enough for fallback
  const locales = ['ko', 'en', 'de', 'es', 'fr', 'it', 'ja', 'pt', 'ar', 'hi', 'ru', 'zh', 'fa', 'nl', 'pl', 'sw', 'tr', 'uk', 'vi', 'el', 'ha', 'he', 'id', 'th'];
  for (const locale of locales) {
    const key = `fact_box_${locale}`;
    if (data[key] && !data[key].key_achievements) {
        data[key].key_achievements = ["Data is being updated."];
    } else if (!data[key]) {
        // don't necessarily need to create it if it falls back to fact_box, but just in case:
        // Actually page.tsx does `narrative[\`fact_box_\${locale}\`] || narrative.fact_box` so we are good.
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Fixed data for ${slug}`);
}
