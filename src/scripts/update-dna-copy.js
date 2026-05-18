const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');

// ── ko.json ──
const koPath = path.join(root, 'messages', 'ko.json');
const ko = JSON.parse(fs.readFileSync(koPath, 'utf8'));

if (ko.Hero) ko.Hero.startTest = '🧬 나와 닮은 위인 찾기';
if (ko.Test && ko.Test.banner) {
  ko.Test.banner.desc = '15가지 질문으로 나와 가장 닮은 역사 속 위인을 찾아보세요.';
}
if (ko.About) ko.About.testTitle = '닮은 위인 찾기 테스트';

fs.writeFileSync(koPath, JSON.stringify(ko, null, 2), 'utf8');
console.log('ko done - Hero.startTest:', ko.Hero && ko.Hero.startTest);
console.log('ko banner.desc:', ko.Test && ko.Test.banner && ko.Test.banner.desc);

// ── en.json ──
const enPath = path.join(root, 'messages', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

if (en.Hero) en.Hero.startTest = '🧬 Find Your Historical Match';
if (en.Test && en.Test.banner) {
  en.Test.banner.desc = 'Find your historical twin through 15 questions.';
}
if (en.Footer && en.Footer.links) en.Footer.links.dnaTest = 'Historical Match Test';
if (en.About) en.About.testTitle = 'Find Your Historical Match';

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log('en done - Hero.startTest:', en.Hero && en.Hero.startTest);

// ── de.json ──
const dePath = path.join(root, 'messages', 'de.json');
const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));

if (de.Hero) de.Hero.startTest = '🧬 Deinen historischen Zwilling finden';
if (de.Test && de.Test.banner) {
  de.Test.banner.desc = 'Finde deinen historischen Zwilling durch 15 Fragen.';
}
if (de.Footer && de.Footer.links) de.Footer.links.dnaTest = 'Historischer Zwilling Test';

fs.writeFileSync(dePath, JSON.stringify(de, null, 2), 'utf8');
console.log('de done - Hero.startTest:', de.Hero && de.Hero.startTest);
