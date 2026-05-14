
import fs from 'fs';
import path from 'path';

// Robust sync script for giants translations
const giantsTsPath = 'src/data/giants.ts';
const locales = ['ko', 'en'];

const giantsTsContent = fs.readFileSync(giantsTsPath, 'utf-8');

// Extract all giant objects by splitting the file content
const giantsArrayStr = giantsTsContent.split('export const giantsData: Giant[] = [')[1].split('];')[0];
const giantBlocks = giantsArrayStr.split(/},\s*{/);

const extractField = (block, fieldName) => {
  // Try both single and double quotes
  const regexS = new RegExp(`${fieldName}:\\s*'([^']+)'`);
  const regexD = new RegExp(`${fieldName}:\\s*"([^"]+)"`);
  const matchS = block.match(regexS);
  const matchD = block.match(regexD);
  return (matchS ? matchS[1] : (matchD ? matchD[1] : '')).trim();
};

const extractLessons = (block) => {
  const lessonsMatch = block.match(/lessons:\s*\[([\s\S]*?)\]/);
  if (!lessonsMatch) return [];
  const lessonsStr = lessonsMatch[1];
  const lessonBlocks = lessonsStr.split(/},\s*{/);
  return lessonBlocks.map(lb => ({
    title: extractField(lb, 'title'),
    content: extractField(lb, 'content')
  }));
};

const allGiants = {};

giantBlocks.forEach((block, index) => {
  // Add back the braces for the first and last elements if needed
  const normalizedBlock = (index === 0 ? block : (index === giantBlocks.length - 1 ? block : '{' + block + '}'));
  
  const slug = extractField(block, 'slug');
  if (!slug) return;

  const id = extractField(block, 'id');
  const name = extractField(block, 'name');
  const headline = extractField(block, 'headline');
  const shortDescription = extractField(block, 'shortDescription');
  const quote = extractField(block, 'quote');
  const pain = extractField(block, 'pain');
  const recovery = extractField(block, 'recovery');
  const persona = extractField(block, 'persona');
  const lessons = extractLessons(block);

  allGiants[slug] = {
    id,
    name,
    headline,
    shortDescription,
    quote,
    pain,
    recovery,
    lessons,
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
});

// Update ko.json
const koJsonPath = 'messages/ko.json';
const koJson = JSON.parse(fs.readFileSync(koJsonPath, 'utf-8'));
koJson.Giants = { ...koJson.Giants, ...allGiants };
fs.writeFileSync(koJsonPath, JSON.stringify(koJson, null, 2), 'utf-8');
console.log(`Updated ko.json with ${Object.keys(allGiants).length} giants.`);

// Update en.json (with basic English mapping from slug)
const enJsonPath = 'messages/en.json';
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));

const toTitleCase = (str) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const allGiantsEn = {};
Object.keys(allGiants).forEach(slug => {
  const g = allGiants[slug];
  // If already exists in en.json, don't overwrite with placeholders
  if (enJson.Giants[slug] && enJson.Giants[slug].name && !enJson.Giants[slug].name.includes('.')) {
    return;
  }

  allGiantsEn[slug] = {
    name: toTitleCase(slug),
    headline: toTitleCase(slug) + ": A Historical Giant",
    shortDescription: "A visionary who changed the course of history.",
    quote: g.quote, // Keep Korean quote for now as placeholder or use slug
    pain: "Historical challenges and adversities faced during their lifetime.",
    recovery: "The process of overcoming obstacles and achieving greatness.",
    lessons: g.lessons.map(l => ({ title: "Lesson", content: "Wisdom from history." })),
    persona: `You are ${toTitleCase(slug)}. Provide wise advice in a professional and insightful manner.`,
    chatGreeting: `Greetings, traveler from the future. I am ${toTitleCase(slug)}. How can I assist you today?`,
    suggestedQuestions: [
      "What was your greatest achievement?",
      "What advice do you have for people today?",
      "How did you overcome your greatest challenge?",
      "What is the secret to a successful life?"
    ],
    era: "Historical Giant"
  };
});

enJson.Giants = { ...enJson.Giants, ...allGiantsEn };
fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf-8');
console.log(`Updated en.json with ${Object.keys(allGiantsEn).length} English placeholders.`);
