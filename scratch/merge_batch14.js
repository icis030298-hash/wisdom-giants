const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
const batchPath = path.join(__dirname, 'batch14_narratives.json');

// 1. Merge Narratives
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const batchNarratives = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

Object.assign(narratives, batchNarratives);
fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log('Merged narratives into final-narratives.json');

// 2. Update giants.ts
let giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

const nextBatchEntries = `  {
    id: '66',
    name: "데스몬드 투투",
    slug: "desmond-tutu",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "용서한다는 것은 상대방을 풀어주는 것이 아니라, 당신을 증오의 감옥으로부터 해방시키는 것입니다.",
    shortDescription: "남아공의 인종 화합을 이끈 평화의 대주교",
    lessons: [
      { title: "용기의 목소리", content: "불의를 보고 중립을 지키는 것은 가해자의 편에 서는 것입니다. 당신의 목소리를 내십시오." },
      { title: "용서의 자유", content: "용서한다는 것은 상대방을 풀어주는 것이 아니라, 당신을 증오의 감옥으로부터 해방시키는 것입니다." },
      { title: "우분투의 정신", content: "우리는 서로를 필요로 합니다. 당신이 있기에 내가 존재한다는 마음으로 타인과 연대하십시오." }
    ],
    imageUrl: '/images/giants/desmond-tutu.jpg',
    persona: "당신은 데스몬드 투투 대주교입니다. 유머러스하면서도 따뜻하고 평화로운 말투로 조언하세요."
  },
  {
    id: '67',
    name: "엘리 위젤",
    slug: "elie-wiesel",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "사랑의 반대는 증오가 아니라 무관심입니다.",
    shortDescription: "홀로코스트의 비극을 증언한 인류의 양심",
    lessons: [
      { title: "관심의 책임", content: "사랑의 반대는 증오가 아니라 무관심입니다. 타인의 고통을 외면하지 마십시오." },
      { title: "기억의 힘", content: "망각은 노예 상태로 이어지지만, 기억은 구원의 길로 우리를 안내합니다. 과거의 아픔을 잊지 마십시오." },
      { title: "증언의 소명", content: "당신이 살아있는 이유는 누군가의 고통을 증언하기 위함입니다. 소외된 이들을 위한 목소리가 되십시오." }
    ],
    imageUrl: '/images/giants/elie-wiesel.jpg',
    persona: "당신은 엘리 위젤입니다. 서늘한 진실과 깊은 성찰이 담긴 웅변적인 말투로 조언하세요."
  },
  {
    id: '68',
    name: "해리엇 비처 스토",
    slug: "harriet-beecher-stowe",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "가장 고통받는 자들의 눈물은 신의 귀에 가장 먼저 닿습니다.",
    shortDescription: "펜 하나로 노예제의 사슬을 끊은 작가",
    lessons: [
      { title: "슬픔의 승화", content: "당신이 겪는 고통은 타인의 고통을 이해하는 가장 예리한 감각이 됩니다. 아픔을 공감의 에너지로 바꾸십시오." },
      { title: "진실의 문장", content: "세상을 바꾸는 것은 거창한 칼이 아니라, 누군가의 마음을 울리는 진실한 이야기입니다." },
      { title: "용기의 기회", content: "미래는 용기 있는 자들에게는 기회입니다. 환경을 탓하지 말고 발을 내딛는 용기를 가지십시오." }
    ],
    imageUrl: '/images/giants/harriet-beecher-stowe.jpg',
    persona: "당신은 해리엇 비처 스토입니다. 섬세하고 정의로우며 강한 설득력이 느껴지는 말투로 조언하세요."
  },
  {
    id: '69',
    name: "리고베르타 멘추",
    slug: "rigoberta-menchu",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "평화는 단순히 전쟁이 없는 상태가 아니라, 모든 사람이 인간으로서 존엄하게 사는 것입니다.",
    shortDescription: "과테말라 원주민 인권을 수호한 평화의 투사",
    lessons: [
      { title: "존엄의 평화", content: "평화는 단순히 전쟁이 없는 상태가 아니라, 모든 사람이 인간으로서 존엄하게 사는 것입니다." },
      { title: "진실의 목소리", content: "가장 큰 무기는 총이 아니라 진실을 말하는 목소리입니다. 부당함에 맞서 당당히 말하십시오." },
      { title: "존중의 정원", content: "다름은 차별의 이유가 아니라 풍요로움의 근거입니다. 서로의 다름을 존중할 때 세상은 더 아름다워집니다." }
    ],
    imageUrl: '/images/giants/rigoberta-menchu.jpg',
    persona: "당신은 리고베르타 멘추입니다. 소박하면서도 단호하고 대지의 지혜가 담긴 말투로 조언하세요."
  },
  {
    id: '70',
    name: "테리 폭스",
    slug: "terry-fox",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "내가 할 수 있는 일은 누군가에게 희망을 주는 것뿐입니다.",
    shortDescription: "희망의 마라톤으로 암 환자들에게 빛을 준 청년",
    lessons: [
      { title: "희망의 목적", content: "삶의 목적을 타인을 향한 기여에 두십시오. 누군가에게 희망이 될 때 고통은 의미 있는 가치가 됩니다." },
      { title: "오늘의 한 걸음", content: "한 걸음을 더 내디딜 수 있다면 아직 패배한 것이 아닙니다. 오늘 할 수 있는 단 한 걸음의 노력에 집중하십시오." },
      { title: "의지의 힘", content: "환경이 당신의 소유를 뺏을 수는 있어도 선택까지 뺏을 수는 없습니다. 어떤 상황에서도 희망을 선택하십시오." }
    ],
    imageUrl: '/images/giants/terry-fox.jpg',
    persona: "당신은 테리 폭스입니다. 열정적이고 패기 넘치며 불굴의 의지가 느껴지는 말투로 조언하세요."
  },
];`;

// Remove the trailing ];
giantsContent = giantsContent.trim().replace(/\];$/, '');
// Append new entries and closing bracket
giantsContent += nextBatchEntries;

fs.writeFileSync(giantsTsPath, giantsContent, 'utf8');
console.log('Updated giants.ts with Batch 14');
