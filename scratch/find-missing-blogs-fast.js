const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\natey\\Desktop\\wisdom-giants\\src\\data\\blog-posts.ts', 'utf8');

const posts = content.split('"slug": "');
posts.shift();

const requiredLocales = ['nl', 'tr', 'fa', 'el', 'uk', 'he', 'sv', 'ar', 'hi', 'pl', 'cs', 'vi', 'th', 'id', 'ru'];
let missing = {};

posts.forEach(postStr => {
  requiredLocales.forEach(loc => {
    if (postStr.indexOf(`"${loc}": {`) === -1) {
      if (!missing[loc]) missing[loc] = 0;
      missing[loc]++;
    }
  });
});

console.log(`Total posts: ${posts.length}`);
console.log('Missing counts per locale:', missing);
