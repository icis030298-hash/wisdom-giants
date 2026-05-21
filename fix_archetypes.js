const fs = require('fs');
let code = fs.readFileSync('src/data/heritage-test.ts', 'utf8');
code = code.replace(/it: "Il Pioniere Eterno"/g, 'it: "Il Pioniere Audace"');
code = code.replace(/it: "Il Saggio Pratico"/g, 'it: "Il Saggio Visionario"');
fs.writeFileSync('src/data/heritage-test.ts', code);
console.log('Fixed specific archetypes');
