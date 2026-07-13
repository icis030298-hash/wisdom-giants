const fs = require('fs');
const glob = require('glob');
const path = require('path');

const baseDir = 'C:\\Users\\natey\\Desktop\\wisdom-giants\\src\\app';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.includes('alternates: buildSEOAlternates(')) {
    // Fix missing closing brace for generateMetadata
    if (content.match(/alternates:\s*buildSEOAlternates\([^)]+\),\s*(?:\r?\n)+\s*export/)) {
      content = content.replace(/(alternates:\s*buildSEOAlternates\([^)]+\),)(\s*(?:\r?\n)+\s*export)/g, '$1\n  };\n}\n$2');
      changed = true;
    } else if (content.match(/alternates:\s*buildSEOAlternates\([^)]+\),\s*(?:\r?\n)+\s*function/)) {
      content = content.replace(/(alternates:\s*buildSEOAlternates\([^)]+\),)(\s*(?:\r?\n)+\s*function)/g, '$1\n  };\n}\n$2');
      changed = true;
    } else if (content.match(/alternates:\s*buildSEOAlternates\([^)]+\),\s*(?:\r?\n)+\s*const/)) {
      content = content.replace(/(alternates:\s*buildSEOAlternates\([^)]+\),)(\s*(?:\r?\n)+\s*const)/g, '$1\n  };\n}\n$2');
      changed = true;
    }
  }

  // Fix consult mangled alternates
  if (filePath.includes('consult\\page.tsx') || filePath.includes('consult/page.tsx')) {
    content = content.replace(/alternates:\s*buildSEOAlternates\('\/consult', locale\)\/consult`\s*}\s*}\s*}/g, 
    "alternates: buildSEOAlternates('/consult', locale)\n  }\n}");
    changed = true;
  }
  
  // Fix the page.tsx mangled syntax
  if (content.match(/alternates:\s*buildSEOAlternates\([^)]+\),\s*(?:\r?\n)+\s*const colorMap/)) {
      content = content.replace(/(alternates:\s*buildSEOAlternates\([^)]+\),)(\s*(?:\r?\n)+\s*const colorMap)/g, '$1\n  };\n}\n$2');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}

const files = [
  path.join(baseDir, '[locale]/about/layout.tsx'),
  path.join(baseDir, '[locale]/blog/[slug]/page.tsx'),
  path.join(baseDir, '[locale]/blog/page.tsx'),
  path.join(baseDir, '[locale]/consult/page.tsx'),
  path.join(baseDir, '[locale]/debate/page.tsx'),
  path.join(baseDir, '[locale]/giant/[slug]/page.tsx'),
  path.join(baseDir, '[locale]/layout.tsx'),
  path.join(baseDir, '[locale]/page.tsx')
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    fixFile(f);
  }
});
