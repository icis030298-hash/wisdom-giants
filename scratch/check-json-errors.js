const fs = require('fs');
const errors = [
  { locale: 'pt', chunk: '023' },
  { locale: 'pt', chunk: '042' },
  { locale: 'ru', chunk: '027' },
  { locale: 'ru', chunk: '028' },
  { locale: 'ru', chunk: '033' },
  { locale: 'ru', chunk: '035' },
  { locale: 'ru', chunk: '036' },
  { locale: 'zh', chunk: '037' },
  { locale: 'zh', chunk: '046' },
  { locale: 'zh', chunk: '047' }
];

errors.forEach(({ locale, chunk }) => {
  const filePath = `scratch/optimization/translations/${locale}/trans_chunk_${chunk}.json`;
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    JSON.parse(content);
  } catch (err) {
    console.log('===', filePath, '===');
    console.log(err.message);
    const posMatch = err.message.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      if (!isNaN(pos)) {
        const start = Math.max(0, pos - 80);
        const end = Math.min(content.length, pos + 80);
        console.log('Context:', JSON.stringify(content.slice(start, end)));
      }
    }
  }
});
