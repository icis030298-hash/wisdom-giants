const fs = require('fs');

function injectRobots(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('robots: { index: isLocaleIndexed(locale)')) {
    content = content.replace(/(\s*alternates:\s*buildSEOAlternates\([^)]+\),)/g, '\n    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },$1');
    fs.writeFileSync(filePath, content);
    console.log(`Injected robots into ${filePath}`);
  }
}

injectRobots('C:\\Users\\natey\\Desktop\\wisdom-giants\\src\\app\\[locale]\\giant\\[slug]\\page.tsx');
injectRobots('C:\\Users\\natey\\Desktop\\wisdom-giants\\src\\app\\[locale]\\blog\\[slug]\\page.tsx');
