const fs = require('fs');

const koData = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-ko.json', 'utf8'));
const trData = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-tr.json', 'utf8'));
const koRegex = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/;

let infectedSlugs = [];
for (let slug of Object.keys(trData)) {
    if (koRegex.test(JSON.stringify(trData[slug]))) {
        infectedSlugs.push(slug);
    }
}
console.log('Total infected TR targets:', infectedSlugs.length);

const chunkSize = 30;
let batch = 0;
for (let i = 0; i < infectedSlugs.length; i += chunkSize) {
    const chunkSlugs = infectedSlugs.slice(i, i + chunkSize);
    const chunkData = {};
    for (let slug of chunkSlugs) {
        chunkData[slug] = koData[slug]; // We must use Korean original text as the source
    }
    fs.writeFileSync(`scratch/task_tr_in_${batch}.json`, JSON.stringify(chunkData, null, 2));
    console.log(`Batch ${batch}: ${chunkSlugs.length} items`);
    batch++;
}
console.log('Created', batch, 'batches.');
