const fs = require('fs');

const inHe = JSON.parse(fs.readFileSync('scratch/narrative_batches/in_narrative_he.json', 'utf8'));
console.log('in_narrative_he slugs:', inHe.map(i => i.slug));
