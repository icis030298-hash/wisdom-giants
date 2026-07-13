const fs = require('fs');

// Extract blogPosts array from the TS file manually
const raw = fs.readFileSync('src/data/blog-posts.ts', 'utf8');
// We'll check for translations by locale directly by scanning the text
const locales = ['ko', 'en', 'ja', 'de', 'es', 'fr', 'it', 'pt', 'ar', 'zh', 'nl', 'ru', 'hi', 'id', 'pl', 'sw', 'th', 'tr', 'uk', 'vi', 'el', 'fa', 'he', 'ha'];

// Count occurrences of each locale key in the file
// A locale translation block looks like: "de": {
locales.forEach(locale => {
  const pattern = new RegExp(`"${locale}"\\s*:\\s*\\{`, 'g');
  const matches = raw.match(pattern);
  const count = matches ? matches.length : 0;
  console.log(`${locale}: ${count} translation blocks`);
});
