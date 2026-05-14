const fs = require('fs');
const path = 'src/data/giants.ts';
const content = fs.readFileSync(path, 'utf8');

// Use a regex to find the start of the giants array
const startMarker = 'export const giantsData: Giant[] = [';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find giantsData start');
  process.exit(1);
}

// I'll rebuild the giantsData content by collecting unique giants by ID
// This is a bit complex via regex, so I'll try a simpler approach: 
// Find all giant objects, keep only unique ones by ID, and write them back.
// But the giant objects are multi-line.
// Let's try to just find the LAST instance of "];" and everything before it that is valid.

// Actually, I'll just restore the file to a known good state (up to 31) and then add 32-50 properly.
// Wait, I don't have the "known good state" easily.

// Let's use a smarter approach: split by "  {" and "  }," 
const header = content.substring(0, startIndex + startMarker.length);
const footer = '\n];\n';

// I'll find all giants. Each giant starts with "  {" and ends with "  }," or "  }"
// Wait, I'll use a more robust way: find all { id: ... } blocks.
// I'll use the ID as a key.

const giantBlocks = [];
const giantRegex = /\{\s+id: ['"]?(\d+)['"]?[\s\S]*?persona: [\s\S]*?\}/g;
let match;
const seenIds = new Set();
const uniqueBlocks = [];

while ((match = giantRegex.exec(content)) !== null) {
  let block = match[0];
  const id = match[1];
  if (!seenIds.has(id)) {
    seenIds.add(id);
    // Ensure ID is a string in the block
    block = block.replace(/id: ['"]?(\d+)['"]?/, `id: '${id}'`);
    uniqueBlocks.push(block);
  }
}

// Sort by ID
uniqueBlocks.sort((a, b) => {
  const idA = parseInt(a.match(/id: ['"]?(\d+)['"]?/)[1]);
  const idB = parseInt(b.match(/id: ['"]?(\d+)['"]?/)[1]);
  return idA - idB;
});

const newContent = header + '\n' + uniqueBlocks.join(',\n') + footer;
fs.writeFileSync(path, newContent, 'utf8');
console.log('Cleaned giants.ts. Total unique giants:', seenIds.size);
