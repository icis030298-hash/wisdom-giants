const { execSync } = require('child_process');

const commits = [
  'ddb2b00', // Expand to 192 giants...
  'ea39209', // Merge 50 new giants (241 total)
  'ba54941', // Add Platinum Standard narratives
  '2fe5558', // comprehensive quality audit and repair
  '9a143e7', // fix: resolve incorrect hook import paths
  '62145a3', // fix: resolve 5 major localization and database issues
  'HEAD'
];

commits.forEach(commit => {
  try {
    const stdout = execSync(`git show ${commit}:src/data/giants.ts`, { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
    const slugMatches = [...stdout.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    console.log(`Commit ${commit}: ${slugMatches.length} giants (Unique: ${new Set(slugMatches).size})`);
  } catch (err) {
    console.log(`Commit ${commit}: Error:`, err.message);
  }
});
