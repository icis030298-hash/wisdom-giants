const fs = require('fs');
const path = require('path');

const out0 = JSON.parse(fs.readFileSync('scratch/fa_narr_out_0.json', 'utf8'));
const out1 = JSON.parse(fs.readFileSync('scratch/fa_narr_out_1.json', 'utf8'));

const merged = { ...out0, ...out1 };
const dir = './src/data/narratives';

let updatedCount = 0;
for (const slug of Object.keys(merged)) {
  const filePath = path.join(dir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const translation = merged[slug];
    
    if (translation.era_fa) data.era_fa = translation.era_fa;
    if (translation.epic_fa) data.epic_fa = translation.epic_fa;
    if (translation.trials_fa) data.trials_fa = translation.trials_fa;
    if (translation.overcoming_fa) data.overcoming_fa = translation.overcoming_fa;
    
    fs.writeFileSync(filePath, JSON.stringify(data));
    updatedCount++;
  }
}
console.log(`Updated ${updatedCount} narratives.`);
