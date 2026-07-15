const fs = require('fs');
const txt = fs.readFileSync('C:/Users/natey/Desktop/wisdom-giants/scratch/el_batch_1.json', 'utf8');
const obj = JSON.parse(txt);
const koStrings = new Set();
const extract = (val) => {
  if (typeof val === 'string') {
    if (/[가-힣]/.test(val)) {
      koStrings.add(val);
    }
  } else if (Array.isArray(val)) {
    val.forEach(extract);
  } else if (val && typeof val === 'object') {
    Object.values(val).forEach(extract);
  }
};
extract(obj);
fs.writeFileSync('C:/Users/natey/Desktop/wisdom-giants/scratch/ko_strings.json', JSON.stringify(Array.from(koStrings), null, 2), 'utf8');
