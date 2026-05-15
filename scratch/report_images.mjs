
import fs from 'fs';
import path from 'path';

const giantsFile = 'src/data/giants.ts';
const imagesDir = 'public/images/giants';

const content = fs.readFileSync(giantsFile, 'utf8');
const files = fs.readdirSync(imagesDir).map(f => f.toLowerCase());

const giantBlockRegex = /\{\s*id:[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?imageUrl:\s*"([^"]+)"[\s\S]*?\}/g;

let match;
const results = [];

while ((match = giantBlockRegex.exec(content)) !== null) {
    const slug = match[1];
    const imageUrl = match[2];
    const filename = path.basename(imageUrl).toLowerCase();
    const exists = files.includes(filename);
    
    results.push({
        slug,
        imageUrl,
        exists
    });
}


fs.writeFileSync('scratch/report_images_data.json', JSON.stringify(results, null, 2));
console.log('Report saved to scratch/report_images_data.json');

