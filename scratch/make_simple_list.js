const fs = require('fs');
const path = require('path');

const rosterPath = path.join(__dirname, 'existing_493_roster.md');
const outputPath = path.join(__dirname, 'existing_493_simple_list.txt');

const content = fs.readFileSync(rosterPath, 'utf8');
const lines = content.split('\n').filter(l => l.startsWith('|') && !l.includes('No.') && !l.includes(':---'));

const simpleLines = lines.map(l => {
  const parts = l.split('|').map(s => s.trim());
  const num = parts[1];
  const slug = parts[2].replace(/`/g, '');
  const koName = parts[3];
  const enName = parts[4];
  const cat = parts[5];
  const era = parts[6];
  return `${num}. ${koName} (${enName}) | Slug: ${slug} | Category: ${cat} | Era: ${era}`;
});

fs.writeFileSync(outputPath, simpleLines.join('\n'), 'utf8');
console.log(`Successfully created ${outputPath} with ${simpleLines.length} items.`);
