const fs = require('fs');
const path = require('path');

const giantsTsPath = path.join(__dirname, 'src', 'data', 'giants.ts');

const mappings = {
    'thomas-edison': '/images/giants/thomas-edison.jpg',
    'julius-caesar': '/images/giants/julius-caesar.jpg',
    'henry-ford': '/images/giants/henry-ford.jpg',
    'frida-kahlo': '/images/giants/frida-kahlo.jpg',
    'viktor-frankl': '/images/giants/viktor-frankl.jpg',
    'oprah-winfrey': '/images/giants/oprah-winfrey.jpg',
    'jk-rowling': '/images/giants/jk-rowling.jpg',
    'nelson-mandela': '/images/giants/nelson-mandela.jpg',
    'helen-keller': '/images/giants/helen-keller.jpg',
    'beethoven': '/images/giants/beethoven.jpg',
    'stephen-hawking': '/images/giants/stephen-hawking.jpg',
    'malala-yousafzai': '/images/giants/malala.jpg',
    'franklin-d-roosevelt': '/images/giants/franklin-roosevelt.jpg',
    'marcus-aurelius': '/images/giants/marcus-aurelius.jpg',
    'seneca': '/images/giants/seneca.jpg',
    'lao-tzu': '/images/giants/lao-tzu.jpg',
    'aristotle': '/images/giants/aristotle.jpg',
    'plato': '/images/giants/plato.jpg',
    'mahatma-gandhi': '/images/giants/mahatma-gandhi.jpg',
    'martin-luther-king': '/images/giants/martin-luther-king.jpg',
    'mother-teresa': '/images/giants/mother-teresa.jpg',
    'leonardo-da-vinci': '/images/giants/da-vinci.jpg',
    'salvador-dali': '/images/giants/salvador-dali.jpg',
    'coco-chanel': '/images/giants/coco-chanel.jpg',
    'mozart': '/images/giants/mozart.jpg',
    'vincent-van-gogh': '/images/giants/vincent-van-gogh.jpg',
    'abraham-lincoln': '/images/giants/abraham-lincoln.jpg',
    'pablo-picasso': '/images/giants/pablo-picasso.png',
    'william-shakespeare': '/images/giants/william-shakespeare.png',
    'nikola-tesla': '/images/giants/nikola-tesla.png',
    'george-washington': '/images/giants/george-washington.png',
    'yi-sun-shin': '/images/giants/yi-sun-shin.png',
    'elizabeth-i': '/images/giants/elizabeth-i.png',
    'gwanggaeto-the-great': '/images/giants/gwanggaeto-the-great.png',
    'winston-churchill': '/images/giants/winston-churchill.png',
    'qin-shi-huang': '/images/giants/qin-shi-huang.png',
    'augustus': '/images/giants/augustus.png',
    'otto-von-bismarck': '/images/giants/otto-von-bismarck.png',
    'peter-the-great': '/images/giants/peter-the-great.png',
    'catherine-the-great': '/images/giants/catherine-the-great.png',
    'simon-bolivar': '/images/giants/simon-bolivar.png',
    'margaret-thatcher': '/images/giants/margaret-thatcher.png',
    'john-d-rockefeller': '/images/giants/john-d-rockefeller.png',
    'ataturk': '/images/giants/ataturk.png'
};

let giantsTsContent = fs.readFileSync(giantsTsPath, 'utf8');

for (const [slug, newPath] of Object.entries(mappings)) {
    const regex = new RegExp(`(slug:\\s*['"]${slug}['"](?:.|\\n)*?imageUrl:\\s*['"])([^'"]+)(['"])`);
    if (regex.test(giantsTsContent)) {
        giantsTsContent = giantsTsContent.replace(regex, `$1${newPath}$3`);
    }
}

fs.writeFileSync(giantsTsPath, giantsTsContent);
console.log('Explicitly updated 44 giant image paths.');
