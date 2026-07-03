import { readFileSync, writeFileSync } from 'fs';

const template = readFileSync('scripts/translate-hebrew.ts', 'utf8');

const langs = [
  { code: 'el', name: 'Greek' },
  { code: 'ha', name: 'Hausa' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' }
];

langs.forEach(({ code, name }) => {
  const out = template
    .replace("const langCode = 'he';", `const langCode = '${code}';`)
    .replace("const langName = 'Hebrew';", `const langName = '${name}';`)
    .replaceAll('=== Starting Hebrew Translation Worker ===', `=== Starting ${name} Translation Worker ===`)
    .replaceAll('[Hebrew]', `[${name}]`)
    .replaceAll('=== Hebrew Translation Finished and Saved! ===', `=== ${name} Translation Finished and Saved! ===`)
    .replaceAll('Fatal error in Hebrew translation:', `Fatal error in ${name} translation:`);
  writeFileSync(`scripts/translate-${code}.ts`, out);
  console.log(`Created scripts/translate-${code}.ts`);
});
