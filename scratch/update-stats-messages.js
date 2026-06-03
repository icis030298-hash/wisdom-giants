const fs = require('fs');
const path = require('path');

const locales = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);

  // Update Hero.guide.selectGiantDesc
  if (json.Hero && json.Hero.guide && json.Hero.guide.selectGiantDesc) {
    let desc = json.Hero.guide.selectGiantDesc;
    desc = desc.replace('95+', '140+');
    desc = desc.replace('95여 명', '140여 명');
    desc = desc.replace('95名以上', '140名以上');
    desc = desc.replace('más de 95', 'más de 140');
    desc = desc.replace('plus de 95', 'plus de 140');
    desc = desc.replace('oltre 95', 'oltre 140');
    json.Hero.guide.selectGiantDesc = desc;
  }

  // Update Navigation.epicTitle / (wherever epicTitle is located - let's check or just search keys)
  function updateEpicTitle(obj) {
    if (!obj) return;
    if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        if (key === 'epicTitle' && typeof obj[key] === 'string') {
          let title = obj[key];
          title = title.replace('95', '140');
          obj[key] = title;
        } else {
          updateEpicTitle(obj[key]);
        }
      }
    }
  }

  updateEpicTitle(json);

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated messages for ${locale}`);
});

console.log("All locale files updated!");
