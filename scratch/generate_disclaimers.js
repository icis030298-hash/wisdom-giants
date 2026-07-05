const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve('.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LOCALES = ['ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'];

const existingTranslations = {
  ko: { backToBlog: "거인들의 지혜 블로그", readTime: "분 분량", chatWith: "와 대화하기", chatNow: "대화 시작하기", relatedPosts: "관련 포스트", ctaTitle: "와 직접 대화해보기", ctaDesc: "역사를 바꾼 거인의 두뇌와 실시간 AI 대화를 통해 깊은 인생의 해답과 통찰을 전수받아 보세요.", share: "공유하기", copylink: "링크 복사" },
  en: { backToBlog: "Wisdom Blog", readTime: "min read", chatWith: "Chat with ", chatNow: "Start Chat", relatedPosts: "Related Posts", ctaTitle: "Chat directly with ", ctaDesc: "Get direct, real-time life advice and profound wisdom from this historical giant through our advanced AI chat.", share: "Share", copylink: "Copy Link" },
  de: { backToBlog: "Weisheits-Blog", readTime: "Min. Lesung", chatWith: "Chatten mit ", chatNow: "Chat starten", relatedPosts: "Ähnliche Beiträge", ctaTitle: "Direkt chatten mit ", ctaDesc: "Erhalten Sie direktes, Echtzeit-Lebensberatung und tiefe Weisheit von diesem historischen Riesen durch unseren fortschrittlichen KI-Chat.", share: "Teilen", copylink: "Link kopieren" },
  ja: { backToBlog: "偉人たちの知恵ブログ", readTime: "分 読了", chatWith: "と対話する", chatNow: "対話を開始する", relatedPosts: "関連投稿", ctaTitle: "と直接対話してみる", ctaDesc: "高度なAIチャットを通じて、この歴史的な偉人から直接、リアルタイムの人生のヒントと深い知恵を得ることができます。", share: "共有", copylink: "リンクをコピー" },
  es: { backToBlog: "Blog de Sabiduría", readTime: "min de lectura", chatWith: "Chatear con ", chatNow: "Iniciar chat", relatedPosts: "Publicaciones relacionadas", ctaTitle: "Chatea directamente con ", ctaDesc: "Obtenga consejos de vida directos en tiempo real y una sabiduría profunda de este gigante histórico a través de nuestro chat de IA avanzado.", share: "Compartir", copylink: "Copiar enlace" },
  fr: { backToBlog: "Blog de la Sagesse", readTime: "min de lecture", chatWith: "Chatter avec ", chatNow: "Démarrer le chat", relatedPosts: "Articles connexes", ctaTitle: "Discuter directement avec ", ctaDesc: "Obtenez des conseils de vie en temps réel et une sagesse profonde de ce géant historique grâce à notre chat IA avancé.", share: "Partager", copylink: "Copier le lien" },
  it: { backToBlog: "Blog della Saggezza", readTime: "min di lettura", chatWith: "Chatta con ", chatNow: "Avvia Chat", relatedPosts: "Articoli correlati", ctaTitle: "Chatta direttamente con ", ctaDesc: "Ottieni consigli di vita diretti in tempo reale e una profonda saggezza da questo gigante storico attraverso la nostra chat IA avanzata.", share: "Condividi", copylink: "Copia Link" },
  pt: { backToBlog: "Blog da Sabedoria", readTime: "min de leitura", chatWith: "Conversar com ", chatNow: "Iniciar Chat", relatedPosts: "Publicações relacionadas", ctaTitle: "Converse diretamente com ", ctaDesc: "Obtenha conselhos de vida diretos em tempo real e uma sabedoria profunda deste gigante histórico através do nosso chat de IA avançado.", share: "Compartilhar", copylink: "Copiar Link" },
  ar: { backToBlog: "مدونة الحكمة", readTime: "دقائق للقراءة", chatWith: "دردش مع ", chatNow: "ابدأ الدردشة", relatedPosts: "مقالات ذات صلة", ctaTitle: "دردش مباشرة مع ", ctaDesc: "احصل على نصيحة مباشرة وحكمة عميقة من هذا العملاق التاريخي عبر دردشة الذكاء الاصطناعي المتقدمة الخاصة بنا.", share: "مشاركة", copylink: "نسخ الرابط" },
  hi: { backToBlog: "ज्ञान ब्लॉग", readTime: "मिनट पढ़ना", chatWith: "के साथ चैट करें ", chatNow: "चैट शुरू करें", relatedPosts: "संबंधित पोस्ट", ctaTitle: "सीधे चैट करें ", ctaDesc: "हमारे उन्नत एआई चैट के माध्यम से इस ऐतिहासिक महान व्यक्ति से सीधे, वास्तविक समय में जीवन की सलाह और गहन ज्ञान प्राप्त करें।", share: "साझा करें", copylink: "लिंक कॉपी करें" },
  ru: { backToBlog: "Блог мудрости", readTime: "мин чтения", chatWith: "Чат с ", chatNow: "Начать чат", relatedPosts: "Похожие публикации", ctaTitle: "Чат напрямую с ", ctaDesc: "Получите ценные жизненные советы и глубокую мудрость от этого исторического гиганта в реальном времени через наш продвинутый ИИ-чат.", share: "Поделиться", copylink: "Копировать ссылку" },
  zh: { backToBlog: "智慧博客", readTime: "分钟阅读", chatWith: "与...对话 ", chatNow: "开始对话", relatedPosts: "相关文章", ctaTitle: "与直接对话 ", ctaDesc: "通过我们先进的 AI 对话，与这位历史伟人进行实时交流，获取人生的启示与深邃的智慧。", share: "分享", copylink: "复制链接" }
};

async function main() {
  const result = {};
  
  const disclaimerEn = 'This content is AI-generated historical material for educational purposes. It does not constitute certified historical records, psychological assessments, or professional advice.';
  
  for (const loc of LOCALES) {
    if (existingTranslations[loc]) {
      result[loc] = { ...existingTranslations[loc] };
      const prompt = `Translate this disclaimer to language code '${loc}':\n\n"${disclaimerEn}"\n\nOutput only the translation, no quotes.`;
      const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      result[loc].disclaimer = res.text.trim();
    } else {
      // Need full translation
      const prompt = `Translate the following JSON object values to language code '${loc}':
      {
        "backToBlog": "Wisdom Blog",
        "readTime": "min read",
        "chatWith": "Chat with ",
        "chatNow": "Start Chat",
        "relatedPosts": "Related Posts",
        "ctaTitle": "Chat directly with ",
        "ctaDesc": "Get direct, real-time life advice and profound wisdom from this historical giant through our advanced AI chat.",
        "share": "Share",
        "copylink": "Copy Link",
        "disclaimer": "${disclaimerEn}"
      }
      Respond with ONLY valid JSON, no markdown blocks.`;
      
      const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      const txt = res.text.replace(/```json|```/g, '').trim();
      result[loc] = JSON.parse(txt);
    }
  }
  
  fs.writeFileSync('scratch/ui-translations-all.json', JSON.stringify(result, null, 2));
  console.log("Done");
}

main();
