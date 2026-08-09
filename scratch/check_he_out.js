const fs = require('fs');

const outHe = JSON.parse(fs.readFileSync('scratch/narrative_batches/out_narrative_he.json', 'utf8'));
console.log('out_narrative_he slugs:', outHe.map(i => i.slug));
