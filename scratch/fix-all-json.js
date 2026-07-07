const fs = require('fs');
const path = require('path');

const baseDir = 'scratch/optimization/translations';

function getJsonFiles(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      files = files.concat(getJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      files.push(filePath);
    }
  });
  return files;
}

const jsonFiles = getJsonFiles(baseDir);
console.log(`Found ${jsonFiles.length} JSON files to inspect.`);

let unparsedCount = 0;

jsonFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Auto fix \' which is extremely common and always invalid in standard JSON strings
  if (content.includes("\\'")) {
    content = content.replace(/\\'/g, "'");
    fs.writeFileSync(file, content, 'utf8');
  }

  try {
    JSON.parse(content);
  } catch (err) {
    unparsedCount++;
    console.log(`=== Syntax Error in: ${file} ===`);
    console.log(err.message);
    
    // Auto-fix some comments or trailing notes if possible
    // For example, if there's a comment like `", (Wait...)` at the end of a line
    let lines = content.split('\n');
    let fixed = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('", (Wait')) {
        const idx = lines[i].indexOf('", (Wait');
        lines[i] = lines[i].substring(0, idx + 2) + ',';
        fixed = true;
      } else if (lines[i].includes('}, (Wait')) {
        const idx = lines[i].indexOf('}, (Wait');
        lines[i] = lines[i].substring(0, idx + 1);
        fixed = true;
      }
    }
    
    if (fixed) {
      const fixedContent = lines.join('\n');
      try {
        JSON.parse(fixedContent);
        fs.writeFileSync(file, fixedContent, 'utf8');
        console.log('-> Auto-fixed comment issue successfully!');
        unparsedCount--;
      } catch (err2) {
        // Try printing line context
        const match = err.message.match(/line (\d+)/);
        if (match) {
          const lineNum = parseInt(match[1]);
          console.log(`Context at line ${lineNum}:`);
          for (let k = Math.max(0, lineNum - 3); k < Math.min(lines.length, lineNum + 2); k++) {
            console.log(`${k+1}: ${lines[k]}`);
          }
        }
      }
    } else {
      const match = err.message.match(/line (\d+)/);
      if (match) {
        const lineNum = parseInt(match[1]);
        console.log(`Context at line ${lineNum}:`);
        for (let k = Math.max(0, lineNum - 3); k < Math.min(lines.length, lineNum + 2); k++) {
          console.log(`${k+1}: ${lines[k]}`);
        }
      }
    }
  }
});

console.log(`Remaining unparsed files: ${unparsedCount}`);
