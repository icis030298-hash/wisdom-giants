const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, '../messages/ja.json');
const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

console.log('Is Giants defined?', !!ja.Giants);
console.log('Is Giants.albert-einstein defined?', !!(ja.Giants && ja.Giants['albert-einstein']));
console.log('Is Giants.mark-twain defined?', !!(ja.Giants && ja.Giants['mark-twain']));
console.log('Is albert-einstein at root level?', !!ja['albert-einstein']);
console.log('Is mark-twain at root level?', !!ja['mark-twain']);
