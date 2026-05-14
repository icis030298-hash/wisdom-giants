const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
const batchPath = path.join(__dirname, 'batch15_narratives.json');

// 1. Merge Narratives
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const batchNarratives = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

Object.assign(narratives, batchNarratives);
fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log('Merged narratives into final-narratives.json');

// 2. Update giants.ts
let giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

const nextBatchEntries = `  {
    id: '71',
    name: "헬렌 켈러",
    slug: "helen-keller",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "세상에서 가장 아름다운 것은 눈에 보이지 않으며 귀로 들리지 않습니다. 오직 마음으로만 느낄 수 있습니다.",
    shortDescription: "어둠과 정적을 뚫고 지식의 빛을 전한 인권 투사",
    lessons: [
      { title: "마음의 눈", content: "가장 아름다운 가치는 마음으로만 볼 수 있습니다. 겉모습에 현혹되지 말고 내면의 진실을 발견하십시오." },
      { title: "희망의 문", content: "행복의 문이 닫히면 다른 문이 열립니다. 상실에 매몰되지 말고 새로운 가능성의 문을 찾으십시오." },
      { title: "최선의 기적", content: "당신이 할 수 있는 최선을 다할 때 인생의 기적이 시작됩니다. 결과보다 과정의 진심에 집중하십시오." }
    ],
    imageUrl: '/images/giants/helen-keller.jpg',
    persona: "당신은 헬렌 켈러입니다. 평온하면서도 내면의 강인함이 느껴지는 말투로 지혜를 나누세요."
  },
  {
    id: '72',
    name: "스티븐 호킹",
    slug: "stephen-hawking",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "발바닥만 내려다보지 말고 별들을 올려다보십시오.",
    shortDescription: "휠체어에 앉아 우주의 신비를 파헤친 천재 물리학자",
    lessons: [
      { title: "별의 비전", content: "발바닥만 보지 말고 별을 보십시오. 호기심을 가질 때 당신의 영혼은 육체의 한계를 뛰어넘습니다." },
      { title: "변화의 지능", content: "지능이란 변화에 적응하는 능력입니다. 예기치 못한 시련이 닥칠 때 삶을 유연하게 재설계하십시오." },
      { title: "불멸의 의지", content: "할 수 있는 일은 언제나 반드시 있습니다. 잃어버린 것을 한탄하기보다 남은 것에 집중하십시오." }
    ],
    imageUrl: '/images/giants/stephen-hawking.jpg',
    persona: "당신은 스티븐 호킹입니다. 위트 있고 명료하며 우주적 통찰이 담긴 말투로 조언하세요."
  },
  {
    id: '73',
    name: "크리스토퍼 리브",
    slug: "christopher-reeve",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "영웅이란 압도적인 역경 속에서도 굴하지 않고 인내하며 버텨낼 힘을 찾아내는 평범한 개인입니다.",
    shortDescription: "절망을 딛고 일어난 우리 시대의 진정한 슈퍼맨",
    lessons: [
      { title: "평범한 영웅", content: "영웅은 특별한 사람이 아니라, 역경 속에서도 인내하며 버텨낼 힘을 찾아내는 당신 자신입니다." },
      { title: "의지의 현실", content: "불가능은 의지를 갖는 순간 피할 수 없는 현실이 됩니다. 불가능이라는 단어에 속지 마십시오." },
      { title: "남겨진 감사", content: "상실보다 남겨진 것에 감사하십시오. 당신 곁의 사랑과 내면의 의지를 발견하고 동력으로 삼으십시오." }
    ],
    imageUrl: '/images/giants/christopher-reeve.jpg',
    persona: "당신은 크리스토퍼 리브입니다. 부드러우면서도 단호하고 희망을 불어넣는 말투로 조언하세요."
  },
  {
    id: '74',
    name: "닉 부이치치",
    slug: "nick-vujicic",
    era: "Modern (21st Century)",
    category: "leadership",
    quote: "100번 넘어진다면 100번 다시 일어나십시오.",
    shortDescription: "팔다리 없는 한계를 극복한 행복 전도사",
    lessons: [
      { title: "존재의 목적", content: "부족함에 집중하지 마십시오. 당신이 태어난 고유한 이유를 발견할 때 결점은 특별한 개성이 됩니다." },
      { title: "다시 일어설 힘", content: "일어나는 것을 포기할 때만 실패가 됩니다. 실패는 다음 단계로 도약하기 위한 소중한 경험입니다." },
      { title: "고유한 빛", content: "당신은 있는 모습 그대로 충분히 소중합니다. 타인의 기준에 맞추지 말고 당신만의 빛을 당당히 드러내십시오." }
    ],
    imageUrl: '/images/giants/nick-vujicic.jpg',
    persona: "당신은 닉 부이치치입니다. 에너지가 넘치고 밝으며 진심 어린 격려를 전하는 말투로 조언하세요."
  },
  {
    id: '75',
    name: "마리 퀴리",
    slug: "marie-curie",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "인생에서 두려워할 것은 아무것도 없습니다. 다만 이해해야 할 것이 있을 뿐입니다.",
    shortDescription: "여성 최초의 노벨상 수상자이자 위대한 과학 정신의 상징",
    lessons: [
      { title: "공포의 지식", content: "인생에서 두려워할 것은 없습니다. 이해해야 할 뿐입니다. 공포를 지식과 탐구의 열정으로 바꾸십시오." },
      { title: "공익의 성취", content: "당신의 성취가 사적인 이익이 아닌 공익을 향하게 하십시오. 나눔을 실천할 때 당신의 업적은 영원해집니다." },
      { title: "재능의 발견", content: "당신만의 고유한 강점을 믿으십시오. 재능을 찾아내어 기필코 끝까지 밀어붙이는 집요함이 필요합니다." }
    ],
    imageUrl: '/images/giants/marie-curie.jpg',
    persona: "당신은 마리 퀴리입니다. 차분하고 학구적이며 강직한 의지가 느껴지는 말투로 조언하세요."
  },
];`;

// Remove the trailing ];
giantsContent = giantsContent.trim().replace(/\];$/, '');
// Append new entries and closing bracket
giantsContent += nextBatchEntries;

fs.writeFileSync(giantsTsPath, giantsContent, 'utf8');
console.log('Updated giants.ts with Batch 15');
