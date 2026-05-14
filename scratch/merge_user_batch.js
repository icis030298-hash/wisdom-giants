const fs = require('fs');
const path = require('path');

const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
let giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

const nextBatchEntries = `  {
    id: '81',
    name: "시몬 볼리바르",
    slug: "simon-bolivar",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "성공은 얼마나 높이 올랐느냐가 아니라, 얼마나 깊은 절망의 바닥에서 다시 튀어 올랐느냐로 측정됩니다.",
    shortDescription: "남미 대륙의 5개국을 해방시킨 '해방자'",
    lessons: [
      { title: "자유의 열매", content: "자유는 거저 주어지는 것이 아니라 피와 땀으로 쟁취해야 하는 고귀한 열매입니다." },
      { title: "통합의 힘", content: "서로의 다름을 인정하고 하나의 비전 아래 뭉치십시오. 분열된 힘은 쉽게 무너집니다." },
      { title: "절망의 도약", content: "바닥을 쳤을 때 다시 솟구치는 탄력성이 당신을 거인으로 만듭니다." }
    ],
    imageUrl: '/images/giants/simon-bolivar.jpg',
    persona: "당신은 시몬 볼리바르입니다. 위엄 있고 열정적이며 대륙을 품는 웅대한 말투로 조언하세요."
  },
  {
    id: '82',
    name: "마가렛 대처",
    slug: "margaret-thatcher",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "생각을 조심하십시오, 그것이 말이 됩니다. 행동은 결국 당신의 운명이 됩니다.",
    shortDescription: "영국 경제를 부활시킨 '철의 여인'",
    lessons: [
      { title: "생각과 운명", content: "당신의 운명은 매일 반복되는 사소한 생각과 습관이 쌓여 만들어지는 필연적인 결과입니다." },
      { title: "리더의 결정", content: "리더는 인기를 얻는 자가 아니라 결정을 내리는 자입니다. 비난을 감수하더라도 미래를 위한 선택을 하십시오." },
      { title: "자립의 사회", content: "진정한 번영은 의존이 아닌 자립에서 나옵니다. 스스로의 운명을 책임지는 개인이 되십시오." }
    ],
    imageUrl: '/images/giants/margaret-thatcher.jpg',
    persona: "당신은 마가렛 대처입니다. 단호하고 논리적이며 원칙을 중시하는 강철 같은 말투로 조언하세요."
  },
  {
    id: '83',
    name: "존 D. 록펠러",
    slug: "john-d-rockefeller",
    era: "Modern (19th Century)",
    category: "business",
    quote: "부는 축복이 아니라 책임입니다.",
    shortDescription: "세계 최초의 억만장자이자 위대한 기부왕",
    lessons: [
      { title: "분석과 성실", content: "성공은 남들이 보지 못하는 작은 숫자의 차이에서 시작됩니다. 철저한 분석과 성실함이 운을 이깁니다." },
      { title: "부의 책임", content: "부는 축복이 아니라 책임입니다. 주어진 자원을 세상의 고통을 덜어주는 데 사용하십시오." },
      { title: "원칙의 힘", content: "세상의 평가에 일희일비하지 마십시오. 당신의 원칙이 확고하다면 시간은 결국 당신의 편이 될 것입니다." }
    ],
    imageUrl: '/images/giants/john-d-rockefeller.jpg',
    persona: "당신은 존 D. 록펠러입니다. 침착하고 신중하며 겸손하고 절제된 말투로 조언하세요."
  },
  {
    id: '84',
    name: "무스타파 케말 아타튀르크",
    slug: "mustafa-kemal-ataturk",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "가장 큰 승리는 전쟁터가 아니라 학교에서 일어납니다.",
    shortDescription: "현대 터키 공화국을 세운 국부",
    lessons: [
      { title: "미래의 개혁", content: "전통이 성장을 가로막는 족쇄가 된다면 과감히 그것을 깨부수어야 합니다. 변화를 두려워하지 마십시오." },
      { title: "내부의 평화", content: "집 안이 평화로워야 세상이 평화롭습니다. 내면의 안정과 조화가 모든 번영의 기초입니다." },
      { title: "지식의 승리", content: "일시적인 무력은 영토를 지키지만, 영원한 문명은 교육을 통해 세워집니다. 배움을 멈추지 마십시오." }
    ],
    imageUrl: '/images/giants/mustafa-kemal-ataturk.jpg',
    persona: "당신은 무스타파 케말 아타튀르크입니다. 단호하고 실용적이며 혁명적인 리더의 말투로 조언하세요."
  },
  {
    id: '85',
    name: "테오도르 루스벨트",
    slug: "theodore-roosevelt",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "지금 당신이 있는 곳에서, 당신이 가진 것을 가지고, 할 수 있는 일을 하십시오.",
    shortDescription: "미국의 위상을 세계로 끌어올린 역동적인 리더",
    lessons: [
      { title: "경기장의 투사", content: "영광은 먼지와 땀으로 범벅된 채 현장에서 직접 싸우는 자의 몫입니다. 구경꾼이 되지 마십시오." },
      { title: "실력과 단호함", content: "태도는 겸손하게 유지하되, 내면의 실력과 원칙은 누구도 넘볼 수 없을 만큼 강력하게 무장하십시오." },
      { title: "실행의 시작", content: "완벽한 환경은 결코 오지 않습니다. 지금 당신이 있는 곳에서 할 수 있는 작은 일부터 실행하십시오." }
    ],
    imageUrl: '/images/giants/theodore-roosevelt.jpg',
    persona: "당신은 테오도르 루스벨트입니다. 에너지가 넘치고 거칠면서도 용기를 북돋워 주는 말투로 조언하세요."
  },
];`;

giantsContent = giantsContent.trim().replace(/\];$/, '');
giantsContent += nextBatchEntries;

fs.writeFileSync(giantsTsPath, giantsContent, 'utf8');
console.log('Updated giants.ts with User Batch (81-85)');
