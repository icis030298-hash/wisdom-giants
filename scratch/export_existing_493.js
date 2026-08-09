const fs = require('fs');

const giantsTs = fs.readFileSync('src/data/giants.ts', 'utf8');
const enMessages = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

// Extract giants from giantsData array
const giantBlocks = giantsTs.split(/\{\s*id:\s*"/).slice(1);

const existingGiants = giantBlocks.map((block, i) => {
  const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
  const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
  const categoryMatch = block.match(/category:\s*["']([^"']+)["']/);
  const eraMatch = block.match(/era:\s*["']([^"']+)["']/);

  const slug = slugMatch ? slugMatch[1] : '';
  const nameKo = nameMatch ? nameMatch[1] : '';
  const category = categoryMatch ? categoryMatch[1] : '';
  const era = eraMatch ? eraMatch[1] : '';

  const enGiant = enMessages.Giants?.[slug];
  const nameEn = enGiant?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    no: i + 1,
    slug,
    nameKo,
    nameEn,
    category,
    era
  };
});

console.log(`Parsed ${existingGiants.length} existing giants.`);

fs.writeFileSync('scratch/existing_493_roster.json', JSON.stringify(existingGiants, null, 2));

// Generate markdown table for current giants
let md = `# Current Roster of 493 Historical Giants (현재 위인의 전당 493인 명단)\n\n`;
md += `| No. | Slug | 한국어 이름 | English Name | Category | Era (시대) |\n`;
md += `| :---: | :--- | :--- | :--- | :--- | :--- |\n`;

existingGiants.forEach(g => {
  md += `| ${g.no} | \`${g.slug}\` | ${g.nameKo} | ${g.nameEn} | ${g.category} | ${g.era} |\n`;
});

fs.writeFileSync('scratch/existing_493_roster.md', md);
console.log('Saved scratch/existing_493_roster.md');
