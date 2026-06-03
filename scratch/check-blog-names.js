const fs = require('fs');
const path = require('path');

// Read files
const blogPosts = require('../src/data/blog-posts-progress.json');
const giantsFile = path.join(__dirname, '../src/data/giants.ts');
let giantsContent = fs.readFileSync(giantsFile, 'utf8');
let jsContent = giantsContent
  .replace(/export interface \w+ \{[^}]*\}/g, '')
  .replace(/export interface Giant \{[^}]*\}/g, '')
  .replace(/export const giantsData:\s*Giant\[\]\s*=/, 'const giantsData =')
  .replace(/export\s+/g, '') + '\nmodule.exports = { giantsData };';
fs.writeFileSync(path.join(__dirname, 'temp_giants.js'), jsContent, 'utf8');
const { giantsData } = require('./temp_giants.js');
fs.unlinkSync(path.join(__dirname, 'temp_giants.js'));

const locales = ['ko', 'en', 'ja'];
locales.forEach(locale => {
  const jsonPath = path.join(__dirname, `../messages/${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const giantsTranslations = messages.Giants || {};

  console.log(`\n--- LOCALE: ${locale} ---`);
  
  Object.values(blogPosts).forEach(post => {
    const giant = giantsData.filter(Boolean).find(g => g && g.slug === post.giantSlug);
    const key = `${post.giantSlug}.name`;
    
    // Translation lookup simulation
    let localizedName = fallback = giant ? giant.name : post.giantSlug;
    
    const parts = key.split('.'); // ['albert-einstein', 'name']
    let current = giantsTranslations;
    for (const part of parts) {
      if (current && current[part]) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }
    
    if (current && typeof current === 'string') {
      localizedName = current;
    }
    
    console.log(`Slug: ${post.slug} | giantSlug: ${post.giantSlug} | Localized: ${localizedName} (Fallback: ${fallback})`);
  });
});
