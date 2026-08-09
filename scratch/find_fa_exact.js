const fs = require('fs');

let content = fs.readFileSync('C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/blog-posts.ts', 'utf8');

const startIndex = content.indexOf('export const blogPosts: BlogPost[] = [');
if (startIndex !== -1) {
    content = content.substring(startIndex + 'export const blogPosts: BlogPost[] = '.length);
}

if (content.endsWith(';')) {
    content = content.substring(0, content.length - 1);
}
if (content.endsWith(';\n')) {
    content = content.substring(0, content.length - 2);
}

try {
  const blogPosts = eval(`(${content})`);
  
  let koCount = 0;
  blogPosts.forEach(post => {
      if (post.translations && post.translations.fa) {
          const faContent = post.translations.fa.content;
          if (/[가-힣]/.test(faContent)) {
              koCount++;
              console.log(`Needs fa translation: ${post.slug}`);
          }
      }
  });
  console.log(`Total fa items with Korean content: ${koCount}`);
} catch (e) {
  console.log("Failed to parse", e.message);
}
