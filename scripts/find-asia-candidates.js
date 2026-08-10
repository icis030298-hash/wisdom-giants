const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const existingSlugs = new Set();
const slugMatches = giantsContent.match(/slug:\s*["']([^"']+)["']/g) || [];
slugMatches.forEach(m => existingSlugs.add(m.replace(/slug:\s*["']([^"']+)["']/, '$1')));

const dir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

console.log('--- SOUTHEAST ASIA CANDIDATES ---');
files.forEach(f => {
  const slug = f.replace('.json', '');
  if (existingSlugs.has(slug)) return;
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  if (content.includes('태국') || content.includes('캄보디아') || content.includes('미얀마') || content.includes('인도네시아') || content.includes('자바') || content.includes('아유타야')) {
    console.log('SE Asia:', slug);
  }
});

console.log('\n--- SOUTH ASIA CANDIDATES ---');
files.forEach(f => {
  const slug = f.replace('.json', '');
  if (existingSlugs.has(slug)) return;
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  if (content.includes('굽타') || content.includes('마우리아') || content.includes('타골') || content.includes('칼리다사') || content.includes('찬드라구프타') || content.includes('아소카')) {
    console.log('South Asia:', slug);
  }
});
