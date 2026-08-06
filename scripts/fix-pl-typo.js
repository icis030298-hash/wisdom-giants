const fs = require('fs');
const path = require('path');

// Fix in scratch/translations/pl_pilot_5.json
const pilotPath = path.join(__dirname, '..', 'scratch', 'translations', 'pl_pilot_5.json');
if (fs.existsSync(pilotPath)) {
  let content = fs.readFileSync(pilotPath, 'utf8');
  content = content.replace(/samoodekrycia/g, 'samoodkrycia');
  fs.writeFileSync(pilotPath, content, 'utf8');
  console.log('[FIXED] Typo samoodekrycia -> samoodkrycia in pl_pilot_5.json');
}

// Fix in src/data/blog-posts.ts
const blogPath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
if (fs.existsSync(blogPath)) {
  let content = fs.readFileSync(blogPath, 'utf8');
  content = content.replace(/samoodekrycia/g, 'samoodkrycia');
  fs.writeFileSync(blogPath, content, 'utf8');
  console.log('[FIXED] Typo samoodekrycia -> samoodkrycia in src/data/blog-posts.ts');
}
