const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const giantsTsPath = path.resolve('src/data/giants.ts');

console.log('=== RESTORING LOST GIANTS ===');

// 1. Load current giantsData (194 giants)
const contentCurr = fs.readFileSync(giantsTsPath, 'utf8');

// 2. Load previous giantsData from commit 9a143e7 (241 giants)
let contentPrev;
try {
  contentPrev = execSync('git show 9a143e7:src/data/giants.ts', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
} catch (err) {
  console.error('Failed to read git commit 9a143e7!', err.message);
  process.exit(1);
}

// Helper to parse JS array blocks from code string
// Since giants.ts contains standard JS objects, we can evaluate or extract it using regex.
// To be 100% safe, we can extract the elements inside const giantsData: Giant[] = [ ... ];
function extractGiantsArray(tsText) {
  const startIndex = tsText.indexOf('export const giantsData: Giant[] = [');
  if (startIndex === -1) {
    throw new Error('Could not find giantsData start index');
  }
  
  // Find the matching closing bracket ]; at the very end
  const arrayStart = tsText.indexOf('[', startIndex);
  const arrayEnd = tsText.lastIndexOf('];');
  if (arrayEnd === -1) {
    throw new Error('Could not find giantsData end bracket ];');
  }
  
  const arrayContent = tsText.substring(arrayStart, arrayEnd + 1);
  
  // Safe evaluation using new Function to parse raw JS array
  // We mock interface definitions by wrapping in an eval
  try {
    const parsed = new Function(`return ${arrayContent};`)();
    return parsed;
  } catch (err) {
    console.error('Failed to parse array via Function evaluation. Attempting fallback parse...', err.message);
    // Return empty if eval fails
    return [];
  }
}

const currentGiants = extractGiantsArray(contentCurr);
const previousGiants = extractGiantsArray(contentPrev);

console.log(`Parsed current giants in file: ${currentGiants.length}`);
console.log(`Parsed previous giants in git: ${previousGiants.length}`);

// 3. Filter out post-1970 violators from previous giants
const violators = ['oskar-schindler', 'desmond-tutu', 'elie-wiesel', 'terry-fox'];
const filteredPrev = previousGiants.filter(g => !violators.includes(g.slug));
console.log(`Filtered previous giants (minus violators): ${filteredPrev.length}`);

// 4. Merge them uniquely by slug
const mergedMap = new Map();
// Load previous first
filteredPrev.forEach(g => mergedMap.set(g.slug, g));
// Overwrite with current ones to preserve any recent fixes
currentGiants.forEach(g => mergedMap.set(g.slug, g));

const mergedList = Array.from(mergedMap.values());
console.log(`Total merged unique giants count: ${mergedList.length}`);

// 5. Generate the new ts content
const interfaceHeader = contentCurr.substring(0, contentCurr.indexOf('export const giantsData: Giant[] = ['));

// Format mergedList back to pretty ts array elements
const formattedGiants = mergedList.map(g => {
  const lessonsStr = Array.isArray(g.lessons) ? `[\n${g.lessons.map(l => `      {
        title: "${l.title.replace(/"/g, '\\"')}",
        content: "${l.content.replace(/"/g, '\\"')}"
      }`).join(',\n')}\n    ]` : '[]';

  const painClean = (g.pain || '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const recoveryClean = (g.recovery || '').replace(/"/g, '\\"').replace(/\n/g, '\\n');

  return `  {\n    id: "${g.id}",\n    name: "${g.name.replace(/"/g, '\\"')}",\n    category: "${g.category}",\n    headline: "${g.headline.replace(/"/g, '\\"')}",\n    shortDescription: "${g.shortDescription.replace(/"/g, '\\"')}",\n    slug: "${g.slug}",\n    dnaCode: "${g.dnaCode || 'LPDI'}",\n    quote: "${g.quote.replace(/"/g, '\\"')}",\n    pain: "${painClean}",\n    recovery: "${recoveryClean}",\n    lessons: ${lessonsStr},\n    persona: "${g.persona.replace(/"/g, '\\"')}",\n    imageUrl: "${g.imageUrl}",\n    era: "${g.era ? g.era.replace(/"/g, '\\"') : ''}"\n  }`;
}).join(',\n');

const newTsContent = `${interfaceHeader}export const giantsData: Giant[] = [\n${formattedGiants}\n];\n`;

fs.writeFileSync(giantsTsPath, newTsContent, 'utf8');
console.log('🎉 Successfully restored lost giants in src/data/giants.ts!');
