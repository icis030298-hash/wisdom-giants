const fs = require('fs');

const existingSlugs = new Set(JSON.parse(fs.readFileSync('scratch/existing_slugs.json', 'utf8')));
const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// We will write out 500 complete candidates divided into 5 clear region-category groups (100 candidates per block)
const candidates500 = [];

const addCand = (nameEn, nameKo, era, region, category, gender, reason) => {
  const slug = toSlug(nameEn);
  if (!existingSlugs.has(slug)) {
    existingSlugs.add(slug);
    candidates500.push({
      no: candidates500.length + 1,
      slug,
      nameEn,
      nameKo,
      era,
      region,
      category,
      gender,
      reason
    });
  }
};

// Batch 1: Korea & East Asia (100)
addCand("Shin Saimdang", "신사임당", "1504 ~ 1551", "아시아 (한국)", "arts", "F", "조선 최고의 여성 예술가이자 시인, 학문과 예술의 조화를 이룬 인물");
addCand("Heo Jun", "허준", "1539 ~ 1615", "아시아 (한국)", "science", "M", "동의보감을 집필하여 의학의 대중화와 인술(仁術)을 실천한 명의");
addCand("Kim Man-deok", "김만덕", "1739 ~ 1812", "아시아 (한국)", "business", "F", "제주도 기근 당시 전 재산을 털어 백성을 구휼한 거상이자 노블레스 오블리주");
addCand("Na Hye-sok", "나혜석", "1896 ~ 1948", "아시아 (한국)", "arts", "F", "한국 최초의 여성 서양화가이자 가부장제에 맞선 선구적 페미니스트");
addCand("Yi Hwang (Toegye)", "이황", "1501 ~ 1570", "아시아 (한국)", "philosophy", "M", "동방의 주자로 불리며 성리학을 집대성하고 유교적 덕목을 실천한 철학자");
addCand("Yi I (Yulgok)", "이이", "1536 ~ 1584", "아시아 (한국)", "philosophy", "M", "십만양병설과 개혁안을 제시하며 사회적 개혁과 학문을 조화시킨 사상가");
addCand("Jang Yeong-sil", "장영실", "1390 ~ 1450", "아시아 (한국)", "science", "M", "노비 출신으로 자격루, 측우기를 발명한 조선 최고의 천재 과학자");
addCand("Wonhyo", "원효", "617 ~ 686", "아시아 (한국)", "philosophy", "M", "해골물 일체유심조 깨달음을 얻고 화쟁사상으로 대중 불교를 전파한 사상가");
addCand("Uisang", "의상", "625 ~ 702", "아시아 (한국)", "philosophy", "M", "화엄종을 창시하고 부석사를 건립하여 화엄 사상을 집대성한 대사");
addCand("Eulji Mundeok", "을지문덕", "550 ~ 620", "아시아 (한국)", "leadership", "M", "살수대첩에서 수나라 30만 대군을 퇴치한 고구려 명장");
addCand("Gang Gam-chan", "강감찬", "948 ~ 1031", "아시아 (한국)", "leadership", "M", "귀주대첩을 통해 거란의 침략을 격퇴하고 고려의 평화를 지킨 구국 장군");
addCand("Choe Museon", "최무선", "1325 ~ 1395", "아시아 (한국)", "science", "M", "화약을 최초로 개발하고 진포대첩에서 왜구를 궤멸시킨 과학자");
addCand("Seo Hui", "서희", "942 ~ 998", "아시아 (한국)", "leadership", "M", "외교적 담판만으로 거란 대군을 물리치고 강동 6주를 획득한 외교가");
addCand("Gim Yu-sin", "김유신", "595 ~ 673", "아시아 (한국)", "leadership", "M", "삼국통일의 주역이자 화랑도 정신을 몸소 실천한 신라의 명장");
addCand("Park Eun-sik", "박은식", "1859 ~ 1925", "아시아 (한국)", "society", "M", "'한국통사'와 '한국독립운동지혈사'를 써서 독립 의식을 일깨운 역사학자");
addCand("Shin Chae-ho", "신채호", "1880 ~ 1936", "아시아 (한국)", "society", "M", "역사를 '아와 비아의 투쟁'으로 정의하고 민족주의 사상을 확립한 사상가");
addCand("Ju Si-gyeong", "주시경", "1876 ~ 1914", "아시아 (한국)", "society", "M", "한글이라는 명칭을 제정하고 국어학 연구에 평생을 바친 한글학자");
addCand("Bang Jeong-hwan", "방정환", "1899 ~ 1931", "아시아 (한국)", "society", "M", "어린이날을 제정하고 아동 인권 확립과 동화 보급에 앞장선 선구자");
addCand("Yun Dong-ju", "윤동주", "1917 ~ 1945", "아시아 (한국)", "arts", "M", "'서시'로 맑은 영혼과 억압에 대한 저항을 노래한 민족 시인");
addCand("Han Yong-un", "한용운", "1879 ~ 1944", "아시아 (한국)", "arts", "M", "'님의 침묵'을 써서 민족의 한과 지조를 노래한 독립운동가 시인");
addCand("Lee Sang", "이상", "1910 ~ 1937", "아시아 (한국)", "arts", "M", "'오감도', '날개'를 통해 모더니즘 문학의 파격적인 지평을 연 작가");
addCand("Kim Sowol", "김소월", "1902 ~ 1934", "아시아 (한국)", "arts", "M", "'진달래꽃'으로 한국 전통 정서를 시로 승화시킨 국민 시인");
addCand("Kim Hong-do", "김홍도", "1745 ~ 1806", "아시아 (한국)", "arts", "M", "조선 서민들의 삶과 풍속을 정겹게 그려낸 단원 풍속화의 거장");
addCand("Sin Yun-bok", "신윤복", "1758 ~ 1813", "아시아 (한국)", "arts", "M", "혜원 풍속화로 남녀 간의 사랑과 미학을 화려한 색채로 표현한 화가");
addCand("Jeong Seon", "정선", "1676 ~ 1759", "아시아 (한국)", "arts", "M", "진경산수화를 창시하여 한국의 아름다운 산천을 그독창적으로 표현한 거장");
addCand("An Gyeon", "안견", "1400 ~ 1470", "아시아 (한국)", "arts", "M", "몽유도원도를 그려 조선 전기 산수화의 전성기를 연 궁중 화가");
addCand("Heo Nanseolheon", "허난설헌", "1563 ~ 1589", "아시아 (한국)", "arts", "F", "조선의 가부장적 한계를 넘어 천재적 시재를 발휘한 시인");
addCand("Im Yunjidang", "임윤지당", "1721 ~ 1793", "아시아 (한국)", "philosophy", "F", "여성도 성인이 될 수 있다는 남녀평등적 성리학 사상을 주장한 사상가");
addCand("Kang Jeong-ildang", "강정일당", "1772 ~ 1832", "아시아 (한국)", "philosophy", "F", "시문과 성리학에 뛰어났던 조선 후기 대표적 여성 학자");
addCand("Seo Jang-ok", "서장옥", "1840 ~ 1900", "아시아 (한국)", "society", "M", "동학의 2대 접주로서 민중 운동과 사회 평등에 기여한 지도자");
addCand("Kim Jeong-ho", "김정호", "1804 ~ 1866", "아시아 (한국)", "science", "M", "대동여지도를 제작하여 조선의 국토를 지밀하게 지도화한 지리학자");
addCand("Jeong Yak-jeon", "정약전", "1758 ~ 1816", "아시아 (한국)", "science", "M", "흑산도 유배지에서 어류 종합 백과사전 '자산어보'를 집필한 학자");
addCand("Ji Seok-young", "지석영", "1855 ~ 1935", "아시아 (한국)", "science", "M", "우두법을 도입하여 종두법을 보급하고 천연두로부터 백성을 구한 의학자");
addCand("Sei Shonagon", "세이 쇼나곤", "966 ~ 1025", "아시아 (일본)", "arts", "F", "'마쿠라노소시'를 쓴 일본 고전 수필 문학의 여왕");
addCand("Minamoto no Yoshitsune", "미나모토 노 요시츠네", "1159 ~ 1189", "아시아 (일본)", "leadership", "M", "비극적 전설과 무사도 정신의 상징적 군사 전술가");
addCand("Zeami Motokiyo", "제아미 모토키요", "1363 ~ 1443", "아시아 (일본)", "arts", "M", "일본 '노(能)' 극예술을 완성하고 미학 이론서 '풍자화전'을 남긴 예술가");
addCand("Sen no Rikyu", "센 노 리큐", "1522 ~ 1591", "아시아 (일본)", "arts", "M", "일본 차도(茶道) 정신인 와비사비를 완성한 미학의 거장");
addCand("Sugawara no Michizane", "스가와라 노 미치자네", "845 ~ 903", "아시아 (일본)", "philosophy", "M", "학문과 문학의 신으로 추앙받은 헤이안 시대 최고의 학자");
addCand("Ihara Saikaku", "이하라 사이카쿠", "1642 ~ 1693", "아시아 (일본)", "arts", "M", "에도시대 상인과 서민의 삶을 사실적으로 묘사한 소설가");
addCand("Chikamatsu Monzaemon", "치카마츠 몬자에몽", "1653 ~ 1725", "아시아 (일본)", "arts", "M", "일본의 셰익스피어로 불린 에도시대 인형극 및 가부키 극작가");
addCand("Yosa Buson", "요사 부손", "1716 ~ 1783", "아시아 (일본)", "arts", "M", "하이크 시인이자 회화 문인화를 결합한 에도시대의 거장");
addCand("Kobayashi Issa", "코바야시 이사", "1763 ~ 1827", "아시아 (일본)", "arts", "M", "약자와 작은 생물에 대한 따뜻한 사랑을 하이크로 노래한 시인");
addCand("Takizaki Bakin", "쿄쿠테이 바킨", "1767 ~ 1848", "아시아 (일본)", "arts", "M", "'남총리견팔견전'을 집필한 에도시대 대역작 소설가");
addCand("Ban Zhao", "반소", "45 ~ 116", "아시아 (중국)", "philosophy", "F", "한나라 시대 여성 최초의 역사학자이자 독보적 여성 학자");
addCand("Cai Lun", "채륜", "50 ~ 121", "아시아 (중국)", "science", "M", "종이(제지술)를 발명하여 인류 지식 전파의 혁명을 일으킨 인물");
addCand("Zhang Heng", "장형", "78 ~ 139", "아시아 (중국)", "science", "M", "세계 최초의 지진계(후풍지동의)와 혼천의를 발명한 후한의 천문학자");
addCand("Zu Chongzhi", "조충지", "429 ~ 500", "아시아 (중국)", "science", "M", "원주율(π)을 소수점 7자리까지 정확히 계산해낸 고대 중국의 수학자");
addCand("Li Qingzhao", "이청조", "1084 ~ 1155", "아시아 (중국)", "arts", "F", "송나라 시대를 빛낸 중국 역사상 가장 위대한 여성 사인(詞人)");
addCand("Su Shi (Su Dongpo)", "소식 (소동파)", "1037 ~ 1101", "아시아 (중국)", "arts", "M", "시·서·화에 모두 능했던 송나라 최고의 서화가이자 문학가");
addCand("Du Fu", "두보", "712 ~ 770", "아시아 (중국)", "arts", "M", "시성(詩聖)으로 불리며 민중의 애환을 웅장하게 서술한 당나라 대시인");
addCand("Wang Anshi", "왕안석", "1021 ~ 1086", "아시아 (중국)", "leadership", "M", "신법(新法)을 통해 부국강병과 서민 구휼을 도모한 송나라의 개혁가");
addCand("Shen Kuo", "심괄", "1031 ~ 1095", "아시아 (중국)", "science", "M", "'몽계필담'을 작성하고 자북선과 나침반 원리를 설명한 백과사전적 과학자");
addCand("Lu Yu", "육우", "733 ~ 804", "아시아 (중국)", "arts", "M", "세계 최초의 차 저술 '다경'을 써서 차 문화를 예술로 승화시킨 다성");
addCand("Xuanzang", "현장", "602 ~ 664", "아시아 (중국)", "philosophy", "M", "17년간 인도 구법 기행을 통해 '대당서역기'를 남기고 불경을 번역한 승려");
addCand("Guo Shoujing", "곽수경", "1231 ~ 1316", "아시아 (중국)", "science", "M", "수시력을 제정하여 1년 길이를 365.2425일로 정확히 계산한 천문학자");

console.log(`Generated ${candidates500.length} candidates after Batch 1.`);
fs.writeFileSync('scratch/candidates_500_partial.json', JSON.stringify(candidates500, null, 2));
