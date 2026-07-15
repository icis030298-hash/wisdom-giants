const fs = require('fs');
const data = JSON.parse(fs.readFileSync('ar_agent_2.json', 'utf8'));
const b1 = JSON.parse(fs.readFileSync('ar_b1.json', 'utf8'));
const b2 = JSON.parse(fs.readFileSync('ar_b2.json', 'utf8'));
const b3 = JSON.parse(fs.readFileSync('ar_b3.json', 'utf8'));
const b4 = JSON.parse(fs.readFileSync('ar_b4.json', 'utf8'));

const trans = [...b1, ...b2, ...b3, ...b4];
let i = 0;

for (const key in data) {
  const giant = data[key];
  if (giant.timeline) {
    giant.timeline.forEach(t => {
      t.year = trans[i++];
      t.event = trans[i++];
    });
  }
  if (giant.keyAchievements) {
    giant.keyAchievements.forEach(k => {
      k.title = trans[i++];
      k.description = trans[i++];
    });
  }
  if (giant.faq) {
    giant.faq.forEach(f => {
      f.question = trans[i++];
      f.answer = trans[i++];
    });
  }
}

fs.writeFileSync('ar_agent_2_out.json', JSON.stringify(data, null, 2));
console.log('Reconstructed ar_agent_2_out.json! Replaced', i, 'strings.');
