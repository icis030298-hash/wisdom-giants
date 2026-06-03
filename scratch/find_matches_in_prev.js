const cp = require('child_process');
const fs = require('fs');

const content = cp.execSync('git show b347d5d^:src/data/giants.ts').toString();

const TARGETS = [
  'elon-musk',
  'steve-jobs',
  'nelson-mandela',
  'margaret-thatcher',
  'mother-teresa',
  'mao-zedong',
  'stephen-hawking',
  'pablo-picasso',
  'salvador-dali',
  'coco-chanel',
  'malala-yousafzai',
  'jk-rowling',
  'oprah-winfrey'
];

TARGETS.forEach(target => {
  const d = content.indexOf(`slug: "${target}"`);
  const s = content.indexOf(`slug: '${target}'`);
  if (d !== -1 || s !== -1) {
    console.log(`Target: ${target} is present (double quotes index: ${d}, single quotes index: ${s})`);
  }
});
