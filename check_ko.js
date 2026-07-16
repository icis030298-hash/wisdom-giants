const fs = require('fs');

const data = JSON.parse(fs.readFileSync('task3_sw_translated.json', 'utf8'));

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
      if (key !== 'year') { // SKIP YEAR
        checkKorean(val, `${pathStr}.${key}`);
      }
    }
  }
}

for (const [slug, d] of Object.entries(data)) {
  checkKorean(d.timeline, `${slug}.timeline`);
  checkKorean(d.keyAchievements, `${slug}.keyAchievements`);
  checkKorean(d.faq, `${slug}.faq`);
  if (d.missingDataNote) {
    checkKorean(d.missingDataNote, `${slug}.missingDataNote`);
  }
}

console.log("\n=== Korean Residue Scan (Excluding 'year') ===");
if (koreanResidue.length > 0) {
  koreanResidue.forEach(r => console.log(r));
} else {
  console.log("CLEAN: No Korean residue found in translated fields!");
}
