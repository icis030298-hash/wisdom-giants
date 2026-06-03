const cp = require('child_process');
try {
  const commits = cp.execSync('git log --oneline -- src/data/giants.ts').toString().trim().split('\n');
  for (const line of commits) {
    const hash = line.split(' ')[0];
    const content = cp.execSync(`git show ${hash}:src/data/giants.ts`).toString();
    const hasSejong = content.includes('king-sejong');
    console.log(`Commit ${line}: has Sejong? ${hasSejong}`);
  }
} catch(e) {
  console.error(e);
}
