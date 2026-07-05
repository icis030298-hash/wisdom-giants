const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config({path:'.env.local'});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('No API KEY found!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const femaleGiants = new Set([
  'simone-de-beauvoir', 'hannah-arendt', 'queen-victoria', 'empress-wu-zetian',
  'harriet-beecher-stowe', 'agatha-christie', 'mary-shelley'
]); // female giants in this batch

const BATCH_TARGETS = [
  "harriet-beecher-stowe", "kim-gu", "buddha", "friedrich-nietzsche", "immanuel-kant", 
  "rene-descartes", "jean-jacques-rousseau", "sigmund-freud", "carl-jung", "baruch-spinoza", 
  "sun-tzu", "david-hume", "john-locke", "simone-de-beauvoir", "hannah-arendt", 
  "soren-kierkegaard", "arthur-schopenhauer", "isaac-newton", "galileo-galilei", "charles-darwin", 
  "michelangelo", "claude-monet", "fyodor-dostoevsky", "victor-hugo", "anton-chekhov", 
  "frederic-chopin", "katsushika-hokusai", "agatha-christie", "mark-twain", "goethe", 
  "mary-shelley", "alexander-fleming", "alexander-hamilton", "benjamin-franklin", "francis-bacon", 
  "johannes-kepler", "john-f-kennedy", "queen-victoria", "thomas-jefferson", "ahn-jung-geun", 
  "empress-wu-zetian", "jeong-yak-yong", "mencius", "sima-qian", "zhuangzi", 
  "zhuge-liang", "ashoka-the-great", "king-jeongjo", "li-bai", "miyamoto-musashi"
];

async function main() {
  const finalNarrativesPath = 'src/data/final-narratives.json';
  const fn = JSON.parse(fs.readFileSync(finalNarrativesPath, 'utf-8'));

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro', // use pro for high quality conversion
    generationConfig: { responseMimeType: 'application/json' }
  });

  // Process in chunks of 5
  const chunkSize = 5;
  for (let i = 0; i < BATCH_TARGETS.length; i += chunkSize) {
    const chunk = BATCH_TARGETS.slice(i, i + chunkSize);
    console.log(`Processing chunk ${i/chunkSize + 1} / ${Math.ceil(BATCH_TARGETS.length / chunkSize)}`);

    const inputData = {};
    for (const slug of chunk) {
      inputData[slug] = {
        name_ko: fn[slug].name_ko || slug,
        epic_ko: fn[slug].epic_ko,
        is_female: femaleGiants.has(slug)
      };
    }

    const prompt = `당신은 전문 전기 작가입니다. 
다음 JSON 데이터에는 여러 위인들의 1인칭 시점 한국어 서사(epic_ko)가 포함되어 있습니다.
이 1인칭 서사("나는...", "내가...")를 3인칭 전기 시점("그는...", "그녀는...", "[위인명]은...")으로 변환해 주세요.

[중요 지침]
1. 1단계 골드스탠다드 문체 유지: 위엄 있고 문학적인 3인칭 서술을 사용하세요.
2. 대명사 규칙: is_female이 true인 위인은 반드시 "그녀는", "그녀의"를 사용하세요. false인 위인은 "그는", "그의", "[위인명]은"을 사용하세요.
3. 원본의 감동과 정보(연도, 사건 등)는 그대로 보존하되 시점만 완벽히 변경하세요.
4. 원본 텍스트에 포함된 인용구("...")는 변경하지 말고 그대로 두어도 됩니다.

[입력 JSON]
${JSON.stringify(inputData, null, 2)}

[출력 형식]
반드시 다음 형태의 JSON 객체만 반환하세요:
{
  "slug1": "변환된 3인칭 epic_ko 텍스트 전체",
  "slug2": "변환된 3인칭 epic_ko 텍스트 전체"
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      
      let updatedCount = 0;
      for (const slug of chunk) {
        if (parsed[slug]) {
          fn[slug].epic_ko = parsed[slug];
          updatedCount++;
        } else {
          console.error(`Missing output for ${slug}`);
        }
      }
      
      // Save progressively
      fs.writeFileSync(finalNarrativesPath, JSON.stringify(fn, null, 2));
      console.log(`Chunk ${i/chunkSize + 1} saved! Updated ${updatedCount} records.`);
      
    } catch (e) {
      console.error('Error on chunk', i/chunkSize + 1, e);
    }
  }

  console.log('Batch 2 completed successfully!');
}

main().catch(console.error);
