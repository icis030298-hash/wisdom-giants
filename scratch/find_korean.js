const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/el_batch_8_out.json', 'utf8'));

function findKorean(obj, path = '') {
    const koreanRegex = /[\uAC00-\uD7A3\u3130-\u318F]/;
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            if (koreanRegex.test(obj[key])) {
                console.log(`Found Korean at ${path}.${key}: ${obj[key]}`);
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            findKorean(obj[key], `${path}.${key}`);
        }
    }
}

findKorean(data);
