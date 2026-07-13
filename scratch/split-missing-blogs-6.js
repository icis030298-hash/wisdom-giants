const fs=require('fs');

// Read existing patch files to see what is already translated
let translatedMap = {};
for (let i = 1; i <= 3; i++) {
  const patchFile = `scratch/patch-agent${i}.json`;
  if (fs.existsSync(patchFile)) {
    const data = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
    for (const slug of Object.keys(data)) {
      if (!translatedMap[slug]) translatedMap[slug] = {};
      for (const loc of Object.keys(data[slug])) {
        translatedMap[slug][loc] = true;
      }
    }
  }
}

const content=fs.readFileSync('src/data/blog-posts.ts', 'utf8');
const posts=content.split('"slug": "');
posts.shift();
const req=['sv', 'cs', 'th', 'hi', 'ru', 'ar'];
let missing=[];

posts.forEach(p => {
  const slugMatch = p.match(/^([^"]+)"/);
  if (!slugMatch) return;
  const slug = slugMatch[1];
  
  const enMatch = p.match(/"en":\s*\{\s*"title":\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"description":\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"content":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
  if (!enMatch) return;
  const [_, title, desc, cont] = enMatch;

  req.forEach(l => {
    // If not in blog-posts.ts AND not in translatedMap
    if(!p.includes('"' + l + '": {') && !(translatedMap[slug] && translatedMap[slug][l])) {
      missing.push({ slug, loc: l, en: { title, description: desc, content: cont } });
    }
  });
});

console.log(`Total missing after previous work: ${missing.length}`);

// Split into 6 chunks
const numAgents = 6;
const chunkSize = Math.ceil(missing.length / numAgents);
for (let i = 0; i < numAgents; i++) {
  const chunk = missing.slice(i * chunkSize, (i + 1) * chunkSize);
  fs.writeFileSync(`scratch/missing-blogs-${i + 1}.json`, JSON.stringify(chunk, null, 2));
  console.log(`Wrote scratch/missing-blogs-${i + 1}.json with ${chunk.length} items`);
}
