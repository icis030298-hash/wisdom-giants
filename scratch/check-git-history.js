const { execSync } = require('child_process');
const fs = require('fs');

const commits = [
  '62145a3',
  '9a143e7',
  '2fe5558',
  'ba54941',
  '45eda7a',
  '05bdba7',
  'ddb2b00',
  'cf9c94c'
];

console.log('Auditing past commits of src/data/final-narratives.json...');

commits.forEach(commit => {
  try {
    const stdout = execSync(`git show ${commit}:src/data/final-narratives.json`, { maxBuffer: 100 * 1024 * 1024 });
    const content = stdout.toString('utf8');
    const count = (content.match(/\uFFFD/g) || []).length;
    console.log(`Commit ${commit}: Found ${count} instances of U+FFFD.`);
  } catch (err) {
    console.log(`Commit ${commit}: Error reading file or commit not found.`, err.message);
  }
});
