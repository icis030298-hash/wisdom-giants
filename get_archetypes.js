const fs = require('fs');
const code = fs.readFileSync('src/data/heritage-test.ts', 'utf8');
const lines = code.split('\n');
lines.forEach(l => {
  if (l.includes('name: {')) console.log(l.trim());
});
