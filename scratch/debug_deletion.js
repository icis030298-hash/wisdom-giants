const cp = require('child_process');
const fs = require('fs');

const originalContent = cp.execSync('git show 6d02626:src/data/giants.ts').toString();

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
      
      console.log(`\nMatched target: ${target} (using ${searchStr}) at index ${targetIdx}`);
      
      let startIdx = -1;
      for (let i = targetIdx; i >= 0; i--) {
        if (content.substr(i, 4) === '\n  {') {
          startIdx = i;
          break;
        }
      }
      
      if (startIdx !== -1) {
        console.log(`  Found start of object (\\n  {) at index ${startIdx}. Substring:`, content.substr(startIdx, 40).replace(/\r?\n/g, '\\n'));
        
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
          console.log(`  Found end of object (}) at index ${endIdx}. Substring:`, content.substr(endIdx - 20, 25).replace(/\r?\n/g, '\\n'));
          
          let removeEnd = endIdx + 1;
          if (content[removeEnd] === ',') removeEnd++;
          while (content[removeEnd] === ' ' || content[removeEnd] === '\r' || content[removeEnd] === '\n') {
            removeEnd++;
          }
          
          const removedText = content.slice(startIdx + 1, removeEnd);
          console.log(`  Removing chunk size: ${removedText.length} characters.`);
          console.log(`  First 100 chars of chunk:`, removedText.slice(0, 100).replace(/\r?\n/g, '\\n'));
          console.log(`  Last 100 chars of chunk:`, removedText.slice(-100).replace(/\r?\n/g, '\\n'));
          
          content = content.slice(0, startIdx + 1) + content.slice(removeEnd);
        } else {
          console.log(`  [ERROR] No matching end brace found!`);
          break;
        }
      } else {
        console.log(`  [ERROR] No start index found!`);
        break;
      }
    }
  });
});
