const fs = require('fs');
const path = require('path');

const GIANTS_PATH = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const content = fs.readFileSync(GIANTS_PATH, 'utf8');

const targetSlugs = [
  'steve-jobs', 'thomas-edison', 'john-d-rockefeller', 'henry-ford', 'andrew-carnegie',
  'walt-disney', 'sun-tzu', 'alexander-the-great', 'george-washington', 'king-sejong',
  'julius-caesar', 'cao-cao', 'elizabeth-i', 'empress-wu-zetian', 'genghis-khan',
  'robert-oppenheimer', 'ernest-hemingway', 'vincent-van-gogh', 'abraham-lincoln',
  'marie-curie', 'helen-keller', 'mahatma-gandhi', 'leonardo-da-vinci', 'benjamin-franklin',
  'mark-twain', 'richard-feynman', 'edgar-allan-poe'
];

targetSlugs.forEach(slug => {
  const exists = content.includes(`slug: "${slug}"`) || content.includes(`slug: '${slug}'`);
  console.log(`Slug: ${slug} | Exists: ${exists}`);
});
