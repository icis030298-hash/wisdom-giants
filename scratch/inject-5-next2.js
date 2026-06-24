const fs = require('fs');

const dataToInject = {
  "georges-cuvier": {
    "era_ko": "18~19세기의 거인 (1769~1832)",
    "era_en": "18th-19th Century Giant (1769~1832)",
    "category": "science",
    "epic_ko": "18세기 후반, 프랑스 혁명의 단두대 칼날이 번뜩이고 나폴레옹의 대포 소리가 유럽을 뒤흔들던 격동의 시대. 파리 자연사 박물관의 한적하고 먼지 쌓인 표본실에서 조르주 퀴비에는 세상의 어떤 포성보다 거대한 지적 혁명을 준비하고 있었습니다. 가난한 군인 가정에서 태어나 정규 교육조차 제대로 받지 못했던 청년이 박물관의 조수로 발탁된 것은 오직 자연을 관찰하는 그의 천재적인 집요함 덕분였습니다. 그 당시 학계는 신이 창조한 생명체는 완벽하며 결코 사라지지 않는다고 굳게 믿고 있었고, 땅속에서 발굴되는 거대한 뼈들은 단지 기형이거나 아직 인간이 발견하지 못한 미지의 동물일 뿐이라 여겼습니다.\n\n하지만 퀴비에의 날카로운 메스와 비교해부학적 시선은 이 거대한 뼈들이 들려주는 수만 년의 침묵을 깨웠습니다. 1796년, 그는 현존하는 코끼리와 시베리아에서 발견된 매머드의 뼈를 해부학적으로 치밀하게 비교 분석했습니다. 턱뼈의 각도와 치아의 융기 구조를 세밀하게 대조한 끝에, 그는 학계의 절대적인 믿음을 산산조각 내는 충격적인 진실을 선포했습니다. \"이 거대한 뼈의 주인은 현재 지구상 어디에도 존재하지 않는다. 그들은 지구를 휩쓴 거대한 격변 속에서 완전히 멸종(Extinction)한 것이다.\" 이것은 인류가 처음으로 '사라져버린 세계'를 과학적으로 증명해 낸 기념비적인 순간이었습니다.\n\n퀴비에는 부서진 화석 조각 하나, 발톱 뼈 하나만으로도 그 동물이 어떻게 생겼고 무엇을 먹고 살았는지 완벽하게 복원해 내는 마법과도 같은 해부학적 통찰을 보여주었습니다. 그의 연구실은 과거 지구를 지배했던 파충류(익룡과 모사사우루스 등)의 거대한 무덤이자 부활의 공간이 되었습니다. 비록 혁명과 전쟁으로 정권이 수없이 바뀌는 정치적 소용돌이 속에서도, 그는 묵묵히 땅속의 뼈들을 맞추며 인류의 시야를 수백만 년 전의 심연으로 확장시켰습니다. 조르주 퀴비에의 삶은, 부서진 뼈 조각들 속에서 사라진 문명의 서사시를 읽어내고 지구 생명의 역사를 완전히 새로 쓴 위대한 박물학자의 대서사시입니다.",
    "epic_en": "In the late 18th century, amidst the turbulent era when the guillotine of the French Revolution flashed and Napoleon's cannons shook Europe, Georges Cuvier was quietly orchestrating an intellectual revolution far louder than any artillery in the dusty, quiet specimen rooms of the National Museum of Natural History in Paris. Born into a poor military family and lacking proper formal education, the young man was chosen as an assistant at the museum solely due to his genius and relentless observation of nature. At that time, the academic world firmly believed that God's creations were perfect and could never vanish; they assumed that the colossal bones unearthed from the ground belonged either to deformed creatures or to unknown animals humanity simply hadn't found yet.\n\nHowever, Cuvier's sharp scalpel and comparative anatomical gaze broke the tens of thousands of years of silence held by these massive bones. In 1796, he conducted a meticulous anatomical comparative analysis between living elephants and the bones of a mammoth discovered in Siberia. After closely contrasting the angles of the jawbones and the ridge structures of the teeth, he proclaimed a shocking truth that shattered the absolute beliefs of the academic world: \"The owners of these colossal bones no longer exist anywhere on Earth. They were completely driven to extinction in immense catastrophes that swept the planet.\" This was a monumental moment when humanity scientifically proved the existence of a 'lost world' for the very first time.\n\nCuvier demonstrated almost magical anatomical insight, perfectly reconstructing an animal's entire appearance and diet from a single fractured fossil fragment or a claw bone. His laboratory became a vast graveyard and a site of resurrection for the reptiles (like pterosaurs and mosasaurs) that once ruled the Earth's past. Even as the political vortex of revolutions and wars repeatedly changed regimes, he silently continued to piece together bones from the earth, expanding humanity's vision into the abyss of millions of years past. Georges Cuvier's life is the grand epic of a great naturalist who read the narratives of vanished civilizations from broken bone fragments and completely rewrote the history of life on Earth.",
    "trials_ko": "혁명과 전쟁으로 정권이 뒤바뀌는 극도의 혼란스러운 정치적 상황, 그리고 '종의 멸종'을 인정하지 않던 당대 학계의 강력한 종교적/학문적 편견.",
    "trials_en": "The extremely chaotic political situation of regimes constantly overturning due to revolutions and wars, coupled with the powerful religious and academic prejudices of an era that refused to acknowledge the 'extinction of species'.",
    "overcoming_ko": "정치적 소용돌이 속에서도 오직 뼈와 화석 연구에만 묵묵히 매진했으며, 반박할 수 없는 정교한 비교해부학적 증거를 통해 학계를 설득하고 멸종의 개념을 과학적으로 정립함.",
    "overcoming_en": "He silently dedicated himself solely to the study of bones and fossils amidst the political vortex, and scientifically established the concept of extinction by convincing the academic world through irrefutable, meticulous comparative anatomical evidence.",
    "wisdom": [
      {
        "quote_ko": "나에게 동물의 뼈 하나만 준다면, 나는 그 동물 전체를 재구성할 수 있다.",
        "quote_en": "Give me one bone, and I will reconstruct the entire animal.",
        "meaning_ko": "세상의 진리는 무작위로 흩어져 있는 것이 아니라, 정교한 인과관계로 연결되어 있습니다. 눈앞에 보이는 작은 단서 하나를 허투루 넘기지 마십시오. 파편화된 정보를 집요하게 파고들 때, 전체의 거대한 그림을 꿰뚫어 보는 통찰력이 생깁니다.",
        "meaning_en": "The truths of the world are not scattered randomly, but are connected by intricate cause-and-effect relationships. Do not carelessly dismiss a single small clue before your eyes. When you relentlessly delve into fragmented information, you develop the insight to pierce through to the colossal overall picture."
      },
      {
        "quote_ko": "사실을 관찰하고, 그 사실들이 스스로 말하게 하라.",
        "quote_en": "Observe the facts, and let them speak for themselves.",
        "meaning_ko": "당신의 섣부른 편견이나 기존의 권위에 기대어 진실을 왜곡하려 하지 마십시오. 문제에 부딪혔을 때는 철저히 팩트(Fact)에 기반하여 냉철하게 분석하십시오. 객관적인 증거는 그 어떤 화려한 말보다 강력한 설득력을 갖습니다.",
        "meaning_en": "Do not attempt to distort the truth by leaning on your hasty prejudices or established authority. When faced with a problem, thoroughly analyze it coldly based on facts. Objective evidence holds a persuasive power far stronger than any flamboyant words."
      },
      {
        "quote_ko": "우리가 밟고 있는 이 땅 아래에는, 우리가 아는 것보다 훨씬 더 거대한 과거가 묻혀 있다.",
        "quote_en": "Beneath the earth we tread, lies a past far more immense than we know.",
        "meaning_ko": "지금 당신이 누리고 있는 성공과 평온함이 영원할 것이라는 착각을 버리십시오. 수많은 문명과 거인들이 흔적도 없이 사라진 역사 앞에서 늘 겸손해야 합니다. 오직 끊임없이 묻고 진화하는 자만이 살아남습니다.",
        "meaning_en": "Abandon the illusion that the success and tranquility you enjoy today will last forever. You must always remain humble before history, where countless civilizations and giants have vanished without a trace. Only those who constantly question and evolve survive."
      }
    ]
  },
  "hatshepsut": {
    "era_ko": "기원전 15세기의 거인 (BC 1507~1458)",
    "era_en": "15th Century BC Giant (1507~1458 BC)",
    "category": "leadership",
    "epic_ko": "황금빛 모래와 거대한 피라미드의 그림자가 드리운 이집트 제18왕조. 하트셉수트는 위대한 파라오 투트모세 1세의 피를 이어받은 가장 고귀한 공주였지만, 그녀의 앞에는 가혹한 숙명이 놓여 있었습니다. 당시 이집트는 여성이 파라오가 될 수 없는 철저한 남성 중심의 사회였습니다. 이복오빠이자 남편이었던 투트모세 2세가 일찍 세상을 떠나자, 왕좌는 후궁의 아들인 어린 투트모세 3세에게 돌아갔습니다. 하트셉수트는 어린 조카의 섭정으로 정치 전면에 나섰지만, 야심 찬 귀족들과 군부의 권력 다툼 속에서 그녀의 자리는 언제나 바람 앞의 등불처럼 위태로웠습니다.\n\n그러나 그녀는 무력하게 조종당하는 섭정으로 남기를 거부했습니다. 하트셉수트는 전례 없는 대담한 결단을 내렸습니다. 스스로 남성 파라오의 복장을 입고, 가짜 수염을 달며 신성한 왕의 상징을 몸에 둘렀습니다. 그녀는 자신을 투트모세 3세의 대리인이 아니라, 아문 신의 신성한 딸이자 이집트를 통치할 정당한 파라오로 선포했습니다. 이 반역과도 같은 결단은 엄청난 저항을 불러일으킬 수 있었으나, 그녀는 군사적 정복이라는 피비린내 나는 길 대신 '풍요와 무역'이라는 다른 카드를 꺼내 들었습니다.\n\n하트셉수트는 전함 대신 거대한 무역선단을 꾸려 전설의 땅 '푼트(Punt)'로 향했습니다. 이 원정은 대성공이었고, 이집트는 황금, 상아, 몰약 등 전례 없는 막대한 부를 거머쥐었습니다. 그녀는 넘쳐나는 부를 바탕으로 데이르 엘 바하리에 역사상 가장 아름다운 장제전을 지으며 건축과 문화의 황금기를 이끌었습니다. 그녀의 통치 20여 년간 이집트는 단 한 번의 파괴적인 전쟁 없이도 가장 찬란하게 빛났습니다. 훗날 투트모세 3세에 의해 그녀의 이름이 지워지고 조각상이 파괴되는 모욕을 당했지만, 모래 폭풍을 견뎌낸 그녀의 건축물들은 영원히 지워지지 않는 위대한 여성 파라오의 대서사시를 오늘날까지 증언하고 있습니다.",
    "epic_en": "In the 18th Dynasty of Egypt, amidst golden sands and the towering shadows of pyramids, Hatshepsut was the most noble princess, inheriting the blood of the great Pharaoh Thutmose I. Yet, a harsh destiny lay before her. Egypt at the time was a strictly patriarchal society where a woman could not become Pharaoh. When her half-brother and husband, Thutmose II, died early, the throne passed to young Thutmose III, the son of a secondary wife. Hatshepsut stepped to the forefront of politics as regent for her young nephew, but amidst the power struggles of ambitious nobles and the military, her position was always as precarious as a candle in the wind.\n\nHowever, she refused to remain a powerlessly manipulated regent. Hatshepsut made an unprecedented, audacious decision. Donning the attire of a male Pharaoh, strapping on a false beard, and adorning herself with the sacred symbols of kingship, she declared herself not a mere proxy for Thutmose III, but the divine daughter of the god Amun and the legitimate Pharaoh to rule Egypt. This seemingly treasonous resolve could have provoked massive resistance, but instead of taking the blood-soaked path of military conquest, she played a different card: 'prosperity and trade.'\n\nInstead of warships, Hatshepsut dispatched a massive fleet of merchant vessels to the legendary land of 'Punt.' This expedition was a resounding success, bringing Egypt unprecedented, immense wealth in the form of gold, ivory, and myrrh. Using this overflowing prosperity, she led a golden age of architecture and culture, constructing the most beautiful mortuary temple in history at Deir el-Bahari. During her two decades of rule, Egypt shone its brightest without a single devastating war. Although she later suffered the indignity of having her name erased and statues destroyed by Thutmose III, her monuments, having withstood the sandstorms, continue to testify today to the indelible, grand epic of the great female Pharaoh.",
    "trials_ko": "여성은 파라오가 될 수 없다는 고대 이집트의 강력한 관습, 군부와 귀족들의 끊임없는 견제, 그리고 사후 투트모세 3세에 의해 이름이 지워지는 기록 말살의 형벌.",
    "trials_en": "The rigid ancient Egyptian custom that a woman could not be Pharaoh, constant checks from the military and nobility, and the post-mortem punishment of damnatio memoriae (erasure of her name) by Thutmose III.",
    "overcoming_ko": "스스로 남성 파라오의 상징을 입는 대담함으로 권력을 장악했고, 전쟁 대신 대규모 무역(푼트 원정)과 거대한 건축 사업으로 국가에 전례 없는 평화와 막대한 부를 안겨줌.",
    "overcoming_en": "She seized power with the audacity to don the symbols of a male Pharaoh, and instead of waging war, she brought unprecedented peace and immense wealth to the nation through massive trade (the Punt expedition) and colossal architectural projects.",
    "wisdom": [
      {
        "quote_ko": "나의 업적이 살아남아, 다가올 모든 세대에게 알려지기를.",
        "quote_en": "May my achievements survive and be known to all generations to come.",
        "meaning_ko": "세상이 정해놓은 편견과 한계 속으로 숨어들지 마십시오. 당신의 위대함은 누군가가 부여하는 것이 아니라 스스로 증명해 내는 것입니다. 당당히 앞으로 나서 당신만의 불멸의 업적을 세우십시오.",
        "meaning_en": "Do not hide within the prejudices and limitations set by the world. Your greatness is not something granted by others, but something you must prove yourself. Step forward proudly and build your own immortal achievements."
      },
      {
        "quote_ko": "칼로 흘린 피는 마르지만, 지혜로 쌓은 부와 예술은 영원하다.",
        "quote_en": "The blood spilled by the sword dries up, but the wealth and art built by wisdom are eternal.",
        "meaning_ko": "상대를 짓밟고 일어서는 무력의 승리보다 더 위대한 것은 번영을 창조하는 평화의 리더십입니다. 투쟁에 에너지를 쏟지 말고, 모두가 풍요로워질 수 있는 교류와 가치 창출에 집중하십시오.",
        "meaning_en": "A leadership of peace that creates prosperity is far greater than a victory of force achieved by trampling opponents. Do not pour your energy into struggle; focus instead on exchange and value creation that can enrich everyone."
      },
      {
        "quote_ko": "나를 지우려는 자들이 있었으나, 나의 기둥은 아직 하늘을 받치고 있다.",
        "quote_en": "Though there were those who sought to erase me, my pillars still hold up the sky.",
        "meaning_ko": "시기심에 찬 이들이 당신의 성과를 폄하하고 이름을 지우려 할지라도 두려워하지 마십시오. 당신이 흔들림 없이 쌓아올린 실질적인 성과와 단단한 토대는 그 어떤 비바람에도 결코 무너지지 않을 것입니다.",
        "meaning_en": "Do not fear when envious people attempt to belittle your achievements and erase your name. The tangible results and solid foundations you have unwaveringly built will never crumble against any storm."
      }
    ]
  },
  "heraclitus": {
    "era_ko": "기원전 6세기의 거인 (BC 535~475)",
    "era_en": "6th Century BC Giant (535~475 BC)",
    "category": "philosophy",
    "epic_ko": "그리스 문명의 동쪽 변방, 페르시아의 지배를 받던 부유한 도시 에페소스. 왕족의 피를 이어받은 헤라클레이토스는 세상이 부러워할 권력과 막대한 부를 손에 쥘 수 있었습니다. 하지만 그는 시장 통의 왁자지껄한 소음과 맹목적으로 부와 명예만을 쫓는 우매한 군중들을 경멸했습니다. 그는 왕위 계승권마저 동생에게 미련 없이 던져버리고, 아르테미스 신전 근처의 한적한 숲속으로 들어가 스스로 철저한 고독을 선택했습니다. 그에게 세상은 변하지 않는 영원한 진리나 신들이 지배하는 곳이 아니라, 모든 것이 타오르고 소멸하는 맹렬한 불꽃이었습니다.\n\n그가 우주의 본질을 파고들며 남긴 글들은 너무나 함축적이고 난해하여, 사람들은 그를 '어두운 철학자(The Obscure)'라 불렀습니다. 하지만 그 어둠 속에는 인류 지성사를 뒤흔들 찬란한 통찰이 숨어 있었습니다. \"같은 강물에 두 번 발을 담글 수는 없다.\" 그는 세상에 영원히 멈춰있는 것은 없으며, 만물은 끊임없이 흐르고 변화한다고 갈파했습니다. 낮과 밤, 삶과 죽음, 전쟁과 평화처럼 서로 대립하고 갈등하는 힘들이 팽팽하게 맞서며 만들어내는 긴장감, 그 자체가 바로 우주를 유지하는 조화이자 진리('로고스')라고 그는 주장했습니다.\n\n만년의 헤라클레이토스는 인간에 대한 환멸이 극에 달해 산속으로 들어가 풀과 나무뿌리만을 먹으며 연명했습니다. 결국 수종(부종)이라는 고통스러운 병에 걸려, 소똥을 몸에 발라 몸의 물기를 빼내려다 비참하고 기이한 죽음을 맞이했습니다. 비록 그의 삶은 기행과 은둔으로 점철되었지만, 정지된 세계관을 부수고 우주를 '역동적인 변화의 용광로'로 해석해 낸 그의 철학적 대서사시는 후대 스토아 학파와 니체에게까지 거대한 영감의 불길로 번져나갔습니다.",
    "epic_en": "In Ephesus, a wealthy city on the eastern fringes of Greek civilization under Persian rule, Heraclitus was born of royal blood, destined to inherit the power and immense wealth the world envied. Yet, he despised the clamorous noise of the marketplace and the foolish multitudes who blindly chased only wealth and fame. Without hesitation, he tossed his right to the throne to his younger brother and retreated to the secluded forests near the Temple of Artemis, choosing a path of profound, self-imposed isolation. To him, the world was not a place ruled by unchanging eternal truths or gods, but a fierce, roaring fire where everything blazed and perished.\n\nThe writings he left behind while delving into the essence of the universe were so highly condensed and cryptic that people dubbed him 'The Obscure.' However, hidden within that obscurity was a radiant insight that would shake the history of human intellect. \"No man ever steps in the same river twice.\" He declared that nothing in the world is eternally still; everything is constantly flowing and changing. He argued that the tension created by opposing and conflicting forces fiercely confronting one another—like day and night, life and death, war and peace—is the very harmony and truth ('Logos') that sustains the universe.\n\nIn his twilight years, his disillusionment with humanity reached its peak. He retreated into the mountains, surviving on a diet of grass and roots. Ultimately, he contracted dropsy (edema), a painful illness, and met a miserable, bizarre death attempting to cure himself by covering his body in cow dung to draw out the moisture. Although his life was marred by eccentricities and reclusion, his grand philosophical epic—smashing the static worldview and interpreting the universe as a 'crucible of dynamic change'—spread like a massive wildfire of inspiration to the later Stoics and down to Nietzsche.",
    "trials_ko": "우매한 대중들에 대한 환멸과 철저한 고독, 자신의 철학을 이해하지 못하는 세상으로부터의 철학적 고립, 그리고 말년의 끔찍한 질병(수종)과 비참한 최후.",
    "trials_en": "Profound disillusionment with the foolish masses leading to absolute isolation, philosophical alienation from a world that could not understand his teachings, and a horrific illness (dropsy) culminating in a miserable end in his final years.",
    "overcoming_ko": "세속적인 왕위와 부를 버리고 자연 속에서 우주의 근본 원리(로고스)를 탐구했으며, 만물이 끊임없이 변화한다는 통찰로 서양 철학사의 패러다임을 바꿈.",
    "overcoming_en": "He discarded secular royalty and wealth to explore the fundamental principle of the universe (Logos) in nature, shifting the paradigm of Western philosophy with his insight that all things are in a constant state of flux.",
    "wisdom": [
      {
        "quote_ko": "같은 강물에 두 번 발을 담글 수는 없다.",
        "quote_en": "No man ever steps in the same river twice.",
        "meaning_ko": "어제의 성공도, 어제의 실패도 이미 지나간 물결입니다. 과거의 영광에 취하거나 옛 상처에 얽매이지 마십시오. 세상은 1초도 멈추지 않고 변하고 있으니, 오직 오늘 당신 앞에 흐르는 새로운 물결에 집중하십시오.",
        "meaning_en": "Yesterday's successes and yesterday's failures are waves that have already passed. Do not become intoxicated by past glory or bound by old wounds. The world is changing without pausing for a single second, so focus solely on the new wave flowing before you today."
      },
      {
        "quote_ko": "대립하는 것들이 조화를 이루며, 갈등 속에서 가장 아름다운 하모니가 탄생한다.",
        "quote_en": "Opposition brings concord. Out of discord comes the fairest harmony.",
        "meaning_ko": "당신을 괴롭히는 시련과 반대자들을 저주하지 마십시오. 근육이 찢어지는 고통을 통해 강해지듯, 인생의 위기와 갈등이야말로 당신을 더 단단하고 위대한 존재로 벼려내는 필수적인 에너지입니다.",
        "meaning_en": "Do not curse the trials and opponents that torment you. Just as muscles grow stronger through the pain of tearing, the crises and conflicts of life are the essential energies that forge you into a tougher, greater being."
      },
      {
        "quote_ko": "눈과 귀는 지혜롭지 못한 영혼을 가진 자들에게는 나쁜 증인이다.",
        "quote_en": "Eyes and ears are bad witnesses to men if they have barbarian souls.",
        "meaning_ko": "단순히 눈에 보이고 귀에 들리는 현상에만 휘둘려 섣부른 판단을 내리지 마십시오. 겉으로 드러난 소란스러움 이면에 숨겨진 사물의 진짜 본질(로고스)을 꿰뚫어 볼 수 있는 깊은 영혼의 눈을 길러야 합니다.",
        "meaning_en": "Do not make hasty judgments swayed merely by the phenomena you see and hear. You must cultivate the deep eyes of the soul capable of piercing through the superficial clamor to see the true essence (Logos) hidden beneath."
      }
    ]
  },
  "pythagoras": {
    "era_ko": "기원전 6세기의 거인 (BC 570~495)",
    "era_en": "6th Century BC Giant (570~495 BC)",
    "category": "philosophy",
    "epic_ko": "사모스 섬에서 태어난 피타고라스는 지중해의 밝은 태양 아래서 지혜를 갈구하는 청년이었습니다. 그는 단순히 한 지역의 학문에 만족하지 않고, 이집트의 신비로운 신전과 바빌론의 천문학자들을 찾아 수십 년간 거친 구도자의 길을 걸었습니다. 지독한 풍토병과 페르시아 군대의 포로가 되는 시련 속에서도, 그는 고대 오리엔트의 가장 깊숙한 비밀 지식들을 집어삼켰습니다. 고향으로 돌아온 그는 폭군 폴리크라테스의 독재를 피해 남이탈리아의 크로톤으로 이주했고, 그곳에서 인류 지성사에 영원히 남을 비밀스럽고도 위대한 공동체, '피타고라스 교단'을 창설했습니다.\n\n그는 우주가 혼돈으로 가득 찬 무작위 한 공간이 아니라, 정교한 수학적 비율로 조율된 거대한 악기라고 믿었습니다. 대장간 옆을 지나다 쇠망치 소리들이 만들어내는 화음을 듣고 현의 길이와 음정의 수학적 비례를 발견해 낸 일화는, 그가 눈에 보이지 않는 진리를 어떻게 숫자로 번역해 냈는지를 보여줍니다. \"만물은 수로 이루어져 있다.\" 이 선언은 주술과 신화가 지배하던 고대 세계에 이성의 빛을 내리꽂은 거대한 번개였습니다. 직각삼각형의 비밀을 밝혀낸 '피타고라스의 정리'는 그가 우주의 설계도를 인류에게 훔쳐다 준 신성한 선물과도 같았습니다.\n\n하지만 그의 교단은 너무나 엄격하고 신비주의적이었습니다. 채식을 강요하고 콩을 먹지 말라는 등의 기이한 규율은 민중의 반감을 샀고, 결국 정치적 폭동의 표적이 되었습니다. 성난 폭도들이 교단 건물에 불을 지르자, 피타고라스와 그의 제자들은 불타는 건물 속에서 끔찍한 최후를 맞이하거나 뿔뿔이 흩어져야 했습니다. 육체는 불길 속에 사라졌지만, 우주를 지배하는 것은 수학적 질서라는 그의 철학적 대서사시는 플라톤을 거쳐 근대 과학 혁명의 심장부까지 흘러들어, 오늘날 인간이 우주로 쏘아 올린 우주선들의 궤도를 여전히 지배하고 있습니다.",
    "epic_en": "Born on the island of Samos, Pythagoras was a young man thirsting for wisdom beneath the bright Mediterranean sun. Not satisfied with the knowledge of a single region, he embarked on a grueling, decades-long journey as a seeker, seeking out the mystical temples of Egypt and the astronomers of Babylon. Enduring severe endemic diseases and even captivity by the Persian army, he devoured the deepest secret knowledge of the ancient Orient. Upon returning home, he fled the tyranny of Polycrates, relocating to Croton in Southern Italy, where he founded the 'Pythagorean Brotherhood'—a secretive yet magnificent community that would remain etched in the history of human intellect forever.\n\nHe believed the universe was not a random space filled with chaos, but a colossal musical instrument tuned by precise mathematical ratios. The anecdote of his passing a blacksmith's forge, hearing the harmony of the hammering anvils, and discovering the mathematical proportions between string length and pitch, demonstrates how he translated invisible truths into numbers. \"All is number.\" This declaration was a massive lightning bolt of reason struck into an ancient world ruled by magic and mythology. The 'Pythagorean Theorem,' revealing the secret of the right-angled triangle, was like a divine gift—as if he had stolen the blueprints of the universe for humanity.\n\nHowever, his brotherhood was overwhelmingly strict and steeped in mysticism. Bizarre rules, such as enforcing vegetarianism and forbidding the eating of beans, alienated the masses and ultimately made the community the target of a political riot. When an angry mob set fire to their meeting house, Pythagoras and his disciples met a horrific end in the blazing inferno, or were scattered to the winds. His flesh may have perished in the flames, but his grand philosophical epic—that the universe is governed by mathematical order—flowed through Plato and into the very heart of the modern scientific revolution. Today, his principles still govern the trajectories of the spaceships humanity launches into the cosmos.",
    "trials_ko": "지식을 찾아 떠난 수십 년의 험난한 유랑 생활 중 겪은 포로 생활, 그리고 그의 신비주의적 교단에 반발한 군중들의 폭동과 방화로 맞이한 비극적 최후.",
    "trials_en": "Enduring captivity during decades of grueling wanderings in search of knowledge, and a tragic demise brought on by a mob riot and arson rebelling against his mystical brotherhood.",
    "overcoming_ko": "수십 년간 축적한 지식을 바탕으로 종교와 수학이 결합된 독보적인 철학 공동체를 세웠으며, 우주를 수(數)와 조화의 관점으로 해석해 서양 철학과 수학의 영원한 기틀을 놓음.",
    "overcoming_en": "He established an unparalleled philosophical community blending religion and mathematics based on decades of accumulated knowledge, and laid the eternal foundation for Western philosophy and mathematics by interpreting the universe through the lens of numbers and harmony.",
    "wisdom": [
      {
        "quote_ko": "만물은 수로 이루어져 있다.",
        "quote_en": "All is number.",
        "meaning_ko": "혼란스럽고 불공평해 보이는 세상 이면에는 반드시 흔들리지 않는 명확한 질서와 법칙이 숨어 있습니다. 감정에 휩쓸리지 마십시오. 당신을 둘러싼 문제를 가장 건조하고 논리적인 형태(숫자)로 환원하여 분석할 때, 반드시 해결책이 보일 것입니다.",
        "meaning_en": "Behind a world that appears chaotic and unfair, there is always a clear, unshakeable order and law hidden. Do not be swept away by emotions. When you reduce the problems surrounding you to their most dry, logical form (numbers) and analyze them, the solution will inevitably reveal itself."
      },
      {
        "quote_ko": "침묵하라, 아니면 침묵보다 가치 있는 말을 하라.",
        "quote_en": "Be silent or let thy words be worth more than silence.",
        "meaning_ko": "당신의 내면이 깊어질수록 당신의 혀는 무거워져야 합니다. 가벼운 말거리로 에너지를 낭비하고 타인에게 상처를 입히지 마십시오. 진정한 거인은 생각의 심연에서 길어 올린 무겁고 가치 있는 한마디로 세상을 울립니다.",
        "meaning_en": "As your inner self deepens, your tongue must become heavier. Do not waste energy on frivolous chatter or use it to hurt others. A true giant resonates with the world through a single, heavy, and valuable word drawn from the abyss of thought."
      },
      {
        "quote_ko": "분노로 시작하는 것은 수치로 끝난다.",
        "quote_en": "Anger begins with folly, and ends with repentance.",
        "meaning_ko": "끓어오르는 감정은 당신의 이성을 마비시키고 시야를 가리는 치명적인 독입니다. 분노의 파도에 휩쓸려 내린 결정은 반드시 처절한 후회를 낳습니다. 어떤 순간에도 당신 내면의 차가운 평정심의 현을 조율하십시오.",
        "meaning_en": "Seething emotion is a fatal poison that paralyzes your reason and clouds your vision. Decisions made while swept away by the waves of anger inevitably breed bitter regret. Attune the strings of your cold, inner tranquility at all times."
      }
    ]
  },
  "ramesses-ii": {
    "era_ko": "기원전 13세기의 거인 (BC 1303~1213)",
    "era_en": "13th Century BC Giant (1303~1213 BC)",
    "category": "leadership",
    "epic_ko": "이집트 신왕국 제19왕조, 거대한 나일강의 태양이 가장 뜨겁게 타오르던 시대. 람세스 2세는 이집트를 역사상 가장 강력한 제국으로 부활시켜야 하는 막중한 사명을 띠고 왕좌에 올랐습니다. 그의 통치 초기는 결코 평온하지 않았습니다. 북쪽에서는 철기를 앞세운 막강한 히타이트 제국이 이집트의 숨통을 조여오고 있었고, 제국 내부는 불안한 긴장감이 감돌고 있었습니다. 기원전 1274년, 인류 역사상 최대 규모의 전차전이었던 '카데시 전투'에서 람세스는 히타이트의 교묘한 매복에 걸려 군대가 궤멸할 절체절명의 위기에 빠졌습니다. 도망치는 병사들 사이에서, 젊은 파라오는 홀로 전차를 몰고 적진을 향해 돌진했습니다. 사자처럼 울부짖는 그의 용맹함은 흩어진 군대를 다시 결집시켰고, 기적적으로 군대를 구출해 냈습니다.\n\n이 전투 후 람세스 2세는 피 흘리는 소모전을 끝내기 위해 대담한 결단을 내렸습니다. 그는 히타이트의 왕 하투실리 3세와 인류 최초의 공식적인 평화 조약을 체결했습니다. 은판에 새겨진 이 조약은 단순한 휴전이 아니라 서로를 형제로 칭하며 불가침을 약속한 위대한 외교적 승리였습니다. 전쟁의 그림자를 걷어낸 그는 나일강 전역에 자신의 위대함을 영원히 새기기 위한 거대한 건축의 시대를 열었습니다. 바위를 뚫어 만든 경이로운 아부심벨 신전, 카르나크 신전의 거대한 다주실, 그리고 새로운 수도 피람세스는 그의 절대적인 권력을 상징하는 기념비가 되었습니다.\n\n그는 66년이라는 경이로운 기간 동안 이집트를 통치하며, 수십 명의 자식들을 앞세워 보내는 인간적인 슬픔을 겪으면서도 결코 제국의 태양으로서의 위엄을 잃지 않았습니다. 그가 다스린 이집트는 역사상 가장 눈부신 풍요와 평화를 누렸습니다. 람세스 2세의 삶은 파괴적인 전쟁의 위기를 압도적인 카리스마로 돌파하고, 평화와 거대한 건축물을 통해 자신의 이름을 역사의 화강암 위에 영원히 새겨 넣은, 왕 중의 왕이 써 내려간 압도적인 대서사시입니다.",
    "epic_en": "In the 19th Dynasty of the Egyptian New Kingdom, an era when the sun over the colossal Nile River burned brightest. Ramesses II ascended the throne with the heavy mission to resurrect Egypt into the most powerful empire in its history. His early reign was anything but peaceful. To the north, the formidable Hittite Empire, wielding iron weapons, was tightening its grip around Egypt's neck, and a restless tension permeated the empire. In 1274 BC, during the 'Battle of Kadesh'—the largest chariot battle in human history—Ramesses fell into a cunning Hittite ambush, facing the existential crisis of his army's annihilation. Amidst his fleeing soldiers, the young Pharaoh drove his chariot alone, charging straight into the enemy lines. Roaring like a lion, his immense valor rallied the scattered army and miraculously saved his forces from destruction.\n\nFollowing this battle, Ramesses II made an audacious decision to end the bloody war of attrition. He concluded the first officially recorded peace treaty in human history with the Hittite King Hattusili III. Engraved on a silver tablet, this treaty was not a mere ceasefire, but a grand diplomatic victory where the two monarchs called each other brothers and pledged non-aggression. Having dispelled the shadow of war, he ushered in a colossal era of construction to eternally carve his greatness across the entire Nile. The wondrous Abu Simbel temples carved directly into the rock face, the massive hypostyle hall at Karnak, and the new capital of Pi-Ramesses stood as monuments to his absolute power.\n\nHe ruled Egypt for an astonishing 66 years. Though he suffered the profound human sorrow of outliving dozens of his own children, he never lost his majesty as the sun of the empire. Under his rule, Egypt enjoyed the most dazzling prosperity and peace in its history. Ramesses II's life is an overwhelming epic written by the King of Kings, who pierced through the crisis of destructive war with sheer charisma, and permanently etched his name into the granite of history through peace and monumental architecture.",
    "trials_ko": "카데시 전투에서 적의 매복에 걸려 목숨을 잃고 군대가 전멸할 뻔한 절체절명의 위기, 그리고 66년의 통치 기간 동안 수많은 자식들이 자신보다 먼저 죽어가는 것을 지켜봐야 했던 가혹한 장수의 형벌.",
    "trials_en": "The existential crisis at the Battle of Kadesh, where he fell into an ambush and nearly lost his life and his entire army, and the cruel penalty of extreme longevity—watching dozens of his own children die before him over his 66-year reign.",
    "overcoming_ko": "절체절명의 전장에서 홀로 적진에 뛰어드는 압도적인 용기로 군대를 구원했고, 이후 히타이트와 인류 최초의 평화 조약을 맺고 거대한 건축 사업을 통해 이집트 최고의 황금기를 이룩함.",
    "overcoming_en": "He saved his army with the overwhelming courage to charge alone into the enemy lines in a desperate situation. Subsequently, he signed the first peace treaty in human history with the Hittites and achieved Egypt's greatest golden age through colossal architectural projects.",
    "wisdom": [
      {
        "quote_ko": "나는 왕 중의 왕, 오시만디아스다. 나의 위대함을 알고 싶은 자는 내가 남긴 업적을 능가해 보아라.",
        "quote_en": "I am Ozymandias, King of Kings; Look on my Works, ye Mighty, and despair!",
        "meaning_ko": "당신의 능력을 말로 떠벌리지 말고, 반박할 수 없는 거대한 결과물로 증명하십시오. 세상은 당신의 변명이나 의도에 관심이 없습니다. 오직 당신이 남긴 압도적인 업적만이 역사에 남아 당신을 대신하여 말할 것입니다.",
        "meaning_en": "Do not brag about your abilities with words; prove them with irrefutable, colossal results. The world cares nothing for your excuses or intentions. Only the overwhelming achievements you leave behind will remain in history and speak on your behalf."
      },
      {
        "quote_ko": "피비린내 나는 승리보다, 견고한 평화가 제국을 더 크고 영원하게 만든다.",
        "quote_en": "A steadfast peace makes an empire greater and more eternal than a blood-soaked victory.",
        "meaning_ko": "모든 갈등을 끝까지 짓밟아 승리하려 하지 마십시오. 때로는 물러서서 적과 악수하는 타협이 필요합니다. 쓸데없는 소모전을 끝내고 평화를 구축할 때, 비로소 당신의 제국(인생)을 거대하게 짓고 성장시킬 시간이 주어집니다.",
        "meaning_en": "Do not try to win every conflict by trampling your opponent to the bitter end. Sometimes, a compromise where you step back and shake hands with the enemy is necessary. Only when you end useless wars of attrition and build peace will you be granted the time to construct and grow your empire (your life) to colossal proportions."
      },
      {
        "quote_ko": "리더는 가장 어두운 절망의 순간, 홀로 앞으로 나아가는 단 한 명의 사람이다.",
        "quote_en": "A leader is the single person who steps forward alone in the darkest moment of despair.",
        "meaning_ko": "모두가 두려움에 사로잡혀 뒷걸음질 칠 때, 그 자리에 멈춰 서서 정면을 응시하십시오. 당신마저 무너지면 모든 것이 끝납니다. 홀로 창을 쥐고 적진으로 뛰어드는 그 압도적인 용기 하나가 흩어진 사람들을 다시 모으는 기적을 만듭니다.",
        "meaning_en": "When everyone else retreats, gripped by fear, stand your ground and stare straight ahead. If even you collapse, everything is finished. That single act of overwhelming courage—charging alone into the enemy lines with spear in hand—is the miracle that rallies scattered people back together."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected next 5 giants into final-narratives.json');
