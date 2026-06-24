const fs = require('fs');
const path = require('path');

const giantsFile = path.resolve('src/data/giants.ts');
let content = fs.readFileSync(giantsFile, 'utf8');

const slugsToUpdate = [
  'charlemagne',
  'akbar-the-great',
  'queen-nzinga',
  'cyrus-the-great',
  'pachacuti',
  'ramesses-ii',
  'queen-elizabeth-i',
  'frederick-the-great',
  'hatshepsut',
  'michael-faraday'
];

let updatedCount = 0;
for (const slug of slugsToUpdate) {
  const targetPattern = `imageUrl: "/images/giants/${slug}.jpg"`;
  const replacement = `imageUrl: "/images/giants/${slug}.png"`;
  
  if (content.includes(targetPattern)) {
    content = content.replace(targetPattern, replacement);
    console.log(`Updated ${slug} to use .png`);
    updatedCount++;
  } else {
    // Also check for single quotes just in case
    const targetPatternSingle = `imageUrl: '/images/giants/${slug}.jpg'`;
    const replacementSingle = `imageUrl: '/images/giants/${slug}.png'`;
    if (content.includes(targetPatternSingle)) {
      content = content.replace(targetPatternSingle, replacementSingle);
      console.log(`Updated ${slug} to use .png (single quotes)`);
      updatedCount++;
    } else {
      console.log(`Warning: Pattern not found for ${slug}`);
    }
  }
}

if (updatedCount > 0) {
  fs.writeFileSync(giantsFile, content, 'utf8');
  console.log(`Successfully updated ${updatedCount} image URLs in giants.ts`);
} else {
  console.log('No updates made.');
}
