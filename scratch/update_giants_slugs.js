const fs = require('fs');

const mapping = {
  1: "steve-jobs",
  2: "napoleon-bonaparte",
  3: "king-sejong",
  4: "elon-musk",
  5: "genghis-khan",
  6: "alexander-the-great",
  7: "walt-disney",
  8: "thomas-edison",
  9: "julius-caesar",
  10: "henry-ford",
  11: "frida-kahlo",
  12: "viktor-frankl",
  13: "oprah-winfrey",
  14: "jk-rowling",
  15: "nelson-mandela",
  16: "helen-keller",
  17: "beethoven",
  18: "stephen-hawking",
  19: "malala-yousafzai",
  20: "franklin-d-roosevelt",
  21: "marcus-aurelius",
  22: "seneca",
  23: "confucius",
  24: "socrates",
  25: "lao-tzu",
  26: "aristotle",
  27: "plato",
  28: "mahatma-gandhi",
  29: "martin-luther-king",
  30: "mother-teresa",
  31: "leonardo-da-vinci",
  32: "salvador-dali",
  33: "coco-chanel",
  34: "pablo-picasso",
  35: "mozart",
  36: "william-shakespeare",
  37: "albert-einstein",
  38: "marie-curie",
  39: "nikola-tesla",
  40: "vincent-van-gogh",
  41: "abraham-lincoln",
  42: "george-washington",
  43: "yi-sun-shin",
  44: "elizabeth-i",
  45: "gwanggaeto-the-great",
  46: "winston-churchill",
  47: "qin-shi-huang",
  48: "augustus",
  49: "otto-von-bismarck",
  50: "peter-the-great",
  51: "catherine-the-great",
  52: "simon-bolivar",
  53: "margaret-thatcher",
  54: "john-d-rockefeller",
  55: "ataturk",
  56: "theodore-roosevelt",
  57: "anne-frank",
  58: "rosa-parks",
  59: "frederick-douglass",
  60: "harriet-tubman",
  61: "oskar-schindler",
  62: "florence-nightingale",
  63: "yu-gwan-sun",
  64: "louis-braille",
  65: "joan-of-arc",
  66: "desmond-tutu",
  67: "elie-wiesel",
  68: "harriet-beecher-stowe",
  69: "rigoberta-menchu",
  70: "terry-fox",
  71: "kim-gu",
  72: "buddha",
  73: "friedrich-nietzsche",
  74: "immanuel-kant",
  75: "rene-descartes",
  76: "jean-jacques-rousseau",
  77: "sigmund-freud",
  78: "carl-jung",
  79: "baruch-spinoza",
  80: "sun-tzu",
  81: "david-hume",
  82: "john-locke",
  83: "simone-de-beauvoir",
  84: "hannah-arendt",
  85: "soren-kierkegaard",
  86: "arthur-schopenhauer",
  87: "isaac-newton",
  88: "galileo-galilei",
  89: "charles-darwin",
  90: "michelangelo",
  91: "claude-monet",
  92: "fyodor-dostoevsky",
  93: "victor-hugo",
  94: "anton-chekhov",
  95: "frederic-chopin",
  96: "katsushika-hokusai",
  97: "agatha-christie",
  98: "mark-twain",
  99: "goethe",
  100: "mary-shelley"
};

const giantsPath = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/giants.ts';
let content = fs.readFileSync(giantsPath, 'utf8');

// Regex to find giant objects and update their slugs
// We look for objects with an 'id' property and update the 'slug' property based on that id.
// Note: This regex assumes a standard structure in giants.ts
const giantRegex = /\{[\s\S]*?id:\s*"(\d+)"[\s\S]*?slug:\s*"([a-z0-9-]+)"[\s\S]*?\}/g;

let updatedContent = content.replace(giantRegex, (match, id, oldSlug) => {
  const newSlug = mapping[id];
  if (newSlug) {
    return match.replace(`slug: "${oldSlug}"`, `slug: "${newSlug}"`);
  }
  return match;
});

fs.writeFileSync(giantsPath, updatedContent);
console.log('Updated slugs in giants.ts');
