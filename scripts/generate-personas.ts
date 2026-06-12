import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs';
import path from 'path';

// 1. Initialize Vertex AI
const projectId = process.env.GCP_PROJECT_ID || 'giantswisdom-8dc26';
const location = process.env.GCP_LOCATION || 'us-central1';

const localKeyPath = path.resolve(process.cwd(), 'google-service-account.json');
let credentials;

if (fs.existsSync(localKeyPath)) {
  try {
    credentials = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
  } catch (e: any) {
    console.error("Failed to parse local google-service-account.json", e.message);
  }
}

if (!credentials && process.env.GCP_SERVICE_ACCOUNT) {
  try {
    credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
  } catch (e: any) {
    console.error("Failed to parse GCP_SERVICE_ACCOUNT environment variable", e.message);
  }
}

const initOptions: any = {
  project: projectId,
  location: location,
};

if (credentials) {
  initOptions.googleAuthOptions = {
    credentials,
  };
}

const vAI = new VertexAI(initOptions);
const modelName = 'gemini-2.5-flash-lite';
const model = vAI.getGenerativeModel({
  model: modelName,
  generationConfig: { responseMimeType: "application/json" }
});

// 2. Define Slugs for Tier 1 and Tier 2
// (Excluding the 10 already completed manually in personas.ts)
const TIER1_SLUGS = [
  'confucius',
  'aristotle',
  'friedrich-nietzsche',
  'baruch-spinoza',
  'zhuangzi',
  'genghis-khan',
  'alexander-the-great',
  'marie-curie',
  'frida-kahlo',
  'helen-keller',
  'viktor-frankl',
  'thomas-edison',
  'nikola-tesla',
  'william-shakespeare',
  'fyodor-dostoevsky',
  'vincent-van-gogh',
  'beethoven',
  'mozart',
  'sun-tzu',
  'mencius',
  'king-jeongjo',
  'ashoka-the-great'
];

const TIER2_SLUGS = [
  'julius-caesar',
  'henry-ford',
  'walt-disney',
  'thomas-jefferson',
  'benjamin-franklin',
  'john-f-kennedy',
  'queen-victoria',
  'alexander-hamilton',
  'francis-bacon',
  'johannes-kepler',
  'jeong-yak-yong',
  'zhuge-liang',
  'oda-nobunaga',
  'tokugawa-ieyasu',
  'toyotomi-hideyoshi',
  'hannibal-barca',
  'mansa-musa',
  'saladin',
  'wright-brothers',
  'adam-smith',
  'archimedes',
  'copernicus',
  'dante-alighieri',
  'johannes-gutenberg',
  'louis-pasteur',
  'machiavelli',
  'voltaire',
  'alexander-graham-bell',
  'amelia-earhart',
  'andrew-carnegie',
  'edgar-allan-poe',
  'ernest-hemingway',
  'henry-david-thoreau',
  'jp-morgan',
  'ralph-waldo-emerson',
  'susan-b-anthony',
  'walt-whitman',
  'buddha',
  'lao-tzu',
  'plato',
  'immanuel-kant',
  'rene-descartes',
  'jean-jacques-rousseau',
  'sigmund-freud',
  'carl-jung',
  'david-hume',
  'john-locke',
  'simone-de-beauvoir',
  'hannah-arendt',
  'soren-kierkegaard',
  'arthur-schopenhauer',
  'galileo-galilei',
  'charles-darwin',
  'michelangelo',
  'claude-monet',
  'victor-hugo',
  'anton-chekhov',
  'frederic-chopin',
  'goethe'
];

const OUTPUT_PATH = path.resolve(process.cwd(), 'src/data/personas/generated-personas.json');

// Helper to load existing generated file for resuming
function loadExistingData() {
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    } catch (e) {
      console.warn("Malformed generated-personas.json. Starting fresh.");
    }
  }
  return { tier1: [], tier2: [] };
}

// Helper to save generated data
function saveData(data: any) {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Generate Tier 1 Persona
async function generateTier1(slug: string, name: string) {
  const prompt = `
당신은 최고의 역사학자이자 인물 심리학 교수입니다.
역사적 거인인 "${name}" (slug: "${slug}")에 대해 신뢰할 수 있는 역사적 기록, 저서 및 당대 기록을 토대로 아래 JSON 규격에 부합하는 초고화질 페르소나 정보를 생성해 주십시오.

반드시 인물의 고유한 성격과 말투, 철학이 대화체에 그대로 묻어나게 묘사되어야 합니다. 추상적이거나 교과서적인 설명을 배제하고, 독보적이고 구체적인 역사적 맥락만을 사용하십시오.

{
  "slug": "${slug}",
  "ko": {
    "corePhilosophy": "인물의 핵심 세계관/사상. 그의 대표 저작이나 사상적 핵심을 200자 내외로 매우 깊이 있게 설명하시오.",
    "communicationStyle": "그가 사용자에게 말을 거는 고유한 말투와 스타일. 조용하고 내향적인지, 혹은 단호하고 거침없는지, 즐겨 쓰는 은유나 반어법 등을 150자 내외로 정의하시오.",
    "personalStruggles": "그가 인생에서 겪은 가장 뼈저린 실패, 시련, 혹은 정신적/신체적 고통을 200자 내외로 역사적 팩트에 기반하여 서술하시오.",
    "verifiedQuotes": [
      "그가 남긴 가장 유명한 실제 명언/인용구 1 (완벽하게 고증된 것)",
      "실제 명언/인용구 2",
      "실제 명언/인용구 3"
    ],
    "signatureQuestions": [
      "그가 유저에게 인생의 본질을 던질 만한 날카로운 질문 1",
      "질문 2",
      "질문 3",
      "질문 4"
    ],
    "modernWisdomMapping": "현대인이 겪는 번아웃, 우울증, 자아 손실, 인간관계 갈등 등의 문제에 이 인물의 지혜가 어떻게 매핑될 수 있는지 150자 내외로 작성하시오.",
    "neverDoes": [
      "그가 대화 중에 절대로 하지 않는 행동 1 (예: 훈계조로 가르치려 들기, AI라고 정체성 밝히기)",
      "절대로 하지 않는 행동 2",
      "절대로 하지 않는 행동 3"
    ]
  },
  "en": {
    "corePhilosophy": "Detailed core philosophy/worldview (within 250 characters).",
    "communicationStyle": "Specific tone and conversational mannerism characteristic of the person (within 200 characters).",
    "personalStruggles": "Authentic historical pain, failures, illnesses, or betrayals they endured (within 250 characters).",
    "verifiedQuotes": [
      "Historically verified quote 1",
      "Historically verified quote 2",
      "Historically verified quote 3"
    ],
    "signatureQuestions": [
      "Pointed, philosophical signature question 1",
      "Signature question 2",
      "Signature question 3"
    ],
    "modernWisdomMapping": "How their legacy maps to modern life stress, anxiety, or work issues (within 200 characters).",
    "neverDoes": [
      "Strict conversational boundary 1 they never cross",
      "Conversational boundary 2",
      "Conversational boundary 3"
    ]
  }
}

JSON 스키마 규격을 엄격히 지켜서 마크다운 장식 없이 순수 JSON 문자열만 반환하시오.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    if (typeof response.text === 'function') {
      text = response.text();
    } else {
      text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    
    // Clean code block wrappers if any
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e: any) {
    console.error(`[Tier 1 Generate Failed] ${name}:`, e.message);
    return null;
  }
}

// Generate Tier 2 Persona
async function generateTier2(slug: string, name: string) {
  const prompt = `
역사적 거인인 "${name}" (slug: "${slug}")에 대해 신뢰할 수 있는 역사적 기록을 바탕으로 아래 JSON 형식의 중간 깊이 페르소나 정보를 생성해 주십시오.

{
  "slug": "${slug}",
  "ko": {
    "philosophy": "인물의 핵심 철학 및 가치관 (120자 내외)",
    "style": "대화 방식과 독특한 말투 특징 (100자 내외)",
    "struggles": "그가 겪은 가장 고통스러운 인생의 시련과 절망 (150자 내외)",
    "quote": "그를 대표하는 가장 유명한 명언 한 구절",
    "neverDoes": [
      "그가 대화 중에 절대로 하지 않는 태도나 행동 1",
      "절대로 하지 않는 행동 2"
    ]
  },
  "en": {
    "philosophy": "Core philosophy (within 150 characters)",
    "style": "Tone and mannerism (within 120 characters)",
    "struggles": "Core struggles they went through (within 200 characters)",
    "quote": "One most famous verified quote",
    "neverDoes": [
      "One conversational behavior they never do",
      "Another behavior they never do"
    ]
  }
}

JSON 스키마 규격을 엄격히 지켜서 마크다운 장식 없이 순수 JSON 문자열만 반환하시오.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    if (typeof response.text === 'function') {
      text = response.text();
    } else {
      text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e: any) {
    console.error(`[Tier 2 Generate Failed] ${name}:`, e.message);
    return null;
  }
}

async function main() {
  const data = loadExistingData();
  
  console.log(`기존 로드된 데이터: Tier 1 (${data.tier1.length}명), Tier 2 (${data.tier2.length}명)`);
  
  console.log("\n=== TIER 1 페르소나 생성 시작 ===");
  for (const slug of TIER1_SLUGS) {
    // Check if already generated
    const exists = data.tier1.some((p: any) => p.slug === slug);
    if (exists) {
      console.log(`[Skip] Tier 1: ${slug} (이미 생성됨)`);
      continue;
    }

    const name = slug.replace(/-/g, ' ');
    console.log(`[Generate] Tier 1: ${name} (${slug}) 생성 중...`);
    
    const persona = await generateTier1(slug, name);
    if (persona) {
      data.tier1.push(persona);
      saveData(data);
      console.log(`✅ Tier 1: ${name} 생성 및 실시간 저장 성공`);
    } else {
      console.log(`❌ Tier 1: ${name} 생성 실패`);
    }
    
    // API Rate Limit 방지용 딜레이
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log("\n=== TIER 2 페르소나 생성 시작 ===");
  for (const slug of TIER2_SLUGS) {
    const exists = data.tier2.some((p: any) => p.slug === slug);
    if (exists) {
      console.log(`[Skip] Tier 2: ${slug} (이미 생성됨)`);
      continue;
    }

    const name = slug.replace(/-/g, ' ');
    console.log(`[Generate] Tier 2: ${name} (${slug}) 생성 중...`);
    
    const persona = await generateTier2(slug, name);
    if (persona) {
      data.tier2.push(persona);
      saveData(data);
      console.log(`✅ Tier 2: ${name} 생성 및 실시간 저장 성공`);
    } else {
      console.log(`❌ Tier 2: ${name} 생성 실패`);
    }
    
    await new Promise(r => setTimeout(r, 2500));
  }

  console.log("\n모든 페르소나 생성 작업이 완료되었습니다!");
  console.log(`최종 저장 데이터: Tier 1 (${data.tier1.length}명), Tier 2 (${data.tier2.length}명)`);
}

main().catch(err => {
  console.error("Fatal error during execution:", err);
});
