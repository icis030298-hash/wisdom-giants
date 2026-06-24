const { execSync } = require('child_process');
try {
  const r = execSync('git commit -m "feat: Add 10 flat vector illustrations for new giants (charlemagne, akbar, nzinga, cyrus, pachacuti, ramesses, elizabeth-i, frederick, hatshepsut, faraday)"', {
    cwd: process.cwd(), encoding: 'utf8'
  });
  console.log(r);
} catch(e) { console.error(e.stdout, e.stderr); }
