const fs = require('fs');

const filesToUpdate = [
  { path: 'src/app/[locale]/about/layout.tsx', route: '/about' },
  { path: 'src/app/[locale]/blog/[slug]/page.tsx', route: '`/blog/${slug}`' },
  { path: 'src/app/[locale]/blog/page.tsx', route: '/blog' },
  { path: 'src/app/[locale]/consult/page.tsx', route: '/consult' },
  { path: 'src/app/[locale]/debate/page.tsx', route: '/debate' },
  { path: 'src/app/[locale]/giant/[slug]/page.tsx', route: '`/giant/${slug}`' },
  { path: 'src/app/[locale]/layout.tsx', route: '/' },
  { path: 'src/app/[locale]/page.tsx', route: '/' }
];

filesToUpdate.forEach(({path: file, route}) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Insert import if not present
  if (!content.includes('buildSEOAlternates')) {
    content = `import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";\n` + content;
  }

  // Find the alternates block in metadata / generateMetadata
  // It usually looks like: alternates: { ... },
  const alternatesRegex = /alternates:\s*\{[\s\S]*?canonical:[\s\S]*?languages:[\s\S]*?\{[\s\S]*?\}(?:\s*\}|)\s*\},?/m;
  const match = content.match(alternatesRegex);
  
  if (match) {
     const replacement = route.includes('slug') || route.includes('${')
       ? `alternates: buildSEOAlternates(${route}, locale),`
       : `alternates: buildSEOAlternates('${route}', locale),`;
     content = content.replace(alternatesRegex, replacement);
  }

  // Now, inject robots if not present inside the return statement of generateMetadata
  // The structure is: return { ... alternates: ... }
  // We need to add: robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
  if (content.includes('export async function generateMetadata') && !content.includes('robots: {')) {
     const returnRegex = /return\s*\{/m;
     content = content.replace(returnRegex, `return {\n    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },`);
  } else if (content.includes('export const metadata') && !content.includes('robots: {')) {
     // Wait, if it's export const metadata, we can't use `locale` dynamically!
     // So we can only set robots dynamically in generateMetadata.
     // Let's check if there are static metadata objects using alternates
  }

  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
