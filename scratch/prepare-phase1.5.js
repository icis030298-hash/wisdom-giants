const fs = require('fs');
const targets = JSON.parse(fs.readFileSync('scratch/dummy-targets.json', 'utf8'));

// We want to group by slug
const slugTasks = {};

targets.dummies.forEach(d => {
  if (!slugTasks[d.slug]) slugTasks[d.slug] = [];
  slugTasks[d.slug].push(d.key);
});

targets.missingSubfields.forEach(slug => {
  if (!slugTasks[slug]) slugTasks[slug] = [];
  slugTasks[slug].push('trials_en', 'trials_ko', 'overcoming_en', 'overcoming_ko', 'wisdom');
});

// Remove duplicates within slugTasks
for (const slug in slugTasks) {
  slugTasks[slug] = [...new Set(slugTasks[slug])];
}

const slugs = Object.keys(slugTasks);
console.log(`Total giants needing generation: ${slugs.length}`);

// Let's chunk them
const numChunks = 4;
const chunkSize = Math.ceil(slugs.length / numChunks);

for (let i = 0; i < numChunks; i++) {
  const chunkSlugs = slugs.slice(i * chunkSize, (i + 1) * chunkSize);
  const chunkData = {};
  chunkSlugs.forEach(slug => {
    chunkData[slug] = slugTasks[slug];
  });
  fs.writeFileSync(`scratch/t1.5-chunk-${i+1}.json`, JSON.stringify(chunkData, null, 2));
}

console.log('Chunked into scratch/t1.5-chunk-[1-4].json');
