const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'src/data/fact-layers');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalFixed = 0;
let filesChanged = [];

files.forEach(file => {
  const locale = file.match(/fact-layer-(.+)\.json/)[1];
  if (locale === 'ko') return;

  const filePath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  Object.entries(data).forEach(([slug, giant]) => {
    if (!giant.timeline || !Array.isArray(giant.timeline)) return;

    giant.timeline.forEach(item => {
      // Check 'year' field (not 'date')
      if (!item.year || !item.year.includes('년')) return;

      const dateStr = item.year;
      const isBC = dateStr.includes('기원전');
      const cleanStr = dateStr.replace('기원전', '').trim();

      const matchFull = cleanStr.match(/(\d+)년\s*(\d+)월\s*(\d+)일/);
      const matchMonth = cleanStr.match(/(\d+)년\s*(\d+)월/);
      const matchYear = cleanStr.match(/(\d+)년/);

      let year, month, day;
      if (matchFull) {
        year = parseInt(matchFull[1]); month = parseInt(matchFull[2]); day = parseInt(matchFull[3]);
      } else if (matchMonth) {
        year = parseInt(matchMonth[1]); month = parseInt(matchMonth[2]);
      } else if (matchYear) {
        year = parseInt(matchYear[1]);
      }

      if (!year) return;

      try {
        let formatted = '';
        const bce = isBC ? ' BC' : '';

        if (day && month) {
          const d = new Date(Date.UTC(2000, month - 1, day));
          const opts = { month: 'long', day: 'numeric' };
          formatted = `${new Intl.DateTimeFormat(locale, opts).format(d)}, ${year}${bce}`;
        } else if (month) {
          const d = new Date(Date.UTC(2000, month - 1, 1));
          const opts = { month: 'long' };
          formatted = `${new Intl.DateTimeFormat(locale, opts).format(d)} ${year}${bce}`;
        } else {
          formatted = `${year}${bce}`;
        }

        item.year = formatted;
        changed = true;
        totalFixed++;
      } catch (e) {
        console.error(`Error formatting date in ${file}: ${e.message}`);
      }
    });
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    filesChanged.push(file);
  }
});

console.log(`Fixed ${totalFixed} dates across ${filesChanged.length} files:`);
filesChanged.forEach(f => console.log(' -', f));
