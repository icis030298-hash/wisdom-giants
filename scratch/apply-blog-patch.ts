import fs from 'fs';
import path from 'path';

const blogPostsPath = path.resolve(process.cwd(), 'src/data/blog-posts.ts');
const patchPath = path.resolve(process.cwd(), 'scratch/blog-patch.json');

const content = fs.readFileSync(blogPostsPath, 'utf8');
const patchData = JSON.parse(fs.readFileSync(patchPath, 'utf8'));

// Split the file using the start of each object
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
    
    // Convert data to formatted string
    const locString = `    "${loc}": {
      "title": ${JSON.stringify(data.title || "")},
      "description": ${JSON.stringify(data.description || "")},
      "content": ${JSON.stringify(data.content || "")}
    },
`;

    // Inject right before "en": {
    newPart = newPart.replace(/(\s*"en":\s*\{)/, `\n${locString}$1`);
  }
  
  return newPart;
});

fs.writeFileSync(blogPostsPath, updatedParts.join(''));
console.log('Successfully applied translations from patch to blog-posts.ts');
