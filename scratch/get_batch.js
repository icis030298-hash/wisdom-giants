const fs = require('fs');

const content = fs.readFileSync('src/data/giants.ts', 'utf8');

// A safer way to extract:
// Match everything from { to }
const objRegex = /\{[^{}]*\}/g;
let match;
const giants = [];
while ((match = objRegex.exec(content)) !== null) {
    const text = match[0];
    if (text.includes('slug:')) {
        const slugMatch = text.match(/slug:\s*["']([^"']+)["']/);
        const nameMatch = text.match(/name:\s*["']([^"']+)["']/);
        const headlineMatch = text.match(/headline:\s*["']([^"']+)["']/);
        if (slugMatch) {
            giants.push({
                slug: slugMatch[1],
                name: nameMatch ? nameMatch[1] : slugMatch[1],
                headline: headlineMatch ? headlineMatch[1] : "Historical Figure"
            });
        }
    }
}

const dir = 'public/images/giants';
const files = fs.readdirSync(dir);
const placeholderSize = 309920;
let remain = files.filter(f => fs.statSync(dir + '/' + f).size === placeholderSize).map(f => f.replace('.jpg', ''));

const next20 = remain.slice(0, 20).map(s => {
    const g = giants.find(g => g.slug === s);
    return g || { slug: s, name: s, headline: "Historical Figure" };
});

console.log(JSON.stringify(next20, null, 2));
