const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/alternates:\s*buildSEOAlternates\([^)]+\),\s*;/g, match => {
    return match.replace(/,;$/, ',') + '\n  };';
  });
  
  if (file.includes('consult/page.tsx')) {
    content = content.replace(/alternates:\s*\{[^}]+\}/, `alternates: buildSEOAlternates('/consult', locale)`);
  }
  
  fs.writeFileSync(file, content);
}

const files = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/debate/page.tsx',
  'src/app/[locale]/giant/[slug]/page.tsx',
  'src/app/[locale]/consult/page.tsx'
];

files.forEach(fixFile);
console.log('Fixed syntax errors.');
