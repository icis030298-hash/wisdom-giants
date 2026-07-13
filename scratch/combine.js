const fs = require('fs');

const inputFile = 'c:\\Users\\natey\\Desktop\\wisdom-giants\\scratch\\t2-p2-chunk-9.json';
const outputFile = 'c:\\Users\\natey\\Desktop\\wisdom-giants\\scratch\\t2-p2-out-9.json';

const t1 = require('./trans1.js');
const t2 = require('./trans2.js');
const t3 = require('./trans3.js');
const t4 = require('./trans4.js');
const t5 = require('./trans5.js');

const allTrans = Object.assign({}, t1, t2, t3, t4, t5);

const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

input.forEach(item => {
  const trans = allTrans[item.slug];
  if (!trans) {
    console.log('Missing translation for', item.slug);
  } else {
    if (item.type === 'fact-layer') {
      item.translated = item.originalEn.map((ev, i) => {
        return {
          year: ev.year,
          event: trans[i]
        };
      });
    } else {
      item.translated = trans;
    }
  }
});

fs.writeFileSync(outputFile, JSON.stringify(input, null, 2));
console.log('Done!');
