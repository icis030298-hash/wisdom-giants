const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/th_batch_2.json', 'utf8'));
const koreanStrings = [];
let idx = 0;

function isKorean(str) {
    // If it contains any Hangul characters
    return /[\u3131-\uD79D]/.test(str);
}

function processObj(obj) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (typeof obj[i] === 'string') {
                if (isKorean(obj[i])) {
                    koreanStrings.push(obj[i]);
                    obj[i] = `__TRANSLATE_${idx}__`;
                    idx++;
                }
            } else if (typeof obj[i] === 'object' && obj[i] !== null) {
                processObj(obj[i]);
            }
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // The prompt says: "Translate all string VALUES inside timeline, keyAchievements, faq, etc into Thai (th). CRITICAL: Do NOT translate the JSON keys... Ensure the year field is also translated completely (e.g. "기원전 551년" -> "551 ปีก่อนคริสตกาล")"
                // Only process specific fields? Or all strings inside those objects?
                // The prompt says "string VALUES inside timeline, keyAchievements, faq, etc".
                // I will check if the string contains Korean. If it does, translate it.
                // Wait, it says "Ensure the `year` field is also translated completely... DO NOT skip the year field."
                if (isKorean(obj[key])) {
                    koreanStrings.push(obj[key]);
                    obj[key] = `__TRANSLATE_${idx}__`;
                    idx++;
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                processObj(obj[key]);
            }
        }
    }
}

for (const slug in data) {
    processObj(data[slug].timeline);
    processObj(data[slug].keyAchievements);
    processObj(data[slug].faq);
}

fs.writeFileSync('scratch/th_batch_2_template.json', JSON.stringify(data, null, 2));
fs.writeFileSync('scratch/korean_strings.json', JSON.stringify(koreanStrings, null, 2));
console.log('Extracted', koreanStrings.length, 'strings');
