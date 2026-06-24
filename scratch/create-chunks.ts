import fs from 'fs';
import path from 'path';

const giants = JSON.parse(fs.readFileSync('scratch/mbti-list.json', 'utf8'));
const targetGiants = giants.slice(33);

const chunks = [];
for (let i = 0; i < targetGiants.length; i += 10) {
  chunks.push(targetGiants.slice(i, i + 10));
}

chunks.forEach((chunk, i) => {
  fs.writeFileSync(`scratch/chunk-${i + 1}.json`, JSON.stringify(chunk, null, 2));
});
console.log(`Created ${chunks.length} chunk files.`);
