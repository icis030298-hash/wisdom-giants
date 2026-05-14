const fs = require('fs');
const path = 'src/data/giants.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `      { title: "포용의 리더십", content: "당신을 가장 격렬하게 비난하는 적조차 당신의 대업을 위한 파트너로 만들 수 있는 넓은 가슴을 가지십시오." },\n    imageUrl: '/images/giants/abraham-lincoln.jpg',`;
const replacement = `      { title: "포용의 리더십", content: "당신을 가장 격렬하게 비난하는 적조차 당신의 대업을 위한 파트너로 만들 수 있는 넓은 가슴을 가지십시오." },\n      { title: "정직한 원칙", content: "환경이 당신을 속일지라도, 스스로에게 정직하고 원칙을 지키는 삶은 결국 시간의 시험을 견뎌내고 승리합니다." }\n    ],\n    imageUrl: '/images/giants/abraham-lincoln.jpg',`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully fixed giants.ts');
} else {
  // Try with \r\n
  const targetRN = target.replace(/\n/g, '\r\n');
  const replacementRN = replacement.replace(/\n/g, '\r\n');
  if (content.includes(targetRN)) {
    content = content.replace(targetRN, replacementRN);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully fixed giants.ts (with CRLF)');
  } else {
    console.error('Target content not found even with CRLF check');
    // Output a bit of content around where we think it is
    const idx = content.indexOf('abraham-lincoln');
    console.log('Context around abraham-lincoln:');
    console.log(JSON.stringify(content.slice(idx, idx + 500)));
  }
}
