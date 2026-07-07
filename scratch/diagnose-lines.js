const fs = require('fs');
const filesToDiagnose = [
  { path: 'scratch/optimization/translations/pt/trans_chunk_042.json', line: 201 },
  { path: 'scratch/optimization/translations/ru/trans_chunk_033.json', line: 230 },
  { path: 'scratch/optimization/translations/ru/trans_chunk_035.json', line: 292 },
  { path: 'scratch/optimization/translations/ru/trans_chunk_036.json', line: 288 },
  { path: 'scratch/optimization/translations/zh/trans_chunk_037.json', line: 294 },
  { path: 'scratch/optimization/translations/zh/trans_chunk_046.json', line: 287 },
  { path: 'scratch/optimization/translations/zh/trans_chunk_047.json', line: 116 }
];

filesToDiagnose.forEach(({ path, line }) => {
  if (!fs.existsSync(path)) return;
  const lines = fs.readFileSync(path, 'utf8').split('\n');
  console.log('===', path, 'line', line, '===');
  for (let i = Math.max(0, line - 4); i < Math.min(lines.length, line + 3); i++) {
    console.log(`${i+1}: ${lines[i]}`);
  }
});
