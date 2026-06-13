const fs = require('fs');
const path = 'src/data/giants.ts';

let content = fs.readFileSync(path, 'utf8');
const before = content.length;

// Fix multiline strings: replace newlines inside double-quoted string values
// This regex finds a double-quote, then non-quote chars, then a newline, then non-quote chars, then a double-quote
// We replace the newline with a space
let fixCount = 0;
let maxPasses = 20;
let pass = 0;

while (pass < maxPasses) {
  const newContent = content.replace(/"([^"\n]*)\n([^"\n]*)"/g, (match, p1, p2) => {
    fixCount++;
    return '"' + p1.trim() + ' ' + p2.trim() + '"';
  });
  if (newContent === content) break;
  content = newContent;
  pass++;
}

if (fixCount > 0) {
  fs.writeFileSync(path, content, 'utf8');
  console.log(`Fixed ${fixCount} multiline string(s) in ${pass} pass(es)`);
} else {
  console.log('No multiline strings found - file is clean');
}
