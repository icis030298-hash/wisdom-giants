const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
let text = fs.readFileSync(filePath, 'utf8');

// Replace "撒哈라沙漠" with "撒哈拉沙漠"
if (text.includes("撒哈라沙漠")) {
  text = text.replace(/撒哈라沙漠/g, "撒哈拉沙漠");
  console.log("✓ Replaced 撒哈라沙漠 with 撒哈拉沙漠.");
}

// Replace "穆罕默드" with "穆罕默德"
if (text.includes("穆罕默드")) {
  text = text.replace(/穆罕默드/g, "穆罕默德");
  console.log("✓ Replaced 穆罕默드 with 穆罕默德.");
}

fs.writeFileSync(filePath, text, 'utf8');
console.log("=== LEAKS FIXED IN final-narratives.json ===");
