
import fs from 'fs';
import path from 'path';

const giantsFile = 'src/data/giants.ts';
const imagesDir = 'public/images/giants';

let content = fs.readFileSync(giantsFile, 'utf8');
const files = fs.readdirSync(imagesDir);

const manualOverrides = {
    'albert-einstein': 'einstein.jpg',
    'malala-yousafzai': 'malala.jpg',
    'nikola-tesla': 'nikola-tesla.png',
    'pablo-picasso': 'pablo-picasso.png',
    'william-shakespeare': 'william-shakespeare.png',
    'napoleon-bonaparte': 'napoleon.jpg',
    'vincent-van-gogh': 'vincent-van-gogh.jpg',
    'thomas-edison': 'thomas-edison.jpg',
    'julius-caesar': 'julius-caesar.jpg',
    'henry-ford': 'henry-ford.jpg',
    'frida-kahlo': 'frida-kahlo.jpg',
    'viktor-frankl': 'viktor-frankl.jpg',
    'oprah-winfrey': 'oprah-winfrey.jpg',
    'jk-rowling': 'jk-rowling.jpg',
    'nelson-mandela': 'nelson-mandela.jpg',
    'helen-keller': 'helen-keller.jpg',
    'beethoven': 'beethoven.jpg',
    'stephen-hawking': 'stephen-hawking.jpg',
    'franklin-d-roosevelt': 'franklin-roosevelt.jpg',
    'marcus-aurelius': 'marcus-aurelius.jpg',
    'seneca': 'seneca.jpg',
    'confucius': 'confucius.jpg',
    'socrates': 'socrates.jpg',
    'lao-tzu': 'lao-tzu.jpg',
    'aristotle': 'aristotle.jpg',
    'plato': 'plato.jpg',
    'mahatma-gandhi': 'mahatma-gandhi.jpg',
    'mother-teresa': 'mother-teresa.jpg',
    'leonardo-da-vinci': 'da-vinci.jpg',
    'salvador-dali': 'salvador-dali.jpg',
    'coco-chanel': 'coco-chanel.jpg',
    'mozart': 'mozart.jpg',
    'marie-curie': 'marie-curie.jpg',
    'george-washington': 'george-washington.png',
    'yi-sun-shin': 'yi-sun-shin.png',
    'elizabeth-i': 'elizabeth-i.png',
    'gwanggaeto-the-great': 'gwanggaeto-the-great.png',
    'qin-shi-huang': 'qin-shi-huang.png',
    'augustus': 'augustus.png',
    'otto-von-bismarck': 'otto-von-bismarck.png',
    'peter-the-great': 'peter-the-great.png',
    'catherine-the-great': 'catherine-the-great.png',
    'simon-bolivar': 'simon-bolivar.png',
    'margaret-thatcher': 'margaret-thatcher.png',
    'john-d-rockefeller': 'john-d-rockefeller.png',
    'ataturk': 'ataturk.png',
    'theodore-roosevelt': 'theodore-roosevelt.jpg',
    'anne-frank': 'anne-frank.jpg',
    'rosa-parks': 'rosa-parks.jpg',
    'frederick-douglass': 'frederick-douglass.jpg',
    'harriet-tubman': 'harriet-tubman.jpg',
    'oskar-schindler': 'oskar-schindler.jpg',
    'florence-nightingale': 'florence-nightingale.jpg',
    'yu-gwan-sun': 'yu-gwan-sun.png',
    'louis-braille': 'louis-braille.jpg',
    'joan-of-arc': 'joan-of-arc.jpg',
    'desmond-tutu': 'desmond-tutu.jpg',
    'elie-wiesel': 'elie-wiesel.jpg',
    'harriet-beecher-stowe': 'harriet-beecher-stowe.jpg',
    'rigoberta-menchu': 'rigoberta-menchu.jpg',
    'terry-fox': 'terry-fox.jpg',
    'kim-gu': 'kim-gu.png',
    'buddha': 'buddha.jpg',
    'friedrich-nietzsche': 'nietzsche.jpg',
    'immanuel-kant': 'kant.jpg',
    'rene-descartes': 'descartes.jpg',
    'jean-jacques-rousseau': 'rousseau.jpg',
    'sigmund-freud': 'freud.jpg',
    'carl-jung': 'jung.jpg',
    'baruch-spinoza': 'spinoza.jpg',
    'sun-tzu': 'sun-tzu.jpg',
    'david-hume': 'hume.jpg',
    'john-locke': 'locke.jpg',
    'simone-de-beauvoir': 'beauvoir.jpg',
    'hannah-arendt': 'arendt.jpg',
    'soren-kierkegaard': 'kierkegaard.jpg',
    'arthur-schopenhauer': 'schopenhauer.jpg',
    'isaac-newton': 'newton.jpg',
    'galileo-galilei': 'galileo.jpg',
    'charles-darwin': 'darwin.jpg',
    'michelangelo': 'michelangelo.jpg',
    'claude-monet': 'monet.jpg',
    'fyodor-dostoevsky': 'dostoevsky.jpg',
    'victor-hugo': 'hugo.jpg',
    'anton-chekhov': 'chekhov.jpg',
    'frederic-chopin': 'chopin.jpg',
    'katsushika-hokusai': 'hokusai.jpg',
    'agatha-christie': 'agatha-christie.jpg',
    'mark-twain': 'mark-twain.jpg',
    'goethe': 'goethe.jpg',
    'mary-shelley': 'mary-shelley.jpg'
};

const giantBlockRegex = /\{\s*id:[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?imageUrl:\s*"([^"]+)"[\s\S]*?\}/g;

let newContent = content;

while (true) {
    const match = giantBlockRegex.exec(content);
    if (!match) break;
    
    const slug = match[1];
    const oldImageUrl = match[2];
    
    let newFilename = manualOverrides[slug];
    
    if (!newFilename) {
        // Try to find file matching slug
        const matchFile = files.find(f => path.parse(f).name.toLowerCase() === slug.toLowerCase());
        if (matchFile) {
            newFilename = matchFile;
        }
    }
    
    if (newFilename) {
        // Verify case from disk
        const exactFile = files.find(f => f.toLowerCase() === newFilename.toLowerCase());
        if (exactFile) {
            newFilename = exactFile;
        }
    } else {
        newFilename = slug + '.jpg'; // Fallback
    }

    const newImageUrl = `/images/giants/${newFilename}`;
    
    if (oldImageUrl !== newImageUrl) {
        console.log(`Updating ${slug}: ${oldImageUrl} -> ${newImageUrl}`);
        const block = match[0];
        const newBlock = block.replace(`imageUrl: "${oldImageUrl}"`, `imageUrl: "${newImageUrl}"`);
        newContent = newContent.replace(block, newBlock);
    }
}

fs.writeFileSync(giantsFile, newContent);
console.log('Successfully updated src/data/giants.ts');
