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
    if (giant.fact_box) {
        extracted.push(giant.fact_box.one_line_summary);
        if (giant.fact_box.key_achievements) {
            for (const a of giant.fact_box.key_achievements) {
                extracted.push(a.title);
                extracted.push(a.description);
            }
        }
        extracted.push(giant.fact_box.legacy_statement);
    }
    if (giant.faq) {
        for (const f of giant.faq) {
            extracted.push(f.question);
            extracted.push(f.answer);
        }
    }
}

fs.writeFileSync('c:/Users/natey/Desktop/wisdom-giants/scratch/test_extract.json', JSON.stringify(extracted, null, 2));
console.log('Extracted length:', extracted.length);
