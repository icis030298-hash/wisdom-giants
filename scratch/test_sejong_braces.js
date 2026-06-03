const cp = require('child_process');
const content = cp.execSync('git show b347d5d^:src/data/giants.ts').toString();

const startIdx = content.indexOf('name: "세종대왕"');
const blockStart = content.lastIndexOf('\n  {', startIdx);
console.log('blockStart index:', blockStart);

let braceCount = 0;
let inString = false;
let escape = false;

for (let i = blockStart + 1; i < content.length; i++) {
  let char = content[i];
  const prevBraceCount = braceCount;
  
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
        console.log(`braceCount reached 0 at index ${i}. Char: ${char}. Context: ${JSON.stringify(content.slice(i - 20, i + 20))}`);
        break;
      }
    }
  }
}
