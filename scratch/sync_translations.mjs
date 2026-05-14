
import fs from 'fs';
import path from 'path';

// This is a scratch script to sync giants data to ko.json
// Since we can't easily import TS files in a simple node script without setup,
// we'll use regex to extract the data from giants.ts

const giantsTsPath = 'src/data/giants.ts';
const koJsonPath = 'messages/ko.json';

const giantsTsContent = fs.readFileSync(giantsTsPath, 'utf-8');
const koJsonContent = JSON.parse(fs.readFileSync(koJsonPath, 'utf-8'));

// Regex to find giant objects
// We want id, name, slug, headline, shortDescription, quote, pain, recovery, lessons, persona
const giantRegex = /\{\s*id:\s*'(\d+)',\s*name:\s*'([^']+)',[\s\S]*?slug:\s*'([^']+)',\s*headline:\s*'([^']+)',\s*shortDescription:\s*'([^']+)',[\s\S]*?quote:\s*"([^"]+)",\s*pain:\s*"([^"]+)",\s*recovery:\s*"([^"]+)",\s*lessons:\s*(\[[\s\S]*?\]),\s*imageUrl:[\s\S]*?persona:\s*"([^"]+)"/g;

let match;
const newGiants = {};

while ((match = giantRegex.exec(giantsTsContent)) !== null) {
  const [_, id, name, slug, headline, shortDescription, quote, pain, recovery, lessonsStr, persona] = match;
  
  // Parse lessons
  const lessonsMatch = lessonsStr.match(/title:\s*"([^"]+)",\s*content:\s*"([^"]+)"/g);
  const lessons = (lessonsMatch || []).map(l => {
    const parts = l.match(/title:\s*"([^"]+)",\s*content:\s*"([^"]+)"/);
    return { title: parts[1], content: parts[2] };
  });

  newGiants[slug] = {
    name,
    headline,
    shortDescription,
    pain,
    recovery,
    lessons,
    quote,
    persona,
    chatGreeting: `반갑네, 미래에서 온 친구여. 나는 ${name}이라네. ${shortDescription}로서 자네의 고민에 귀를 기울일 준비가 되었네. 어떤 지혜를 찾고 있는가?`,
    suggestedQuestions: [
      "당신의 가장 위대한 발견은 무엇인가요?",
      "현대인들에게 해주고 싶은 조언이 있나요?",
      "가장 힘들었던 순간을 어떻게 극복했나요?",
      "성공적인 삶을 위한 태도는 무엇일까요?"
    ],
    era: "역사의 거인"
  };
}

// Update ko.json
koJsonContent.Giants = { ...koJsonContent.Giants, ...newGiants };

fs.writeFileSync(koJsonPath, JSON.stringify(koJsonContent, null, 2), 'utf-8');
console.log('Successfully updated ko.json with giants data.');
