const fs = require('fs');
const frFile = './src/data/fact-layers/fact-layer-fr.json';
const frData = JSON.parse(fs.readFileSync(frFile));
frData['buddha'].faq.forEach(f => { 
    if(f.answer.includes('붓다')) f.answer = f.answer.replace('(붓다)', ''); 
});
fs.writeFileSync(frFile, JSON.stringify(frData, null, 2));

const idFile = './src/data/fact-layers/fact-layer-id.json';
const idData = JSON.parse(fs.readFileSync(idFile));
idData['buddha'].faq.forEach(f => { 
    if(f.question.includes('보통 누가 부처라고 불리나요?')) 
        f.question = 'Siapa yang biasanya disebut Buddha?'; 
});
idData['zoroaster'].keyAchievements.forEach(a => { 
    if(a.description.includes('마즈다야스나라는')) 
        a.description = "Mendirikan sistem etika agama yang disebut Mazdayasna, yang berarti 'pemujaan terhadap kebijaksanaan/Mazda'."; 
});
fs.writeFileSync(idFile, JSON.stringify(idData, null, 2));
console.log('Patched');
