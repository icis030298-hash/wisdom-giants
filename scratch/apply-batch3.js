const fs = require('fs');

function convertToPlain(text) {
  let res = text;
  
  const replacements = [
    [/태어났습니다/g, '태어났다'],
    [/마련했습니다/g, '마련했다'],
    [/제시했습니다/g, '제시했다'],
    [/있습니다/g, '있다'],
    [/입니다/g, '이다'],
    [/했습니다/g, '했다'],
    [/되었습니다/g, '되었다'],
    [/이었습니다/g, '이었다'],
    [/였습니다/g, '였다'],
    [/받았습니다/g, '받았다'],
    [/남겼습니다/g, '남겼다'],
    [/주었습니다/g, '주었다'],
    [/겪어야 했습니다/g, '겪어야 했다'],
    [/보였습니다/g, '보였다'],
    [/있었습니다/g, '있었다'],
    [/없었습니다/g, '없었다'],
    [/살았습니다/g, '살았다'],
    [/숨 쉽니다/g, '숨 쉰다'],
    [/거인이었습니다/g, '거인이었다'],
    [/치유자였습니다/g, '치유자였다'],
    [/수호자였습니다/g, '수호자였다'],
    [/개척자였습니다/g, '개척자였다'],
    [/선구자였습니다/g, '선구자였다'],
    [/학자였습니다/g, '학자였다'],
    [/예술가였습니다/g, '예술가였다'],
    [/철학자였습니다/g, '철학자였다'],
    [/선지자였습니다/g, '선지자였다'],
    [/고고학자였습니다/g, '고고학자였다'],
    [/발견'입니다/g, '발견\'이다'],
    [/발견'이었습니다/g, '발견\'이었다'],
    [/제시'였습니다/g, '제시\'였다'],
    [/주고 있습니다/g, '주고 있다'],
    [/받고 있습니다/g, '받고 있다'],
    [/하고 있습니다/g, '하고 있다'],
    [/되고 있습니다/g, '되고 있다'],
    [/살아 숨 쉽니다/g, '살아 숨 쉰다'],
    [/가르쳐 주었습니다/g, '가르쳐 주었다'],
    // catch remaining
    [/([가-힣])(았|었|였)습니다/g, '$1$2다'],
    [/([가-힣])(으)?십니다/g, '$1$2신다'],
    [/([가-힣])습니다/g, '$1다']
  ];

  for (const [regex, replacement] of replacements) {
    res = res.replace(regex, replacement);
  }

  // Final cleanup for any strange "입다" that should be "이다"
  res = res.replace(/([가-힣])(합|입|됩)니다/g, (match, p1, p2) => {
    if (p2 === '합') return p1 + '한다';
    if (p2 === '입') return p1 + '이다';
    if (p2 === '됩') return p1 + '된다';
    return match;
  });

  return res;
}

const finalNarrativesPath = 'src/data/final-narratives.json';
const fn = JSON.parse(fs.readFileSync(finalNarrativesPath, 'utf-8'));

const batch = [
  "oda-nobunaga", "sun-yat-sen", "tokugawa-ieyasu", "toyotomi-hideyoshi",
  "chulalongkorn", "hannibal-barca", "ibn-battuta", "jayavarman-vii",
  "mansa-musa", "shaka-zulu", "al-khwarizmi", "br-ambedkar",
  "chandragupta-maurya", "omar-khayyam", "robert-oppenheimer", "saladin",
  "srinivasa-ramanujan", "suleiman-the-magnificent", "swami-vivekananda", "wright-brothers",
  "adam-smith", "archimedes", "copernicus", "dante-alighieri",
  "johannes-gutenberg", "louis-pasteur", "machiavelli", "voltaire",
  "alexander-graham-bell", "amelia-earhart", "andrew-carnegie", "edgar-allan-poe",
  "ernest-hemingway", "henry-david-thoreau", "jp-morgan", "ralph-waldo-emerson",
  "susan-b-anthony", "walt-whitman", "max-planck", "hypatia",
  "ibn-al-haytham", "blaise-pascal", "dmitri-mendeleev", "ada-lovelace",
  "alan-turing", "charles-babbage", "ibn-sina", "james-watt",
  "george-stephenson", "gregor-mendel"
];

const femaleGiants = ['amelia-earhart', 'susan-b-anthony', 'hypatia', 'ada-lovelace'];

let updatedCount = 0;
for (const slug of batch) {
  if (fn[slug] && fn[slug].epic_ko) {
    const original = fn[slug].epic_ko;
    let plain = convertToPlain(original);
    
    // Ensure female pronouns
    if (femaleGiants.includes(slug)) {
      plain = plain.replace(/그는/g, '그녀는')
                   .replace(/그의/g, '그녀의')
                   .replace(/그가/g, '그녀가')
                   .replace(/소년과 같았던/g, '소녀와 같았던') // just in case
    }
    
    if (original !== plain) {
      fn[slug].epic_ko = plain;
      updatedCount++;
    }
  }
}

fs.writeFileSync(finalNarrativesPath, JSON.stringify(fn, null, 2));
console.log(`Updated ${updatedCount} texts in Batch 3 to Plain Form.`);
