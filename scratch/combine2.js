const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/fa_agent_1.json', 'utf8'));

let ko_strings = [];
let fa_strings = [];

for (let i = 0; i < 10; i++) {
    const k = JSON.parse(fs.readFileSync(`scratch/chunk_${i}.json`, 'utf8'));
    const f = JSON.parse(fs.readFileSync(`scratch/out_${i}.json`, 'utf8'));
    ko_strings = ko_strings.concat(k);
    fa_strings = fa_strings.concat(f);
}

const dict = {};
for (let i = 0; i < ko_strings.length; i++) {
    dict[ko_strings[i]] = fa_strings[i];
}

function traverse(obj) {
    if (typeof obj === 'string') {
        if (dict.hasOwnProperty(obj)) {
            return dict[obj];
        }
        return obj;
    } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = traverse(obj[i]);
        }
    } else if (obj !== null && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            obj[key] = traverse(obj[key]);
        }
    }
    return obj;
}

traverse(data);

fs.writeFileSync('scratch/fa_agent_1_out.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully written fa_agent_1_out.json!');
