const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:/Users/natey/Desktop/wisdom-giants/scratch/fa_agent_1.json'));

let extracted = [];
for (const [slug, giant] of Object.entries(data)) {
    if (giant.timeline) {
        for (const t of giant.timeline) {
            extracted.push(t.year);
            extracted.push(t.event);
        }
    }
    if (giant.keyAchievements) {
        for (const a of giant.keyAchievements) {
            extracted.push(a.title);
            extracted.push(a.description);
        }
    }
    if (giant.faq) {
        for (const f of giant.faq) {
            extracted.push(f.question);
            extracted.push(f.answer);
        }
    }
}

fs.writeFileSync('c:/Users/natey/Desktop/wisdom-giants/scratch/test_extract2.json', JSON.stringify(extracted, null, 2));
console.log('Extracted length:', extracted.length);
