const fs = require('fs');

const inFile = 'c:\\\\Users\\\\user\\\\OneDrive\\\\바탕 화면\\\\wisdom-giants-20260512T091146Z-3-001\\\\wisdom-giants\\\\scratch\\\\sw_year_fix_in_1.json';
const outFile = 'c:\\\\Users\\\\user\\\\OneDrive\\\\바탕 화면\\\\wisdom-giants-20260512T091146Z-3-001\\\\wisdom-giants\\\\scratch\\\\sw_year_fix_out_1.json';

const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));

const koMap = {
  '1887년 8월 12일': '12 Agosti, 1887',
  '1910년': '1910',
  '1920년 4월 6일': '6 Aprili, 1920',
  '1921년': '1921',
  '1926년 1월': 'Januari 1926',
  '1927년': '1927',
  '1933년': '1933',
  '1935년': '1935',
  '1938년': '1938',
  '1940년': '1940',
  '1944년': '1944',
  '1948년': '1948',
  '1955년': '1955',
  '1956년': '1956',
  '1961년 1월 4일': '4 Januari, 1961',
  '2022년 1월': 'Januari 2022'
};

for (const key in data) {
  for (const i in data[key]) {
    let val = data[key][i];
    if (koMap[val]) {
      val = koMap[val];
    }
    if (val.includes(' BC')) {
      val = val.replace(/ BC/g, ' KK');
    }
    if (val.includes('spring')) {
      val = val.replace(/spring/g, 'majira ya kuchipua');
    }
    data[key][i] = val;
  }
}

fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
console.log('Done');
