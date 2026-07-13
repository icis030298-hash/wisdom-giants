const fs=require('fs');

const content = fs.readFileSync('src/data/blog-posts.ts', 'utf8');
const posts = content.split('"slug": "');
posts.shift();
const req = ['sv', 'cs', 'th', 'hi', 'ru', 'ar'];
let missing = [];

posts.forEach(p => {
  const slugMatch = p.match(/^([^"]+)"/);
  if (!slugMatch) return;
  const slug = slugMatch[1];
  
  const enMatch = p.match(/"en":\s*\{\s*"title":\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"description":\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"content":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
  if (!enMatch) return;

  req.forEach(l => {
    if (!p.includes('"' + l + '": {')) {
      missing.push({ slug, loc: l });
    }
  });
});

console.log(`Total missing blocks right now: ${missing.length}`);
