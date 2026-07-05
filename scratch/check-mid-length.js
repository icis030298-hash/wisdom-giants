const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf-8'));

const list = Object.entries(fn)
  .filter(([k, v]) => v.epic_ko && v.epic_ko.length >= 1000 && v.epic_ko.length <= 1200)
  .map(([k, v]) => ({ slug: k, len: v.epic_ko.length }))
  .sort((a, b) => a.len - b.len);

console.log(`총 ${list.length}명 (1000~1200자)`);
list.forEach(({ slug, len }) => {
  console.log(`  ${len}자\t${slug}`);
});
