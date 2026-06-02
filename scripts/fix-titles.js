const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
let content = fs.readFileSync(tsFile, 'utf8');

// Match objects that only have title and content and nothing else at the top level (they don't have id: )
// We look for `{` optionally with whitespace, then `title:`, then string, then `content:`, then string, then `},`
const regex = /\{\s*title:\s*["'][^"']*["'],\s*content:\s*["'][^"']*["']\s*\},?\s*/g;

let count = 0;
content = content.replace(regex, (match) => {
  count++;
  return '';
});

// There is one tricky one at line 24 which might not have a comma? No, line 28 has `      },`. 
// Wait, the strings might have escaped quotes or newlines.
// Let's use a more robust approach: Find any block that looks like:
// {
//   title: "...",
//   content: "..."
// },
// that is NOT inside `lessons: [`

// Since the file might still be slightly messy, let's just do a simpler search. 
// We know that top level Giant objects MUST have `id:`. If an object starts with `title:`, it's bad.
const regex2 = /\{\s*title:\s*"(?:[^"\\]|\\.)*",\s*content:\s*"(?:[^"\\]|\\.)*"\s*\},?\s*/g;
content = content.replace(regex2, (match) => {
  count++;
  return '';
});

fs.writeFileSync(tsFile, content, 'utf8');
console.log(`Removed ${count} orphaned title objects.`);
