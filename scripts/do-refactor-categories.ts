import fs from 'fs';
import path from 'path';

const mappingRules: Record<string, string> = {
  // leadership
  "napoleon-bonaparte": "leadership",
  "king-sejong": "leadership",
  "genghis-khan": "leadership",
  "alexander-the-great": "leadership",
  "julius-caesar": "leadership",
  "franklin-d-roosevelt": "leadership",
  "marcus-aurelius": "philosophy",
  "george-washington": "leadership",
  "yi-sun-shin": "leadership",
  "elizabeth-i": "leadership",
  "gwanggaeto-the-great": "leadership",
  "winston-churchill": "leadership",
  "qin-shi-huang": "leadership",
  "augustus": "leadership",
  "otto-von-bismarck": "leadership",
  "peter-the-great": "leadership",
  "catherine-the-great": "leadership",
  "simon-bolivar": "leadership",
  "ataturk": "leadership",
  "theodore-roosevelt": "leadership",
  "alexander-hamilton": "leadership",
  "john-f-kennedy": "leadership",
  "queen-victoria": "leadership",
  "thomas-jefferson": "leadership",
  "ahn-jung-geun": "leadership",
  "empress-wu-zetian": "leadership",
  "zhuge-liang": "leadership",
  "ashoka-the-great": "leadership",
  "king-jeongjo": "leadership",
  "oda-nobunaga": "leadership",
  "sun-yat-sen": "leadership",
  "tokugawa-ieyasu": "leadership",
  "toyotomi-hideyoshi": "leadership",
  "chulalongkorn": "leadership",
  "hannibal-barca": "leadership",
  "jayavarman-vii": "leadership",
  "mansa-musa": "leadership",
  "shaka-zulu": "leadership",
  "chandragupta-maurya": "leadership",
  "saladin": "leadership",
  "suleiman-the-magnificent": "leadership",
  "abraham-lincoln": "leadership",
  "joan-of-arc": "leadership",
  "kim-gu": "leadership",

  // science
  "thomas-edison": "science",
  "albert-einstein": "science",
  "marie-curie": "science",
  "nikola-tesla": "science",
  "alexander-fleming": "science",
  "johannes-kepler": "science",
  "al-khwarizmi": "science",
  "robert-oppenheimer": "science",
  "srinivasa-ramanujan": "science",
  "archimedes": "science",
  "copernicus": "science",
  "louis-pasteur": "science",
  "alexander-graham-bell": "science",
  "galileo-galilei": "science",
  "charles-darwin": "science",
  "louis-braille": "science",
  "isaac-newton": "science",
  "omar-khayyam": "science",
  "wright-brothers": "science",
  "johannes-gutenberg": "science",

  // philosophy
  "seneca": "philosophy",
  "confucius": "philosophy",
  "socrates": "philosophy",
  "lao-tzu": "philosophy",
  "aristotle": "philosophy",
  "plato": "philosophy",
  "buddha": "philosophy",
  "friedrich-nietzsche": "philosophy",
  "immanuel-kant": "philosophy",
  "rene-descartes": "philosophy",
  "jean-jacques-rousseau": "philosophy",
  "sigmund-freud": "philosophy",
  "carl-jung": "philosophy",
  "baruch-spinoza": "philosophy",
  "sun-tzu": "philosophy",
  "david-hume": "philosophy",
  "john-locke": "philosophy",
  "soren-kierkegaard": "philosophy",
  "arthur-schopenhauer": "philosophy",
  "benjamin-franklin": "philosophy",
  "francis-bacon": "philosophy",
  "jeong-yak-yong": "philosophy",
  "mencius": "philosophy",
  "zhuangzi": "philosophy",
  "miyamoto-musashi": "philosophy",
  "swami-vivekananda": "philosophy",
  "adam-smith": "philosophy",
  "machiavelli": "philosophy",
  "voltaire": "philosophy",
  "henry-david-thoreau": "philosophy",
  "ralph-waldo-emerson": "philosophy",
  "simone-de-beauvoir": "philosophy",
  "hannah-arendt": "philosophy",

  // arts
  "walt-disney": "arts",
  "frida-kahlo": "arts",
  "beethoven": "arts",
  "leonardo-da-vinci": "arts",
  "mozart": "arts",
  "william-shakespeare": "arts",
  "vincent-van-gogh": "arts",
  "michelangelo": "arts",
  "claude-monet": "arts",
  "fyodor-dostoevsky": "arts",
  "victor-hugo": "arts",
  "anton-chekhov": "arts",
  "frederic-chopin": "arts",
  "katsushika-hokusai": "arts",
  "agatha-christie": "arts",
  "mark-twain": "arts",
  "goethe": "arts",
  "mary-shelley": "arts",
  "li-bai": "arts",
  "dante-alighieri": "arts",
  "edgar-allan-poe": "arts",
  "ernest-hemingway": "arts",
  "walt-whitman": "arts",
  "sima-qian": "arts",

  // society
  "viktor-frankl": "society",
  "helen-keller": "society",
  "mahatma-gandhi": "society",
  "martin-luther-king": "society",
  "frederick-douglass": "society",
  "harriet-tubman": "society",
  "oskar-schindler": "society",
  "florence-nightingale": "society",
  "susan-b-anthony": "society",
  "br-ambedkar": "society",
  "anne-frank": "society",
  "rosa-parks": "society",
  "yu-gwan-sun": "society",
  "desmond-tutu": "society",
  "elie-wiesel": "society",
  "harriet-beecher-stowe": "society",
  "terry-fox": "society",

  // business
  "henry-ford": "business",
  "john-d-rockefeller": "business",
  "andrew-carnegie": "business",
  "jp-morgan": "business",
  "ibn-battuta": "business",
  "amelia-earhart": "business",
};

const giantsPath = path.resolve(process.cwd(), 'src/data/giants.ts');
let content = fs.readFileSync(giantsPath, 'utf8');

// 1. Refactor interface Giant category type
content = content.replace(
  /category:\s*'성취'\s*\|\s*'역경'\s*\|\s*'지혜'\s*\|\s*'창의';/,
  `category: 'leadership' | 'science' | 'philosophy' | 'arts' | 'society' | 'business';`
);

// 2. Refactor category in giantsData
// We will parse the content, extract the giantsData objects and replace the category fields.
// Since we want to preserve exact code comments and formatting, let's use string replacement for each giant's category line.
// We can locate each giant block by looking for "slug: '...'" and then replace the category line in that block.
const giantBlocks = content.split('{\n    id:');
if (giantBlocks.length <= 1) {
  console.error("Failed to parse giantsData structure!");
  process.exit(1);
}

const header = giantBlocks[0];
const rest = giantBlocks.slice(1);

const processed = rest.map(block => {
  const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
  if (!slugMatch) return block;
  const slug = slugMatch[1];
  const newCat = mappingRules[slug];
  if (!newCat) {
    console.error(`Missing mapping rule for slug: ${slug}`);
    return block;
  }
  // Replace the category line: category: "..." or category: '...'
  return block.replace(/category:\s*['"]([^'"]+)['"],/, `category: "${newCat}",`);
});

const newContent = [header, ...processed].join('{\n    id:');
fs.writeFileSync(giantsPath, newContent, 'utf8');
console.log("giants.ts category refactoring complete!");
