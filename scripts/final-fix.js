const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const originalContent = fs.readFileSync(tsFile, 'utf8');

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

// Remove each target one by one
TARGETS.forEach(target => {
  const searchStr = `slug: "${target}"`;
  let targetIdx = content.indexOf(searchStr);
  if (targetIdx === -1) targetIdx = content.indexOf(`slug: '${target}'`);
  
  if (targetIdx !== -1) {
    // Find the start of the object: backward search for `  {\n` or `  {\r\n` where it's the main object
    // A safe way is to find the previous `  {` that is NOT preceded by spaces like `        {` (which are lessons).
    // Let's search backward character by character. We look for `{` at column 2 (i.e. preceded by `\n  `).
    let startIdx = -1;
    for (let i = targetIdx; i >= 0; i--) {
      if (content.substr(i, 4) === '\n  {') {
        startIdx = i;
        break;
      }
    }
    
    // Find the end of the object: we need to balance braces starting from startIdx
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
          // crude string handling
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
        // Remove from startIdx to endIdx + 1, plus optional comma
        let removeEnd = endIdx + 1;
        if (content[removeEnd] === ',') removeEnd++;
        // also remove following whitespace/newlines up to the next thing
        while (content[removeEnd] === ' ' || content[removeEnd] === '\r' || content[removeEnd] === '\n') {
          removeEnd++;
        }
        
        content = content.slice(0, startIdx + 1) + content.slice(removeEnd);
        console.log(`Removed ${target}`);
      }
    }
  }
});

fs.writeFileSync(tsFile, content, 'utf8');
console.log('Done');
