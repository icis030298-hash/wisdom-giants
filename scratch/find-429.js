const fs = require('fs');
const path = require('path');

const rootDir = "C:\\Users\\user\\.gemini\\antigravity";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (file.endsWith('.log') || file.endsWith('.jsonl') || file.endsWith('.txt') || file.endsWith('.json')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

try {
  const allFiles = walk(rootDir);
  console.log(`Scanning ${allFiles.length} files...`);
  for (const f of allFiles) {
    try {
      const stat = fs.statSync(f);
      if (stat.size > 20000000) continue; // skip very large files
      const content = fs.readFileSync(f, 'utf8');
      if (content.includes('429') && (content.includes('generate_image') || content.includes('Quota') || content.includes('quota'))) {
        console.log(`MATCH in file: ${f}`);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('429') || line.includes('Quota') || line.includes('quota')) {
            console.log(`  Line ${idx+1}: ${line.slice(0, 300)}`);
          }
        });
      }
    } catch(err) {}
  }
} catch (e) {
  console.error(e);
}
