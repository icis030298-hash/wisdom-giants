const fs = require('fs');
const path = require('path');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const pilotMappings = [
  { prefix: 'pilot_rain_queen_', slug: 'rain-queen.jpg' },
  { prefix: 'pilot_ban_zhao_', slug: 'ban-zhao.jpg' },
  { prefix: 'pilot_hildegard_of_bingen_', slug: 'hildegard-of-bingen.jpg' },
  { prefix: 'pilot_kalidasa_', slug: 'kalidasa.jpg' },
  { prefix: 'pilot_aung_san_', slug: 'aung-san.jpg' },
  { prefix: 'pilot_diego_rivera_', slug: 'diego-rivera.jpg' },
  { prefix: 'pilot_abbas_the_great_', slug: 'abbas-the-great.jpg' },
  { prefix: 'pilot_ambroise_pare_', slug: 'ambroise-pare.jpg' }
];

console.log('=== COPYING GENERATED PILOT IMAGES TO PUBLIC/IMAGES/GIANTS/ ===\n');

const files = fs.readdirSync(brainDir);

pilotMappings.forEach(mapping => {
  const found = files.find(f => f.startsWith(mapping.prefix) && f.endsWith('.jpg'));
  if (found) {
    const srcPath = path.join(brainDir, found);
    const destPath = path.join(targetDir, mapping.slug);
    fs.copyFileSync(srcPath, destPath);
    const stat = fs.statSync(destPath);
    console.log(`[COPIED] ${found} -> public/images/giants/${mapping.slug} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`[NOT FOUND] File starting with ${mapping.prefix} in brain directory`);
  }
});
