const fs = require('fs');
const map = JSON.parse(fs.readFileSync('./scratch/korean_years_map_filled.json', 'utf8'));

const allOriginals = new Set();
const locales = Object.keys(map);

for (const loc of locales) {
    for (const key of Object.keys(map[loc])) {
        allOriginals.add(key);
    }
}

let table = "| 원본(ko) | " + locales.join(" | ") + " |\n";
table += "| --- | " + locales.map(()=>"---").join(" | ") + " |\n";

for (const orig of allOriginals) {
    let row = `| ${orig} |`;
    for (const loc of locales) {
        row += ` ${map[loc][orig] || ''} |`;
    }
    table += row + "\n";
}

fs.writeFileSync('./scratch/years_table.md', table, 'utf8');
console.log("Table generated at scratch/years_table.md");
