const fs = require('fs');
const path = require('path');

const masterFile = path.join(__dirname, 'src', 'data', 'fact-layers', 'fact-layer-sw.json');
const masterData = JSON.parse(fs.readFileSync(masterFile, 'utf8'));

const yearOutData = {};

for(let i=0; i<5; i++) {
  const chunkFile = path.join(__dirname, 'scratch', `sw_year_fix_out_${i}.json`);
  if (fs.existsSync(chunkFile)) {
    const data = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
    Object.assign(yearOutData, data);
  } else {
    console.log("Missing chunk: ", i);
  }
}

// Update the master data
for (const [slug, indices] of Object.entries(yearOutData)) {
  if (masterData[slug] && masterData[slug].timeline) {
    for (const [indexStr, yearVal] of Object.entries(indices)) {
      const idx = parseInt(indexStr, 10);
      if (masterData[slug].timeline[idx]) {
        masterData[slug].timeline[idx].year = yearVal;
      }
    }
  }
}

fs.writeFileSync(masterFile, JSON.stringify(masterData, null, 2));

// Full scan
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

for (const [slug, d] of Object.entries(masterData)) {
  checkKorean(d, slug);
}

console.log("\n=== FULL Korean Residue Scan (Including 'year') ===");
if (koreanResidue.length > 0) {
  koreanResidue.forEach(r => console.log(r));
} else {
  console.log("CLEAN: No Korean residue found at all!");
}
