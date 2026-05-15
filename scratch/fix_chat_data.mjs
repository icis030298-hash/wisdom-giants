
import fs from 'fs';
import path from 'path';

// Note: In a real environment, we'd use a parser for TS, but here we can use regex or simple string matching for giantsData
const giantsFile = 'src/data/giants.ts';
const koFile = 'messages/ko.json';
const enFile = 'messages/en.json';

const koData = JSON.parse(fs.readFileSync(koFile, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

const giantsContent = fs.readFileSync(giantsFile, 'utf8');

// Extract slugs and names
const giantRegex = /\{\s*id:[\s\S]*?name:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"/g;
let match;
const giants = [];
while ((match = giantRegex.exec(giantsContent)) !== null) {
    giants.push({ name: match[1], slug: match[2] });
}

console.log(`Found ${giants.length} giants in giants.ts`);

const updateJson = (data, isKo) => {
    if (!data.Giants) data.Giants = {};
    
    giants.forEach(g => {
        if (!data.Giants[g.slug]) {
            data.Giants[g.slug] = { name: g.name };
        }
        
        const giant = data.Giants[g.slug];
        
        if (!giant.chatGreeting) {
            giant.chatGreeting = isKo 
                ? `반갑네, 나는 ${g.name}이라네. 자네의 고민이나 내가 걸어온 길에 대해 궁금한 것이 있는가?`
                : `Greetings, I am ${g.name}. Do you have any concerns or questions about the path I've walked?`;
        }
        
        if (!giant.suggestedQuestions || !Array.isArray(giant.suggestedQuestions)) {
            giant.suggestedQuestions = isKo
                ? [
                    `${g.name}의 가장 큰 업적은 무엇인가요?`,
                    "힘든 시기를 어떻게 극복하셨나요?",
                    "지금 저에게 가장 필요한 조언이 무엇일까요?"
                ]
                : [
                    `What is your greatest achievement, ${g.name}?`,
                    "How did you overcome your most difficult times?",
                    "What advice do you have for me right now?"
                ];
        }
    });
};

updateJson(koData, true);
updateJson(enData, false);

fs.writeFileSync(koFile, JSON.stringify(koData, null, 2));
fs.writeFileSync(enFile, JSON.stringify(enData, null, 2));

console.log('Successfully updated ko.json and en.json with missing chat data');
