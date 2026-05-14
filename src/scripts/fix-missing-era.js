const fs = require('fs');

function addEraToGiants(path, eraValue) {
  const content = JSON.parse(fs.readFileSync(path, 'utf8'));
  const giants = content.Giants;

  Object.keys(giants).forEach(slug => {
    if (!giants[slug].era) {
      giants[slug].era = eraValue;
    }
  });

  fs.writeFileSync(path, JSON.stringify(content, null, 2), 'utf8');
}

addEraToGiants('messages/en.json', 'Historical Giant');
addEraToGiants('messages/ko.json', '역사의 거인');
console.log('Era field added to all giants in en.json and ko.json');
