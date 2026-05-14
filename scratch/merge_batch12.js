const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
const batchPath = path.join(__dirname, 'batch12_narratives.json');

// 1. Merge Narratives
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const batchNarratives = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

Object.assign(narratives, batchNarratives);
fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log('Merged narratives into final-narratives.json');

// 2. Update giants.ts
let giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

// Fix existing IDs (51-55) to (52-56)
// We do it in reverse order to avoid double matching if we were just doing string replace
// But here they are objects, so we can be specific.
giantsContent = giantsContent.replace(/id: '55',/g, "id: '56',");
giantsContent = giantsContent.replace(/id: '54',/g, "id: '55',");
giantsContent = giantsContent.replace(/id: '53',/g, "id: '54',");
giantsContent = giantsContent.replace(/id: '52',/g, "id: '53',");
giantsContent = giantsContent.replace(/id: '51',/g, "id: '52',");

// Insert Catherine the Great (51) before Bolívar (52)
const catherineEntry = `  {
    id: '51',
    name: "캐서린 대제",
    slug: "catherine-the-great",
    era: "Modern (18th Century)",
    category: "leadership",
    quote: "나는 통치하기 위해 태어났습니다. 그러나 그 통치는 힘이 아닌 지혜와 헌신에서 시작되어야 합니다.",
    shortDescription: "러시아의 전성기를 이끈 계몽 전제 군주",
    lessons: [
      { title: "실력의 권위", content: "권위는 주어지는 것이 아니라 실력으로 증명하는 것입니다. 대상을 깊이 공부할 때 진정한 리더십이 생겨납니다." },
      { title: "준비된 행운", content: "행운은 준비된 마음을 찾아옵니다. 고독한 준비의 시간이 당신의 가장 찬란한 순간을 만드는 밑거름이 됩니다." },
      { title: "결점의 승화", content: "결점이나 불리한 조건을 탓하지 마십시오. 관점을 바꾸면 그것은 당신만의 독보적인 강점이 될 수 있습니다." }
    ],
    imageUrl: '/images/giants/catherine-the-great.jpg',
    persona: "당신은 캐서린 대제입니다. 우아하고 계몽적인 말투로 지혜를 나누세요."
  },
`;

// Find where Peter the Great ends (id 50) and Bolívar starts (id 52)
// Peter ends at line 778
giantsContent = giantsContent.replace(/id: '52',/, (match) => {
    return catherineEntry + "  " + match;
});

// Append the rest (57-60)
const nextBatchEntries = `  {
    id: '57',
    name: "안네 프랑크",
    slug: "anne-frank",
    era: "Modern (20th Century)",
    category: "arts",
    quote: "그럼에도 불구하고, 나는 사람들의 마음이 정말로 착하다고 믿습니다.",
    shortDescription: "절망 속에서도 희망을 기록한 소녀",
    lessons: [
      { title: "내면의 등불", content: "당신의 내면이 밝다면 어떤 감옥 같은 상황에서도 타인에게 빛을 줄 수 있습니다. 외부 환경이 아닌 당신의 마음을 먼저 돌보십시오." },
      { title: "기록의 힘", content: "고뇌가 당신을 짓누를 때 그것을 기록하십시오. 객관화된 고통은 더 이상 당신을 해치지 못하고 성찰의 도구가 됩니다." },
      { title: "불멸의 긍정", content: "어둠 속에서도 선한 의지를 잃지 마십시오. 당신의 작은 선함이 결국 거대한 어둠을 밝히는 유일한 횃불이 됩니다." }
    ],
    imageUrl: '/images/giants/anne-frank.jpg',
    persona: "당신은 안네 프랑크입니다. 맑고 희망적이며 섬세한 감수성으로 조언하세요."
  },
  {
    id: '58',
    name: "로자 파크스",
    slug: "rosa-parks",
    era: "Modern (20th Century)",
    category: "leadership",
    quote: "내가 거절한 것은 단지 자리를 양보하는 것이 아니라, 불의에 굴복하는 것이었습니다.",
    shortDescription: "한 번의 거절로 세상을 바꾼 인권 운동의 어머니",
    lessons: [
      { title: "존엄의 거절", content: "부당한 요구에 순응하는 것은 영혼을 갉아먹는 일입니다. 작은 일에서부터 당신의 존엄을 지키는 용기를 가지십시오." },
      { title: "행동하는 용기", content: "두려움은 행동하지 않을 때 커집니다. 정의로운 확신이 있다면 망설이지 말고 첫발을 내디디십시오." },
      { title: "시대의 공감", content: "개인의 피로보다 시대의 아픔에 공감하십시오. 당신의 작은 불편함이 세상을 치유하는 도구가 될 수 있습니다." }
    ],
    imageUrl: '/images/giants/rosa-parks.jpg',
    persona: "당신은 로자 파크스입니다. 조용하지만 단호하고 위엄 있는 말투로 조언하세요."
  },
  {
    id: '59',
    name: "프레데릭 더글러스",
    slug: "frederick-douglass",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "교육은 사람을 노예로 만들 수 없게 합니다.",
    shortDescription: "스스로 사슬을 끊고 지성으로 무장한 자유의 투사",
    lessons: [
      { title: "지식의 해방", content: "당신을 억압하는 환경에서 벗어나는 가장 강력한 무기는 배움입니다. 지식은 누구도 빼앗을 수 없는 당신의 영토입니다." },
      { title: "천둥과 번개", content: "투쟁 없이는 진보도 없습니다. 비를 원한다면 천둥과 번개 같은 시련을 견뎌내야 합니다." },
      { title: "마음의 사슬", content: "환경이 당신을 가둘 수 있어도 영혼까지 가두게 두지 마십시오. 스스로를 존엄하게 믿는 순간 해방은 시작됩니다." }
    ],
    imageUrl: '/images/giants/frederick-douglass.jpg',
    persona: "당신은 프레데릭 더글러스입니다. 웅변적이고 지성적이며 강인한 의지가 느껴지는 말투로 조언하세요."
  },
  {
    id: '60',
    name: "해리엇 터브먼",
    slug: "harriet-tubman",
    era: "Modern (19th Century)",
    category: "leadership",
    quote: "나는 한 번도 내 기차를 탈선시킨 적이 없고, 한 명의 승객도 잃은 적이 없습니다.",
    shortDescription: "동포들을 자유로 인도한 '흑인들의 모세'",
    lessons: [
      { title: "끝까지의 책임", content: "성공의 비결은 완벽한 조건이 아니라 끝까지 책임을 지는 완결성에 있습니다. 당신이 이끄는 사람들을 위해 끝까지 손을 놓지 마십시오." },
      { title: "비전의 소리", content: "공포의 소리보다 내면에서 울리는 비전의 소리에 집중하십시오. 그러면 어떤 늪지대도 건널 수 있습니다." },
      { title: "어둠 속의 결단", content: "안락함 속에 머물러서는 결코 변화를 이룰 수 없습니다. 때로는 모든 것을 걸고 어둠 속으로 뛰어드는 결단이 필요합니다." }
    ],
    imageUrl: '/images/giants/harriet-tubman.jpg',
    persona: "당신은 해리엇 터브먼입니다. 헌신적이고 신비로우며 불굴의 용기가 담긴 말투로 조언하세요."
  },
];`;

// Remove the trailing ];
giantsContent = giantsContent.trim().replace(/\];$/, '');
// Append new entries and closing bracket
giantsContent += nextBatchEntries;

fs.writeFileSync(giantsTsPath, giantsContent, 'utf8');
console.log('Updated giants.ts with Batch 12 and fixed IDs');
