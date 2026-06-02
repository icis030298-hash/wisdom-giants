const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

console.log('==========================================');
console.log('Starting Comprehensive Scan of src/ for Korean Pollution/Hardcoding...');
console.log('==========================================');

let totalFindings = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.js', '.jsx', '.json'].includes(ext)) {
        // Skip files we already checked/verified or are naturally in Korean (like blog-posts.ts, final-narratives.json)
        if (file === 'final-narratives.json' || file === 'blog-posts.ts' || file === 'blog-posts-progress.json') {
          return;
        }
        
        // Skip explicitly Korean routing pages/components if there are any
        // Usually Next.js app is under locale routing [locale], so pages under [locale] shouldn't contain hardcoded Korean!
        
        const relativePath = path.relative(SRC_DIR, fullPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (koreanRegex.test(content)) {
          console.log(`  [FOUND] Korean characters in: "src/${relativePath}"`);
          
          // Print lines containing Korean characters
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (koreanRegex.test(line)) {
              console.log(`          Line ${idx + 1}: ${line.trim()}`);
            }
          });
          totalFindings++;
        }
      }
    }
  });
}

walkDir(SRC_DIR);

console.log('==========================================');
console.log(`Scan Complete. Found ${totalFindings} files with Korean characters.`);
console.log('==========================================');
