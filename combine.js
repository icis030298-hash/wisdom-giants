const fs = require('fs');

const chunk1 = JSON.parse(fs.readFileSync('scratch/thai_chunk_1.json', 'utf8'));
const chunk2 = JSON.parse(fs.readFileSync('scratch/thai_chunk_2.json', 'utf8'));
const chunk3 = JSON.parse(fs.readFileSync('scratch/thai_chunk_3.json', 'utf8'));

const allThaiStrings = chunk1.concat(chunk2, chunk3);

// The template has placeholders like __TRANSLATE_0__, __TRANSLATE_1__
// Wait, when I wrote extract.js, I replaced the values IN THE OBJECT structure
// so they are actual strings "__TRANSLATE_0__" in the JSON.
let templateObj = JSON.parse(fs.readFileSync('scratch/th_batch_2_template.json', 'utf8'));

function replacePlaceholders(obj) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (typeof obj[i] === 'string' && obj[i].startsWith('__TRANSLATE_')) {
                const idx = parseInt(obj[i].split('_')[3], 10);
                obj[i] = allThaiStrings[idx];
            } else if (typeof obj[i] === 'object' && obj[i] !== null) {
                replacePlaceholders(obj[i]);
            }
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key].startsWith('__TRANSLATE_')) {
                const idx = parseInt(obj[key].split('_')[3], 10);
                obj[key] = allThaiStrings[idx];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                replacePlaceholders(obj[key]);
            }
        }
    }
}

replacePlaceholders(templateObj);

fs.writeFileSync('scratch/th_batch_2_out.json', JSON.stringify(templateObj, null, 2));
console.log('Replaced', allThaiStrings.length, 'strings and saved to th_batch_2_out.json');
