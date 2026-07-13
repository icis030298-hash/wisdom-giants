const fs = require('fs');

function checkContamination() {
  const data = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  const report = {};
  
  Object.entries(data).forEach(([slug, giant]) => {
    Object.entries(giant).forEach(([key, val]) => {
      if (typeof val !== 'string') return;
      if (key.endsWith('_en') || key.endsWith('_ko') || key === 'category' || key === 'wisdom') return;
      
      let issues = [];
      // Reversed English (yloponom is monopoly reversed)
      if (val.includes('yloponom') || val.includes('lautcelletni') || val.includes('taerht')) {
        issues.push('Reversed English Debug Text');
      }
      
      // Normal English text in RTL or non-latin languages
      const isNonLatin = key.endsWith('_ar') || key.endsWith('_fa') || key.endsWith('_he') || key.endsWith('_ru') || key.endsWith('_uk') || key.endsWith('_el') || key.endsWith('_zh') || key.endsWith('_ja') || key.endsWith('_th') || key.endsWith('_hi');
      if (isNonLatin && val.match(/[a-zA-Z]{5,}/)) {
        issues.push('English Text Leak');
      }
      
      // Korean particle 
      if (val.includes('및')) {
        issues.push('Korean "및" Leak');
      }
      
      // Prefix
      if (val.match(/^\[[a-zA-Z\s]+\]/)) {
        issues.push('Language Prefix Leak');
      }
      
      if (issues.length > 0) {
        if (!report[key]) report[key] = {};
        issues.forEach(issue => {
          report[key][issue] = (report[key][issue] || 0) + 1;
        });
      }
    });
  });
  
  console.log("=== final-narratives.json Contamination Report ===");
  console.log(JSON.stringify(report, null, 2));
}

checkContamination();
