const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '..', 'scratch', 'illustration_queue.json');
const publicGiantsDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const existingImages = new Set(fs.readdirSync(publicGiantsDir).map(f => f.toLowerCase()));

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

// Filter out those that already have webp or jpg generated
const remaining = queue.filter(g => !existingImages.has(`${g.slug}.webp`) && !existingImages.has(`${g.slug}.jpg`));

console.log(`Remaining giants in queue: ${remaining.length}`);
console.log('\nNext 10 Giants to process:');
remaining.slice(0, 10).forEach((g, idx) => console.log(`${idx + 1}. [${g.slug}] (${g.nameKo} / ${g.nameEn}) - ${g.category} - ${g.gender}`));
