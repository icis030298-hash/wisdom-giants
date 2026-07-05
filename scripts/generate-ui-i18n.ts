import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("Error: GEMINI_API_KEY not configured."); process.exit(1); }

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const uiKeys = {
  about: "ABOUT",
  quotesCollection: "Quotes Collection",
  deleteConversationConfirm: "Delete this conversation? This cannot be undone.",
  deleteConversation: "Delete conversation",
  debateRoom: "The Debate Room",
  aiDebate: "AI Debate",
  historicalGiantsDebate: "Historical Giants Debate",
  aristotleVsNietzsche: "Aristotle vs Nietzsche",
  aiChat: "AI Chat",
  historicalFigure: "Historical Figure",
  home: "Home",
  hallOfGiants: "Hall of Giants",
  continuePreviousChat: "Continue Previous Chat",
  loadingChatHistory: "Loading chat history...",
  recommendedGiants: "Recommended Giants",
  learnMoreOnWikipedia: "Learn more on Wikipedia",
  exploreLegacyOfOtherGiants: "Explore the legacy of other giants who walked a similar path in this field.",
  shareResults: "Share Results",
  storyFormat: "Story (9:16)",
  talkWithGiant: "Talk with Giant",
  timelineAndFacts: "Timeline & Facts",
  timeline: "Timeline",
  keyAchievements: "Key Achievements",
  readEpic: "Read Epic",
  warningAiMistakes: "Giants Wisdom is an AI chatbot and may make mistakes. Please verify important information through actual historical records.",
  echoesOfPast: "Echoes of the past • Wisdom that transcends time"
};

const languages = [
  'ko', 'en', 'ja', 'zh', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ar', 'hi', 'bn',
  'tr', 'fa', 'pl', 'nl', 'sv', 'vi', 'uk', 'id', 'cs', 'ro', 'hu'
];

const langNameMap: Record<string, string> = {
  'ko': 'Korean', 'en': 'English', 'ja': 'Japanese', 'zh': 'Chinese (Simplified)', 'fr': 'French',
  'de': 'German', 'es': 'Spanish', 'it': 'Italian', 'pt': 'Portuguese',
  'ru': 'Russian', 'ar': 'Arabic', 'hi': 'Hindi', 'bn': 'Bengali',
  'tr': 'Turkish', 'fa': 'Persian', 'pl': 'Polish', 'nl': 'Dutch',
  'sv': 'Swedish', 'vi': 'Vietnamese', 'uk': 'Ukrainian', 'id': 'Indonesian',
  'cs': 'Czech', 'ro': 'Romanian', 'hu': 'Hungarian'
};

async function translateUI(langCode: string): Promise<any> {
  if (langCode === 'en') return uiKeys;
  
  if (langCode === 'ko') {
    return {
      about: "소개",
      quotesCollection: "명언 모음",
      deleteConversationConfirm: "이 대화를 삭제하시겠습니까? 복구할 수 없습니다.",
      deleteConversation: "대화 삭제",
      debateRoom: "역사의 토론방",
      aiDebate: "AI 토론",
      historicalGiantsDebate: "역사 위인 토론",
      aristotleVsNietzsche: "아리스토텔레스 니체 토론",
      aiChat: "AI 대화",
      historicalFigure: "역사 위인",
      home: "홈",
      hallOfGiants: "거인들의 전당",
      continuePreviousChat: "이전 대화 이어가기",
      loadingChatHistory: "대화 기록을 불러오는 중...",
      recommendedGiants: "관련 거인 추천",
      learnMoreOnWikipedia: "위키백과에서 알아보기",
      exploreLegacyOfOtherGiants: "이 분야에서 비슷한 길을 걸었던 다른 거인들의 유산도 탐구해보세요.",
      shareResults: "결과 공유하기",
      storyFormat: "스토리형 (9:16)",
      talkWithGiant: "거인과 대화하기",
      timelineAndFacts: "한눈에 보는 발자취",
      timeline: "연표",
      keyAchievements: "핵심 업적",
      readEpic: "대서사시 읽기",
      warningAiMistakes: "Giants Wisdom은 AI 챗봇으로서 실수를 할 수 있으므로, 중요한 정보는 위인의 실제 역사적 기록을 통해 한 번 더 확인하시기 바랍니다.",
      echoesOfPast: "과거의 메아리 • 시간을 초월한 지혜"
    };
  }

  const prompt = `Translate the following JSON object containing UI strings from English to ${langNameMap[langCode]}.
Keep the exact same JSON keys. Only translate the values.
Provide ONLY valid JSON output. No markdown, no backticks.

${JSON.stringify(uiKeys, null, 2)}`;

  let success = false;
  let attempts = 0;
  while (!success && attempts < 3) {
    attempts++;
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });
      const text = response.response.text();
      return JSON.parse(text);
    } catch (e: any) {
      console.log(`Retry ${langCode} (${attempts}/3) due to: ${e.message}`);
    }
  }
  return uiKeys; // fallback
}

async function main() {
  console.log('Starting UI translation generation...');
  for (const lang of languages) {
    console.log(`Processing ${lang}...`);
    const translatedUI = await translateUI(lang);
    
    const messagesPath = path.join(process.cwd(), `messages/${lang}.json`);
    if (!fs.existsSync(messagesPath)) {
      console.log(`WARNING: messages/${lang}.json does not exist. Skipping.`);
      continue;
    }
    
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    messages.UI = translatedUI;
    
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), 'utf8');
    console.log(`✅ Updated messages/${lang}.json`);
  }
  console.log('Done.');
}

main().catch(console.error);
