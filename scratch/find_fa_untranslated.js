const fs = require('fs');

try {
  let content = fs.readFileSync('C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/blog-posts.ts', 'utf8');

  // We only want to find which slugs have untranslated Korean text in their `fa` content.
  // We can just use a simple regex approach line by line to avoid parsing 64MB of TS code.
  
  const lines = content.split('\n');
  let currentSlug = null;
  let inFaBlock = false;
  let faContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for slug
    const slugMatch = line.match(/"slug"\s*:\s*"([^"]+)"/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
    }

    // Check for "fa": {
    if (line.match(/"fa"\s*:\s*\{/)) {
      inFaBlock = true;
      faContent = '';
      continue;
    }

    // Check for end of fa block (assuming 6 spaces indent for closing brace of language block)
    if (inFaBlock && line.match(/^      \},?/)) {
      inFaBlock = false;
      // Check if faContent has Korean characters
      if (/[가-힣]/.test(faContent)) {
        console.log(`Needs translation (fa): ${currentSlug}`);
      }
    }

    if (inFaBlock) {
      faContent += line + '\n';
    }
  }

} catch (e) {
  console.error(e);
}
