const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain';

function findJsonFilesInScratch(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findJsonFilesInScratch(filePath, fileList);
    } else if (file.endsWith('.json') && filePath.includes('\\scratch\\')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allScratchJson = findJsonFilesInScratch(brainDir);
console.log(`Found ${allScratchJson.length} JSON files in scratch directories.`);

let successCount = 0;
for (const file of allScratchJson) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    if (data.slug && data.messages) {
      console.log(`Merging ${data.slug}...`);
      execSync(`node scripts/merge-giant-data.js "${file}"`, { stdio: 'inherit' });
      successCount++;
    }
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
}

console.log(`Successfully merged ${successCount} giants.`);
