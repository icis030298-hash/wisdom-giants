const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
const batchPath = path.join(__dirname, 'batch16_narratives.json');

// 1. Merge Narratives
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const batchNarratives = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

Object.assign(narratives, batchNarratives);
fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log('Merged narratives into final-narratives.json');

// 2. Update giants.ts
let giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

const nextBatchEntries = `  {
    id: '76',
    name: "루이 파스퇴르",
    slug: "louis-pasteur",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "관찰의 영역에서 기회는 오직 준비된 마음만을 돕습니다.",
    shortDescription: "질병의 미생물 이론을 정립한 현대 의학의 아버지",
    lessons: [
      { title: "준비된 기회", content: "행운은 우연히 오는 것이 아닙니다. 끊임없이 탐구하고 준비하는 사람만이 기회를 기적으로 바꿀 수 있습니다." },
      { title: "지식의 소명", content: "과학에는 국경이 없지만 과학자에게는 조국과 인류라는 조국이 있습니다. 지식을 공익을 위해 사용하십시오." },
      { title: "불굴의 집념", content: "운명은 노력하는 자를 비웃지 않습니다. 실패하더라도 완벽한 결과가 나올 때까지 다시 시작할 용기를 가지십시오." }
    ],
    imageUrl: '/images/giants/louis-pasteur.jpg',
    persona: "당신은 루이 파스퇴르입니다. 엄격하면서도 신중하고 열정적인 말투로 조언하세요."
  },
  {
    id: '77',
    name: "알렉산더 플레밍",
    slug: "alexander-fleming",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "자연이 준 선물은 전 인류의 것입이다.",
    shortDescription: "최초의 항생제 페니실린을 발견한 생명의 수호자",
    lessons: [
      { title: "발견의 열린 마음", content: "계획하지 않은 실수가 가장 위대한 발견으로 인도할 수 있습니다. 예기치 못한 상황에서도 기회를 찾으십시오." },
      { title: "무소유의 공유", content: "재능이나 성취가 당신만의 것이라 생각하지 마십시오. 세상과 공유할 때 당신의 가치는 비로소 영원해집니다." },
      { title: "준비된 관찰", content: "준비되지 않은 사람에게 우연은 지나가는 바람일 뿐입니다. 기회를 잡을 수 있도록 평소에 실력을 닦으십시오." }
    ],
    imageUrl: '/images/giants/alexander-fleming.jpg',
    persona: "당신은 알렉산더 플레밍입니다. 겸손하고 세심하며 학구적인 말투로 조언하세요."
  },
  {
    id: '78',
    name: "조너스 소크",
    slug: "jonas-salk",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "태양에도 특허를 낼 수 있습니까?",
    shortDescription: "소아마비 백신 특허를 포기하고 인류를 구원한 과학자",
    lessons: [
      { title: "지식의 공공성", content: "생명을 살리는 지식은 공유되어야 합니다. 당신의 기술이 사적인 이익보다 공공의 이익을 향하게 하십시오." },
      { title: "성공의 책임", content: "성공의 진정한 보상은 더 많은 책임을 질 수 있는 기회를 얻는 것입니다. 낮은 곳의 고통을 덜어주는 데 힘쓰십시오." },
      { title: "미래를 위한 유산", content: "우리는 우리 아이들의 조상입니다. 미래 세대를 위해 도덕적 모범과 지속 가능한 가치를 남기십시오." }
    ],
    imageUrl: '/images/giants/jonas-salk.jpg',
    persona: "당신은 조너스 소크입니다. 자비롭고 강직하며 도덕적인 신념이 느껴지는 말투로 조언하세요."
  },
  {
    id: '79',
    name: "에드워드 제너",
    slug: "edward-jenner",
    era: "Modern (18th Century)",
    category: "leadership",
    quote: "가장 위대한 의술은 병이 생기지 않도록 미리 막는 것입니다.",
    shortDescription: "종두법을 통해 천연두를 박멸한 예방 의학의 선구자",
    lessons: [
      { title: "현장의 진리", content: "거창한 이론보다 실질적인 경험 속에 진리가 있습니다. 주변의 작은 징후들을 세심히 관찰하고 해답을 찾으십시오." },
      { title: "신념의 침묵", content: "신념이 있다면 세상의 비웃음을 두려워하지 마십시오. 당신의 길이 옳다면 비난에 흔들리지 말고 묵묵히 나아가십시오." },
      { title: "예방의 지혜", content: "문제가 터진 후 해결하기보다 미리 원인을 찾아 예방하십시오. 선제적인 대응이 가장 효율적인 해결책입니다." }
    ],
    imageUrl: '/images/giants/edward-jenner.jpg',
    persona: "당신은 에드워드 제너입니다. 소박하고 끈기 있으며 인내심 있는 말투로 조언하세요."
  },
  {
    id: '80',
    name: "찰스 다윈",
    slug: "charles-darwin",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "살아남는 종은 가장 강한 종도 아니라, 변화에 가장 잘 적응하는 종입니다.",
    shortDescription: "진화론을 통해 생명의 근원을 파헤친 지적 혁명가",
    lessons: [
      { title: "변화의 적응", content: "강함에 안주하지 마십시오. 세상의 흐름을 읽고 유연하게 자신을 변화시키는 능력이 최고의 생존 전략입니다." },
      { title: "시도의 가치", content: "결코 틀리지 않는 사람은 아무것도 시도하지 않는 사람뿐입니다. 실수를 두려워하지 말고 실험하고 배우십시오." },
      { title: "연결의 겸손", content: "모든 생명은 연결되어 있습니다. 자연의 일부로서 당신의 존재를 겸손하게 받아들이고 조화를 이루십시오." }
    ],
    imageUrl: '/images/giants/charles-darwin.jpg',
    persona: "당신은 찰스 다윈입니다. 신중하고 객관적이며 깊은 통찰력이 느껴지는 말투로 조언하세요."
  },
];`;

// Remove the trailing ];
giantsContent = giantsContent.trim().replace(/\];$/, '');
// Append new entries and closing bracket
giantsContent += nextBatchEntries;

fs.writeFileSync(giantsTsPath, giantsContent, 'utf8');
console.log('Updated giants.ts with Batch 16');
