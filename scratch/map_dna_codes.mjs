
import fs from 'fs';

const giantsFile = 'src/data/giants.ts';
let content = fs.readFileSync(giantsFile, 'utf8');

// Define some manual mappings for famous ones to ensure accuracy
const manualDNA = {
    'steve-jobs': 'LPDI',
    'king-sejong': 'LRHI',
    'napoleon-bonaparte': 'LRDI',
    'elon-musk': 'LPDI',
    'genghis-khan': 'LRDI',
    'alexander-the-great': 'LRDI',
    'walt-disney': 'LPHI',
    'thomas-edison': 'SRDI',
    'julius-caesar': 'LRDI',
    'henry-ford': 'LRDI',
    'frida-kahlo': 'SPDI',
    'viktor-frankl': 'SRHI',
    'oprah-winfrey': 'LPHI',
    'jk-rowling': 'LPHI',
    'nelson-mandela': 'LPHT',
    'helen-keller': 'SPDT',
    'beethoven': 'SPDI',
    'stephen-hawking': 'LRHI',
    'malala-yousafzai': 'SPDT',
    'franklin-d-roosevelt': 'LRHI',
    'confucius': 'LRHT',
    'socrates': 'SRHI',
    'lao-tzu': 'SRHT',
    'aristotle': 'LRHI',
    'plato': 'LRHI',
    'mahatma-gandhi': 'LPHT',
    'martin-luther-king': 'LPDT',
    'mother-teresa': 'SRHT',
    'leonardo-da-vinci': 'LRHI',
    'salvador-dali': 'SPDI',
    'coco-chanel': 'SPDI',
    'pablo-picasso': 'SPDI',
    'mozart': 'SPDI',
    'william-shakespeare': 'LPHI',
    'albert-einstein': 'SRHI',
    'marie-curie': 'SRHI',
    'nikola-tesla': 'SRDI',
    'vincent-van-gogh': 'SPDI',
    'abraham-lincoln': 'LRHI',
    'george-washington': 'LRDT',
    'yi-sun-shin': 'LRDT',
    'elizabeth-i': 'LRDT',
    'gwanggaeto-the-great': 'LRDI',
    'winston-churchill': 'LRDT',
    'qin-shi-huang': 'LRDI',
    'augustus': 'LRDT',
    'otto-von-bismarck': 'LRDI',
    'peter-the-great': 'LRDI',
    'catherine-the-great': 'LRDI',
    'simon-bolivar': 'LPDI',
    'margaret-thatcher': 'LRDT',
    'john-d-rockefeller': 'LRDI',
    'ataturk': 'LRDI',
    'theodore-roosevelt': 'LRDI',
    'anne-frank': 'SPHT',
    'rosa-parks': 'SPDT',
    'frederick-douglass': 'LPDT',
    'harriet-tubman': 'SPDT',
    'oskar-schindler': 'SPHT',
    'florence-nightingale': 'SRHT',
    'yu-gwan-sun': 'SPDT',
    'louis-braille': 'SRDI',
    'joan-of-arc': 'LPDT',
    'desmond-tutu': 'LPHT',
    'elie-wiesel': 'SPHT',
    'harriet-beecher-stowe': 'SPDT',
    'rigoberta-menchu': 'SPDT',
    'terry-fox': 'SPDT',
    'kim-gu': 'LPDT',
    'buddha': 'SRHT',
    'friedrich-nietzsche': 'SRDI',
    'immanuel-kant': 'SRHI',
    'rene-descartes': 'SRHI',
    'jean-jacques-rousseau': 'SRHI',
    'sigmund-freud': 'SRHI',
    'carl-jung': 'SRHI',
    'baruch-spinoza': 'SRHI',
    'sun-tzu': 'LRDI',
    'david-hume': 'SRHI',
    'john-locke': 'SRHI',
    'simone-de-beauvoir': 'SPDI',
    'hannah-arendt': 'SRHI',
    'soren-kierkegaard': 'SPDI',
    'arthur-schopenhauer': 'SRHI',
    'isaac-newton': 'SRDI',
    'galileo-galilei': 'SRDI',
    'charles-darwin': 'SRHI',
    'michelangelo': 'SPDI',
    'claude-monet': 'SPHI',
    'fyodor-dostoevsky': 'SPDI',
    'victor-hugo': 'LPHI',
    'anton-chekhov': 'SPHI',
    'frederic-chopin': 'SPHI',
    'katsushika-hokusai': 'SPDI',
    'agatha-christie': 'SRHI',
    'mark-twain': 'SPDI',
    'goethe': 'LPHI',
    'mary-shelley': 'SPDI'
};

const dnaOptions = ['LRDI', 'LPDI', 'LRHI', 'LPHI', 'LRDT', 'LPDT', 'LRHT', 'LPHT', 'SRDI', 'SPDI', 'SRHI', 'SPHI', 'SRDT', 'SPDT', 'SRHT', 'SPHT'];

const giantBlockRegex = /\{\s*id:[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?\}/g;

let newContent = content;

while (true) {
    const match = giantBlockRegex.exec(content);
    if (!match) break;
    
    const slug = match[1];
    const block = match[0];
    
    if (block.includes('dnaCode:')) continue; // Already has it
    
    let dna = manualDNA[slug];
    if (!dna) {
        // Random fallback if not in manual list (shouldn't happen for the main 100 but good for safety)
        dna = dnaOptions[Math.floor(Math.random() * dnaOptions.length)];
    }
    
    const newBlock = block.replace(/slug:\s*"([^"]+)"/, `slug: "$1",\n    dnaCode: "${dna}"`);
    newContent = newContent.replace(block, newBlock);
}

// Also update the Giant interface
if (!newContent.includes('dnaCode: string;')) {
    newContent = newContent.replace('imageUrl: string;', 'imageUrl: string;\n  dnaCode: string;');
}

fs.writeFileSync(giantsFile, newContent);
console.log('Successfully updated src/data/giants.ts with dnaCode');
