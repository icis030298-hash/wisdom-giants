const fs = require('fs');
const path = require('path');

const dataFile = process.argv[2];
if (!dataFile) {
  console.error("Please provide the data file path.");
  process.exit(1);
}

const rawData = fs.readFileSync(dataFile, 'utf8');
const giantData = JSON.parse(rawData);
const giantSlug = giantData.slug;
const LOCALES = ['en', 'ko', 'de', 'ja', 'es', 'fr', 'it', 'pt'];

// 1. Update messages
const msgs = {};
for (const lang of LOCALES) {
  const p = path.join(__dirname, '..', 'messages', `${lang}.json`);
  msgs[lang] = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!msgs[lang].Giants) msgs[lang].Giants = {};
  if (giantData.messages && giantData.messages[lang]) {
    msgs[lang].Giants[giantSlug] = giantData.messages[lang];
    fs.writeFileSync(p, JSON.stringify(msgs[lang], null, 2), 'utf8');
  }
}

// 2. Update final-narratives
const narrativeFile = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
let narratives = {};
if (fs.existsSync(narrativeFile)) {
  narratives = JSON.parse(fs.readFileSync(narrativeFile, 'utf8'));
}
if (giantData.epic) {
  narratives[giantSlug] = giantData.epic;
  fs.writeFileSync(narrativeFile, JSON.stringify(narratives, null, 2), 'utf8');
}

// 3. Update giants.ts
const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
let tsContent = fs.readFileSync(tsFile, 'utf8');
if (!tsContent.includes(`slug: "${giantSlug}"`) && !tsContent.includes(`slug: '${giantSlug}'`)) {
  let maxId = 0;
  const idMatches = tsContent.match(/id:\s*["'](\d+)["']/g);
  if (idMatches) {
    idMatches.forEach(m => {
      const id = parseInt(m.match(/\d+/)[0]);
      if (id > maxId) maxId = id;
    });
  }
  const nextId = maxId + 1;
  const en = giantData.messages.en || {};
  
  const newTsBlock = `,
  {
    id: "${nextId}",
    name: "${giantData.name.replace(/"/g, '\\"')}",
    category: "${giantData.category}",
    headline: "${(en.headline || '').replace(/"/g, '\\"')}",
    shortDescription: "${(en.shortDescription || '').replace(/"/g, '\\"')}",
    slug: "${giantSlug}",
    dnaCode: "LPDI",
    quote: "${(en.quote || '').replace(/"/g, '\\"')}",
    pain: "${(en.pain || '').replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    recovery: "${(en.recovery || '').replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    lessons: [],
    persona: "당신은 ${giantData.name.replace(/"/g, '\\"')}입니다.",
    imageUrl: "/images/giants/${giantSlug}.jpg",
    era: "${(en.era || '').replace(/"/g, '\\"')}"
  },
`;

  const closingIndex = tsContent.lastIndexOf('];');
  if (closingIndex !== -1) {
    tsContent = tsContent.slice(0, closingIndex) + newTsBlock + tsContent.slice(closingIndex);
    fs.writeFileSync(tsFile, tsContent, 'utf8');
  }
}

console.log(`Successfully merged ${giantSlug}.`);
