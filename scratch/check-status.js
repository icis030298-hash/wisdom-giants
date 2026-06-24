const fs = require('fs');
const path = require('path');

const merged = JSON.parse(fs.readFileSync(path.resolve('scripts/new-giants-50.json'), 'utf8'));
const mergedKeys = Object.keys(merged);
console.log('Current merged count:', mergedKeys.length);

const ALL_50 = [
  'charlemagne', 'akbar-the-great', 'pachacuti', 'queen-nzinga', 'ramesses-ii',
  'cyrus-the-great', 'queen-elizabeth-i', 'frederick-the-great', 'william-the-conqueror',
  'giuseppe-garibaldi', 'hatshepsut', 'zenobia', 'moctezuma-ii', 'tran-hung-dao',
  'michael-faraday', 'james-clerk-maxwell', 'edward-jenner', 'erwin-schrodinger',
  'james-hutton', 'georges-cuvier',
  'epicurus', 'diogenes', 'heraclitus', 'pythagoras', 'plotinus',
  'john-stuart-mill', 'gottfried-leibniz', 'meister-eckhart',
  'homer', 'virgil', 'jane-austen', 'charles-dickens', 'rembrandt',
  'francisco-de-goya', 'franz-schubert', 'george-eliot', 'emily-dickinson', 'henrik-ibsen',
  'dorothea-dix', 'clara-barton', 'ida-b-wells', 'elizabeth-cady-stanton',
  'harriet-martineau', 'olympe-de-gouges',
  'james-cook', 'bartolomeu-dias', 'ernest-shackleton', 'henry-hudson',
  'vitus-bering', 'roald-amundsen'
];

const missing = ALL_50.filter(s => !mergedKeys.includes(s));
console.log('\nMissing (' + missing.length + '):', missing);
console.log('\nMerged (' + mergedKeys.length + '):', mergedKeys);
