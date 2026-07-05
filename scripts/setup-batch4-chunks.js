const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

// 이미 완료된 slug 수집 (pilot + batch1 + batch2 + batch3)
const batch3Done = JSON.parse(fs.readFileSync('scratch/batch3-final.json', 'utf8')).map(x => x.slug);

// 정책 위반/중복으로 이미 제거된 slug들은 final-narratives.json에 없으므로 자동으로 제외됨
// epic_ko가 1800자 미만인 인물들만 추출
const remaining = Object.entries(data)
  .filter(([s, v]) => (v.epic_ko || '').length < 1800)
  .map(x => x[0]);

console.log('처리 대상 (1800자 미만):', remaining.length, '명');

const numChunks = 5; // 152명 → 5개 청크(약 30명씩)
const chunkSize = Math.ceil(remaining.length / numChunks);

for (let i = 0; i < numChunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, remaining.length);
  const chunk = remaining.slice(start, end);
  if (chunk.length > 0) {
    fs.writeFileSync(`scratch/batch4-chunk-${i + 1}.json`, JSON.stringify(chunk, null, 2));
    console.log(`Chunk ${i + 1}: ${chunk.length}명`);
  }
}
