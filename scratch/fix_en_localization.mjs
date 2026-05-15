
import fs from 'fs';

const enFile = 'messages/en.json';
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

const figures = enData.Giants;
let count = 0;

Object.keys(figures).forEach(slug => {
    const giant = figures[slug];
    const englishName = giant.name;
    
    // Update chatGreeting to be natural and English
    giant.chatGreeting = `Greetings, I am ${englishName}. Do you seek the path of wisdom or have questions about my life's journey?`;
    
    // Update suggestedQuestions with the English name
    giant.suggestedQuestions = [
        `Tell me about your greatest achievement, ${englishName}.`,
        "How did you overcome your most difficult challenges?",
        "What is the most important piece of advice you can give me?"
    ];
    
    count++;
});

fs.writeFileSync(enFile, JSON.stringify(enData, null, 2));

console.log(`Successfully audited and fixed ${count} entries in en.json with correct English localization.`);
