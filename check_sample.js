const fs = require('fs');
const koData = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-ko.json', 'utf8'));
const idData = JSON.parse(fs.readFileSync('scratch/task3_id_retry_out_1.json', 'utf8'));

const keys = Object.keys(idData).slice(0, 3);
keys.forEach(k => {
  console.log(`\n=== Giant: ${k} ===`);
  console.log(`[KO]: ${koData[k].timeline[0].event}`);
  console.log(`[ID]: ${idData[k].timeline[0].event}`);
  console.log(`[KO FAQ]: ${koData[k].faq[0].question}`);
  console.log(`[ID FAQ]: ${idData[k].faq[0].question}`);
});
