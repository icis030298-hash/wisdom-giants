const fs = require('fs');
const path = require('path');

const d = JSON.parse(fs.readFileSync(path.resolve('scripts/new-giants-50.json'), 'utf8'));
const k = Object.keys(d);
console.log('count:', k.length);
const first = d[k[0]];
console.log('top-level keys:', Object.keys(first));
console.log('messages keys:', Object.keys(first.messages));
console.log('epic keys:', Object.keys(first.epic).slice(0, 5), '...');
console.log('category:', first.category);
console.log('\nSample ko messages:', JSON.stringify(first.messages.ko, null, 2).slice(0, 500));
