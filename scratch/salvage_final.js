const fs = require('fs');

const standardizedMapping = {
  "steve-jobs": "steve-jobs",
  "napoleon-bonaparte": "napoleon-bonaparte",
  "napoleon": "napoleon-bonaparte",
  "king-sejong": "king-sejong",
  "elon-musk": "elon-musk",
  "genghis-khan": "genghis-khan",
  "alexander-the-great": "alexander-the-great",
  "walt-disney": "walt-disney",
  "thomas-edison": "thomas-edison",
  "julius-caesar": "julius-caesar",
  "henry-ford": "henry-ford",
  "frida-kahlo": "frida-kahlo",
  "viktor-frankl": "viktor-frankl",
  "oprah-winfrey": "oprah-winfrey",
  "jk-rowling": "jk-rowling",
  "jk": "jk-rowling",
  "nelson-mandela": "nelson-mandela",
  "mandela": "nelson-mandela",
  "helen-keller": "helen-keller",
  "beethoven": "beethoven",
  "stephen-hawking": "stephen-hawking",
  "malala-yousafzai": "malala-yousafzai",
  "malala": "malala-yousafzai",
  "franklin-d-roosevelt": "franklin-d-roosevelt",
  "fdr": "franklin-d-roosevelt",
  "marcus-aurelius": "marcus-aurelius",
  "seneca": "seneca",
  "confucius": "confucius",
  "socrates": "socrates",
  "lao-tzu": "lao-tzu",
  "giant-25": "lao-tzu",
  "aristotle": "aristotle",
  "giant-26": "aristotle",
  "plato": "plato",
  "giant-27": "plato",
  "mahatma-gandhi": "mahatma-gandhi",
  "giant-28": "mahatma-gandhi",
  "martin-luther-king": "martin-luther-king",
  "martin-louther-king": "martin-luther-king",
  "mlk": "martin-luther-king",
  "mother-teresa": "mother-teresa",
  "giant-30": "mother-teresa",
  "leonardo-da-vinci": "leonardo-da-vinci",
  "salvador-dali": "salvador-dali",
  "giant-32": "salvador-dali",
  "coco-chanel": "coco-chanel",
  "giant-33": "coco-chanel",
  "pablo-picasso": "pablo-picasso",
  "giant-34": "pablo-picasso",
  "mozart": "mozart",
  "giant-35": "mozart",
  "william-shakespeare": "william-shakespeare",
  "giant-36": "william-shakespeare",
  "albert-einstein": "albert-einstein",
  "einstein": "albert-einstein",
  "marie-curie": "marie-curie",
  "nikola-tesla": "nikola-tesla",
  "giant-39": "nikola-tesla",
  "vincent-van-gogh": "vincent-van-gogh",
  "giant-40": "vincent-van-gogh",
  "abraham-lincoln": "abraham-lincoln",
  "lincoln": "abraham-lincoln",
  "george-washington": "george-washington",
  "giant-42": "george-washington",
  "yi-sun-shin": "yi-sun-shin",
  "giant-43": "yi-sun-shin",
  "elizabeth-i": "elizabeth-i",
  "gwanggaeto-the-great": "gwanggaeto-the-great",
  "giant-45": "gwanggaeto-the-great",
  "winston-churchill": "winston-churchill",
  "churchill": "winston-churchill",
  "qin-shi-huang": "qin-shi-huang",
  "giant-47": "qin-shi-huang",
  "augustus": "augustus",
  "giant-48": "augustus",
  "otto-von-bismarck": "otto-von-bismarck",
  "giant-49": "otto-von-bismarck",
  "peter-the-great": "peter-the-great",
  "giant-50": "peter-the-great",
  "catherine-the-great": "catherine-the-great",
  "giant-51": "catherine-the-great",
  "simon-bolivar": "simon-bolivar",
  "giant-52": "simon-bolivar",
  "margaret-thatcher": "margaret-thatcher",
  "john-d-rockefeller": "john-d-rockefeller",
  "d": "john-d-rockefeller",
  "ataturk": "ataturk",
  "giant-55": "ataturk",
  "theodore-roosevelt": "theodore-roosevelt",
  "giant-56": "theodore-roosevelt",
  "anne-frank": "anne-frank",
  "giant-57": "anne-frank",
  "rosa-parks": "rosa-parks",
  "giant-58": "rosa-parks",
  "frederick-douglass": "frederick-douglass",
  "giant-59": "frederick-douglass",
  "harriet-tubman": "harriet-tubman",
  "giant-60": "harriet-tubman",
  "oskar-schindler": "oskar-schindler",
  "giant-61": "oskar-schindler",
  "florence-nightingale": "florence-nightingale",
  "giant-62": "florence-nightingale",
  "yu-gwan-sun": "yu-gwan-sun",
  "giant-63": "yu-gwan-sun",
  "louis-braille": "louis-braille",
  "giant-64": "louis-braille",
  "joan-of-arc": "joan-of-arc",
  "giant-65": "joan-of-arc",
  "desmond-tutu": "desmond-tutu",
  "giant-66": "desmond-tutu",
  "elie-wiesel": "elie-wiesel",
  "giant-67": "elie-wiesel",
  "harriet-beecher-stowe": "harriet-beecher-stowe",
  "giant-68": "harriet-beecher-stowe",
  "rigoberta-menchu": "rigoberta-menchu",
  "giant-69": "rigoberta-menchu",
  "terry-fox": "terry-fox",
  "giant-70": "terry-fox",
  "kim-gu": "kim-gu",
  "giant-71": "kim-gu",
  "buddha": "buddha",
  "giant-72": "buddha",
  "friedrich-nietzsche": "friedrich-nietzsche",
  "giant-73": "friedrich-nietzsche",
  "immanuel-kant": "immanuel-kant",
  "giant-74": "immanuel-kant",
  "rene-descartes": "rene-descartes",
  "giant-75": "rene-descartes",
  "jean-jacques-rousseau": "jean-jacques-rousseau",
  "giant-76": "jean-jacques-rousseau",
  "sigmund-freud": "sigmund-freud",
  "giant-77": "sigmund-freud",
  "carl-jung": "carl-jung",
  "giant-78": "carl-jung",
  "baruch-spinoza": "baruch-spinoza",
  "giant-79": "baruch-spinoza",
  "sun-tzu": "sun-tzu",
  "giant-80": "sun-tzu",
  "david-hume": "david-hume",
  "giant-81": "david-hume",
  "john-locke": "john-locke",
  "giant-82": "john-locke",
  "simone-de-beauvoir": "simone-de-beauvoir",
  "giant-83": "simone-de-beauvoir",
  "hannah-arendt": "hannah-arendt",
  "giant-84": "hannah-arendt",
  "soren-kierkegaard": "soren-kierkegaard",
  "giant-85": "soren-kierkegaard",
  "arthur-schopenhauer": "arthur-schopenhauer",
  "giant-86": "arthur-schopenhauer",
  "isaac-newton": "isaac-newton",
  "newton": "isaac-newton",
  "galileo-galilei": "galileo-galilei",
  "giant-88": "galileo-galilei",
  "charles-darwin": "charles-darwin",
  "darwin": "charles-darwin",
  "michelangelo": "michelangelo",
  "claude-monet": "claude-monet",
  "giant-91": "claude-monet",
  "fyodor-dostoevsky": "fyodor-dostoevsky",
  "giant-92": "fyodor-dostoevsky",
  "victor-hugo": "victor-hugo",
  "giant-93": "victor-hugo",
  "anton-chekhov": "anton-chekhov",
  "giant-94": "anton-chekhov",
  "frederic-chopin": "frederic-chopin",
  "giant-95": "frederic-chopin",
  "katsushika-hokusai": "katsushika-hokusai",
  "giant-96": "katsushika-hokusai",
  "agatha-christie": "agatha-christie",
  "mark-twain": "mark-twain",
  "goethe": "goethe",
  "mary-shelley": "mary-shelley"
};

const narrativesPath = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/final-narratives.json';
const content = fs.readFileSync(narrativesPath, 'utf8');

// Use regex to find all matches of blocks
// A block starts with "slug": { and ends where the next "slug": { or the end of the file occurs.
// We'll use a more surgical approach.
const blocks = [];
const blockRegex = /"([a-z0-9-]+)"\s*:\s*\{/g;
let match;
let lastIndex = 0;
let lastSlug = null;

while ((match = blockRegex.exec(content)) !== null) {
  if (lastSlug) {
    blocks.push({ slug: lastSlug, body: content.substring(lastIndex, match.index) });
  }
  lastSlug = match[1];
  lastIndex = match.index;
}
if (lastSlug) {
  blocks.push({ slug: lastSlug, body: content.substring(lastIndex) });
}

const salvaged = {};

blocks.forEach(b => {
  let body = b.body.trim();
  // Remove the key part to leave just the object
  body = body.substring(body.indexOf('{'));
  
  // Cleanup trailing commas or missing closing braces
  if (body.endsWith(',')) body = body.slice(0, -1);
  
  // Try to parse
  let obj;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    // Secondary fix: try adding a closing brace
    try {
      obj = JSON.parse(body + "}");
    } catch (e2) {
      // Tertiary fix: it might have multiple extra braces or be truncated
      // We'll try to find the last valid closing brace for the wisdom array
      const lastBrace = body.lastIndexOf('}');
      try {
        obj = JSON.parse(body.substring(0, lastBrace + 1));
      } catch (e3) {
        console.log(`Failed to salvage ${b.slug}: ${e3.message}`);
        return;
      }
    }
  }
  
  const targetSlug = standardizedMapping[b.slug];
  if (targetSlug) {
    salvaged[targetSlug] = obj;
  }
});

// Write to clean file
const cleanPath = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/final-narratives.json';
fs.writeFileSync(cleanPath, JSON.stringify(salvaged, null, 2));
console.log(`Successfully salvaged and standardized ${Object.keys(salvaged).length} narratives.`);
