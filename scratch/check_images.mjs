
import fs from 'fs';
import path from 'path';

const giantsFile = 'src/data/giants.ts';
const imagesDir = 'public/images/giants';

// Read giants.ts
const content = fs.readFileSync(giantsFile, 'utf8');

// Simple regex to extract slug and imageUrl
const giantRegex = /slug:\s*"([^"]+)",[\s\S]*?imageUrl:\s*"([^"]+)"/g;
let match;
const updates = [];

const files = fs.readdirSync(imagesDir);

while ((match = giantRegex.exec(content)) !== null) {
    const slug = match[1];
    const imageUrl = match[2];
    
    // Check if image exists
    const filename = imageUrl.split('/').pop();
    const exists = files.some(f => f.toLowerCase() === filename.toLowerCase());
    
    if (!exists) {
        // Try to find a file matching the slug
        const possibleFiles = files.filter(f => f.startsWith(slug));
        if (possibleFiles.length > 0) {
            updates.push({
                old: imageUrl,
                new: `/images/giants/${possibleFiles[0]}`
            });
        } else {
            // Try to find a file matching the name (this is harder without more parsing)
            console.log(`Missing image for slug: ${slug}, current path: ${imageUrl}`);
        }
    } else {
        // Check case sensitivity
        const exactMatch = files.find(f => f === filename);
        if (!exactMatch) {
            const actualFile = files.find(f => f.toLowerCase() === filename.toLowerCase());
            updates.push({
                old: imageUrl,
                new: `/images/giants/${actualFile}`
            });
        }
    }
}

console.log('Suggested updates:');
console.log(JSON.stringify(updates, null, 2));
