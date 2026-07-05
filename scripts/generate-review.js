const fs = require('fs');
const path = require('path');

const langs = ['en', 'ko', 'es', 'fr', 'de', 'ja', 'zh'];
let output = '# UI 언어팩 번역 품질 검수\n\n주요 언어들의 핵심 UI 문자열 번역 결과입니다. 꼼꼼히 확인해 주세요.\n\n';

const keys = [
  'recommendedGiants', 'learnMoreOnWikipedia', 'exploreLegacyOfOtherGiants', 'timelineAndFacts',
  'timeline', 'keyAchievements', 'readEpic', 'about', 'quotesCollection', 'shareResults', 
  'talkWithGiant', 'warningAiMistakes'
];

output += '| 키 (Key) | 영어 (en) | 한국어 (ko) | 스페인어 (es) | 프랑스어 (fr) | 독일어 (de) | 일본어 (ja) | 중국어 (zh) |\n';
output += '|---|---|---|---|---|---|---|---|\n';

const uiData = {};
for (const lang of langs) {
  try {
    const data = JSON.parse(fs.readFileSync('messages/' + lang + '.json', 'utf8'));
    uiData[lang] = data.UI || {};
  } catch(e) {
    uiData[lang] = {};
  }
}

for (const key of keys) {
  output += '| `' + key + '` ';
  output += '| ' + (uiData['en'][key] || '') + ' ';
  output += '| ' + (uiData['ko'][key] || '') + ' ';
  output += '| ' + (uiData['es'][key] || '') + ' ';
  output += '| ' + (uiData['fr'][key] || '') + ' ';
  output += '| ' + (uiData['de'][key] || '') + ' ';
  output += '| ' + (uiData['ja'][key] || '') + ' ';
  output += '| ' + (uiData['zh'][key] || '') + ' |\n';
}

const outPath = 'C:/Users/user/.gemini/antigravity/brain/1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4/ui_translations_review.md';
fs.writeFileSync(outPath, output, 'utf8');
console.log('Artifact created.');
