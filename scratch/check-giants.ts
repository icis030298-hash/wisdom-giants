import * as fs from 'fs';
const content = fs.readFileSync('src/data/giants.ts', 'utf-8');
console.log(content.substring(0, 5000));
