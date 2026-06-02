const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const koreanRegex = /[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f]/;

console.log('--- STARTING SRC KOREAN TEXT SCAN ---');

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (koreanRegex.test(line)) {
          // Print the file name and the line
          const relPath = path.relative(srcDir, filePath);
          console.log(`[KOREAN TEXT] File: src/${relPath} | Line ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  });
}

walk(srcDir);
console.log('--- SRC SCAN COMPLETE ---');
