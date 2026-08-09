const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/blog-posts.ts', 'utf8');

const regex = /"ja"\s*:\s*\{[\s\S]*?\}/g;
let match;
while ((match = regex.exec(content)) !== null) {
  if (match[0].includes('불안')) {
    console.log(`Found '불안' in 'ja' block at index ${match.index}`);
    console.log(match[0].substring(0, 150) + ' ... ' + match[0].substring(match[0].indexOf('불안') - 50, match[0].indexOf('불안') + 50));
  }
}
