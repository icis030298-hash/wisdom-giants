const fs = require('fs');
const path = require('path');

const filePaths = [
  'src/app/[locale]/about/layout.tsx',
  'src/app/[locale]/blog/[slug]/page.tsx',
  'src/app/[locale]/blog/page.tsx',
  'src/app/[locale]/debate/page.tsx',
  'src/app/[locale]/giant/[slug]/page.tsx',
];

filePaths.forEach(fp => {
  const fullPath = path.join(process.cwd(), fp);
  if (!fs.existsSync(fullPath)) return;
  let code = fs.readFileSync(fullPath, 'utf-8');

  // Add import if not exists
  if (!code.includes("import { buildHreflang }")) {
    code = `import { buildHreflang } from '@/lib/locales';\n` + code;
  }

  // Remove LOCALES definition
  code = code.replace(/const LOCALES = \[.*?\] as const;?\n/s, '');
  code = code.replace(/const LOCALES = \[.*?\] as const\n/s, '');

  // Replace hreflangLanguages building logic
  const replaceRegex = /(?:\/\/[^\n]*\n)*\s*const hreflangLanguages:\s*Record<string,\s*string>\s*=\s*\{[\s\S]*?\};\n\s*for\s*\([^)]+\)\s*\{[\s\S]*?\}/g;
  
  if (code.match(replaceRegex)) {
    code = code.replace(replaceRegex, (match) => {
      // Extract the path from the x-default string
      const pathMatch = match.match(/`\$\{BASE_URL\}\/en([^`]+)`/);
      let p = '';
      if (pathMatch) p = pathMatch[1];
      else {
          // If the path is dynamic, like /blog/${slug}
          const dynamicMatch = match.match(/`\$\{BASE_URL\}\/en(\/[^`]+)`/);
          if(dynamicMatch) p = dynamicMatch[1];
      }
      return `const hreflangLanguages = buildHreflang(BASE_URL, \`${p}\`);`;
    });
    fs.writeFileSync(fullPath, code);
    console.log('Fixed', fp);
  } else {
    console.log('Could not match logic in', fp);
  }
});
