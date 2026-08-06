const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetSlugs = [
  'cyrus-the-great-wisdom',
  'peter-the-great-wisdom',
  'ataturk-wisdom',
  'rosa-parks-wisdom',
  'queen-victoria-wisdom',
  'simon-bolivar-wisdom'
];

console.log('=== INVESTIGATING GIT COMMIT HISTORY FOR MISSING WISDOM SLUGS ===');

targetSlugs.forEach(slug => {
  console.log(`\n--- Searching git log for slug: "${slug}" ---`);
  try {
    const log = execSync(`git log -S "${slug}" --oneline`, { encoding: 'utf8' });
    console.log(log || 'No commit matches found.');
  } catch (err) {
    console.log(`Git search error for ${slug}`);
  }
});

console.log('\n--- Searching translation injection commits ---');
try {
  const injectionLogs = execSync(`git log --grep="inject" --oneline -n 15`, { encoding: 'utf8' });
  console.log(injectionLogs);
} catch (err) {
  console.log('Error fetching injection logs');
}
