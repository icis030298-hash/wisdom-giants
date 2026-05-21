const fs = require('fs');
const en = require('./messages/en.json');
const it = require('./messages/it.json');

function compareKeys(obj1, obj2, path = '') {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  if (keys1.length !== keys2.length) {
    console.log(`Mismatch at ${path}`);
    return false;
  }
  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      console.log(`Mismatch key at ${path}: ${keys1[i]} !== ${keys2[i]}`);
      return false;
    }
    if (typeof obj1[keys1[i]] === 'object' && !Array.isArray(obj1[keys1[i]]) && obj1[keys1[i]] !== null) {
      if (!compareKeys(obj1[keys1[i]], obj2[keys2[i]], path + '.' + keys1[i])) {
        return false;
      }
    }
  }
  return true;
}

const parity = compareKeys(en, it, 'root');
console.log('Parity check:', parity ? 'SUCCESS' : 'FAILED');
