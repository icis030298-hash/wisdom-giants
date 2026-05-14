const fs = require('fs');
const finalPath = 'src/data/final-narratives.json';
const batchPath = 'scratch/batch11_final.json';

const finalData = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

const mergedData = { ...finalData, ...batchData };

fs.writeFileSync(finalPath, JSON.stringify(mergedData, null, 2), 'utf8');
console.log('Merged Batch 11 into final-narratives.json');
