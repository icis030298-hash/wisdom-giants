const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src', 'data', 'pending-translations');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Gather 44 Polish posts from scratch/pl_chunks/
const plChunkFiles = fs.readdirSync(path.join(__dirname, '..', 'scratch', 'pl_chunks')).filter(f => f.startsWith('translated_chunk_'));
let plPosts = [];
plChunkFiles.forEach(f => {
  const content = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'pl_chunks', f), 'utf8'));
  plPosts = plPosts.concat(content);
});

// 2. Gather 39 Ukrainian posts from scratch/uk_chunk_*.json
let ukPosts = [];
for (let i = 0; i <= 7; i++) {
  const ukFile = path.join(__dirname, '..', 'scratch', `uk_chunk_${i}.json`);
  if (fs.existsSync(ukFile)) {
    const content = JSON.parse(fs.readFileSync(ukFile, 'utf8'));
    ukPosts = ukPosts.concat(content);
  }
}

// 3. Gather 12 temp-agent posts from scratch/temp-agent*.json
let tempPosts = [];
for (let i = 1; i <= 6; i++) {
  const tempFile = path.join(__dirname, '..', 'scratch', `temp-agent${i}.json`);
  if (fs.existsSync(tempFile)) {
    const content = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
    tempPosts = tempPosts.concat(content);
  }
}

fs.writeFileSync(path.join(targetDir, 'pl_44_pending.json'), JSON.stringify(plPosts, null, 2), 'utf8');
fs.writeFileSync(path.join(targetDir, 'uk_39_pending.json'), JSON.stringify(ukPosts, null, 2), 'utf8');
fs.writeFileSync(path.join(targetDir, 'temp_12_pending.json'), JSON.stringify(tempPosts, null, 2), 'utf8');

console.log(`Saved pending translations to src/data/pending-translations/:
- pl_44_pending.json: ${plPosts.length} posts
- uk_39_pending.json: ${ukPosts.length} posts
- temp_12_pending.json: ${tempPosts.length} posts
Total: ${plPosts.length + ukPosts.length + tempPosts.length} posts`);
