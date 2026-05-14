const fs = require('fs');

const masterGiants = [
  { "id": 1, "name": "스티브 잡스", "slug": "steve-jobs" },
  { "id": 2, "name": "나폴레옹 보나파르트", "slug": "napoleon" },
  { "id": 3, "name": "세종대왕", "slug": "king-sejong" },
  { "id": 4, "name": "일론 머스크", "slug": "elon-musk" },
  { "id": 5, "name": "징기스칸", "slug": "genghis-khan" },
  { "id": 6, "name": "알렉산더 대왕", "slug": "alexander-the-great" },
  { "id": 7, "name": "월트 디즈니", "slug": "walt-disney" },
  { "id": 8, "name": "토마스 에디슨", "slug": "thomas-edison" },
  { "id": 9, "name": "율리우스 카이사르", "slug": "julius-caesar" },
  { "id": 10, "name": "헨리 포드", "slug": "henry-ford" },
  { "id": 11, "name": "프리다 칼로", "slug": "frida-kahlo" },
  { "id": 12, "name": "빅터 프랑클", "slug": "viktor-frankl" },
  { "id": 13, "name": "오프라 윈프리", "slug": "oprah-winfrey" },
  { "id": 14, "name": "J.K. 롤링", "slug": "jk" },
  { "id": 15, "name": "넬슨 만델라", "slug": "mandela" },
  { "id": 16, "name": "헬렌 켈러", "slug": "helen-keller" },
  { "id": 17, "name": "루드비히 판 베토벤", "slug": "beethoven" },
  { "id": 18, "name": "스티븐 호킹", "slug": "stephen-hawking" },
  { "id": 19, "name": "말랄라 유사프자이", "slug": "malala" },
  { "id": 20, "name": "프랭클린 루스벨트", "slug": "fdr" },
  { "id": 21, "name": "마르쿠스 아우렐리우스", "slug": "marcus-aurelius" },
  { "id": 22, "name": "세네카", "slug": "seneca" },
  { "id": 23, "name": "공자", "slug": "confucius" },
  { "id": 24, "name": "소크라테스", "slug": "socrates" },
  { "id": 25, "name": "노자", "slug": "giant-25" },
  { "id": 26, "name": "아리스토텔레스", "slug": "giant-26" },
  { "id": 27, "name": "플라톤", "slug": "giant-27" },
  { "id": 28, "name": "마하트마 간디", "slug": "giant-28" },
  { "id": 29, "name": "마틴 루터 킹", "slug": "mlk" },
  { "id": 30, "name": "마더 테레사", "slug": "giant-30" },
  { "id": 31, "name": "레오나르도 다 빈치", "slug": "leonardo-da-vinci" },
  { "id": 32, "name": "살바도르 달리", "slug": "giant-32" },
  { "id": 33, "name": "코코 샤넬", "slug": "giant-33" },
  { "id": 34, "name": "파블로 피카소", "slug": "giant-34" },
  { "id": 35, "name": "모차르트", "slug": "giant-35" },
  { "id": 36, "name": "윌리엄 셰익스피어", "slug": "giant-36" },
  { "id": 37, "name": "알베르트 아인슈타인", "slug": "einstein" },
  { "id": 38, "name": "마리 퀴리", "slug": "marie-curie" },
  { "id": 39, "name": "니콜라 테슬라", "slug": "giant-39" },
  { "id": 40, "name": "빈센트 반 고흐", "slug": "giant-40" },
  { "id": 41, "name": "에이브러햄 링컨", "slug": "lincoln" },
  { "id": 42, "name": "조지 워싱턴", "slug": "giant-42" },
  { "id": 43, "name": "이순신", "slug": "giant-43" },
  { "id": 44, "name": "엘리자베스 1세", "slug": "elizabeth-i" },
  { "id": 45, "name": "광개토대왕", "slug": "giant-45" },
  { "id": 46, "name": "윈스턴 처칠", "slug": "churchill" },
  { "id": 47, "name": "진시황", "slug": "giant-47" },
  { "id": 48, "name": "아우구스투스", "slug": "giant-48" },
  { "id": 49, "name": "오토 폰 비스마르크", "slug": "giant-49" },
  { "id": 50, "name": "표트르 대제", "slug": "giant-50" },
  { "id": 51, "name": "캐서린 대제", "slug": "giant-51" },
  { "id": 52, "name": "시몬 볼리바르", "slug": "giant-52" },
  { "id": 53, "name": "마가렛 대처", "slug": "margaret-thatcher" },
  { "id": 54, "name": "존 D. 록펠러", "slug": "d" },
  { "id": 55, "name": "무스타파 케말 아타튀르크", "slug": "giant-55" },
  { "id": 56, "name": "테오도르 루스벨트", "slug": "giant-56" },
  { "id": 57, "name": "안네 프랑크", "slug": "giant-57" },
  { "id": 58, "name": "로자 파크스", "slug": "giant-58" },
  { "id": 59, "name": "프레데릭 더글러스", "slug": "giant-59" },
  { "id": 60, "name": "해리엇 터브먼", "slug": "giant-60" },
  { "id": 61, "name": "오스카 쉰들러", "slug": "giant-61" },
  { "id": 62, "name": "플로렌스 나이팅게일", "slug": "giant-62" },
  { "id": 63, "name": "유관순", "slug": "giant-63" },
  { "id": 64, "name": "루이 브라이유", "slug": "giant-64" },
  { "id": 65, "name": "잔 다르크", "slug": "giant-65" },
  { "id": 66, "name": "데스몬드 투투", "slug": "giant-66" },
  { "id": 67, "name": "엘리 위젤", "slug": "giant-67" },
  { "id": 68, "name": "해리엇 비처 스토", "slug": "giant-68" },
  { "id": 69, "name": "리고베르타 멘추", "slug": "giant-69" },
  { "id": 70, "name": "테리 폭스", "slug": "giant-70" },
  { "id": 71, "name": "김구", "slug": "giant-71" },
  { "id": 72, "name": "붓다", "slug": "giant-72" },
  { "id": 73, "name": "프리드리히 니체", "slug": "giant-73" },
  { "id": 74, "name": "이마누엘 칸트", "slug": "giant-74" },
  { "id": 75, "name": "르네 데카르트", "slug": "giant-75" },
  { "id": 76, "name": "장 자크 루소", "slug": "giant-76" },
  { "id": 77, "name": "지그문트 프로이트", "slug": "giant-77" },
  { "id": 78, "name": "칼 융", "slug": "giant-78" },
  { "id": 79, "name": "바뤼흐 스피노자", "slug": "giant-79" },
  { "id": 80, "name": "손무", "slug": "giant-80" },
  { "id": 81, "name": "데이비드 흄", "slug": "giant-81" },
  { "id": 82, "name": "존 로크", "slug": "giant-82" },
  { "id": 83, "name": "시몬 드 보부아르", "slug": "giant-83" },
  { "id": 84, "name": "한나 아렌트", "slug": "giant-84" },
  { "id": 85, "name": "쇠렌 키에르케고르", "slug": "giant-85" },
  { "id": 86, "name": "아르투어 쇼펜하우어", "slug": "giant-86" },
  { "id": 87, "name": "아이작 뉴턴", "slug": "newton" },
  { "id": 88, "name": "갈릴레오 갈릴레이", "slug": "giant-88" },
  { "id": 89, "name": "찰스 다윈", "slug": "darwin" },
  { "id": 90, "name": "미켈란젤로", "slug": "michelangelo" },
  { "id": 91, "name": "클로드 모네", "slug": "giant-91" },
  { "id": 92, "name": "표도르 도스토옙스키", "slug": "giant-92" },
  { "id": 93, "name": "빅토르 위고", "slug": "giant-93" },
  { "id": 94, "name": "안톤 체호프", "slug": "giant-94" },
  { "id": 95, "name": "프레데리크 쇼팽", "slug": "giant-95" },
  { "id": 96, "name": "카츠시카 호쿠사이", "slug": "giant-96" },
  { "id": 97, "name": "애가사 크리스티", "slug": "agatha-christie" },
  { "id": 98, "name": "마크 트웨인", "slug": "mark-twain" },
  { "id": 99, "name": "요한 볼프강 폰 괴테", "slug": "goethe" },
  { "id": 100, "name": "메리 셸리", "slug": "mary-shelley" }
];

const slugMap = {
  "napoleon-bonaparte": "napoleon",
  "abraham-lincoln": "lincoln",
  "albert-einstein": "einstein",
  "mahatma-gandhi": "giant-28", // Should probably fix this in giants.ts later
  "mother-teresa": "giant-30",
  "nelson-mandela": "mandela",
  "winston-churchill": "churchill",
  "jk-rowling": "jk",
  "lao-tzu": "giant-25",
  "joan-of-arc": "giant-65",
  "queen-elizabeth-i": "elizabeth-i",
  "martin-luther-king": "mlk",
  "martin-louther-king": "mlk",
  "queen-victoria": "queen-victoria", // Not in masterGiants 100? Let's check.
  "peter-the-great": "giant-50",
  "george-washington": "giant-42",
  "thomas-jefferson": "thomas-jefferson", // Not in masterGiants?
  "franklin-d-roosevelt": "fdr",
  "john-f-kennedy": "john-f-kennedy" // Not in masterGiants?
};

const narrativesPath = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/final-narratives.json';
const content = fs.readFileSync(narrativesPath, 'utf8');

// Use a very liberal regex to extract objects
// This is risky but since the JSON is broken, we need to salvage it.
// We look for "slug": { ... } and try to balance braces or just grab until the next slug.
const blocks = content.split(/\n(?="[a-z0-9-]+": {)/);

const salvages = {};

blocks.forEach(block => {
  const match = block.match(/"([a-z0-9-]+)"\s*:\s*\{/);
  if (match) {
    let slug = match[1];
    let body = block.substring(block.indexOf('{'));
    
    // Normalize slug
    if (slugMap[slug]) slug = slugMap[slug];
    
    // Try to fix body syntax (ensure it ends with a comma or brace)
    body = body.trim();
    if (body.endsWith(',')) body = body.slice(0, -1);
    
    // Very crude way to ensure it's at least close to valid JSON
    // We'll wrap it in a temp object to test
    try {
      const temp = JSON.parse(`{"data": ${body}}`);
      salvages[slug] = temp.data;
    } catch (e) {
      console.log(`Failed to parse salvaged block for ${slug}: ${e.message}`);
      // Try a secondary fix: if it ends with ]} but missing a closing brace
      try {
         const fixedBody = body + "}";
         const temp = JSON.parse(`{"data": ${fixedBody}}`);
         salvages[slug] = temp.data;
      } catch (e2) {
         console.log(`Secondary fix failed for ${slug}`);
      }
    }
  }
});

// Write salvaged data to a clean file
fs.writeFileSync('c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/final-narratives_clean.json', JSON.stringify(salvages, null, 2));
console.log(`Salvaged ${Object.keys(salvages).length} giants.`);
