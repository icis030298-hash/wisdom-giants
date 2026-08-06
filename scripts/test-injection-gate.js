const fs = require('fs');
const path = require('path');
const { validateTranslationItem } = require('../src/lib/injection-gate');

// Load blogPosts safely
const blogPostsPath = path.join(process.cwd(), 'src/data/blog-posts.ts');
const rawContent = fs.readFileSync(blogPostsPath, 'utf8');
const jsContent = rawContent
  .replace(/import .*;/g, '')
  .replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
fs.writeFileSync('scratch/temp_gate_test.js', jsContent + '\nmodule.exports = { blogPosts };');
const { blogPosts } = require('../scratch/temp_gate_test.js');

// Build maps of titles by locale
const localeTitlesMaps = new Map(); // locale -> Map<slug, title>
for (const post of blogPosts) {
  for (const [lang, trans] of Object.entries(post.translations)) {
    if (!localeTitlesMaps.has(lang)) {
      localeTitlesMaps.set(lang, new Map());
    }
    localeTitlesMaps.get(lang).set(post.slug, trans.title);
  }
}

// -------------------------------------------------------------
// PASSED SET (20 items)
// -------------------------------------------------------------
const passedItems = [];

// 1) 5 items with backticks in content (from pt, el, sw)
for (const p of blogPosts) {
  for (const lang of ['pt', 'el', 'sw']) {
    const t = p.translations[lang];
    if (t && t.content && t.content.includes('`') && t.content.length >= 500 && !t.content.includes('*Tone:*')) {
      const enTitle = p.translations['en']?.title;
      if (t.title && t.title !== enTitle && t.title.trim().length >= 10 && !t.title.includes('`')) {
        passedItems.push({
          slug: p.slug,
          locale: lang,
          title: t.title,
          description: t.description,
          content: t.content,
          enTitle
        });
        if (passedItems.length >= 5) break;
      }
    }
  }
  if (passedItems.length >= 5) break;
}

// 2) 5 items from Latin script locales (pl, de, id, ha, sw)
for (const p of blogPosts) {
  for (const lang of ['pl', 'de', 'id', 'ha', 'sw']) {
    const t = p.translations[lang];
    if (t && t.content && t.content.length >= 500 && !t.content.includes('*Tone:*')) {
      const enTitle = p.translations['en']?.title;
      if (t.title && t.title !== enTitle && t.title.trim().length >= 10 && !t.title.includes('`')) {
        // avoid duplicates
        if (!passedItems.some(i => i.slug === p.slug && i.locale === lang)) {
          passedItems.push({
            slug: p.slug,
            locale: lang,
            title: t.title,
            description: t.description,
            content: t.content,
            enTitle
          });
          if (passedItems.length >= 10) break;
        }
      }
    }
  }
  if (passedItems.length >= 10) break;
}

// 3) 5 items from ko, ja
for (const p of blogPosts) {
  for (const lang of ['ko', 'ja']) {
    const t = p.translations[lang];
    if (t && t.content && t.content.length >= 500 && !t.content.includes('*Tone:*')) {
      const enTitle = p.translations['en']?.title;
      if (t.title && (lang === 'ko' || t.title !== enTitle) && t.title.trim().length >= 10 && !t.title.includes('`')) {
        if (!passedItems.some(i => i.slug === p.slug && i.locale === lang)) {
          passedItems.push({
            slug: p.slug,
            locale: lang,
            title: t.title,
            description: t.description,
            content: t.content,
            enTitle
          });
          if (passedItems.length >= 15) break;
        }
      }
    }
  }
  if (passedItems.length >= 15) break;
}

// 4) 5 random valid items
for (const p of blogPosts) {
  for (const lang of ['de', 'fr', 'es', 'it', 'nl', 'ru']) {
    const t = p.translations[lang];
    if (t && t.content && t.content.length >= 500 && !t.content.includes('*Tone:*')) {
      const enTitle = p.translations['en']?.title;
      if (t.title && t.title !== enTitle && t.title.trim().length >= 10 && !t.title.includes('`')) {
        if (!passedItems.some(i => i.slug === p.slug && i.locale === lang)) {
          passedItems.push({
            slug: p.slug,
            locale: lang,
            title: t.title,
            description: t.description,
            content: t.content,
            enTitle
          });
          if (passedItems.length >= 20) break;
        }
      }
    }
  }
  if (passedItems.length >= 20) break;
}

// -------------------------------------------------------------
// REJECTED SET (14 items)
// -------------------------------------------------------------
const rejectedItems = [
  // 5 sw empty shells
  {
    name: 'sw empty shell (al-biruni-wisdom)',
    item: {
      slug: 'al-biruni-wisdom',
      locale: 'sw',
      title: 'Al-Biruni: The Polymath of the Islamic Golden Age', // title === enTitle
      description: 'Short desc',
      content: 'Short content under 500 chars', // < 500 chars
      enTitle: 'Al-Biruni: The Polymath of the Islamic Golden Age'
    }
  },
  {
    name: 'sw empty shell (al-farabi-wisdom)',
    item: {
      slug: 'al-farabi-wisdom',
      locale: 'sw',
      title: 'Al-Farabi: The Second Teacher',
      description: 'Short desc',
      content: 'Short content',
      enTitle: 'Al-Farabi: The Second Teacher'
    }
  },
  {
    name: 'sw empty shell (descartes-wisdom)',
    item: {
      slug: 'descartes-wisdom',
      locale: 'sw',
      title: 'René Descartes: Father of Modern Philosophy',
      description: 'Short desc',
      content: 'Short content under 500 chars',
      enTitle: 'René Descartes: Father of Modern Philosophy'
    }
  },
  {
    name: 'sw empty shell (ibn-battuta-wisdom)',
    item: {
      slug: 'ibn-battuta-wisdom',
      locale: 'sw',
      title: 'Ibn Battuta: The Great Traveler',
      description: 'Short desc',
      content: 'Short content',
      enTitle: 'Ibn Battuta: The Great Traveler'
    }
  },
  {
    name: 'sw empty shell (mansa-musa-wisdom)',
    item: {
      slug: 'mansa-musa-wisdom',
      locale: 'sw',
      title: 'Mansa Musa: The Wealthiest King in History',
      description: 'Short desc',
      content: 'Short content',
      enTitle: 'Mansa Musa: The Wealthiest King in History'
    }
  },

  // 5 pt corrupted samples
  {
    name: 'pt corrupted (hannibal-barca-wisdom)',
    item: {
      slug: 'hannibal-barca-wisdom',
      locale: 'pt',
      title: 'Hannibal Barca: Estrategista Militar',
      description: 'Descrição válida',
      content: '*Tone:* Formato informativo.\n*Style:* Directo.\n' + 'Conteúdo '.repeat(60),
      enTitle: 'Hannibal Barca: Military Strategist'
    }
  },
  {
    name: 'pt corrupted (zenobia-wisdom)',
    item: {
      slug: 'zenobia-wisdom',
      locale: 'pt',
      title: 'Zenobia: Rainha de Palmira',
      description: 'Descrição válida',
      content: '*Style:* Académico.\n' + 'Conteúdo longo '.repeat(60),
      enTitle: 'Zenobia: Queen of Palmyra'
    }
  },
  {
    name: 'pt corrupted (alexander-the-great-wisdom)',
    item: {
      slug: 'alexander-the-great-wisdom',
      locale: 'pt',
      title: 'Alexandre o Grande: O Conquistador',
      description: 'Descrição válida',
      content: '*Title:* Alexandre.\n' + 'Texto em português '.repeat(60),
      enTitle: 'Alexander the Great: The Conqueror'
    }
  },
  {
    name: 'pt corrupted (cleopatra-wisdom)',
    item: {
      slug: 'cleopatra-wisdom',
      locale: 'pt',
      title: 'Cleópatra: A Última Rainha do Egito',
      description: 'Descrição válida',
      content: '*Tone:* Persuasivo.\n*Title:* Cleópatra.\n' + 'História '.repeat(60),
      enTitle: 'Cleopatra: The Last Queen of Egypt'
    }
  },
  {
    name: 'pt corrupted (julius-caesar-wisdom)',
    item: {
      slug: 'julius-caesar-wisdom',
      locale: 'pt',
      title: 'Júlio César: O Ditador de Roma',
      description: 'Descrição válida',
      content: '*Tone:* Histórico.\n' + 'Roma Antiga '.repeat(60),
      enTitle: 'Julius Caesar: Dictator of Rome'
    }
  },

  // 4 Synthetic invalid items
  {
    name: 'Synthetic: Invalid locale (sv)',
    item: {
      slug: 'some-post-slug',
      locale: 'sv',
      title: 'Svensk Titel Som Är Tillräckligt Lång',
      description: 'En beskrivning på svenska',
      content: 'Innehåll '.repeat(60),
      enTitle: 'English Title For Some Post'
    }
  },
  {
    name: 'Synthetic: Short title (< 10 chars)',
    item: {
      slug: 'some-post-slug-2',
      locale: 'de',
      title: 'Kurz',
      description: 'Gültige Beschreibung auf Deutsch',
      content: 'Inhalt auf Deutsch '.repeat(60),
      enTitle: 'Long English Title For Test'
    }
  },
  {
    name: 'Synthetic: Title equal to English title',
    item: {
      slug: 'some-post-slug-3',
      locale: 'de',
      title: 'English Title Exactly Identical',
      description: 'Gültige Beschreibung auf Deutsch',
      content: 'Inhalt auf Deutsch '.repeat(60),
      enTitle: 'English Title Exactly Identical'
    }
  },
  {
    name: 'Synthetic: Content with *Tone:* marker',
    item: {
      slug: 'some-post-slug-4',
      locale: 'fr',
      title: 'Titre Valide Et Assez Long En Français',
      description: 'Une description valide',
      content: '*Tone:* Formel.\n' + 'Contenu en français '.repeat(60),
      enTitle: 'Valid English Title For Comparison'
    }
  }
];

// -------------------------------------------------------------
// EXECUTE TESTS
// -------------------------------------------------------------
console.log('====================================================');
console.log('A-3 GATE SELF-VERIFICATION TEST');
console.log('====================================================\n');

let passedTestCount = 0;
console.log('[TEST SET 1: PASSED SET (Expected: 20/20 PASS)]');
passedItems.forEach((item, idx) => {
  const sameLocaleMap = localeTitlesMaps.get(item.locale);
  const result = validateTranslationItem(item, sameLocaleMap);
  if (result.valid) {
    passedTestCount++;
    console.log(`  ✅ [${idx + 1}/20] PASS: [${item.locale}] ${item.slug}`);
  } else {
    console.log(`  ❌ [${idx + 1}/20] FAIL (unexpected block): [${item.locale}] ${item.slug} -> Reasons: ${result.reasons.join(', ')}`);
  }
});

let rejectedTestCount = 0;
console.log('\n[TEST SET 2: REJECTED SET (Expected: 14/14 REJECT)]');
rejectedItems.forEach((entry, idx) => {
  const sameLocaleMap = localeTitlesMaps.get(entry.item.locale);
  const result = validateTranslationItem(entry.item, sameLocaleMap);
  if (!result.valid) {
    rejectedTestCount++;
    console.log(`  ✅ [${idx + 1}/14] REJECTED (as expected): ${entry.name}`);
    console.log(`     -> Reason(s): ${result.reasons.join(' | ')}`);
  } else {
    console.log(`  ❌ [${idx + 1}/14] FAILED TO REJECT (gate gap!): ${entry.name}`);
  }
});

console.log('\n====================================================');
console.log(`SUMMARY: Passed Set: ${passedTestCount}/20 | Rejected Set: ${rejectedTestCount}/14`);
console.log('====================================================');

if (passedTestCount === 20 && rejectedTestCount === 14) {
  console.log('\n🎉 ALL GATE TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('\n❌ GATE TEST FAILED!');
  process.exit(1);
}
