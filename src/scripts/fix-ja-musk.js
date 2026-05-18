const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, '..', '..', 'messages', 'ja.json');
const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

// Insert the two missing translated fields for Elon Musk
if (ja.Giants && ja.Giants['elon-musk']) {
  ja.Giants['elon-musk'].pain = "3回連続のロケット爆発事故と、破産寸前の深刻な資金難。";
  ja.Giants['elon-musk'].recovery = "全財産を投じた最後の賭けと、第一原理思考による危機の突破。";
  console.log("✓ Successfully added pain and recovery translations for Elon Musk in ja.json!");
} else {
  console.error("Could not find Giants.elon-musk in ja.json");
}

fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2), 'utf8');
