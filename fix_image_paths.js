const fs = require('fs');
const path = require('path');

const giantsTsPath = path.join(__dirname, 'src', 'data', 'giants.ts');
const imageDir = path.join(__dirname, 'public', 'images', 'giants');

const existingImages = fs.readdirSync(imageDir);
let giantsTsContent = fs.readFileSync(giantsTsPath, 'utf8');

const slugs = [...giantsTsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

let updatedCount = 0;
slugs.forEach(slug => {
    // Look for a file that matches the slug
    let match = existingImages.find(f => f.toLowerCase().startsWith(slug.toLowerCase() + '.') || f.toLowerCase().includes(slug.toLowerCase().replace(/-/g, '')));
    
    if (!match) {
        // Try matching by last name
        const lastName = slug.split('-').pop();
        match = existingImages.find(f => f.toLowerCase().includes(lastName.toLowerCase()));
    }

    if (match) {
        const newPath = `/images/giants/${match}`;
        // Regex to replace imageUrl for this specific slug block
        const regex = new RegExp(`(slug:\\s*['"]${slug}['"](?:.|\\n)*?imageUrl:\\s*['"])([^'"]+)(['"])`);
        if (regex.test(giantsTsContent)) {
            const oldPath = giantsTsContent.match(regex)[2];
            if (oldPath !== newPath) {
                giantsTsContent = giantsTsContent.replace(regex, `$1${newPath}$3`);
                updatedCount++;
                console.log(`Updated ${slug}: ${oldPath} -> ${newPath}`);
            }
        }
    }
});

fs.writeFileSync(giantsTsPath, giantsTsContent);
console.log(`\nMISSION 1 COMPLETE: Updated ${updatedCount} image paths.`);
