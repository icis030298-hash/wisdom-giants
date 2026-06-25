const fs = require('fs');
const path = require('path');

const categoryMap = {
  "gungunhana": "leadership",
  "nana-asmau": "society",
  "nefertiti": "leadership",
  "dido": "leadership",
  "ranavalona-i": "leadership",
  "gebre-mesqel-lalibela": "leadership",
  "leo-africanus": "business",
  "lobengula": "leadership",
  "menelik-ii": "leadership",
  "moshoeshoe-i": "leadership",
  "muhammad-ahmad": "leadership",
  "behanzin": "leadership",
  "saad-zaghloul": "leadership",
  "samori-toure": "leadership",
  "samuel-ajayi-crowther": "society",
  "sayyid-mohammed-abdullah-hassan": "leadership",
  "sonni-ali": "leadership",
  "sol-plaatje": "society",
  "susenyos-i": "leadership",
  "amanirenas": "leadership",
  "ahmadu-bamba": "society",
  "akhenaten": "leadership",
  "ahmad-baba-al-massufi": "philosophy",
  "ezana-of-axum": "leadership",
  "anton-wilhelm-amo": "philosophy"
};

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

function run() {
  console.log("Loading Batch 1 data from new-giants-data.json...");
  const rawData = fs.readFileSync('scripts/new-giants-data.json', 'utf8');
  const generatedData = JSON.parse(rawData);
  const slugs = Object.keys(generatedData);

  console.log(`Loaded ${slugs.length} giants. Merging into files...`);

  // 1. Merge messages
  for (const lang of LOCALES) {
    const p = path.resolve(process.cwd(), 'messages', `${lang}.json`);
    if (fs.existsSync(p)) {
      const messages = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (!messages.Giants) messages.Giants = {};
      
      for (const slug of slugs) {
        if (generatedData[slug].messages && generatedData[slug].messages[lang]) {
          messages.Giants[slug] = generatedData[slug].messages[lang];
        }
      }
      fs.writeFileSync(p, JSON.stringify(messages, null, 2), 'utf8');
    }
  }
  console.log("✓ Messages merged.");

  // 2. Merge final-narratives
  const narrativesPath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
  let narratives = {};
  if (fs.existsSync(narrativesPath)) {
    narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  }
  for (const slug of slugs) {
    if (generatedData[slug].epic) {
      narratives[slug] = generatedData[slug].epic;
    }
  }
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
  console.log("✓ Narratives merged.");

  // 3. Merge wikipedia-links.json
  const wikiPath = path.resolve(process.cwd(), 'src/data/wikipedia-links.json');
  let wikiLinks = {};
  if (fs.existsSync(wikiPath)) {
    wikiLinks = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
  }
  for (const slug of slugs) {
    if (generatedData[slug].wikipediaLinks) {
      wikiLinks[slug] = generatedData[slug].wikipediaLinks;
    }
  }
  fs.writeFileSync(wikiPath, JSON.stringify(wikiLinks, null, 2), 'utf8');
  console.log("✓ Wikipedia links merged.");

  // 4. Merge regions-map.ts
  const regionsPath = path.resolve(process.cwd(), 'src/data/regions-map.ts');
  if (fs.existsSync(regionsPath)) {
    let regionsContent = fs.readFileSync(regionsPath, 'utf8');
    for (const slug of slugs) {
      if (!regionsContent.includes(`"${slug}":`) && !regionsContent.includes(`'${slug}':`)) {
        const insertIndex = regionsContent.indexOf('};');
        if (insertIndex !== -1) {
          const region = generatedData[slug].region || 'africa';
          const insertBlock = `  "${slug}": "${region}",\n`;
          regionsContent = regionsContent.slice(0, insertIndex) + insertBlock + regionsContent.slice(insertIndex);
        }
      }
    }
    fs.writeFileSync(regionsPath, regionsContent, 'utf8');
  }
  console.log("✓ Regions map merged.");

  // 5. Merge fact-layer-all.json
  const factPath = path.resolve(process.cwd(), 'src/data/fact-layer-all.json');
  let factLayer = {};
  if (fs.existsSync(factPath)) {
    factLayer = JSON.parse(fs.readFileSync(factPath, 'utf8'));
  }
  for (const slug of slugs) {
    if (generatedData[slug].factLayer) {
      factLayer[slug] = {
        slug: slug,
        timeline: generatedData[slug].factLayer.timeline || [],
        keyAchievements: generatedData[slug].factLayer.keyAchievements || [],
        faq: generatedData[slug].factLayer.faq || [],
        sourceVerified: true
      };
    }
  }
  fs.writeFileSync(factPath, JSON.stringify(factLayer, null, 2), 'utf8');
  console.log("✓ Fact layers merged.");

  // 6. Merge giants.ts with robust comma formatting
  const tsPath = path.resolve(process.cwd(), 'src/data/giants.ts');
  let tsContent = fs.readFileSync(tsPath, 'utf8');

  let maxId = 0;
  const idMatches = tsContent.match(/id:\s*["'](\d+)["']/g);
  if (idMatches) {
    idMatches.forEach(m => {
      const id = parseInt(m.match(/\d+/)[0]);
      if (id > maxId) maxId = id;
    });
  }

  let newTsBlocks = "";
  for (const slug of slugs) {
    if (tsContent.includes(`slug: "${slug}"`) || tsContent.includes(`slug: '${slug}'`)) {
      console.log(`[Skip] ${slug} already exists in giants.ts.`);
      continue;
    }
    maxId++;
    const giantData = generatedData[slug];
    const ko = giantData.messages.ko || {};
    const category = categoryMap[slug] || "leadership";

    newTsBlocks += `  {
    id: "${maxId}",
    name: "${ko.name.replace(/"/g, '\\"')}",
    category: "${category}",
    headline: "${ko.headline.replace(/"/g, '\\"')}",
    shortDescription: "${ko.shortDescription.replace(/"/g, '\\"')}",
    slug: "${slug}",
    dnaCode: "LPDI",
    quote: "${ko.quote.replace(/"/g, '\\"')}",
    pain: "${ko.pain.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    recovery: "${ko.recovery.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    lessons: [],
    persona: "당신은 ${ko.name.replace(/"/g, '\\"')}입니다.",
    imageUrl: "/images/giants/${slug}.jpg",
    era: "${ko.era.replace(/"/g, '\\"')}"
  },\n`;

    // Also update category in local json backup
    generatedData[slug].category = category;
  }

  // Update backup file with categories
  fs.writeFileSync('scripts/new-giants-data.json', JSON.stringify(generatedData, null, 2), 'utf8');

  if (newTsBlocks) {
    const closingIndex = tsContent.lastIndexOf('];');
    if (closingIndex !== -1) {
      // Find the last non-whitespace character before ];
      let lastCharIndex = closingIndex - 1;
      while (lastCharIndex >= 0 && /\s/.test(tsContent[lastCharIndex])) {
        lastCharIndex--;
      }
      const needsComma = lastCharIndex >= 0 && tsContent[lastCharIndex] !== ',';
      const comma = needsComma ? ',' : '';
      
      tsContent = tsContent.slice(0, closingIndex) + comma + '\n' + newTsBlocks + tsContent.slice(closingIndex);
      fs.writeFileSync(tsPath, tsContent, 'utf8');
      console.log("✓ Added new giants to giants.ts with correct formatting.");
    }
  }

  console.log("=== REMERGE COMPLETED SUCCESSFULY ===");
}

run();
