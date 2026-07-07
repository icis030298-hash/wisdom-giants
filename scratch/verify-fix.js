const fs = require('fs');
const path = require('path');

const locale = 'zh';
const slug = 'napoleon-bonaparte';
let factLayerAll = {};
try {
  const layerPath = path.join(process.cwd(), 'src/data/fact-layers', `fact-layer-${locale}.json`);
  if (fs.existsSync(layerPath)) {
    factLayerAll = JSON.parse(fs.readFileSync(layerPath, 'utf-8'));
  }
} catch (error) {
  console.warn(`Could not load fact-layer-${locale}.json`);
}
const factLayer = factLayerAll[slug] || null;

console.log(`\n=== Verification Log ===`);
console.log(`Locale: ${locale}`);
console.log(`Slug: ${slug}`);
console.log(`factLayer loaded:`, factLayer !== null);
if (factLayer) {
    console.log(`Number of timeline items: ${factLayer.timeline?.length || 0}`);
    console.log(`Number of FAQ items: ${factLayer.faq?.length || 0}`);
    console.log(`\nSample data (first timeline event):\n`, JSON.stringify(factLayer.timeline?.[0], null, 2));
}
