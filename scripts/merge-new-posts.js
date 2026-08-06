const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'src', 'data', 'new-posts');
const blogPostsFile = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');

const postFiles = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.json'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('post-', '').replace('.json', ''), 10);
    const numB = parseInt(b.replace('post-', '').replace('.json', ''), 10);
    return numA - numB;
  });

console.log(`Found ${postFiles.length} new post files to merge.`);

const newPosts = postFiles.map(f => JSON.parse(fs.readFileSync(path.join(postsDir, f), 'utf8')));

// Format each post into TS object literal code string
function formatPostTS(p) {
  return `  {
    slug: ${JSON.stringify(p.slug)},
    category: ${JSON.stringify(p.category)},
    giantSlug: ${JSON.stringify(p.giantSlug)},
    publishedAt: ${JSON.stringify(p.publishedAt)},
    translations: ${JSON.stringify(p.translations, null, 6).replace(/\n/g, '\n    ')}
  }`;
}

const newPostsTS = newPosts.map(formatPostTS).join(',\n');

let tsContent = fs.readFileSync(blogPostsFile, 'utf8');

// Find the last ];
const lastBracketIndex = tsContent.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error('Could not find closing ]; in blog-posts.ts');
  process.exit(1);
}

// Insert new posts before closing ];
const updatedContent = tsContent.slice(0, lastBracketIndex) + ',\n' + newPostsTS + '\n];\n';

fs.writeFileSync(blogPostsFile, updatedContent, 'utf8');
console.log('Successfully merged 20 new posts into src/data/blog-posts.ts');
