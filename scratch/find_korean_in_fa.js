const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/blog-posts.ts', 'utf8');

const regex = /"fa"\s*:\s*\{([\s\S]*?)\}/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const block = match[1];
  // Match Korean characters
  if (/[가-힣]/.test(block)) {
    // extract slug by looking behind (simple heuristic)
    const beforeBlock = content.substring(Math.max(0, match.index - 500), match.index);
    const slugMatch = beforeBlock.match(/"slug"\s*:\s*"([^"]+)"/);
    console.log(`Found Korean in 'fa' for slug: ${slugMatch ? slugMatch[1] : 'unknown'}`);
    const koreanMatch = block.match(/.{0,20}[가-힣]+.{0,20}/g);
    if(koreanMatch) {
      console.log('Snippet:', koreanMatch[0]);
    }
  }
}
