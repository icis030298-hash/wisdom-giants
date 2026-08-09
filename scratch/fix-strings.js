const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const koData = JSON.parse(fs.readFileSync(path.join(messagesDir, 'ko.json'), 'utf8'));

// The exact strings the user requested
const updates = {
  purposeDesc: "본 서비스는 인프라 및 핵심 기능(AI 챗봇, 고민 상담, 맞춤형 광고) 제공을 위해 신뢰할 수 있는 제3자 플랫폼에 데이터를 위탁 처리하고 있습니다:\n1. Google Cloud (Firebase): 구글 소셜 로그인 인증 처리 및 유저별 실시간 채팅 데이터베이스(Firestore) 안전 보관\n2. Google AI Studio (Gemini API): 실시간 대화 및 고민 상담 텍스트 분석. (이용자가 입력한 대화 및 상담 내용은 AI 응답 생성을 위해 Google에 전송되며, 현재 Gemini API 무료 등급 정책에 따라 Google의 모델 개선/학습에 활용될 수 있습니다.)\n3. Google AdSense: 맞춤형 및 비맞춤형 광고 게재 및 트래픽 분석",
  rightsDesc: "귀하는 언제든지 자신의 개인정보 열람, 수정, 또는 계정 삭제(회원 탈퇴)를 요구할 수 있습니다. 계정 삭제 및 데이터 파기는 공식 이메일(contact@giantswisdom.com)로 요청하실 수 있으며, 이메일 접수 시 영업일 기준 7일 이내에 처리하고 결과를 통보드립니다."
};

koData.Privacy.purposeDesc = updates.purposeDesc;
koData.Privacy.rightsDesc = updates.rightsDesc;

fs.writeFileSync(path.join(messagesDir, 'ko.json'), JSON.stringify(koData, null, 2));
console.log('Updated ko.json');

const targetLangs = files.map(f => f.replace('.json', '')).filter(lang => lang !== 'ko');

const systemPrompt = `You are a professional legal translator. 
Translate the provided JSON object containing Privacy Policy segments into the target language.
Maintain a formal, legal tone appropriate for privacy policies in that language.
Output ONLY valid JSON matching the exact keys provided, with string values translated.`;

async function processTranslations() {
  for (const lang of targetLangs) {
    console.log(`Translating to ${lang}...`);
    try {
      const prompt = `Target language code: ${lang}\n\nJSON to translate:\n${JSON.stringify(updates, null, 2)}\n\nOutput only the translated JSON.`;
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      
      let text = result.response.text();
      const translated = JSON.parse(text);

      const filePath = path.join(messagesDir, `${lang}.json`);
      const langData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      langData.Privacy.purposeDesc = translated.purposeDesc;
      langData.Privacy.rightsDesc = translated.rightsDesc;
      
      fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
      console.log(`Success: ${lang}.json`);
    } catch (e) {
      console.error(`Failed for ${lang}:`, e.message);
    }
  }
}

processTranslations();
