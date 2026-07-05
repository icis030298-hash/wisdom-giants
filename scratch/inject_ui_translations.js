const fs = require('fs');
const path = require('path');

const pageTsxPath = path.resolve('src/app/[locale]/blog/[slug]/page.tsx');
const jsonPath = path.resolve('scratch/ui-translations-all.json');

if (!fs.existsSync(jsonPath)) {
  console.log("JSON not found yet. Exiting.");
  process.exit(1);
}

const pageContent = fs.readFileSync(pageTsxPath, 'utf8');
const translationsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Format to JS object string
let newObjectString = 'const uiTranslations: Record<string, Record<string, string>> = {\n';
for (const locale of Object.keys(translationsData)) {
  newObjectString += `  ${locale}: {\n`;
  const entries = Object.entries(translationsData[locale]);
  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i];
    // stringify value to escape quotes and newlines
    newObjectString += `    ${key}: ${JSON.stringify(val)}`;
    if (i < entries.length - 1) {
      newObjectString += ',';
    }
    newObjectString += '\n';
  }
  newObjectString += `  },\n`;
}
// remove last comma
newObjectString = newObjectString.slice(0, -2) + '\n}';

// Find start and end of uiTranslations block in page.tsx
const startMatch = pageContent.match(/const uiTranslations: Record<string, Record<string, string>> = \{/);
if (!startMatch) {
  console.log("Could not find start of uiTranslations");
  process.exit(1);
}
const startIndex = startMatch.index;
// find the closing brace of uiTranslations. 
// We know it ends before `const categoryNames`
const endMatch = pageContent.match(/const categoryNames: Record<string, Record<string, string>> = \{/);
if (!endMatch) {
  console.log("Could not find end of uiTranslations (categoryNames)");
  process.exit(1);
}
const endIndex = endMatch.index;

// Replace everything between startIndex and endIndex with newObjectString + \n\n
const newPageContent = pageContent.substring(0, startIndex) + newObjectString + '\n\n' + pageContent.substring(endIndex);

fs.writeFileSync(pageTsxPath, newPageContent, 'utf8');
console.log("Successfully injected uiTranslations!");
