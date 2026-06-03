const cp = require('child_process');
try {
  const content = cp.execSync('git show 6d02626:src/data/giants.ts').toString();
  const matches = {};
  const regex = /slug:\s*["'](.*?)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const slug = match[1];
    matches[slug] = (matches[slug] || 0) + 1;
  }
  console.log(JSON.stringify(matches, null, 2));
} catch(e) {
  console.error(e);
}
