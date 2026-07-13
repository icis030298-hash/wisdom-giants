const fs = require('fs');

// Chunk Task 1: 9 epics, 77 fact-layers
const t1 = JSON.parse(fs.readFileSync('scratch/task1-missing.json', 'utf8'));
const epics = t1.epic;
const fl = t1.factLayer;

// Distribute to 3 subagents for T1
const numT1 = 3;
const chunkSizeEpic = Math.ceil(epics.length / numT1);
const chunkSizeFl = Math.ceil(fl.length / numT1);

for(let i=0; i<numT1; i++){
  fs.writeFileSync(`scratch/t1-chunk-${i+1}.json`, JSON.stringify({
    epic: epics.slice(i*chunkSizeEpic, (i+1)*chunkSizeEpic),
    factLayer: fl.slice(i*chunkSizeFl, (i+1)*chunkSizeFl)
  }, null, 2));
}

// Chunk Task 2: 123 KO fallbacks
const t2 = JSON.parse(fs.readFileSync('scratch/task2-ko-fallbacks.json', 'utf8'));

// Distribute to 3 subagents for T2
const numT2 = 3;
const chunkSizeT2 = Math.ceil(t2.length / numT2);
for(let i=0; i<numT2; i++){
  fs.writeFileSync(`scratch/t2-chunk-${i+1}.json`, JSON.stringify(t2.slice(i*chunkSizeT2, (i+1)*chunkSizeT2), null, 2));
}

console.log("Chunked into scratch/t1-chunk-[1-3].json and scratch/t2-chunk-[1-3].json");
