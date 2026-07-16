const fs = require('fs');
const path = require('path');

const outData = {};
let missingChunks = [];

for(let i=0; i<9; i++) {
  const chunkFile = path.join(__dirname, 'scratch', `task3_sw_out_${i}.json`);
  if (fs.existsSync(chunkFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
      Object.assign(outData, data);
      console.log(`Merged chunk ${i} (${Object.keys(data).length} items)`);
    } catch(e) {
      console.log(`Error parsing chunk ${i}`);
    }
  } else {
    missingChunks.push(i);
  }
}

if (missingChunks.length > 0) {
  console.log('MISSING CHUNKS:', missingChunks);
}

fs.writeFileSync('task3_sw_translated.json', JSON.stringify(outData, null, 2));

// Merge to master
const masterFile = path.join(__dirname, 'src', 'data', 'fact-layers', 'fact-layer-sw.json');
const masterData = JSON.parse(fs.readFileSync(masterFile, 'utf8'));

for (const [slug, data] of Object.entries(outData)) {
  if (!masterData[slug]) {
    masterData[slug] = data; 
  } else {
    if (data.timeline) masterData[slug].timeline = data.timeline;
    if (data.keyAchievements) masterData[slug].keyAchievements = data.keyAchievements;
    if (data.faq) masterData[slug].faq = data.faq;
    if (data.missingDataNote !== undefined) masterData[slug].missingDataNote = data.missingDataNote;
  }
}
fs.writeFileSync(masterFile, JSON.stringify(masterData, null, 2));

// Korean Residue Scan
let koreanResidue = [];
const koRegex = /[가-힣]/;

function checkKorean(obj, pathStr) {
  if (typeof obj === 'string') {
    if (koRegex.test(obj)) {
      koreanResidue.push(`${pathStr}: ${obj}`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => checkKorean(item, `${pathStr}[${index}]`));
  } else if (obj !== null && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      checkKorean(val, `${pathStr}.${key}`);
    }
  }
}

for (const [slug, data] of Object.entries(outData)) {
  checkKorean(data.timeline, `${slug}.timeline`);
  checkKorean(data.keyAchievements, `${slug}.keyAchievements`);
  checkKorean(data.faq, `${slug}.faq`);
  if (data.missingDataNote) {
    checkKorean(data.missingDataNote, `${slug}.missingDataNote`);
  }
}

console.log("\n=== Korean Residue Scan ===");
if (koreanResidue.length > 0) {
  koreanResidue.forEach(r => console.log(r));
} else {
  console.log("CLEAN: No Korean residue found.");
}
