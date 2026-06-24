const fs = require('fs');
const path = require('path');

// Category mapping
const CATEGORY_MAP = {
  'charlemagne': 'leadership', 'akbar-the-great': 'leadership', 'pachacuti': 'leadership',
  'queen-nzinga': 'leadership', 'ramesses-ii': 'leadership', 'cyrus-the-great': 'leadership',
  'queen-elizabeth-i': 'leadership', 'frederick-the-great': 'leadership',
  'william-the-conqueror': 'leadership', 'giuseppe-garibaldi': 'leadership',
  'hatshepsut': 'leadership', 'zenobia': 'leadership', 'moctezuma-ii': 'leadership',
  'tran-hung-dao': 'leadership',
  'michael-faraday': 'science', 'james-clerk-maxwell': 'science', 'edward-jenner': 'science',
  'erwin-schrodinger': 'science', 'james-hutton': 'science', 'georges-cuvier': 'science',
  'epicurus': 'philosophy', 'diogenes': 'philosophy', 'heraclitus': 'philosophy',
  'pythagoras': 'philosophy', 'plotinus': 'philosophy', 'john-stuart-mill': 'philosophy',
  'gottfried-leibniz': 'philosophy', 'meister-eckhart': 'philosophy',
  'homer': 'arts', 'virgil': 'arts', 'jane-austen': 'arts', 'charles-dickens': 'arts',
  'rembrandt': 'arts', 'francisco-de-goya': 'arts', 'franz-schubert': 'arts',
  'george-eliot': 'arts', 'emily-dickinson': 'arts', 'henrik-ibsen': 'arts',
  'dorothea-dix': 'society', 'clara-barton': 'society', 'ida-b-wells': 'society',
  'elizabeth-cady-stanton': 'society', 'harriet-martineau': 'society', 'olympe-de-gouges': 'society',
  'james-cook': 'business', 'bartolomeu-dias': 'business', 'ernest-shackleton': 'business',
  'henry-hudson': 'business', 'vitus-bering': 'business', 'roald-amundsen': 'business',
};

const DNA_MAP = {
  'charlemagne': 'LRDI', 'akbar-the-great': 'LRHI', 'pachacuti': 'LRDI',
  'queen-nzinga': 'LRDI', 'ramesses-ii': 'LRDI', 'cyrus-the-great': 'LRHI',
  'queen-elizabeth-i': 'LRDI', 'frederick-the-great': 'LRDI', 'william-the-conqueror': 'LRDI',
  'giuseppe-garibaldi': 'LPDI', 'hatshepsut': 'LRHI', 'zenobia': 'LRDI',
  'moctezuma-ii': 'LRHI', 'tran-hung-dao': 'LRDI',
  'michael-faraday': 'SPHI', 'james-clerk-maxwell': 'SPHI', 'edward-jenner': 'SPHI',
  'erwin-schrodinger': 'SPHI', 'james-hutton': 'SPHI', 'georges-cuvier': 'SPDI',
  'epicurus': 'PPHI', 'diogenes': 'PPDI', 'heraclitus': 'PPDI', 'pythagoras': 'SPHI',
  'plotinus': 'PPHI', 'john-stuart-mill': 'PPHI', 'gottfried-leibniz': 'SPHI',
  'meister-eckhart': 'PPHI',
  'homer': 'APHI', 'virgil': 'APHI', 'jane-austen': 'APHI', 'charles-dickens': 'APDI',
  'rembrandt': 'APDI', 'francisco-de-goya': 'APDI', 'franz-schubert': 'APHI',
  'george-eliot': 'APHI', 'emily-dickinson': 'APHI', 'henrik-ibsen': 'APDI',
  'dorothea-dix': 'SPHI', 'clara-barton': 'SPHI', 'ida-b-wells': 'LPDI',
  'elizabeth-cady-stanton': 'LPHI', 'harriet-martineau': 'PPHI', 'olympe-de-gouges': 'LPDI',
  'james-cook': 'LRDI', 'bartolomeu-dias': 'LRDI', 'ernest-shackleton': 'LRDI',
  'henry-hudson': 'LRDI', 'vitus-bering': 'LRDI', 'roald-amundsen': 'LRDI',
};

const giantsPath = path.resolve('src/data/giants.ts');
const giantsContent = fs.readFileSync(giantsPath, 'utf8');

// Find all existing IDs
const idMatches = [...giantsContent.matchAll(/id:\s*"(\d+)"/g)];
const existingIds = idMatches.map(m => parseInt(m[1]));
let maxId = Math.max(...existingIds);
console.log('Max existing ID:', maxId);

// Find all existing slugs
const slugMatches = [...giantsContent.matchAll(/slug:\s*"([^"]+)"/g)];
const existingSlugs = new Set(slugMatches.map(m => m[1]));
console.log('Existing slug count:', existingSlugs.size);

const newGiantsData = JSON.parse(fs.readFileSync(path.resolve('scripts/new-giants-50.json'), 'utf8'));

// Safe string: escape backslashes and double quotes for TS string literals
function safeStr(s) {
  if (typeof s !== 'string') return '';
  // Remove actual newlines (replace with space), escape backslashes, then escape double quotes
  return s
    .replace(/\r\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .trim();
}

const newEntries = [];
let skipped = 0;

for (const [slug, data] of Object.entries(newGiantsData)) {
  if (existingSlugs.has(slug)) {
    console.log(`[SKIP] ${slug} already exists`);
    skipped++;
    continue;
  }

  maxId++;
  const id = String(maxId);
  const category = CATEGORY_MAP[slug] || 'philosophy';
  const dnaCode = DNA_MAP[slug] || 'PPHI';
  const ko = (data.messages && data.messages.ko) || {};
  const en = (data.messages && data.messages.en) || {};
  const epic = data.epic || {};

  const wisdom = epic.wisdom || [];
  let lessons = wisdom.slice(0, 3).map(w => ({
    title: safeStr(w.quote_ko || w.quote_en || ''),
    content: safeStr(w.meaning_ko || w.meaning_en || '')
  }));

  if (lessons.length === 0) {
    lessons.push({
      title: safeStr(ko.quote || en.quote || ''),
      content: safeStr(ko.shortDescription || en.shortDescription || '')
    });
  }

  // Build headline from shortDescription or first line of epic
  let rawHeadline = ko.shortDescription || en.shortDescription || '';
  if (rawHeadline.length > 80) rawHeadline = rawHeadline.slice(0, 77) + '...';
  const headline = safeStr(rawHeadline);

  const entry = {
    id,
    name: safeStr(ko.name || en.name || slug),
    category,
    headline,
    shortDescription: safeStr(ko.shortDescription || en.shortDescription || ''),
    slug,
    dnaCode,
    quote: safeStr(ko.quote || en.quote || ''),
    pain: safeStr(ko.pain || en.pain || ''),
    recovery: safeStr(ko.recovery || en.recovery || ''),
    lessons,
    persona: `당신은 ${safeStr(ko.name || en.name || slug)}입니다.`,
    imageUrl: `/images/giants/${slug}.jpg`,
    era: safeStr(ko.era || en.era || '')
  };

  newEntries.push(entry);
}

console.log(`\nReady to add: ${newEntries.length} giants (skipped: ${skipped})`);

// Generate TS block
function lessonToTS(l) {
  return `      {\n        title: "${l.title}",\n        content: "${l.content}"\n      }`;
}

function entryToTS(e) {
  const lessonsStr = e.lessons.map(lessonToTS).join(',\n');
  return [
    `  {`,
    `    id: "${e.id}",`,
    `    name: "${e.name}",`,
    `    category: "${e.category}",`,
    `    headline: "${e.headline}",`,
    `    shortDescription: "${e.shortDescription}",`,
    `    slug: "${e.slug}",`,
    `    dnaCode: "${e.dnaCode}",`,
    `    quote: "${e.quote}",`,
    `    pain: "${e.pain}",`,
    `    recovery: "${e.recovery}",`,
    `    lessons: [`,
    lessonsStr,
    `    ],`,
    `    persona: "${e.persona}",`,
    `    imageUrl: "${e.imageUrl}",`,
    `    era: "${e.era}"`,
    `  }`,
  ].join('\n');
}

const newTSBlock = newEntries.map(entryToTS).join(',\n');

// Find last ]; and insert before it
const insertionPoint = giantsContent.lastIndexOf('];');
if (insertionPoint === -1) {
  console.error('ERROR: Could not find ]; in giants.ts');
  process.exit(1);
}

const before = giantsContent.slice(0, insertionPoint).trimEnd();
const after = giantsContent.slice(insertionPoint);
const newContent = before + ',\n' + newTSBlock + '\n' + after;

fs.writeFileSync(giantsPath, newContent, 'utf8');
console.log(`\nSuccessfully merged ${newEntries.length} giants into giants.ts!`);

// Quick verification
const verify = fs.readFileSync(giantsPath, 'utf8');
const verifyIds = [...verify.matchAll(/id:\s*"(\d+)"/g)];
console.log('Total Giant entries in file:', verifyIds.length);
