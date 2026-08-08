import { blogPosts } from '../src/data/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

const locales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];
const BATCH_SIZE = 10;

// Read missing list
const missingData = JSON.parse(fs.readFileSync('scratch/missing_8_locales.json', 'utf8'));

const outDir = 'scratch/batches';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let overallBatchCount = 0;
const summary: any = {};

locales.forEach(loc => {
  const missingSlugs: string[] = missingData[loc] || [];
  // Skip the 3 pilot slugs already done
  const pilotSlugs = new Set(
    JSON.parse(fs.readFileSync(`scratch/out_${loc}_pilot.json`, 'utf8')).map((i: any) => i.slug)
  );

  const remainingSlugs = missingSlugs.filter(s => !pilotSlugs.has(s));

  summary[loc] = {
    totalMissing: missingSlugs.length,
    pilotDone: pilotSlugs.size,
    remaining: remainingSlugs.length,
    batches: []
  };

  for (let i = 0; i < remainingSlugs.length; i += BATCH_SIZE) {
    const chunkSlugs = remainingSlugs.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batchFileName = `in_${loc}_b${batchNum}.json`;
    const batchFilePath = path.join(outDir, batchFileName);

    const chunkData = chunkSlugs.map(slug => {
      const p = blogPosts.find(post => post.slug === slug);
      const en = p?.translations['en'];
      return {
        slug,
        category: p?.category,
        giantSlug: p?.giantSlug,
        enTitle: en?.title || '',
        enDescription: en?.description || '',
        enContent: en?.content || ''
      };
    });

    fs.writeFileSync(batchFilePath, JSON.stringify(chunkData, null, 2), 'utf8');
    summary[loc].batches.push({
      batchNum,
      inputFile: batchFilePath,
      outputFile: path.join(outDir, `out_${loc}_b${batchNum}.json`),
      count: chunkSlugs.length
    });
    overallBatchCount++;
  }
});

console.log('=== BATCH PREPARATION SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));
console.log(`Total batches created: ${overallBatchCount}`);

fs.writeFileSync('scratch/batches_summary.json', JSON.stringify(summary, null, 2), 'utf8');
