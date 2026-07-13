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
  const [_, title, desc, cont] = enMatch;

  req.forEach(l => {
    if (!p.includes('"' + l + '": {')) {
      missing.push({ slug, loc: l, en: { title, description: desc, content: cont } });
    }
  });
});

console.log(`Total missing to re-split: ${missing.length}`);

// Split into 6 chunks
const numAgents = 6;
const chunkSize = Math.ceil(missing.length / numAgents);
for (let i = 0; i < numAgents; i++) {
  const chunk = missing.slice(i * chunkSize, (i + 1) * chunkSize);
  fs.writeFileSync(`scratch/missing-blogs-${i + 1}.json`, JSON.stringify(chunk, null, 2));
  // Clear the old patch files so they don't carry over old data
  fs.writeFileSync(`scratch/patch-agent${i + 1}.json`, JSON.stringify({}, null, 2));
  console.log(`Wrote scratch/missing-blogs-${i + 1}.json with ${chunk.length} items`);
}
