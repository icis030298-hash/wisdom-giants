const fs = require('fs');
const path = 'C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/blog-posts.ts';

let content = fs.readFileSync(path, 'utf8');
if (content.includes('蔓延する職業的 불안')) {
    content = content.replace('蔓延する職業的 불안', '蔓延する職業的 不安');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed "불안" in ja translation');
} else {
    console.log('Could not find the target string!');
}
