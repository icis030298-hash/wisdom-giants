const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
const batchPath = path.join(__dirname, 'batch13_narratives.json');

// 1. Merge Narratives
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const batchNarratives = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

Object.assign(narratives, batchNarratives);
fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log('Merged narratives into final-narratives.json');

// 2. Update giants.ts
let giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

const nextBatchEntries = `  {
    id: '61',
    name: "오스카 쉰들러",
    slug: "oskar-schindler",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "한 생명을 구하는 자는 전 세계를 구하는 것입니다.",
    shortDescription: "죽음의 문턱에서 수많은 생명을 구한 실업가",
    lessons: [
      { title: "생명의 가치", content: "단 한 사람에게 최선을 다하는 것이 곧 세상을 바꾸는 시작입니다. 숫자의 크기에 압도되지 마십시오." },
      { title: "부의 소명", content: "부의 진짜 가치는 소유가 아니라 사용에 있습니다. 타인의 고통을 덜어주는 데 쓰일 때 그 가치는 영원해집니다." },
      { title: "회개의 결단", content: "정의를 선택하는 데 늦은 때란 없습니다. 잘못된 길에서 즉시 돌아서서 옳은 방향으로 발을 내딛으십시오." }
    ],
    imageUrl: '/images/giants/oskar-schindler.jpg',
    persona: "당신은 오스카 쉰들러입니다. 신중하면서도 따뜻한 인간미가 느껴지는 말투로 조언하세요."
  },
  {
    id: '62',
    name: "플로렌스 나이팅게일",
    slug: "florence-nightingale",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "인생은 헌신이지, 단순한 관조가 아닙니다.",
    shortDescription: "현대 간호학의 기초를 세운 '등불을 든 여인'",
    lessons: [
      { title: "현장의 행동", content: "멀리서 지켜보는 것만으로는 아무것도 바꿀 수 없습니다. 문제의 핵심 속으로 뛰어들어 땀 흘릴 때 변화가 시작됩니다." },
      { title: "진정한 위대함", content: "위대함은 눈에 보이는 화려함이 아닌, 보이지 않는 곳에서 타인을 위해 쏟는 정성과 수고에 있습니다." },
      { title: "데이터의 힘", content: "열정만으로는 세상을 바꾸기에 부족합니다. 객관적인 사실과 치밀한 준비를 갖출 때 당신의 비전은 힘을 얻습니다." }
    ],
    imageUrl: '/images/giants/florence-nightingale.jpg',
    persona: "당신은 플로렌스 나이팅게일입니다. 냉철한 분석력과 따뜻한 헌신이 공존하는 말투로 조언하세요."
  },
  {
    id: '63',
    name: "유관순",
    slug: "yu-gwan-sun",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "내 손톱이 빠져나가고 내 귀와 코가 잘려도 그 고통은 이길 수 있으나, 나라를 잃은 고통은 견딜 수가 없습니다.",
    shortDescription: "꺾이지 않는 독립의 의지를 상징하는 민족의 꽃",
    lessons: [
      { title: "공동체의 존엄", content: "개인의 안위보다 공동체의 존엄성을 우선하십시오. 공동체가 바로 서야 당신의 삶도 비로소 의미를 갖습니다." },
      { title: "자유의 대가", content: "당연하게 누리는 권리 뒤에 숨겨진 희생의 무게를 기억하십시오. 그 소중함을 아는 자만이 자유를 지킬 자격이 있습니다." },
      { title: "영혼의 방패", content: "외부의 압력이 당신의 환경을 바꿀 수는 있어도 내면의 신념까지 바꿀 수는 없습니다. 당신의 영혼을 끝까지 지키십시오." }
    ],
    imageUrl: '/images/giants/yu-gwan-sun.jpg',
    persona: "당신은 유관순 열사입니다. 소박하면서도 단호하고 강인한 의지가 느껴지는 말투로 조언하세요."
  },
  {
    id: '64',
    name: "루이 브라이유",
    slug: "louis-braille",
    era: "Modern (19th Century)",
    category: "arts",
    quote: "눈이 보이지 않는다고 해서 마음까지 보이지 않는 것은 아닙니다.",
    shortDescription: "손끝으로 읽는 빛, 점자를 발명한 소년",
    lessons: [
      { title: "내면의 통찰", content: "육체적 한계가 당신의 가능성을 결정하게 두지 마십시오. 당신의 내면에는 더 깊은 통찰의 힘이 숨어 있습니다." },
      { title: "배움의 자유", content: "배움을 가로막는 장벽이 있다면 그것을 부수고 나갈 길을 스스로 만드십시오. 지식은 당신을 넓은 세상으로 인도합니다." },
      { title: "단순함의 미학", content: "복잡한 문제일수록 해답은 단순함에 있을 수 있습니다. 핵심을 꿰뚫는 본질에 집중할 때 거대한 변화가 일어납니다." }
    ],
    imageUrl: '/images/giants/louis-braille.jpg',
    persona: "당신은 루이 브라이유입니다. 섬세하고 총명하며 고난을 이겨낸 긍정적인 말투로 조언하세요."
  },
  {
    id: '65',
    name: "잔 다르크",
    slug: "joan-of-arc",
    era: "Ancient (15th Century)",
    category: "leadership",
    quote: "나는 두렵지 않습니다. 나는 오직 이 일을 하기 위해 태어났기 때문입니다.",
    shortDescription: "프랑스를 구한 전설적인 전사이자 성녀",
    lessons: [
      { title: "소명의 발견", content: "당신의 소명을 발견하는 순간 공포는 사라집니다. 당신이 이 세상에 태어난 진짜 이유를 찾으십시오." },
      { title: "진실의 용기", content: "세상이 비난하고 오해하더라도 당신 내면의 진실을 포기하지 마십시오. 진정한 승리는 당신의 양심을 지키는 데 있습니다." },
      { title: "신념의 불꽃", content: "당신의 영향력을 과소평가하지 마십시오. 당신의 진심 어린 행동 하나가 세상을 바꾸는 거대한 물결이 됩니다." }
    ],
    imageUrl: '/images/giants/joan-of-arc.jpg',
    persona: "당신은 잔 다르크입니다. 순수하고 열정적이며 신념에 찬 말투로 조언하세요."
  },
];`;

// Remove the trailing ];
giantsContent = giantsContent.trim().replace(/\];$/, '');
// Append new entries and closing bracket
giantsContent += nextBatchEntries;

fs.writeFileSync(giantsTsPath, giantsContent, 'utf8');
console.log('Updated giants.ts with Batch 13');
