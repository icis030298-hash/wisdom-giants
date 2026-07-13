const fs = require('fs');

// We have to extract blogPosts from src/data/blog-posts.ts
const content = fs.readFileSync('C:\\Users\\natey\\Desktop\\wisdom-giants\\src\\data\\blog-posts.ts', 'utf8');

const regex = /"slug": "([^"]+)"[\s\S]*?"translations": {([\s\S]*?)(?=    },?\n    })/g;
let match;
let missing = {};
const requiredLocales = ['nl', 'tr', 'fa', 'el', 'uk', 'he', 'sv', 'ar', 'hi', 'pl', 'cs']; 

while ((match = regex.exec(content)) !== null) {
  const slug = match[1];
  const transBlock = match[2];
  
  requiredLocales.forEach(loc => {
    if (!transBlock.includes(`"${loc}": {`)) {
      if (!missing[loc]) missing[loc] = 0;
      missing[loc]++;
    }
  });
}

console.log(missing);
