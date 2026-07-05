const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf-8'));
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

let females = [];
for (const slug of batch) {
  if (fn[slug] && fn[slug].epic_ko) {
    const text = fn[slug].epic_ko;
    // Check if original text contains 그녀 or is generally known as female.
    // Also, checking giants.ts for '그녀' in shortDescription
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
