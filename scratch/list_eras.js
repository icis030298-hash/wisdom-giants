const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '../src/data/giants.ts');
const content = fs.readFileSync(giantsPath, 'utf8');

const blocks = content.split(/id:\s*['"]/);
const giants = [];

blocks.slice(1).forEach(b => {
  const slugMatch = b.match(/slug:\s*['"]([^'"]+)['"]/);
  const nameMatch = b.match(/name:\s*['"]([^'"]+)['"]/);
  const eraMatch = b.match(/era:\s*['"]([^'"]+)['"]/);
  
  if (slugMatch) {
    giants.push({
      slug: slugMatch[1],
      name: nameMatch ? nameMatch[1] : '',
      era: eraMatch ? eraMatch[1] : '❌ 없음'
    });
  }
});

let output = `총 ${giants.length}명 위인 파싱 완료.\n`;
giants.forEach(g => {
  output += `${g.slug} | ${g.name} | ${g.era}\n`;
});

fs.writeFileSync(path.join(__dirname, 'eras_output.txt'), output, 'utf8');
console.log('Saved to eras_output.txt');
