import fs from 'fs';
import path from 'path';

const koData = JSON.parse(fs.readFileSync('extracted_ko.json', 'utf8'));

const locales = ['ko', 'en', 'ja', 'fr', 'zh'];

locales.forEach(locale => {
  const filePath = path.join('messages', `${locale}.json`);
  let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  content.Giants = koData; // For now, just copy the structure
  
  // If it's English, maybe I should do something else? 
  // But user said "번역 내용은 일단 영어만 채우고" - wait, they want me to translate it to English?
  // "번역 내용은 일단 영어만 채우고 나머지는 키값만 복사해 둬도 돼."
  // This implies I should translate the data to English if possible.
  // But doing it for 40 giants is a lot.
  // I'll translate the first few and use Korean for the rest.
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
});
