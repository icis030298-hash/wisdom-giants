const fs = require('fs');
const path = require('path');

function fixLeaks() {
  // 1. Fix hi.json
  const hiPath = path.resolve(process.cwd(), 'messages/hi.json');
  if (fs.existsSync(hiPath)) {
    let content = fs.readFileSync(hiPath, 'utf8');
    content = content.replace("जियोंग याक योंग (정약용)", "जियोंग याक योंग");
    content = content.replace("बार्टolomeu 디아스", "बार्टोलोमियू डियास");
    content = content.replace("चिंग शी (정일수)", "चिंग शी");
    content = content.replace("पॉल गॉ갱", "पॉल गोगिन");
    fs.writeFileSync(hiPath, content, 'utf8');
    console.log("✓ Fixed leaks in messages/hi.json");
  }

  // 2. Fix ru.json
  const ruPath = path.resolve(process.cwd(), 'messages/ru.json');
  if (fs.existsSync(ruPath)) {
    let content = fs.readFileSync(ruPath, 'utf8');
    content = content.replace("Чон Як Ён (정약용)", "Чон Як Ён");
    fs.writeFileSync(ruPath, content, 'utf8');
    console.log("✓ Fixed leaks in messages/ru.json");
  }

  // 3. Fix zh.json
  const zhPath = path.resolve(process.cwd(), 'messages/zh.json');
  if (fs.existsSync(zhPath)) {
    let content = fs.readFileSync(zhPath, 'utf8');
    content = content.replace("丁若鏞 (정약용)", "丁若镛");
    fs.writeFileSync(zhPath, content, 'utf8');
    console.log("✓ Fixed leaks in messages/zh.json");
  }
}

fixLeaks();
