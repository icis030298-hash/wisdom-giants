const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(process.cwd(), 'src/data/final-narratives.json');
const rawData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

// Mapping of English names (keys often used) to Korean names in Master Roster
const nameMap = {
  "Steve Jobs": "스티브 잡스",
  "Napoleon Bonaparte": "나폴레옹 보나파르트",
  "King Sejong": "세종대왕",
  "Elon Musk": "일론 머스크",
  "Genghis Khan": "징기스칸",
  "Alexander the Great": "알렉산더 대왕",
  "Walt Disney": "월트 디즈니",
  "Thomas Edison": "토마스 에디슨",
  "Julius Caesar": "율리우스 카이사르",
  "Henry Ford": "헨리 포드",
  "Frida Kahlo": "프리다 칼로",
  "Viktor Frankl": "빅터 프랑클",
  "Oprah Winfrey": "오프라 윈프리",
  "J.K. Rowling": "J.K. 롤링",
  "Nelson Mandela": "넬슨 만델라",
  "Helen Keller": "헬렌 켈러",
  "Ludwig van Beethoven": "루드비히 판 베토벤",
  "Stephen Hawking": "스티븐 호킹",
  "Malala Yousafzai": "말랄라 유사프자이",
  "Franklin D. Roosevelt": "프랭클린 루스벨트",
  "Marcus Aurelius": "마르쿠스 아우렐리우스",
  "Seneca": "세네카",
  "Confucius": "공자",
  "Socrates": "소크라테스",
  "Lao Tzu": "노자",
  "Aristotle": "아리스토텔레스",
  "Plato": "플라톤",
  "Mahatma Gandhi": "마하트마 간디",
  "Martin Luther King Jr.": "마틴 루터 킹",
  "Mother Teresa": "마더 테레사",
  "Leonardo da Vinci": "레오나르도 다 빈치",
  "Salvador Dalí": "살바도르 달리",
  "Coco Chanel": "코코 샤넬",
  "Pablo Picasso": "파블로 피카소",
  "Wolfgang Amadeus Mozart": "모차르트",
  "William Shakespeare": "윌리엄 셰익스피어",
  "Albert Einstein": "알베르트 아인슈타인",
  "Marie Curie": "마리 퀴리",
  "Nikola Tesla": "니콜라 테슬라",
  "Vincent van Gogh": "빈센트 반 고흐",
  "Abraham Lincoln": "에이브러햄 링컨",
  "George Washington": "조지 워싱턴",
  "Yi Sun-shin": "이순신",
  "Elizabeth I": "엘리자베스 1세",
  "Gwanggaeto the Great": "광개토대왕",
  "Winston Churchill": "윈스턴 처칠",
  "Qin Shi Huang": "진시황",
  "Augustus": "아우구스투스",
  "Otto von Bismarck": "오토 폰 비스마르크",
  "Peter the Great": "표트르 대제",
  "Catherine the Great": "캐서린 대제",
  "Simón Bolívar": "시몬 볼리바르",
  "Margaret Thatcher": "마가렛 대처",
  "John D. Rockefeller": "존 D. 록펠러",
  "Mustafa Kemal Atatürk": "무스타파 케말 아타튀르크",
  "Theodore Roosevelt": "테오도르 루스벨트",
  "Anne Frank": "안네 프랑크",
  "Rosa Parks": "로자 파크스",
  "Frederick Douglass": "프레데릭 더글러스",
  "Harriet Tubman": "해리엇 터브먼",
  "Oskar Schindler": "오스카 쉰들러",
  "Florence Nightingale": "플로렌스 나이팅게일",
  "Yu Gwan-sun": "유관순",
  "Louis Braille": "루이 브라이유",
  "Joan of Arc": "잔 다르크",
  "Desmond Tutu": "데스몬드 투투",
  "Elie Wiesel": "엘리 위젤",
  "Harriet Beecher Stowe": "해리엇 비처 스토",
  "Rigoberta Menchú": "리고베르타 멘추",
  "Terry Fox": "테리 폭스",
  "Arthur Schopenhauer": "아르투어 쇼펜하우어",
  "Isaac Newton": "아이작 뉴턴",
  "Galileo Galilei": "갈릴레오 갈릴레이",
  "Charles Darwin": "찰스 다윈",
  "Michelangelo": "미켈란젤로",
  "Claude Monet": "클로드 모네",
  "Fyodor Dostoevsky": "표도르 도스토옙스키",
  "Victor Hugo": "빅토르 위고",
  "Anton Chekhov": "안톤 체호프",
  "Frédéric Chopin": "프레데리크 쇼팽",
  "Katsushika Hokusai": "카츠시카 호쿠사이",
  "Agatha Christie": "애가사 크리스티",
  "Mark Twain": "마크 트웨인",
  "Johann Wolfgang von Goethe": "요한 볼프강 폰 괴테",
  "Mary Shelley": "메리 셸리"
};

// Master List from giants.ts (I'll hardcode the names to be safe)
const masterNames = [
  "스티브 잡스", "나폴레옹 보나파르트", "세종대왕", "일론 머스크", "징기스칸", "알렉산더 대왕", "월트 디즈니", "토마스 에디슨", "율리우스 카이사르", "헨리 포드",
  "프리다 칼로", "빅터 프랑클", "오프라 윈프리", "J.K. 롤링", "넬슨 만델라", "헬렌 켈러", "루드비히 판 베토벤", "스티븐 호킹", "말랄라 유사프자이", "프랭클린 루스벨트",
  "마르쿠스 아우렐리우스", "세네카", "공자", "소크라테스", "노자", "아리스토텔레스", "플라톤", "마하트마 간디", "마틴 루터 킹", "마더 테레사",
  "레오나르도 다 빈치", "살바도르 달리", "코코 샤넬", "파블로 피카소", "모차르트", "윌리엄 셰익스피어", "알베르트 아인슈타인", "마리 퀴리", "니콜라 테슬라", "빈센트 반 고흐",
  "에이브러햄 링컨", "조지 워싱턴", "이순신", "엘리자베스 1세", "광개토대왕", "윈스턴 처칠", "진시황", "아우구스투스", "오토 폰 비스마르크", "표트르 대제",
  "캐서린 대제", "시몬 볼리바르", "마가렛 대처", "존 D. 록펠러", "무스타파 케말 아타튀르크", "테오도르 루스벨트", "안네 프랑크", "로자 파크스", "프레데릭 더글러스", "해리엇 터브먼",
  "오스카 쉰들러", "플로렌스 나이팅게일", "유관순", "루이 브라이유", "잔 다르크", "데스몬드 투투", "엘리 위젤", "해리엇 비처 스토", "리고베르타 멘추", "테리 폭스",
  "김구", "붓다", "프리드리히 니체", "이마누엘 칸트", "르네 데카르트", "장 자크 루소", "지그문트 프로이트", "칼 융", "바뤼흐 스피노자", "손무",
  "데이비드 흄", "존 로크", "시몬 드 보부아르", "한나 아렌트", "쇠렌 키에르케고르", "아르투어 쇼펜하우어", "아이작 뉴턴", "갈릴레오 갈릴레이", "찰스 다윈", "미켈란젤로",
  "클로드 모네", "표도르 도스토옙스키", "빅토르 위고", "안톤 체호프", "프레데리크 쇼팽", "카츠시카 호쿠사이", "애가사 크리스티", "마크 트웨인", "요한 볼프강 폰 괴테", "메리 셸리"
];

const cleanedData = {};

masterNames.forEach(name => {
  // Try to find the narrative
  let narrative = rawData[name];
  
  // Try reverse mapping if not found
  if (!narrative) {
    const engName = Object.keys(nameMap).find(key => nameMap[key] === name);
    if (engName) narrative = rawData[engName];
  }

  if (!narrative) {
    cleanedData[name] = {
      era_ko: "역사의 거인",
      category: "기타",
      epic_ko: "서사 준비 중입니다.",
      trials_ko: "시련 준비 중...",
      overcoming_ko: "극복 준비 중...",
      wisdom: []
    };
    return;
  }

  // If it's a string, parse it
  if (typeof narrative === 'string') {
    const lines = narrative.split('\n');
    let epic = "";
    let trials = "";
    let overcoming = "";
    let wisdom = [];

    let currentSection = "";

    lines.forEach(line => {
      if (line.includes('거인의 대서사시')) {
        currentSection = "epic";
      } else if (line.includes('지독한 시련 & 위대한 극복')) {
        currentSection = "trials";
      } else if (line.includes('거인의 지혜')) {
        currentSection = "wisdom";
      } else {
        if (currentSection === "epic") epic += line + "\n";
        else if (currentSection === "trials") {
           // Try to split trials and overcoming if they are in the same section
           if (line.includes('극복') || line.includes('승리')) {
             overcoming += line + "\n";
           } else {
             trials += line + "\n";
           }
        }
        else if (currentSection === "wisdom") {
          // Match 1. Title: Content
          const match = line.match(/^\d+\.\s+\*\*(.*?)\*\*:\s+(.*)$/);
          if (match) {
            wisdom.push({ quote_ko: match[1], meaning_ko: match[2] });
          }
        }
      }
    });

    cleanedData[name] = {
      era_ko: "역사의 거인",
      category: "기타",
      epic_ko: epic.trim(),
      trials_ko: trials.trim(),
      overcoming_ko: overcoming.trim(),
      wisdom: wisdom
    };
  } else {
    // Already an object, just copy
    cleanedData[name] = narrative;
  }
});

fs.writeFileSync(narrativesPath, JSON.stringify(cleanedData, null, 2), 'utf8');
console.log('Successfully standardized final-narratives.json');
