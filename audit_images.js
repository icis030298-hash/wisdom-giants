const fs = require('fs');
const path = require('path');

const giantsTsPath = path.join(__dirname, 'src', 'data', 'giants.ts');
const imageDir = path.join(__dirname, 'public', 'images', 'giants');

const giantsTsContent = fs.readFileSync(giantsTsPath, 'utf8');
const giants = [];
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
const imageUrlRegex = /imageUrl:\s*['"]([^'"]+)['"]/g;
const categoryRegex = /category:\s*['"]([^'"]+)['"]/g;

let match;
const slugs = [];
while ((match = slugRegex.exec(giantsTsContent)) !== null) {
    slugs.push(match[1]);
}

const names = [];
while ((match = nameRegex.exec(giantsTsContent)) !== null) {
    names.push(match[1]);
}

const imageUrls = [];
while ((match = imageUrlRegex.exec(giantsTsContent)) !== null) {
    imageUrls.push(match[1]);
}

const categories = [];
while ((match = categoryRegex.exec(giantsTsContent)) !== null) {
    categories.push(match[1]);
}

const giantsData = slugs.map((slug, i) => ({
    slug,
    name: names[i],
    imageUrl: imageUrls[i],
    category: categories[i]
}));

const existingImages = fs.readdirSync(imageDir);

const audit = giantsData.map(g => {
    const filename = path.basename(g.imageUrl);
    const exists = existingImages.includes(filename);
    return {
        ...g,
        exists,
        actualFile: exists ? filename : null
    };
});

const missing = audit.filter(a => !a.exists);
const present = audit.filter(a => a.exists);

console.log(`Total Giants: ${audit.length}`);
console.log(`Present Images: ${present.length}`);
console.log(`Missing Images: ${missing.length}`);

fs.writeFileSync('audit_images.json', JSON.stringify({ audit, missing, present }, null, 2));

console.log('\nMissing Slugs:');
missing.forEach(m => console.log(`- ${m.slug} (${m.name}) -> path: ${m.imageUrl}`));
