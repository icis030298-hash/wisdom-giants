const fs = require('fs');

const batchPaths = [
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\0b7d6e98-af35-4635-925d-eb24f451d29d\\scratch\\batch0.json',
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\2024e53b-7945-43e4-a8a7-74179c9063da\\scratch\\batch1.json',
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\34a311d6-40db-4810-aa61-f1aea6533153\\scratch\\batch2.json',
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\29f86f55-0e1b-4518-8059-116eee083c6f\\scratch\\batch3.json',
    'C:\\Users\\user\\.gemini\\antigravity\\brain\\6239f4a9-a981-4287-b08f-13c27c06e2de\\scratch\\batch4.json'
];

const itPath = './messages/it.json';
const ptPath = './messages/pt.json';

const itData = JSON.parse(fs.readFileSync(itPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

let mergedCount = 0;

for (const p of batchPaths) {
    if (fs.existsSync(p)) {
        const batch = JSON.parse(fs.readFileSync(p, 'utf8'));
        for (const [id, langs] of Object.entries(batch)) {
            if (langs.it) {
                if(itData.Giants[id]) {
                    itData.Giants[id].pain = langs.it.pain;
                    itData.Giants[id].recovery = langs.it.recovery;
                }
            }
            if (langs.pt) {
                if(ptData.Giants[id]) {
                    ptData.Giants[id].pain = langs.pt.pain;
                    ptData.Giants[id].recovery = langs.pt.recovery;
                }
            }
            mergedCount++;
        }
    } else {
        console.error('File not found:', p);
    }
}

fs.writeFileSync(itPath, JSON.stringify(itData, null, 2), 'utf8');
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2), 'utf8');

console.log('Successfully merged ' + mergedCount + ' giants into it.json and pt.json');
