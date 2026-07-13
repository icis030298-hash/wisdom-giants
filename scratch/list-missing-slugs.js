const fs=require('fs');
const content=fs.readFileSync('src/data/blog-posts.ts', 'utf8');
const posts=content.split('"slug": "');
posts.shift();
const req=['sv', 'cs', 'th', 'hi', 'ru', 'ar'];
let missing=[];
posts.forEach(p => {
  const slug=p.match(/^([^"]+)"/)[1];
  req.forEach(l => {
    if(!p.includes('"' + l + '": {')) missing.push({slug, loc: l});
  });
});
console.log(missing.slice(0, 10));
