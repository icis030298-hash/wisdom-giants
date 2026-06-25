import fs from 'fs';
import { giants } from '../src/lib/giants-data'; // Use the actual export

const pilotSlugs = new Set([
  'king-sejong', 'diogenes', 'socrates',
  'napoleon-bonaparte', 'albert-einstein',
  'marie-curie', 'leonardo-da-vinci',
  'thomas-edison', 'joan-of-arc', 'confucius'
]);

const remaining = giants
  .filter((g: any) => !pilotSlugs.has(g.slug))
  .map((g: any) => g.slug);

const batchSize = 30;
const batches: string[][] = [];
for (let i = 0; i < remaining.length; i += batchSize) {
  batches.push(remaining.slice(i, i + batchSize));
}

if (!fs.existsSync('scripts/batches')) {
  fs.mkdirSync('scripts/batches');
}

batches.forEach((batch, idx) => {
  fs.writeFileSync(
    `scripts/batches/batch-${String(idx + 1).padStart(2, '0')}.json`,
    JSON.stringify(batch, null, 2)
  );
});

console.log(`총 ${batches.length}개 배치 생성 (총 대상: ${remaining.length}명, 각 배치 평균 ${Math.round(remaining.length / batches.length)}명)`);
