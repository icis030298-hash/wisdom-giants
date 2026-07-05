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
    [/주고 있습니다/g, '주고 있다'],
    [/받고 있습니다/g, '받고 있다'],
    [/하고 있습니다/g, '하고 있다'],
    [/되고 있습니다/g, '되고 있다'],
    [/살아 숨 쉽니다/g, '살아 숨 쉰다'],
    [/가르쳐 주었습니다/g, '가르쳐 주었다'],
    [/([가-힣])(았|었|였)습니다/g, '$1$2다'],
    [/([가-힣])(으)?십니다/g, '$1$2신다'],
    [/([가-힣])습니다/g, '$1다']
  ];

  for (const [regex, replacement] of replacements) {
    res = res.replace(regex, replacement);
  }

  res = res.replace(/([가-힣])(합|입|됩)니다/g, (match, p1, p2) => {
    if (p2 === '합') return p1 + '한다';
    if (p2 === '입') return p1 + '이다';
    if (p2 === '됩') return p1 + '된다';
    return match;
  });

  return res;
}

const giantsPath = 'src/data/giants.ts';
let giantsTxt = fs.readFileSync(giantsPath, 'utf-8');
const originalGiantsTxt = giantsTxt;

giantsTxt = convertToPlain(giantsTxt);

if (giantsTxt !== originalGiantsTxt) {
  fs.writeFileSync(giantsPath, giantsTxt);
  console.log('giants.ts updated with plain form!');
}

const finalNarrativesPath = 'src/data/final-narratives.json';
const fn = JSON.parse(fs.readFileSync(finalNarrativesPath, 'utf-8'));

const batch = [
  'tycho-brahe',
  'john-muir',
  'alfred-russel-wallace',
  'pierre-curie',
  'charles-lyell',
  'al-farabi',
  'thomas-more',
  'simone-weil',
  'antonio-gramsci',
  'rosa-luxemburg',
  'george-santayana',
  'henri-bergson',
  'william-of-ockham',
  'ernst-mach',
  'william-tyndale',
  'chaucer',
  'jonathan-swift',
  'george-sand',
  'paul-cezanne',
  'auguste-rodin',
  'claude-debussy',
  'virginia-woolf',
  'franz-kafka',
  'james-joyce',
  'giacomo-puccini',
  'charles-baudelaire',
  'wassily-kandinsky',
  'paul-gauguin',
  'william-blake',
  'hans-christian-andersen',
  'rudyard-kipling',
  'dorothea-lange',
  'clara-schumann',
  'jane-addams',
  'maria-montessori',
  'william-lloyd-garrison',
  'albert-schweitzer',
  'pandita-ramabai',
  'elizabeth-blackwell',
  'florence-kelley',
  'david-livingstone',
  'alfred-nobel',
  'pierre-de-coubertin',
  'fridtjof-nansen',
  'george-eastman',
  'elisha-otis',
  'jang-yeong-sil',
  'yun-dong-ju',
  'sophocles',
  'euclid'
];

const femaleGiants = [
  'simone-weil', 'rosa-luxemburg', 'george-sand', 'virginia-woolf',
  'dorothea-lange', 'clara-schumann', 'jane-addams', 'maria-montessori',
  'pandita-ramabai', 'elizabeth-blackwell', 'florence-kelley'
];

let updatedCount = 0;
for (const slug of batch) {
  if (fn[slug] && fn[slug].epic_ko) {
    const original = fn[slug].epic_ko;
    let plain = convertToPlain(original);
    
    if (femaleGiants.includes(slug)) {
      plain = plain.replace(/그는/g, '그녀는')
                   .replace(/그의/g, '그녀의')
                   .replace(/그가/g, '그녀가')
                   .replace(/소년과 같았던/g, '소녀와 같았던')
    }
    
    if (original !== plain) {
      fn[slug].epic_ko = plain;
      updatedCount++;
    }
  }
}

fs.writeFileSync(finalNarrativesPath, JSON.stringify(fn, null, 2));
console.log(`Updated ${updatedCount} texts in Batch 6 to Plain Form.`);
