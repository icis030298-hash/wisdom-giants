const fs = require('fs');
const path = require('path');

const koStringsPath = path.join(__dirname, 'ko_strings.json');
const batch5Path = path.join(__dirname, 'vi_batch_5.json');
const outPath = path.join(__dirname, 'vi_batch_5_out.json');
const trans1Path = path.join(__dirname, 'vi_translated_1.txt');
const trans2Path = path.join(__dirname, 'vi_translated_2.txt');

const koStrings = JSON.parse(fs.readFileSync(koStringsPath, 'utf8'));
const batch5 = JSON.parse(fs.readFileSync(batch5Path, 'utf8'));

const trans1 = fs.readFileSync(trans1Path, 'utf8').trim().split('\n');
const trans2 = fs.readFileSync(trans2Path, 'utf8').trim().split('\n');
const allTrans = [...trans1, ...trans2];

if (koStrings.length !== allTrans.length) {
    console.error(`Mismatch! koStrings: ${koStrings.length}, allTrans: ${allTrans.length}`);
    process.exit(1);
}

for (let i = 0; i < koStrings.length; i++) {
    const objPath = koStrings[i].path;
    const transText = allTrans[i].trim();
    
    let current = batch5;
    for (let j = 0; j < objPath.length - 1; j++) {
        current = current[objPath[j]];
    }
    const lastKey = objPath[objPath.length - 1];
    current[lastKey] = transText;
}

// Ensure formatting is maintained
fs.writeFileSync(outPath, JSON.stringify(batch5, null, 2), 'utf8');

// Check for remaining Korean characters
const outContent = fs.readFileSync(outPath, 'utf8');
const koreanRegex = /[가-힣]/g;
const matches = outContent.match(koreanRegex);

if (matches) {
    console.error(`Found ${matches.length} Korean characters remaining!`);
    // Output a few characters to see what we missed
    const matchContexts = [];
    let match;
    const regex2 = /.{0,20}[가-힣].{0,20}/g;
    let count = 0;
    while ((match = regex2.exec(outContent)) !== null && count < 5) {
        matchContexts.push(match[0].replace(/\s+/g, ' '));
        count++;
    }
    console.error("Contexts:", matchContexts);
} else {
    console.log("Success! No Korean characters remain.");
}
