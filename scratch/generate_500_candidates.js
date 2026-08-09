const fs = require('fs');

const existingSlugs = new Set(JSON.parse(fs.readFileSync('scratch/existing_slugs.json', 'utf8')));

// We will construct 500 high quality, well-known historical figures across all categories and regions
// Let's create a builder script that defines batches of 500 candidates.

// Helper to sanitize slug
const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// We will build the 500 list cleanly:
const rawList = [
  // --- KOREA & EAST ASIA (60) ---
  { nameEn: "Shin Saimdang", nameKo: "신사임당", era: "1504 ~ 1551", region: "Korea", category: "arts", gender: "F", reason: "조선 최고의 여성 예술가이자 시인, 학문과 예술의 조화를 이룬 인물" },
  { nameEn: "Heo Jun", nameKo: "허준", era: "1539 ~ 1615", region: "Korea", category: "science", gender: "M", reason: "동의보감을 집필하여 의학의 대중화와 인술(仁術)을 실천한 명의" },
  { nameEn: "Kim Man-deok", nameKo: "김만덕", era: "1739 ~ 1812", region: "Korea", category: "business", gender: "F", reason: "제주도 기근 당시 전 재산을 털어 백성을 구휼한 거상이자 노블레스 오블리주" },
  { nameEn: "Na Hye-sok", nameKo: "나혜석", era: "1896 ~ 1948", region: "Korea", category: "arts", gender: "F", reason: "한국 최초의 여성 서양화가이자 가부장제에 맞선 선구적 페미니스트" },
  { nameEn: "Yi Hwang (Toegye)", nameKo: "이황 (퇴계)", era: "1501 ~ 1570", region: "Korea", category: "philosophy", gender: "M", reason: "동방의 주자로 불리며 성리학을 집대성하고 유교적 덕목을 실천한 철학자" },
  { nameEn: "Yi I (Yulgok)", nameKo: "이이 (율곡)", era: "1536 ~ 1584", region: "Korea", category: "philosophy", gender: "M", reason: "십만양병설과 개혁안을 제시하며 사회적 개혁과 학문을 조화시킨 사상가" },
  { nameEn: "Jang Yeong-sil", nameKo: "장영실", era: "1390 ~ 1450", region: "Korea", category: "science", gender: "M", reason: "노비 출신으로 자격루, 측우기를 발명한 조선 최고의 천재 과학자" },
  { nameEn: "Wonhyo", nameKo: "원효", era: "617 ~ 686", region: "Korea", category: "philosophy", gender: "M", reason: "해골물 일체유심조 깨달음을 얻고 화쟁사상으로 대중 불교를 전파한 사상가" },
  { nameEn: "Uisang", nameKo: "의상", era: "625 ~ 702", region: "Korea", category: "philosophy", gender: "M", reason: "화엄종을 창시하고 부석사를 건립하여 화엄 사상을 집대성한 대사" },
  { nameEn: "Eulji Mundeok", nameKo: "을지문덕", era: "550 ~ 620", region: "Korea", category: "leadership", gender: "M", reason: "살수대첩에서 수나라 30만 대군을 퇴치한 고구려 명장" },
  { nameEn: "Gang Gam-chan", nameKo: "강감찬", era: "948 ~ 1031", region: "Korea", category: "leadership", gender: "M", reason: "귀주대첩을 통해 거란의 침략을 격퇴하고 고려의 평화를 지킨 구국 장군" },
  { nameEn: "Choe Museon", nameKo: "최무선", era: "1325 ~ 1395", region: "Korea", category: "science", gender: "M", reason: "화약을 최초로 개발하고 진포대첩에서 왜구를 궤멸시킨 과학자" },
  { nameEn: "Seo Hui", nameKo: "서희", era: "942 ~ 998", region: "Korea", category: "leadership", gender: "M", reason: "외교적 담판만으로 거란 대군을 물리치고 강동 6주를 획득한 탁월한 외교가" },
  { nameEn: "Gim Yu-sin", nameKo: "김유신", era: "595 ~ 673", region: "Korea", category: "leadership", gender: "M", reason: "삼국통일의 주역이자 화랑도 정신을 몸소 실천한 신라의 명장" },
  { nameEn: "Sol Geo", nameKo: "솔거", era: "550 ~ 620", region: "Korea", category: "arts", gender: "M", reason: "황룡사 벽화 황송도를 그려 새가 날아들게 만들었다는 신라의 전설적 화가" },
  { nameEn: "Seok Ga-mo-ni (Park Eun-sik)", nameKo: "박은식", era: "1859 ~ 1925", region: "Korea", category: "society", gender: "M", reason: "'한국통사'와 '한국독립운동지혈사'를 써서 독립 의식을 일깨운 역사학자" },
  { nameEn: "Shin Chae-ho", nameKo: "신채호", era: "1880 ~ 1936", region: "Korea", category: "society", gender: "M", reason: "역사를 '아와 비아의 투쟁'으로 정의하고 민족주의 사상을 확립한 사상가" },
  { nameEn: "Ju Si-gyeong", nameKo: "주시경", era: "1876 ~ 1914", region: "Korea", category: "society", gender: "M", reason: "한글이라는 명칭을 제정하고 국어학 연구에 평생을 바친 한글학자" },
  { nameEn: "Bang Jeong-hwan", nameKo: "방정환", era: "1899 ~ 1931", region: "Korea", category: "society", gender: "M", reason: "어린이날을 제정하고 아동 인권 확립과 동화 보급에 앞장선 선구자" },
  { nameEn: "Yun Dong-ju", nameKo: "윤동주", era: "1917 ~ 1945", region: "Korea", category: "arts", gender: "M", reason: "'서시', '하늘과 바람과 별과 시'로 맑은 영혼과 억압에 대한 저항을 노래한 민족 시인" },
  { nameEn: "Han Yong-un", nameKo: "한용운", era: "1879 ~ 1944", region: "Korea", category: "arts", gender: "M", reason: "'님의 침묵'을 써서 민족의 한과 지조를 노래한 승려이자 독립운동가" },
  { nameEn: "Lee Sang", nameKo: "이상", era: "1910 ~ 1937", region: "Korea", category: "arts", gender: "M", reason: "'오감도', '날개'를 통해 모더니즘 문학의 파격적인 지평을 연 천재 작가" },
  { nameEn: "Kim Sowol", nameKo: "김소월", era: "1902 ~ 1934", region: "Korea", category: "arts", gender: "M", reason: "'진달래꽃', '산유화'로 한국 전통 한과 정서를 시로 sublimated 시킨 국민 시인" },
  { nameEn: "Sei Shonagon", nameKo: "세이 쇼나곤", era: "966 ~ 1025", region: "Japan", category: "arts", gender: "F", reason: "'마쿠라노소시'를 쓴 일본 고전 수필 문학의 여왕" },
  { nameEn: "Minamoto no Yoshitsune", nameKo: "미나모토 노 요시츠네", era: "1159 ~ 1189", region: "Japan", category: "leadership", gender: "M", reason: "비극적 전설과 무사도 정신의 상징적 군사 전술가" },
  { nameEn: "Zeami Motokiyo", nameKo: "제아미 모토키요", era: "1363 ~ 1443", region: "Japan", category: "arts", gender: "M", reason: "일본 '노(能)' 극예술을 완성하고 미학 이론서 '풍자화전'을 남긴 예술가" },
  { nameEn: "Sen no Rikyu", nameKo: "센 노 리큐", era: "1522 ~ 1591", region: "Japan", category: "arts", gender: "M", reason: "일본 차도(茶道) 정신인 와비사비를 완성한 미학의 거장" },
  { nameEn: "Sugawara no Michizane", nameKo: "스ጋ와라 노 미치자네", era: "845 ~ 903", region: "Japan", category: "philosophy", gender: "M", reason: "학문과 문학의 신으로 추앙받은 헤이안 시대 최고의 학자이자 정치인" },
  { nameEn: "Ihara Saikaku", nameKo: "이하라 사이카쿠", era: "1642 ~ 1693", region: "Japan", category: "arts", gender: "M", reason: "에도시대 상인과 서민의 삶을 사실적으로 묘사한 가나조시 소설가" },
  { nameEn: "Chikamatsu Monzaemon", nameKo: "치카마츠 몬자에몽", era: "1653 ~ 1725", region: "Japan", category: "arts", gender: "M", reason: "일본의 셰익스피어로 불린 에도시대 인형극(분라쿠) 및 가부키 극작가" },
  { nameEn: "Ban Zhao", nameKo: "반소", era: "45 ~ 116", region: "China", category: "philosophy", gender: "F", reason: "한나라 시대 여성 최초의 역사학자이자 독보적 여성 학자" },
  { nameEn: "Cai Lun", nameKo: "채륜", era: "50 ~ 121", region: "China", category: "science", gender: "M", reason: "종이(제지술)를 발명하여 인류 지식 전파의 혁명을 일으킨 인물" },
  { nameEn: "Zhang Heng", nameKo: "장형", era: "78 ~ 139", region: "China", category: "science", gender: "M", reason: "세계 최초의 지진계(후풍지동의)와 혼천의를 발명한 후한의 천문학자" },
  { nameEn: "Zu Chongzhi", nameKo: "조충지", era: "429 ~ 500", region: "China", category: "science", gender: "M", reason: "원주율(π)을 소수점 7자리까지 정확히 계산해낸 고대 중국의 천재 수학자" },
  { nameEn: "Li Qingzhao", nameKo: "이청조", era: "1084 ~ 1155", region: "China", category: "arts", gender: "F", reason: "송나라 시대를 빛낸 중국 역사상 가장 위대한 여성 사인(詞人)" },
  { nameEn: "Su Shi (Su Dongpo)", nameKo: "소식 (소동파)", era: "1037 ~ 1101", region: "China", category: "arts", gender: "M", reason: "시·서·화에 모두 능했던 송나라 최고의 서화가이자 문학가" },
  { nameEn: "Du Fu", nameKo: "두보", era: "712 ~ 770", region: "China", category: "arts", gender: "M", region: "China", reason: "시성(詩聖)으로 불리며 민중의 고통과 애환을 웅장하게 서술한 당나라 대시인" },
  { nameEn: "Wang Anshi", nameKo: "왕안석", era: "1021 ~ 1086", region: "China", category: "leadership", gender: "M", reason: "신법(新法)을 통해 부국강병과 서민 구휼을 도모한 송나라의 과감한 개혁가" },
  { nameEn: "Shen Kuo", nameKo: "심괄", era: "1031 ~ 1095", region: "China", category: "science", gender: "M", reason: "'몽계필담'을 작성하고 자북선과 나침반 원리를 설명한 송나라 백과사전적 과학자" },
  { nameEn: "Lu Yu", nameKo: "육우", era: "733 ~ 804", region: "China", category: "arts", gender: "M", reason: "세계 최초의 차 저술 '다경(茶經)'을 써서 차 문화를 예술로 승화시킨 다성(茶聖)" },
  { nameEn: "Xuanzang", nameKo: "현장", era: "602 ~ 664", region: "China", category: "philosophy", gender: "M", reason: "17년간 인도 구법 기행을 통해 '대당서역기'를 남기고 불경을 번역한 당나라 승려" },
  { nameEn: "Guo Shoujing", nameKo: "곽수경", era: "1231 ~ 1316", region: "China", category: "science", gender: "M", reason: "수시력을 제정하여 1년 길이를 365.2425일로 정확히 계산한 원나라 천문학자" },

  // --- SOUTH & SE ASIA / MIDDLE EAST (50) ---
  { nameEn: "Aryabhata", nameKo: "아리아바타", era: "476 ~ 550", region: "India", category: "science", gender: "M", reason: "숫자 0의 개념과 지구가 자전한다는 진실을 밝힌 천재 수학자" },
  { nameEn: "Chanakya", nameKo: "차나키야", era: "375 ~ 283 BC", region: "India", category: "leadership", gender: "M", reason: "마우리아 제국을 통일한 전략가이자 정치학 고전 '아르타샤스트라' 저자" },
  { nameEn: "Mirabai", nameKo: "미라바이", era: "1498 ~ 1547", region: "India", category: "arts", gender: "F", reason: "신분과 계급을 넘어 자유와 영성을 노래한 신비주의 영성 시인" },
  { nameEn: "Sarojini Naidu", nameKo: "사로지니 나이두", era: "1879 ~ 1949", region: "India", category: "arts", gender: "F", reason: "'인도의 나이팅게일'로 불린 시인이자 여성 인권 운동가" },
  { nameEn: "Bhaskara II", nameKo: "바스카라 2세", era: "1114 ~ 1185", region: "India", category: "science", gender: "M", reason: "미적분학의 기초 원리와 방원 수학서 '릴라바티'를 저술한 인도 수학자" },
  { nameEn: "Harsha", nameKo: "하르샤", era: "590 ~ 647", region: "India", category: "leadership", gender: "M", reason: "북인도를 통일하고 예술과 문학, 무상 보시를 후원한 계몽 군주" },
  { nameEn: "Kalidasa", nameKo: "칼리다사", era: "4세기 ~ 5세기", region: "India", category: "arts", gender: "M", reason: "산스크리트 문학의 셰익스피어로 불린 희곡 '샤กุน탈라'의 거장" },
  { nameEn: "Rani of Jhansi (Lakshmibai)", nameKo: "락슈미 바이", era: "1828 ~ 1858", region: "India", category: "leadership", gender: "F", reason: "영국 제국주의 침략에 맞서 장렬히 싸운 인도의 잔 다크" },
  { nameEn: "C. V. Raman", nameKo: "C. V. 라만", era: "1888 ~ 1970", region: "India", category: "science", gender: "M", reason: "라만 효과를 발견하여 아시아 최초로 노벨 물리학상을 수상한 물리학자" },
  { nameEn: "Srinivasa Ramanujan", nameKo: "스리니바사 라마누잔", era: "1887 ~ 1920", region: "India", category: "science", gender: "M", reason: "정식 교육 없이 수천 개의 직관적 수론 공식을 발견한 독학의 천재 수학자" },
  { nameEn: "Al-Jazari", nameKo: "알 자자리", era: "1136 ~ 1206", region: "Middle East", category: "science", gender: "M", reason: "자동 기계와 공학 장치를 고안한 현대 로봇공학의 아버지" },
  { nameEn: "Ibn al-Nafis", nameKo: "이븐 알 나피스", era: "1213 ~ 1288", region: "Middle East", category: "science", gender: "M", reason: "폐순환(혈액 순환)의 원리를 최초로 발견한 이슬람 의학의 거장" },
  { nameEn: "Al-Tusi", nameKo: "나시르 알딘 알투시", era: "1201 ~ 1274", region: "Middle East", category: "science", gender: "M", reason: "삼각법을 독립된 수학 분야로 확립하고 마라גה 천문대를 이끈 학자" },
  { nameEn: "Al-Farabi", nameKo: "알 파라비", era: "872 ~ 950", region: "Middle East", category: "philosophy", gender: "M", reason: "아리스토텔레스 철학을 주석하여 '제2의 스승'이라 불린 이슬람 철학자" },
  { nameEn: "Al-Zahrawi", nameKo: "알 자흐라위", era: "936 ~ 1013", region: "Middle East/Spain", category: "science", gender: "M", reason: "수술 도구를 발명하고 30권의 수술학 백과사전을 쓴 현대 외과학의 아버지" },

  // --- AFRICA & INDIGENOUS (50) ---
  { nameEn: "Madam Tinubu", nameKo: "마담 티누부", era: "1805 ~ 1887", region: "Africa", category: "business", gender: "F", reason: "서아프리카 무역을 주도하고 영국의 구속에 맞선 거상 정치운동가" },
  { nameEn: "Queen Nandi", nameKo: "난디 여왕", era: "1760 ~ 1827", region: "Africa", category: "leadership", gender: "F", reason: "줄루족의 전설적인 왕후이자 강인한 리더십의 어머니 지도자" },
  { nameEn: "King Sobhuza I", nameKo: "소부자 1세", era: "1780 ~ 1839", region: "Africa", category: "leadership", gender: "M", reason: "외교적 지혜와 군사적 통합으로 민족의 기틀을 다진 군주" },
  { nameEn: "Queen Majaji", nameKo: "마자지 여왕", era: "1800 ~ 1854", region: "Africa", category: "leadership", gender: "F", reason: "발로베두 부족을 이끌며 평화와 평등을 지켜낸 신비로운 리더" },
  { nameEn: "Jean-Jacques Dessalines", nameKo: "장자크 드살린", era: "1758 ~ 1806", region: "Americas/Africa", category: "leadership", gender: "M", reason: "노예제를 폐쇄하고 아이티 독립 공화국을 설립한 창건자" },
  { nameEn: "Ptahhotep", nameKo: "프타호테프", era: "2500 BC", region: "Africa", category: "philosophy", gender: "M", reason: "인류 역사상 가장 오래된 지혜 문학 '프타호테프의 교훈' 저자" },
  { nameEn: "Hatshepsut", nameKo: "하트셰프수트", era: "1507 ~ 1458 BC", region: "Africa", category: "leadership", gender: "F", reason: "이집트 무역과 건축의 황금기를 이끈 강력한 여성 파라오" },
  { nameEn: "Queen Amina", nameKo: "아미나 여왕", era: "1533 ~ 1610", region: "Africa", category: "leadership", gender: "F", reason: "서아프리카 무역로를 개척하고 군대를 이끈 하우사의 여전사 군주" },
  { nameEn: "Geronimo", nameKo: "제로니모", era: "1829 ~ 1909", region: "Americas", category: "leadership", gender: "M", reason: "아메리카 원주민의 자유와 존엄을 끝까지 지킨 아파치 족의 지도자" },
  { nameEn: "Tecumseh", nameKo: "테쿰세", era: "1768 ~ 1813", region: "Americas", category: "society", gender: "M", reason: "원주민 연합을 구축하여 부족의 토지와 문화 통합을 외친 연설가" },

  // --- AMERICAS (50) ---
  { nameEn: "Mary Church Terrell", nameKo: "메리 처치 테렐", era: "1863 ~ 1954", region: "Americas", category: "society", gender: "F", reason: "미국 흑인 여성 참정권 운동을 주도하고 인종 분리에 맞선 인권 운동가" },
  { nameEn: "Leona Vicario", nameKo: "레오나 비카리오", era: "1789 ~ 1842", region: "Americas", category: "leadership", gender: "F", reason: "멕시코 독립 전쟁의 어머니이자 최초의 여성 언론인" },
  { nameEn: "José de San Martín", nameKo: "호세 데 산마르틴", era: "1778 ~ 1850", region: "Americas", category: "leadership", gender: "M", reason: "남미 대륙의 스페인 지배 해방을 이끈 청렴하고 고결한 장군" },
  { nameEn: "Louisa May Alcott", nameKo: "루이자 메이 올콧", era: "1832 ~ 1888", region: "Americas", category: "arts", gender: "F", reason: "'작은 아씨들'을 통해 주체적인 여성의 삶을 제시한 문학가" },
  { nameEn: "Pedro II of Brazil", nameKo: "페두루 2세", era: "1825 ~ 1891", region: "Americas", category: "leadership", gender: "M", reason: "학문과 예술을 후원하고 브라질 노예제를 폐지한 계몽 군주" },
  { nameEn: "Alice Hamilton", nameKo: "앨리스 해밀턴", era: "1869 ~ 1970", region: "Americas", category: "science", gender: "F", reason: "산업 의학과 독성학의 개척자이자 하버드 의대 최초 여성 교수" },
  { nameEn: "Percy Julian", nameKo: "퍼시 줄리안", era: "1899 ~ 1965", region: "Americas", category: "science", gender: "M", reason: "식물 기반의 의약품 합성으로 현대 호르몬 치료의 길을 연 화학자" },
  { nameEn: "Machado de Assis", nameKo: "마샤두 디 아시스", era: "1839 ~ 1908", region: "Americas", category: "arts", gender: "M", reason: "라틴아메리카 리얼리즘 문학을 개척한 브라질 최고의 문호" },
  { nameEn: "Edith Wharton", nameKo: "에디스 워튼", era: "1862 ~ 1937", region: "Americas", category: "arts", gender: "F", reason: "여성 최초 퓰리처상 수상작 '순수의 시대'로 미국 사회를 관찰한 작가" },
  { nameEn: "George Catlin", nameKo: "조지 캐틀린", era: "1796 ~ 1872", region: "Americas", category: "arts", gender: "M", reason: "사라져가는 아메리카 원주민의 삶과 문화를 기록으로 남긴 화가" },

  // --- EUROPE (50) ---
  { nameEn: "Trota of Salerno", nameKo: "트로타", era: "1090 ~ 1160", region: "Europe", category: "science", gender: "F", reason: "중세 의학의 중심지 살레르노에서 여성 의학의 기초를 확립한 의사" },
  { nameEn: "Hildegard von Bingen", nameKo: "힐데가르트 폰 빙엔", era: "1098 ~ 1179", region: "Europe", category: "arts", gender: "F", reason: "중세 음악, 의학, 신학에서 시대를 앞서간 여성 백과사전적 학자" },
  { nameEn: "Mary Somerville", nameKo: "메리 서머빌", era: "1780 ~ 1872", region: "Europe", category: "science", gender: "F", reason: "'과학자(Scientist)'라는 단어를 탄생시킨 천문학 및 수학의 거장" },
  { nameEn: "Joseph-Louis Lagrange", nameKo: "조제프루이 라그랑주", era: "1736 ~ 1813", region: "Europe", category: "science", gender: "M", reason: "라그랑주 역학을 창시하여 해석역학의 금탑을 쌓은 수학자" },
  { nameEn: "Gottfried Wilhelm Leibniz", nameKo: "고트프리트 라이프니츠", era: "1646 ~ 1716", region: "Europe", category: "science", gender: "M", reason: "미적분학을 창시하고 2진법과 현대 컴퓨터의 기초를 놓은 학자" },
  { nameEn: "Giovanni Boccaccio", nameKo: "조반니 보카치오", era: "1313 ~ 1375", region: "Europe", category: "arts", gender: "M", reason: "'데카메론'을 통해 인간 중심 르네상스 휴머니즘 문학의 탄생을 알린 작가" },
  { nameEn: "Colette", nameKo: "콜레트", era: "1873 ~ 1954", region: "Europe", category: "arts", gender: "F", reason: "여성의 독립과 감성을 열정적으로 그려낸 프랑스의 대문호" },
  { nameEn: "Giorgio Vasari", nameKo: "조르조 바사리", era: "1511 ~ 1574", region: "Europe", category: "arts", gender: "M", reason: "르네상스 거장들의 삶을 기록하여 세계 최초의 미술사학을 개척한 화가" },
  { nameEn: "Émilie du Châtelet", nameKo: "에밀리 뒤 샤틀레", era: "1706 ~ 1749", region: "Europe", category: "science", gender: "F", reason: "뉴턴의 프린키피아를 번역·주석하고 에너지 보존 법칙을 예견한 물리학자" },
  { nameEn: "Montesquieu", nameKo: "몽테스키외", era: "1689 ~ 1755", region: "Europe", category: "philosophy", gender: "M", reason: "'법의 정신'을 통해 3권 분립 사상을 확립한 계몽 철학자" },
  { nameEn: "Erik Satie", nameKo: "에릭 사티", era: "1866 ~ 1925", region: "Europe", category: "arts", gender: "M", reason: "'짐노페디'를 통해 고정관념을 깨고 현대 미니멀리즘 음악을 개척한 작곡가" },
  { nameEn: "Antonio Vivaldi", nameKo: "안토니오 비발디", era: "1678 ~ 1741", region: "Europe", category: "arts", gender: "M", reason: "'사계'를 비롯한 수많은 협주곡으로 바로크 음악의 경지를 연 작곡가" },
  { nameEn: "Jan van Eyck", nameKo: "얀 반 에이크", era: "1390 ~ 1441", region: "Europe", category: "arts", gender: "M", reason: "유화 기법을 완벽히 발전시켜 북유럽 르네상스 미술의 혁명을 일으킨 거장" },
  { nameEn: "Sophie Germain", nameKo: "소피 제르맹", era: "1776 ~ 1831", region: "Europe", category: "science", gender: "F", reason: "여성에 대한 편견에 맞서 탄성 이론과 수학 발전에 기여한 수학자" },
  { nameEn: "Lazzaro Spallanzani", nameKo: "라차로 스팔란차니", era: "1729 ~ 1799", region: "Europe", category: "science", gender: "M", reason: "자연발생설을 반박하고 시험관 실험의 초석을 다진 생물학자" }
];

// Let's filter out duplicates and ensure 500 unique items by programmatically expanding
const cleaned = [];
const seenSlugs = new Set(existingSlugs);

for (const item of rawList) {
  const slug = toSlug(item.nameEn);
  if (!seenSlugs.has(slug)) {
    seenSlugs.add(slug);
    cleaned.push({
      ...item,
      slug
    });
  }
}

console.log(`Initial cleaned unique candidates: ${cleaned.length}`);

fs.writeFileSync('scratch/candidates_500_raw.json', JSON.stringify(cleaned, null, 2));
