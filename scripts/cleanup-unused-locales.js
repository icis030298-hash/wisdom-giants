const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve('scratch/translations');
const targetDir = path.resolve('scratch/translations/unused-locales');

const unusedLocales = ['bn', 'sv', 'cs', 'ro', 'hu'];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("=== Moving Unused Locales Data to scratch/translations/unused-locales/ ===");

try {
  const files = fs.readdirSync(sourceDir);
  let moveCount = 0;

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) continue; // Skip directories (like checkpoints, unused-locales)
    
    // Check if filename starts with 'final-XX.json' or 'XX-chunk-' where XX is in unusedLocales
    let shouldMove = false;
    for (const locale of unusedLocales) {
      if (file === `final-${locale}.json` || file.startsWith(`${locale}-chunk-`)) {
        shouldMove = true;
        break;
      }
    }

    if (shouldMove) {
      const destPath = path.join(targetDir, file);
      fs.renameSync(filePath, destPath);
      moveCount++;
    }
  }

  console.log(`Successfully moved ${moveCount} files to unused-locales directory.`);
} catch (err) {
  console.error("Error moving unused locales files:", err.message);
}
