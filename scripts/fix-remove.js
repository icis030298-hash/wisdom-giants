const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
let content = fs.readFileSync(tsFile, 'utf8').replace(/\r\n/g, '\n');

const TARGETS = [
  'elon-musk',
  'steve-jobs',
  'nelson-mandela',
  'margaret-thatcher',
  'mother-teresa',
  'mao-zedong',
  'stephen-hawking',
  'pablo-picasso',
  'salvador-dali',
  'coco-chanel',
  'malala-yousafzai',
  'jk-rowling',
  'oprah-winfrey'
];

let count = 0;
TARGETS.forEach(t => {
  const searchStr = `slug: "${t}"`;
  let idx = content.indexOf(searchStr);
  if (idx === -1) {
    idx = content.indexOf(`slug: '${t}'`);
  }
  if (idx !== -1) {
    let startIdx = content.lastIndexOf('  {\n    id:', idx);
    let endIdx = content.indexOf('  },', idx);
    let realEndIdx = endIdx !== -1 ? endIdx + 5 : -1; // include \n
    
    if (startIdx !== -1 && realEndIdx !== -1) {
      content = content.slice(0, startIdx) + content.slice(realEndIdx);
      count++;
      console.log(`Removed ${t}`);
    } else {
      // maybe it's the last one
      endIdx = content.indexOf('  }', idx);
      if (endIdx !== -1 && startIdx !== -1) {
        content = content.slice(0, startIdx) + content.slice(endIdx + 4);
        count++;
        console.log(`Removed ${t}`);
      }
    }
  }
});

if (count > 0) {
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  fs.writeFileSync(tsFile, content, 'utf8');
}
console.log(`Done, removed ${count}`);
