const fs = require('fs');
const path = require('path');

const giantsTsPath = path.resolve('src/data/giants.ts');
const content = fs.readFileSync(giantsTsPath, 'utf8');

// Parse giantsData
// Simple parser to extract id, name, slug, and imageUrl
const giantsRaw = content.substring(content.indexOf('export const giantsData'));
const blocks = giantsRaw.split(/{\s*id:\s*/).slice(1);

const giants = [];
blocks.forEach(block => {
  const idMatch = block.match(/^['"]?(\d+)['"]?/);
  const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
  const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
  const imageMatch = block.match(/imageUrl:\s*['"]([^'"]+)['"]/);
  
  if (idMatch && nameMatch && slugMatch) {
    giants.push({
      id: parseInt(idMatch[1]),
      name: nameMatch[1],
      slug: slugMatch[1],
      imageUrl: imageMatch ? imageMatch[1] : ""
    });
  }
});

// We can sort giants by ID
giants.sort((a, b) => a.id - b.id);

// Let's assume recent giants are those with higher IDs
// Let's look at giants with ID >= 200
const newGiants = giants.filter(g => g.id >= 200);

console.log(`New Giants count (ID >= 200): ${newGiants.length}`);

newGiants.forEach(g => {
  const relPath = g.imageUrl && g.imageUrl.startsWith('/') ? g.imageUrl.substring(1) : g.imageUrl;
  const absPath = g.imageUrl ? path.resolve('public', relPath) : '';
  const exists = absPath ? fs.existsSync(absPath) : false;
  
  // Also check if there's an alternative format (e.g. illust_[slug].png or [slug].png) in public/images/giants
  let alternative = 'None';
  const parentDir = path.resolve('public/images/giants');
  if (fs.existsSync(parentDir)) {
    const files = fs.readdirSync(parentDir);
    const altFile = files.find(f => f.includes(g.slug));
    if (altFile) {
      alternative = `/images/giants/${altFile}`;
    }
  }

  console.log(`- [ID ${g.id}] ${g.name} (${g.slug}):`);
  console.log(`  Expected Path: ${g.imageUrl} -> ${exists ? '✅ FOUND' : '❌ MISSING'}`);
  if (!exists && alternative !== 'None') {
    console.log(`  💡 Alternative found: ${alternative}`);
  }
});
