const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\natey\\.gemini\\antigravity\\brain\\3fcbb9bb-a7eb-4334-9502-8fef36add9b0';
const destDir = path.resolve('public/images/giants');

const mapping = {
  "giant_sonni_ali": "sonni-ali.jpg",
  "giant_sol_plaatje": "sol-plaatje.jpg",
  "giant_susenyos_i": "susenyos-i.jpg",
  "giant_amanirenas": "amanirenas.jpg",
  "giant_ahmadu_bamba": "ahmadu-bamba.jpg",
  "giant_akhenaten": "akhenaten.jpg",
  "giant_ahmad_baba": "ahmad-baba-al-massufi.jpg"
};

function copyLatest() {
  const files = fs.readdirSync(brainDir);
  
  for (const [prefix, targetName] of Object.entries(mapping)) {
    // Find all files matching prefix + timestamp + .png
    const matchingFiles = files.filter(f => f.startsWith(prefix) && f.endsWith('.png'));
    if (matchingFiles.length === 0) {
      console.warn(`No file found in brainDir for prefix: ${prefix}`);
      continue;
    }
    
    // Sort by timestamp (the part of filename after prefix) to get the latest
    matchingFiles.sort((a, b) => {
      const timeA = parseInt(a.replace(prefix + '_', '').replace('.png', '')) || 0;
      const timeB = parseInt(b.replace(prefix + '_', '').replace('.png', '')) || 0;
      return timeB - timeA; // Descending order
    });
    
    const latestFile = matchingFiles[0];
    const sourcePath = path.join(brainDir, latestFile);
    const destPath = path.join(destDir, targetName);
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied ${latestFile} to ${targetName} (${fs.statSync(destPath).size} bytes)`);
  }
}

copyLatest();
