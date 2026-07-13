const fs = require('fs');
const path = require('path');

const blogPostsPath = path.resolve(process.cwd(), 'src/data/blog-posts.ts');
let content = fs.readFileSync(blogPostsPath, 'utf8');

let totalApplied = 0;

for (let i = 1; i <= 6; i++) {
  const patchFile = path.resolve(process.cwd(), `scratch/patch-agent${i}.json`);
  if (!fs.existsSync(patchFile)) continue;
  
  const patchData = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
  console.log(`Processing patch-agent${i}.json with ${Object.keys(patchData).length} slugs`);

  const parts = content.split(/(?=\s*{\s*"slug":\s*")/g);

  const updatedParts = parts.map(part => {
    const slugMatch = part.match(/"slug":\s*"([^"]+)"/);
    if (!slugMatch) return part;
    const slug = slugMatch[1];
    
    if (!patchData[slug]) return part;

    const translations = patchData[slug];
    
    let newPart = part;
    for (const [loc, data] of Object.entries(translations)) {
      if (newPart.includes(`"${loc}": {`)) continue; // already has it
      
      const locString = `    "${loc}": {
      "title": ${JSON.stringify(data.title || "")},
      "description": ${JSON.stringify(data.description || "")},
      "content": ${JSON.stringify(data.content || "")}
    },
`;

      newPart = newPart.replace(/(\s*"en":\s*\{)/, `\n${locString}$1`);
      totalApplied++;
    }
    
    return newPart;
  });

  content = updatedParts.join('');
}

fs.writeFileSync(blogPostsPath, content);
console.log(`Successfully applied ${totalApplied} individual locale translations to blog-posts.ts`);
