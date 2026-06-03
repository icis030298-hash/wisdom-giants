const cp = require('child_process');
const fs = require('fs');

const originalContent = cp.execSync('git show b347d5d^:src/data/giants.ts').toString();

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

let content = originalContent;

TARGETS.forEach(target => {
  let searchStrs = [`slug: "${target}"`, `slug: '${target}'`];
  searchStrs.forEach(searchStr => {
    while (true) {
      let targetIdx = content.indexOf(searchStr);
      if (targetIdx === -1) break;
      
      let startIdx = -1;
      for (let i = targetIdx; i >= 0; i--) {
        if (content.substr(i, 4) === '\n  {') {
          startIdx = i;
          break;
        }
      }
      
      if (startIdx !== -1) {
        let braceCount = 0;
        let endIdx = -1;
        let inString = false;
        let escape = false;
        for (let i = startIdx + 1; i < content.length; i++) {
          let char = content[i];
          if (escape) {
            escape = false;
            continue;
          }
          if (char === '\\') {
            escape = true;
            continue;
          }
          if (char === '"' || char === "'") {
            if (!inString) inString = char;
            else if (inString === char) inString = false;
          }
          if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIdx = i;
                break;
              }
            }
          }
        }
        
        if (endIdx !== -1) {
          let removeEnd = endIdx + 1;
          if (content[removeEnd] === ',') removeEnd++;
          while (content[removeEnd] === ' ' || content[removeEnd] === '\r' || content[removeEnd] === '\n') {
            removeEnd++;
          }
          
          content = content.slice(0, startIdx + 1) + content.slice(removeEnd);
          console.log(`Removed ${target}`);
        } else {
          break;
        }
      } else {
        break;
      }
    }
  });
});

console.log('Result length:', content.length);
console.log('Original length:', originalContent.length);
console.log('Did it change?', content !== originalContent);
