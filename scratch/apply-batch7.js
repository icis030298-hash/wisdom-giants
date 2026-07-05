const fs = require('fs');

function convertToPlain(text, isFemale) {
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

  // 1st to 3rd person conversion
  const he = isFemale ? '그녀는' : '그는';
  const he_ga = isFemale ? '그녀가' : '그가';
  const his = isFemale ? '그녀의' : '그의';
  const him = isFemale ? '그녀를' : '그를';
  const to_him = isFemale ? '그녀에게' : '그에게';

  res = res.replace(/(^|\s)나는 /g, "$1" + he + " ");
  res = res.replace(/(^|\s)내가 /g, "$1" + he_ga + " ");
  res = res.replace(/(^|\s)나의 /g, "$1" + his + " ");
  res = res.replace(/(^|\s)나를 /g, "$1" + him + " ");
  res = res.replace(/(^|\s)나에게 /g, "$1" + to_him + " ");
  res = res.replace(/(^|\s)내게 /g, "$1" + to_him + " ");
  res = res.replace(/(^|\s)내 /g, "$1" + his + " ");
  
  res = res.replace(/(^|\s)우리는 /g, "$1그들은 ");
  res = res.replace(/(^|\s)우리의 /g, "$1그들의 ");
  res = res.replace(/(^|\s)우리가 /g, "$1그들이 ");
  res = res.replace(/(^|\s)우리 /g, "$1그들의 ");
  res = res.replace(/(^|\s)우리를 /g, "$1그들을 ");
  res = res.replace(/(^|\s)우리에게 /g, "$1그들에게 ");

  // General replace for female pronouns if any "그는" was there originally
  if (isFemale) {
    res = res.replace(/그는/g, '그녀는')
               .replace(/그의/g, '그녀의')
               .replace(/그가/g, '그녀가')
               .replace(/소년과 같았던/g, '소녀와 같았던')
               .replace(/왕이 /g, '여왕이 ');
  }

  return res;
}

const finalNarrativesPath = 'src/data/final-narratives.json';
const fn = JSON.parse(fs.readFileSync(finalNarrativesPath, 'utf-8'));

const batch = [
  'gungunhana', 'nana-asmau', 'nefertiti', 'dido', 'ranavalona-i',
  'gebre-mesqel-lalibela', 'leo-africanus', 'lobengula', 'menelik-ii',
  'moshoeshoe-i', 'muhammad-ahmad', 'behanzin', 'saad-zaghloul',
  'samori-toure', 'samuel-ajayi-crowther', 'sayyid-mohammed-abdullah-hassan',
  'sonni-ali', 'sol-plaatje', 'susenyos-i', 'amanirenas', 'ahmadu-bamba',
  'akhenaten', 'ahmad-baba-al-massufi', 'ezana-of-axum', 'anton-wilhelm-amo',
  'athanasius-of-alexandria', 'cyril-of-alexandria', 'amda-seyon-i',
  'abd-al-rahman-al-jabarti', 'abd-al-mumin', 'abdelkader-el-djezairi',
  'albert-luthuli', 'yaa-asantewaa', 'origen-of-alexandria', 'osei-tutu-i',
  'olaudah-equiano', 'yohannes-iv', 'usman-dan-fodio', 'nzinga-of-ndongo-and-matamba',
  'idris-alooma', 'imhotep', 'ibn-tumart', 'amina-of-zazzau', 'zera-yacob',
  'john-chilembwe', 'cetshwayo-kampande', 'khufu', 'cleopatra-vii',
  'kimpa-vita', 'tariq-ibn-ziyad', 'taytu-betul', 'abubakar-tafawa-balewa',
  'taharqa', 'tertullian', 'tewodros-ii', 'tutankhamun', 'prempeh-i',
  'piye', 'herbert-macaulay', 'hendrik-witbooi', 'huda-shaarawi',
  'augustine-of-hippo', 'j-e-casely-hayford', 'frantz-fanon', 'w-e-b-du-bois',
  'george-gemistos-plethon', 'nikolai-gogol', 'nikolay-muravyov-amursky',
  'nikolai-vavilov', 'nikolai-przhevalsky', 'danylo-halytskyi',
  'david-iv-of-georgia', 'rabban-bar-sauma', 'lesya-ukrainka', 'rudaki',
  'mahmud-al-kashgari', 'michael-psellos', 'mikhail-lomonosov',
  'mykhailo-drahomanov', 'mykhailo-hrushevsky', 'babur', 'basil-ii',
  'faxian', 'belisarius', 'bohdan-khmelnytsky', 'bumin-qaghan',
  'vladimir-the-great', 'vladimir-vernadsky', 'sergei-korolev',
  'semyon-dezhnev', 'shota-rustaveli', 'leo-the-mathematician',
  'abai-qunanbaiuly', 'avvakum', 'attila-the-hun', 'ahmad-yasawi',
  'anna-komnene', 'andrei-rublev', 'alexander-nevsky', 'alexander-pushkin'
];

const femaleGiants = [
  'nana-asmau', 'nefertiti', 'dido', 'ranavalona-i', 'amanirenas',
  'yaa-asantewaa', 'nzinga-of-ndongo-and-matamba', 'amina-of-zazzau',
  'cleopatra-vii', 'kimpa-vita', 'taytu-betul', 'huda-shaarawi',
  'lesya-ukrainka', 'anna-komnene'
];

let updatedCount = 0;
for (const slug of batch) {
  if (fn[slug] && fn[slug].epic_ko) {
    const original = fn[slug].epic_ko;
    const plain = convertToPlain(original, femaleGiants.includes(slug));
    
    if (original !== plain) {
      fn[slug].epic_ko = plain;
      updatedCount++;
    }
  }
}

fs.writeFileSync(finalNarrativesPath, JSON.stringify(fn, null, 2));
console.log(`Updated ${updatedCount} texts in Batch 7 (100 giants) to 3rd Person Plain Form.`);
