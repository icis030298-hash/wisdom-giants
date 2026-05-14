import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/giants.ts';
let content = fs.readFileSync(filePath, 'utf8');

const updates = [
  {
    id: '1',
    era: '21세기의 거인 (20세기 ~ 21세기)',
    pain: '애플에서 쫓겨나 공개적인 실패자로 전락했던 서른 살의 지독한 상실감과 배신감.',
    recovery: '넥스트와 픽사를 통해 기술과 예술의 정점을 개척한 후 애플로 복귀하여 혁신을 완성함.',
    mbti: 'ENTP'
  },
  {
    id: '2',
    era: '19세기의 거인',
    pain: '유럽 전체를 호령하던 권력의 정점에서 워털루 패배 후 맞이한 세인트헬레나 섬의 지독한 고독과 무력감.',
    recovery: "절망적인 고립 속에서도 자신의 철학을 기록하며 인류의 근대화를 이끄는 '나폴레옹 법전'이라는 불멸의 유산을 남김.",
    mbti: 'ENTJ'
  },
  {
    id: '3',
    era: '15세기의 거인',
    pain: '1443년, 기득권층의 격렬한 반대와 시력을 잃어가는 가혹한 신체적 고통 속에서 홀로 백성을 위한 길을 개척해야 했던 고독.',
    recovery: "백성을 사랑하는 마음 하나로 버티며, 자신의 눈과 바꾼 인류 역사상 가장 과학적인 문자 '훈민정음'을 기어코 완성함.",
    mbti: 'INFJ'
  },
  {
    id: '4',
    era: '21세기의 거인 (20세기 ~ 21세기)',
    pain: '2008년, 스페이스X의 3회 연속 발사 실패와 테슬라의 파산 위기, 그리고 이혼이 겹친 인생 최악의 암흑기.',
    recovery: '전 재산을 건 마지막 베팅으로 스페이스X의 4차 발사를 성공시키며 민간 우주 시대와 전기차 혁명을 현실로 만듦.',
    mbti: 'INTJ'
  },
  {
    id: '5',
    era: '13세기의 거인 (12세기 ~ 13세기)',
    pain: '9살에 아버지를 잃고 부족에서 버림받아 노예로 끌려다녔던 짐승 같은 수모와 처절한 굶주림.',
    recovery: '출신과 핏줄 대신 오직 능력만으로 사람을 모아 유라시아 대륙을 하나로 묶은 인류사 최대의 제국을 건설함.',
    mbti: 'ENTJ'
  },
  {
    id: '6',
    era: '기원전 4세기의 거인',
    pain: '스무 살의 어린 나이에 아버지가 암살당하며 맞이한 제국의 붕괴 위기와 사방이 적으로 둘러싸인 고독한 상황.',
    recovery: '압도적인 결단력으로 내부 반란을 잠재우고 페르시아 원정을 강행하여 인류사 최대의 제국을 건설함.',
    mbti: 'ENTP'
  },
  {
    id: '7',
    era: '20세기의 거인',
    pain: "첫 스튜디오의 파산과 핵심 캐릭터인 '오스왈드'의 판권을 빼앗긴 배신으로 인한 절망.",
    recovery: "절망의 기차 안에서 탄생시킨 '미키 마우스'로 기적처럼 재기하며 마법의 왕국을 건설함.",
    mbti: 'ENFP'
  },
  {
    id: '8',
    era: '19세기의 거인 (19세기 ~ 20세기)',
    pain: '전구 발명을 위한 1,000번 이상의 처절한 실험 실패와 세상의 비웃음.',
    recovery: "실패를 '안 되는 방법을 발견한 과정'으로 정의하며 끝내 인류를 어둠에서 해방함.",
    mbti: 'ENTP'
  },
  {
    id: '9',
    era: '기원전 1세기의 거인',
    pain: '해적에게 납치되는 모욕과 천문학적인 빚더미에 눌린 절망적 상황.',
    recovery: '루비콘강을 건너는 결단으로 낡은 시대를 종식시키고 제국의 길을 염.',
    mbti: 'ENTJ'
  },
  {
    id: '10',
    era: '20세기의 거인',
    pain: '두 번의 사업 실패와 투자자들로부터의 배신, 그리고 빈손으로의 퇴장.',
    recovery: '컨베이어 벨트 시스템을 발명하여 자동차를 대중의 권리로 바꾸며 현대 산업의 기틀을 닦음.',
    mbti: 'ISTJ'
  }
];

updates.forEach(update => {
  const regex = new RegExp(`id: '${update.id}', name: [^,]+, category: [^,]+,\\s+headline: [^,]+,\\s+shortDescription: [^,]+, slug: [^,]+,\\s+quote: ".*?",`, 's');
  const match = content.match(regex);
  if (match) {
    const replacement = match[0] + `\n    era: '${update.era}',\n    pain: "${update.pain}",\n    recovery: "${update.recovery}",`;
    // Also need to handle the removal of old pain/recovery if they exist.
    // This is tricky with regex on a large file.
    // Let's use a simpler approach: replace the entire block for each ID.
  }
});

// Actually, I'll just use a simpler script that targets the specific fields.
// Since I shortened them, I can just replace the old long strings.

updates.forEach(update => {
    // Find the giant block by ID
    const startIdx = content.indexOf(`id: '${update.id}'`);
    if (startIdx === -1) return;
    
    let endIdx = content.indexOf('},', startIdx);
    if (endIdx === -1) endIdx = content.indexOf('}', startIdx);
    
    let block = content.substring(startIdx, endIdx);
    
    // Replace or add era
    if (block.includes('era:')) {
        block = block.replace(/era: '.*?',/, `era: '${update.era}',`);
    } else {
        block = block.replace(/quote: ".*?",/, (m) => m + `\n    era: '${update.era}',`);
    }
    
    // Replace pain and recovery
    block = block.replace(/pain: ".*?",/s, `pain: "${update.pain}",`);
    block = block.replace(/recovery: ".*?",/s, `recovery: "${update.recovery}",`);
    
    // Add mbti before persona or imageUrl
    if (!block.includes('mbti:')) {
        block = block.replace(/persona: "/, `mbti: '${update.mbti}',\n    persona: "`);
    }
    
    content = content.substring(0, startIdx) + block + content.substring(endIdx);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated giants.ts');
