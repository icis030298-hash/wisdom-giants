const fs = require('fs');
const k = JSON.parse(fs.readFileSync('scratch/chunk_0.json'));
const f = JSON.parse(fs.readFileSync('scratch/out_0.json'));

let offset = 0;
for (let i = 0; i < k.length; i++) {
    // We can't compare directly since f is in Persian and k is in Korean.
    // We will just print them side by side.
}

console.log(f.slice(120, 130));
