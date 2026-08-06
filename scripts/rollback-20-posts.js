const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
let content = fs.readFileSync(file, 'utf8');

// Find the start of post-1 (marcus-aurelius-stoic-mindset)
const post1Index = content.indexOf('slug: "marcus-aurelius-stoic-mindset"');
if (post1Index === -1) {
  console.log('marcus-aurelius-stoic-mindset not found. File may already be rolled back.');
} else {
  // Find the opening brace of that object before post1Index
  const objectStartIndex = content.lastIndexOf('{\n    slug: "marcus-aurelius-stoic-mindset"', post1Index);
  const altIndex = content.lastIndexOf('{\n  slug: "marcus-aurelius-stoic-mindset"', post1Index);
  const targetIndex = Math.max(objectStartIndex, altIndex);
  
  if (targetIndex !== -1) {
    // Find preceding comma or newline
    const slicePoint = content.lastIndexOf(',', targetIndex);
    if (slicePoint !== -1) {
      content = content.slice(0, slicePoint) + '\n];\n';
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully sliced blog-posts.ts back to original 195 posts.');
    }
  }
}

// Remove src/data/new-posts directory
const newPostsDir = path.join(__dirname, '..', 'src', 'data', 'new-posts');
if (fs.existsSync(newPostsDir)) {
  fs.rmSync(newPostsDir, { recursive: true, force: true });
  console.log('Successfully deleted src/data/new-posts/ directory.');
}

// Verify count using JS evaluation
const cleanCode = content.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();
console.log(`VERIFICATION: Current blogPosts array length = ${blogPosts.length}`);
if (blogPosts.length === 195) {
  console.log('CONFIRMED: Exactly 195 posts present in blog-posts.ts!');
} else {
  console.error(`WARNING: Post count is ${blogPosts.length}, expected 195.`);
}
