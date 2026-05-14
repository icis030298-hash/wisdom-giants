const fs = require('fs');

const masterGiants = [
  { "id": 1, "name": "스티브 잡스", "slug": "steve-jobs" },
  { "id": 2, "name": "나폴레옹 보나파르트", "slug": "napoleon-bonaparte" },
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
  { "id": 14, "name": "J.K. 롤링", "slug": "jk-rowling" },
  { "id": 15, "name": "넬슨 만델라", "slug": "nelson-mandela" },
  { "id": 16, "name": "헬렌 켈러", "slug": "helen-keller" },
  { "id": 17, "name": "루드비히 판 베토벤", "slug": "beethoven" },
  { "id": 18, "name": "스티븐 호킹", "slug": "stephen-hawking" },
  { "id": 19, "name": "말랄라 유사프자이", "slug": "malala-yousafzai" },
  { "id": 20, "name": "프랭클린 루스벨트", "slug": "franklin-d-roosevelt" },
  { "id": 21, "name": "마르쿠스 아우렐리우스", "slug": "marcus-aurelius" },
  { "id": 22, "name": "세네카", "slug": "seneca" },
  { "id": 23, "name": "공자", "slug": "confucius" },
  { "id": 24, "name": "소크라테스", "slug": "socrates" },
  { "id": 25, "name": "노자", "slug": "lao-tzu" },
  { "id": 26, "name": "아리스토텔레스", "slug": "aristotle" },
  { "id": 27, "name": "플라톤", "slug": "plato" },
  { "id": 28, "name": "마하트마 간디", "slug": "mahatma-gandhi" },
  { "id": 29, "name": "마틴 루터 킹", "slug": "martin-luther-king" },
  { "id": 30, "name": "마더 테레사", "slug": "mother-teresa" },
  { "id": 31, "name": "레오나르도 다 빈치", "slug": "leonardo-da-vinci" },
  { "id": 32, "name": "살바도르 달리", "slug": "salvador-dali" },
  { "id": 33, "name": "코코 샤넬", "slug": "coco-chanel" },
  { "id": 34, "name": "파블로 피카소", "slug": "pablo-picasso" },
  { "id": 35, "name": "모차르트", "slug": "mozart" },
  { "id": 36, "name": "윌리엄 셰익스피어", "slug": "william-shakespeare" },
  { "id": 37, "name": "알베르트 아인슈타인", "slug": "albert-einstein" },
  { "id": 38, "name": "마리 퀴리", "slug": "marie-curie" },
  { "id": 39, "name": "니콜라 테슬라", "slug": "nikola-tesla" },
  { "id": 40, "name": "빈센트 반 고흐", "slug": "vincent-van-gogh" },
  { "id": 41, "name": "에이브러햄 링컨", "slug": "abraham-lincoln" },
  { "id": 42, "name": "조지 워싱턴", "slug": "george-washington" },
  { "id": 43, "name": "이순신", "slug": "yi-sun-shin" },
  { "id": 44, "name": "엘리자베스 1세", "slug": "elizabeth-i" },
  { "id": 45, "name": "광개토대왕", "slug": "gwanggaeto-the-great" },
  { "id": 46, "name": "윈스턴 처칠", "slug": "winston-churchill" },
  { "id": 47, "name": "진시황", "slug": "qin-shi-huang" },
  { "id": 48, "name": "아우구스투스", "slug": "augustus" },
  { "id": 49, "name": "오토 폰 비스마르크", "slug": "otto-von-bismarck" },
  { "id": 50, "name": "표트르 대제", "slug": "peter-the-great" },
  { "id": 51, "name": "캐서린 대제", "slug": "catherine-the-great" },
  { "id": 52, "name": "시몬 볼리바르", "slug": "simon-bolivar" },
  { "id": 53, "name": "마가렛 대처", "slug": "margaret-thatcher" },
  { "id": 54, "name": "존 D. 록펠러", "slug": "john-d-rockefeller" },
  { "id": 55, "name": "무스타파 케말 아타튀르크", "slug": "ataturk" },
  { "id": 56, "name": "테오도르 루스벨트", "slug": "theodore-roosevelt" },
  { "id": 57, "name": "안네 프랑크", "slug": "anne-frank" },
  { "id": 58, "name": "로자 파크스", "slug": "rosa-parks" },
  { "id": 59, "name": "프레데릭 더글러스", "slug": "frederick-douglass" },
  { "id": 60, "name": "해리엇 터브먼", "slug": "harriet-tubman" },
  { "id": 61, "name": "오스카 쉰들러", "slug": "oskar-schindler" },
  { "id": 62, "name": "플로렌스 나이팅게일", "slug": "florence-nightingale" },
  { "id": 63, "name": "유관순", "slug": "yu-gwan-sun" },
  { "id": 64, "name": "루이 브라이유", "slug": "louis-braille" },
  { "id": 65, "name": "잔 다르크", "slug": "joan-of-arc" },
  { "id": 66, "name": "데스몬드 투투", "slug": "desmond-tutu" },
  { "id": 67, "name": "엘리 위젤", "slug": "elie-wiesel" },
  { "id": 68, "name": "해리엇 비처 스토", "slug": "harriet-beecher-stowe" },
  { "id": 69, "name": "리고베르타 멘추", "slug": "rigoberta-menchu" },
  { "id": 70, "name": "테리 폭스", "slug": "terry-fox" },
  { "id": 71, "name": "김구", "slug": "kim-gu" },
  { "id": 72, "name": "붓다", "slug": "buddha" },
  { "id": 73, "name": "프리드리히 니체", "slug": "friedrich-nietzsche" },
  { "id": 74, "name": "이마누엘 칸트", "slug": "immanuel-kant" },
  { "id": 75, "name": "르네 데카르트", "slug": "rene-descartes" },
  { "id": 76, "name": "장 자크 루소", "slug": "jean-jacques-rousseau" },
  { "id": 77, "name": "지그문트 프로이트", "slug": "sigmund-freud" },
  { "id": 78, "name": "칼 융", "slug": "carl-jung" },
  { "id": 79, "name": "바뤼흐 스피노자", "slug": "baruch-spinoza" },
  { "id": 80, "name": "손무", "slug": "sun-tzu" },
  { "id": 81, "name": "데이비드 흄", "slug": "david-hume" },
  { "id": 82, "name": "존 로크", "slug": "john-locke" },
  { "id": 83, "name": "시몬 드 보부아르", "slug": "simone-de-beauvoir" },
  { "id": 84, "name": "한나 아렌트", "slug": "hannah-arendt" },
  { "id": 85, "name": "쇠렌 키에르케고르", "slug": "soren-kierkegaard" },
  { "id": 86, "name": "아르투어 쇼펜하우어", "slug": "arthur-schopenhauer" },
  { "id": 87, "name": "아이작 뉴턴", "slug": "isaac-newton" },
  { "id": 88, "name": "갈릴레오 갈릴레이", "slug": "galileo-galilei" },
  { "id": 89, "name": "찰스 다윈", "slug": "charles-darwin" },
  { "id": 90, "name": "미켈란젤로", "slug": "michelangelo" },
  { "id": 91, "name": "클로드 모네", "slug": "claude-monet" },
  { "id": 92, "name": "표도르 도스토옙스키", "slug": "fyodor-dostoevsky" },
  { "id": 93, "name": "빅토르 위고", "slug": "victor-hugo" },
  { "id": 94, "name": "안톤 체호프", "slug": "anton-chekhov" },
  { "id": 95, "name": "프레데리크 쇼팽", "slug": "frederic-chopin" },
  { "id": 96, "name": "카츠시카 호쿠사이", "slug": "katsushika-hokusai" },
  { "id": 97, "name": "애가사 크리스티", "slug": "agatha-christie" },
  { "id": 98, "name": "마크 트웨인", "slug": "mark-twain" },
  { "id": 99, "name": "요한 볼프강 폰 괴테", "slug": "goethe" },
  { "id": 100, "name": "메리 셸리", "slug": "mary-shelley" }
];

const narrativesPath = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/final-narratives.json';
const content = fs.readFileSync(narrativesPath, 'utf8');

// Regex to find slugs even in broken JSON
const slugRegex = /"([a-z0-9-]+)"\s*:\s*\{/g;
const foundSlugs = [];
let match;
while ((match = slugRegex.exec(content)) !== null) {
  foundSlugs.push(match[1]);
}

// Also check for "era_ko" to count actual data blocks
const blockCount = (content.match(/"era_ko"/g) || []).length;

const masterSlugs = masterGiants.map(g => g.slug);

console.log('--- FINAL STANDARDIZED AUDIT REPORT ---');
console.log(`Total slugs found: ${foundSlugs.length}`);
console.log(`Total "era_ko" blocks found: ${blockCount}`);

const missingSlugs = masterSlugs.filter(slug => !foundSlugs.includes(slug));
console.log(`\nMissing Slugs in narratives (${missingSlugs.length}):`);
missingSlugs.forEach(slug => {
  const giant = masterGiants.find(g => g.slug === slug);
  console.log(`- ${slug} (${giant.name}, ID: ${giant.id})`);
});

const extraKeys = foundSlugs.filter(key => !masterSlugs.includes(key));
console.log(`\nExtra/Mismatched Keys found (${extraKeys.length}):`);
extraKeys.forEach(key => {
  console.log(`- ${key}`);
});

if (missingSlugs.length === 0 && extraKeys.length === 0 && foundSlugs.length === 100) {
  console.log('\nPERFECT PARITY ACHIEVED!');
} else {
  console.log('\nPARITY ISSUES DETECTED.');
}
