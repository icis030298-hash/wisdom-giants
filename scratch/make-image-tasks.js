const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '../src/data/giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const missingImages = [
  "napoleon-bonaparte", "franklin-d-roosevelt", "harriet-tubman", "carl-jung", "baruch-spinoza", "david-hume", "john-locke", "simone-de-beauvoir", "hannah-arendt", "soren-kierkegaard", "arthur-schopenhauer", "galileo-galilei", "charles-darwin", "fyodor-dostoevsky", "victor-hugo", "anton-chekhov", "frederic-chopin", "katsushika-hokusai", "alexander-hamilton", "francis-bacon", "johannes-kepler", "john-f-kennedy", "queen-victoria", "thomas-jefferson", "empress-wu-zetian", "jeong-yak-yong", "mencius", "li-bai", "oda-nobunaga", "sun-yat-sen", "tokugawa-ieyasu", "toyotomi-hideyoshi", "chulalongkorn", "hannibal-barca", "ibn-battuta", "jayavarman-vii", "mansa-musa", "shaka-zulu", "al-khwarizmi", "br-ambedkar", "chandragupta-maurya", "omar-khayyam", "robert-oppenheimer", "saladin", "srinivasa-ramanujan", "suleiman-the-magnificent", "swami-vivekananda", "wright-brothers", "adam-smith", "copernicus", "dante-alighieri", "johannes-gutenberg", "louis-pasteur", "machiavelli", "voltaire", "alexander-graham-bell", "amelia-earhart", "andrew-carnegie", "edgar-allan-poe", "ernest-hemingway", "henry-david-thoreau", "jp-morgan", "ralph-waldo-emerson", "susan-b-anthony", "walt-whitman"
];

const tasks = [];
for (const slug of missingImages) {
  // Extract category for this slug
  const regex = new RegExp(`slug:\\s*['"]${slug}['"][\\s\\S]*?category:\\s*['"]([^'"]+)['"]`);
  const match = regex.exec(giantsContent);
  const category = match ? match[1] : 'wisdom';
  tasks.push({ slug, category });
}

fs.writeFileSync(path.join(__dirname, 'image-tasks.json'), JSON.stringify(tasks, null, 2));
console.log(`Generated image-tasks.json for ${tasks.length} giants.`);
