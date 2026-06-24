const { execSync } = require('child_process');
try {
  const r = execSync('git commit -m "feat: Merge 50 new giants into giants.ts (241 total) and exclude scratch/scripts from tsconfig"', {
    cwd: process.cwd(), encoding: 'utf8'
  });
  console.log(r);
} catch(e) { console.error(e.stdout, e.stderr); }
