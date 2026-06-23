import { getVertexAIInstance } from "../src/lib/vertexai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const locales = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'];

const manualTranslations: Record<string, any> = {
  ko: {
    "name": "디오게네스",
    "title": "고대 그리스 철학자",
    "headline": "통 속의 철학자",
    "shortDescription": "고대 그리스 견유학파의 대표 철학자. 문명과 허례허식을 거부하고 통 속에서 미니멀한 삶을 살며 세상의 가식을 날카롭게 풍자했습니다.",
    "quote": "알렉산더 대왕이 내게 무엇을 원하느냐 물었을 때, 나는 그저 내 햇빛을 가리지 말고 비켜달라고 했다.",
    "chatGreeting": "나는 시놉의 디오게네스라네. 가식과 위선을 버리고 자연을 따르는 참된 자유에 대해 이야기해 보겠나?",
    "suggestedQuestions": [
      "알렉산더 대왕과의 햇빛 일화에 대해 들려주세요.",
      "왜 집 대신 커다란 통 속에서 살았나요?",
      "당신이 생각하는 진정한 자유와 미니멀리즘이란 무엇인가요?"
    ],
    "era": "기원전 4세기의 거인",
    "pain": "사회적 관습과 위선을 철저히 거부했기 때문에 동시대 사람들로부터 개와 같다는 조롱과 비난을 받았습니다.",
    "recovery": "비난을 철학적 도구로 받아들여 '견유학파(개와 같은 학파)'라는 이름을 스스로 자랑스러워했으며, 알렉산더 대왕마저 그 기개에 감탄하게 만들었습니다."
  },
  en: {
    "name": "Diogenes",
    "title": "Ancient Greek Cynic Philosopher",
    "headline": "The Philosopher in a Tub",
    "shortDescription": "A legendary Greek Cynic philosopher who rejected social conventions and wealth, famously living in a large tub and mocking human hypocrisy.",
    "quote": "Stand out of my sunlight.",
    "chatGreeting": "I am Diogenes of Sinope. Let us speak of true freedom and shedding the false conventions of society.",
    "suggestedQuestions": [
      "Tell me about your encounter with Alexander the Great.",
      "Why did you live in a large tub?",
      "What is true freedom and minimalism in your view?"
    ],
    "era": "4th Century BC Giant",
    "pain": "Mocked and ridiculed by his contemporaries for living like a dog and defying social norms.",
    "recovery": "Embraced the insult, proud to be called a Cynic (dog-like), and ultimately won the respect of thinkers and kings, including Alexander the Great."
  },
  ja: {
    "name": "ディオゲネス",
    "title": "古代ギリシャの犬儒学派の哲学者",
    "headline": "樽の中の哲学者",
    "shortDescription": "社会的慣習や富を拒否し、樽の中で暮らしながら人間の偽善を痛烈に皮肉った、古代ギリシャの犬儒学派（キュニコス派）を代表する哲学者。",
    "quote": "アレクサンドロス大王に望みを聞かれた際、私はただ『私の陽光を遮らないで立ち去ってくれ』と頼んだ。",
    "chatGreeting": "私はシノペのディオゲネスだ。虚飾と偽善を捨て去り、自然に従う真の自由について語り合おうではないか。",
    "suggestedQuestions": [
      "アレクサンドロス大王との陽光のエピソードについて教えてください。",
      "なぜ家ではなく大きな樽の中で暮らしたのですか？",
      "あなたが考える真の自由とミニマリズムとは何ですか？"
    ],
    "era": "紀元前4世紀の巨人",
    "pain": "社会的規範に逆らい、犬のように暮らしたため、同時代の人々から嘲笑され非難されました。",
    "recovery": "その侮辱を哲学的な道具として受け入れ、自らを犬儒学派と呼ぶことを誇りとし、最終的にはアレクサンドロス大王をも感嘆させました。"
  }
};

const LANG_MAP: Record<string, string> = {
  de: "German",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  ar: "Arabic",
  hi: "Hindi",
  ru: "Russian",
  zh: "Simplified Chinese"
};

async function translateDiogenes(targetLangCode: string): Promise<any> {
  const targetLangName = LANG_MAP[targetLangCode];
  console.log(`Translating Diogenes data to ${targetLangName}...`);

  const prompt = `Translate the following English profile for the historical figure 'Diogenes' into fluent, natural, and historically accurate ${targetLangName}. Preserve the JSON structure exactly.

Input JSON:
${JSON.stringify(manualTranslations.en, null, 2)}

Ensure the fields match the input JSON keys: "name", "title", "headline", "shortDescription", "quote", "chatGreeting", "suggestedQuestions", "era", "pain", "recovery".
Only return valid JSON without markdown wrapping.`;

  const vAI = getVertexAIInstance();
  const model = vAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return JSON.parse(text);
}

async function main() {
  for (const locale of locales) {
    const filePath = path.join(__dirname, `../messages/${locale}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let diogenesData;
    if (manualTranslations[locale]) {
      diogenesData = manualTranslations[locale];
      console.log(`Applying manual translation for: ${locale}`);
    } else {
      try {
        diogenesData = await translateDiogenes(locale);
      } catch (err) {
        console.error(`Failed translation for ${locale}, falling back to English:`, err);
        diogenesData = manualTranslations.en;
      }
    }

    // Merge/update
    data.Giants.diogenes = diogenesData;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated translation for: ${locale}`);
    
    // Brief delay
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("All Diogenes translations successfully repaired!");
}

main();
