const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf-8'));
const batch = [
  'alexios-i-komnenos',
  'alisher-navoi',
  'muhammad-al-bukhari',
  'al-farghani',
  'yaroslav-the-wise',
  'yermak-timofeyevich',
  'john-chrysostom',
  'ulugh-beg',
  'justinian-i',
  'ivan-iii-the-great',
  'ivan-iv-the-terrible',
  'ivan-mazepa',
  'ivan-franko',
  'ismail-gasprinsky',
  'jamshid-al-kashi',
  'shoqan-walikhanov',
  'kassia',
  'constantine-xi-palaiologos',
  'kublai-khan',
  'anne-of-kyiv',
  'olga-of-kyiv',
  'taras-shevchenko',
  'tamar-of-georgia',
  'theodora',
  'theophanes-the-greek',
  'tonyukuk',
  'timur-tamerlane',
  'petro-mohyla',
  'pyotr-ilyich-tchaikovsky',
  'procopius',
  'heraclius',
  'xuanzang',
  'hryhorii-skovoroda',
  'gertrude-bell',
  'nader-shah',
  'namik-kemal',
  'nasir-al-din-al-tusi',
  'nebuchadnezzar-ii',
  'nizam-al-mulk',
  'darius-i',
  'rashid-rida',
  'reza-shah',
  'mani',
  'mahmud-ii',
  'mehmed-the-conqueror',
  'mustafa-kemal-ataturk',
  'muhammad-ali-of-egypt',
  'muhammad-abduh',
  'mimar-sinan',
  'badi-al-zaman-al-hamadani',
  'bediuzzaman-said-nursi',
  'baybars',
  'saadi-shirazi',
  'sargon-of-akkad',
  'shapur-i',
  'selim-iii',
  'abbas-i-of-persia',
  'ashurbanipal',
  'ahmed-shawqi',
  'ahmed-cevdet-pasha',
  'rhazes-al-razi',
  'al-mamun',
  'al-masudi',
  'al-battani',
  'al-jahiz',
  'al-kindi',
  'al-tabari',
  'alp-arslan',
  'evliya-celebi',
  'ibrahim-muteferrika',
  'ibrahim-pasha-of-egypt',
  'averroes-ibn-rushd',
  'avicenna-ibn-sina',
  'ibn-arabi',
  'ismail-i',
  'zarathushtra',
  'jamal-al-din-al-afghani',
  'jabir-ibn-hayyan',
  'ziya-gokalp',
  'karim-khan-zand',
  'katip-celebi',
  'xerxes-i',
  'thabit-ibn-qurra',
  'tahirih',
  'fuzuli',
  'ferdowsi',
  'piri-reis',
  'harun-al-rashid',
  'hafez',
  'halide-edib-adivar',
  'hammurabi',
  'hurrem-sultan-roxelana',
  't-e-lawrence'
];

let females = [];
for (const slug of batch) {
  if (fn[slug] && fn[slug].epic_ko) {
    const text = fn[slug].epic_ko;
    if (text.includes('여왕') || text.includes('소녀') || text.includes('그녀') || text.includes('공주') || text.includes('여성')) {
      females.push(slug);
    }
  }
}
const fs2 = require('fs');
const gts = fs2.readFileSync('src/data/giants.ts', 'utf8');
for (const slug of batch) {
  const regex = new RegExp(`slug:\\s*['"]${slug}['"][\\s\\S]*?shortDescription:\\s*['"]([^'"]+)['"]`);
  const match = gts.match(regex);
  if (match) {
    if (match[1].includes('그녀') || match[1].includes('여성') || match[1].includes('여왕')) {
      if (!females.includes(slug)) females.push(slug);
    }
  }
}

console.log(females);
