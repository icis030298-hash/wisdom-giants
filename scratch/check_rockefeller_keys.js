const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives/john-d-rockefeller.json', 'utf8'));

const localeFields = {};
Object.keys(data).forEach(k => {
  const m = k.match(/^(.*)_([a-z]{2})$/);
  if (m) {
    const prefix = m[1];
    const loc = m[2];
    if (!localeFields[loc]) localeFields[loc] = [];
    localeFields[loc].push(prefix);
  } else {
    console.log('Non-locale key:', k);
  }
});

console.log('\nde 로케일 필드 목록:', localeFields['de']);
console.log('en 로케일 필드 목록:', localeFields['en']);
