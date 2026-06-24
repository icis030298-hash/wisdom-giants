const fs = require('fs');

const dataToInject = {
  "steve-jobs": {
    "era_ko": "20세기 후반 - 21세기 초반 (1955~2011)",
    "era_en": "Late 20th - Early 21st Century (1955~2011)",
    "category": "business",
    "epic_ko": "차가운 기계 덩어리에 불과했던 컴퓨터에 숨결을 불어넣어, 기술을 인간의 가장 우아한 예술품으로 승화시킨 시대의 연금술사. 스티브 잡스는 태어나자마자 친부모에게 버려지는 깊은 상처를 안고 시작했지만, 그 결핍은 오히려 완벽함을 향한 지독한 갈망으로 타올랐습니다. 자신이 세운 애플에서 쫓겨나는 참담한 굴욕을 겪으면서도 그는 결코 타협하지 않았습니다. 픽사와 넥스트를 거치며 날카롭게 벼려진 그의 시선은, 다시 돌아온 애플에서 세상을 송두리째 바꿀 '아이폰'이라는 혁명적 마법을 탄생시켰습니다.\n\n그는 사용자조차 자신이 무엇을 원하는지 모를 때, 인간의 무의식적 욕망을 꿰뚫어 보는 섬뜩할 정도의 직관을 발휘했습니다. 복잡하고 지루한 버튼들을 모두 지워버리고, 오직 직관적인 터치만으로 전 세계를 하나로 연결한 그의 디자인 철학은, 기술이 아닌 인문학의 교차점에서 피어난 기적이었습니다. 죽음이라는 가장 명확한 인생의 종착역 앞에서도 흔들리지 않고 마지막 숨결까지 새로운 혁신을 갈구했던 그의 궤적은, 현실 안주를 거부하고 우주에 거대한 흔적(Dent in the universe)을 남긴 창조적 파괴자의 압도적인 대서사시입니다.",
    "epic_en": "The alchemist of an era who breathed life into cold chunks of machinery, sublimating technology into humanity's most elegant works of art. Steve Jobs began his life with the deep wound of being abandoned by his biological parents immediately after birth, but that deficiency fueled a fierce, burning thirst for perfection. Even after suffering the devastating humiliation of being ousted from Apple, the very company he founded, he never compromised. His vision, sharpened to a razor's edge through his time at Pixar and NeXT, gave birth upon his return to Apple to a revolutionary magic that would completely alter the world: the 'iPhone.'\n\nHe wielded an almost eerie intuition, piercing through the unconscious desires of humanity even when users themselves did not know what they wanted. Erasing all complex, tedious buttons to connect the entire world through intuitive touch alone, his design philosophy was a miracle blooming at the intersection of technology and the liberal arts. Unwavering even before death—the most certain destination of life—he craved new innovation until his final breath. His trajectory is the overwhelming epic of a creative destroyer who rejected complacency to leave a colossal 'dent in the universe.'",
    "trials_ko": "친부모에게 버림받은 입양아라는 상실감, 자신이 창업한 회사에서의 비참한 축출, 그리고 너무 일찍 찾아온 치명적인 췌장암의 공포.",
    "trials_en": "The profound sense of loss from being an adopted child abandoned by his biological parents, the miserable ousting from the company he founded, and the terror of fatal pancreatic cancer that arrived far too soon.",
    "overcoming_ko": "상실과 축출의 절망을 예술적 직관과 편집광적인 완벽주의로 벼려내어, 아이폰을 통해 전 세계 인류의 소통 방식을 완전히 재창조함.",
    "overcoming_en": "He forged the despair of loss and ousting into artistic intuition and paranoid perfectionism, entirely reinventing the way humanity communicates through the iPhone.",
    "wisdom": [
      {
        "quote_ko": "죽음은 삶이 만든 최고의 발명품이다. 죽음은 낡은 것을 치우고 새로운 것을 위한 길을 만들어준다.",
        "quote_en": "Death is very likely the single best invention of Life. It clears out the old to make way for the new.",
        "meaning_ko": "시간은 자네를 기다려주지 않네. 죽음이라는 절대적인 끝이 존재함을 가슴에 품을 때, 비로소 세상의 시선이나 실패의 두려움 따위는 먼지처럼 사라지는 법이라네. 남의 인생을 흉내 내느라 자네에게 주어진 그 귀중한 유한한 시간을 낭비하지 말게.",
        "meaning_en": "Time does not wait for you. Only when you embrace the absolute end called death do the judgments of the world and the fear of failure vanish like dust. Do not waste the precious, finite time given to you imitating someone else's life."
      },
      {
        "quote_ko": "계속 갈망하라, 늘 바보처럼 머물러라.",
        "quote_en": "Stay hungry, stay foolish.",
        "meaning_ko": "안락한 성공의 방석에 앉아 자신이 다 안다고 자만하는 순간, 인간은 썩어가기 시작한다네. 늘 채워지지 않는 갈증으로 스스로를 벼랑 끝으로 몰아세우고, 세상이 손가락질하는 바보 같은 짓일지라도 자네의 심장이 이끄는 곳으로 거침없이 나아가게나.",
        "meaning_en": "The moment you sit on the cushion of comfortable success and arrogantly believe you know everything, you begin to rot. Always push yourself to the edge of the cliff with an unquenchable thirst, and boldly advance wherever your heart leads, even if it is a foolish act the world points fingers at."
      },
      {
        "quote_ko": "여정 자체가 보상이다.",
        "quote_en": "The journey is the reward.",
        "meaning_ko": "목표를 이루면 행복해질 거라는 환상을 버리게. 목적지에 도달하는 짧은 쾌락을 위해 현재를 희생하지 말고, 피 튀기고 넘어지며 전진하는 이 처절한 과정 그 자체에서 전율을 느끼는 자만이 진정한 세상을 손에 쥘 수 있다네.",
        "meaning_en": "Abandon the illusion that you will be happy once you achieve your goal. Do not sacrifice the present for the brief pleasure of reaching the destination. Only the one who feels a thrill in the desperate process of advancing, bleeding, and falling can truly grasp the world."
      }
    ]
  },
  "napoleon-bonaparte": {
    "era_ko": "18세기 후반 - 19세기 초 (1769~1821)",
    "era_en": "Late 18th - Early 19th Century (1769~1821)",
    "category": "leadership",
    "epic_ko": "프랑스 본토인들에게 멸시받던 지중해의 작은 섬 코르시카의 촌뜨기 소년. 그는 조롱과 차별 속에서도 침묵하며 역사와 병법책을 씹어 먹듯 탐독했습니다. 프랑스 대혁명의 거대한 피바람 속에서 아무도 거들떠보지 않던 이 작은 포병 장교는, 툴롱 포위전에서의 눈부신 포격 단 한 번으로 자신의 이름을 역사에 각인시켰습니다. 혼란에 빠진 국가를 구원할 영웅을 갈망하던 프랑스 민중 앞에, 그는 알프스의 만년설을 군화발로 짓밟으며 압도적인 전승 신화로 응답했습니다.\n\n스스로 황제의 관을 머리에 쓴 그는 단순한 정복자가 아니었습니다. 그는 '나폴레옹 법전'을 통해 낡은 봉건제의 사슬을 끊어버리고, 능력에 따라 누구나 귀족이 될 수 있다는 평등의 불씨를 유럽 전역에 들불처럼 번지게 했습니다. 아우스터리츠 전투에서 전 유럽의 연합군을 상대로 펼친 기만과 속도전은 전쟁을 예술의 경지로 끌어올린 천재적인 마스터피스였습니다.\n\n비록 혹독한 러시아의 겨울과 워털루의 안개 속에서 그의 거대한 제국은 산산조각 나고 차가운 세인트헬레나 섬에 유배되어 쓸쓸히 눈을 감았지만, 그가 유럽의 심장에 꽂아 넣은 '자유와 평등'이라는 칼날은 영원히 뽑히지 않았습니다. 나폴레옹 보나파르트의 삶은, 불가능이라는 단어를 사전에서 찢어버리고 오직 자신의 의지와 실력만으로 가장 높은 곳에 도달할 수 있음을 증명한 가장 극적이고 장엄한 인간 승리의 서사시입니다.",
    "epic_en": "A provincial boy from the small Mediterranean island of Corsica, despised by mainland Frenchmen. Amidst mockery and discrimination, he remained silent, devouring history and military strategy books as if chewing them. In the massive bloodstorm of the French Revolution, this insignificant artillery officer—whom no one paid attention to—etched his name into history with a single, brilliant bombardment at the Siege of Toulon. Before the French people, who yearned for a hero to save their chaotic nation, he responded with an overwhelming myth of unbroken victories, trampling the eternal snows of the Alps beneath his military boots.\n\nPlacing the emperor's crown upon his own head, he was no mere conqueror. Through the 'Napoleonic Code,' he shattered the chains of the old feudal system and spread the embers of equality—the idea that anyone could rise to nobility based on merit—like wildfire across Europe. The deception and war of speed he deployed against the combined armies of Europe at the Battle of Austerlitz was a brilliant masterpiece that elevated warfare to the realm of art.\n\nThough his colossal empire shattered in the harsh Russian winter and the fog of Waterloo, and he closed his eyes in lonely exile on the cold island of Saint Helena, the blade of 'liberty and equality' he thrust into the heart of Europe was never extracted. Napoleon Bonaparte's life is the most dramatic and majestic epic of human triumph, proving that one can tear the word 'impossible' from the dictionary and reach the highest peaks solely through sheer will and capability.",
    "trials_ko": "코르시카 출신이라는 출신의 꼬리표와 지독한 차별, 그리고 러시아 원정의 대실패로 모든 것을 잃고 외딴섬에 유배된 처절한 몰락.",
    "trials_en": "The stigma and severe discrimination of being from Corsica, and the devastating downfall where he lost everything and was exiled to an isolated island after the catastrophic failure of the Russian campaign.",
    "overcoming_ko": "출신의 한계를 압도적인 군사적 천재성과 속도전으로 짓밟았으며, 나폴레옹 법전을 통해 유럽 전역에 혁명의 정신(평등)을 불멸의 유산으로 남김.",
    "overcoming_en": "He trampled the limitations of his origins with overwhelming military genius and blitz warfare, leaving the spirit of the revolution (equality) as an immortal legacy across Europe through the Napoleonic Code.",
    "wisdom": [
      {
        "quote_ko": "내 사전에는 불가능이란 단어가 없다.",
        "quote_en": "The word impossible is not in my dictionary.",
        "meaning_ko": "자네 앞을 막아선 거대한 장벽 앞에서 지레짐작으로 고개를 숙이지 말게. 불가능이란 단지 겁쟁이들이 만들어낸 환상에 불과하다네. 자네의 강철 같은 의지와 돌파력 앞에서 세상에 뚫지 못할 벽은 존재하지 않는 법이라네.",
        "meaning_en": "Do not bow your head preemptively before the colossal barriers blocking your path. Impossible is merely an illusion created by cowards. In the face of your iron-willed resolve and breakthrough power, there is no wall in the world that cannot be pierced."
      },
      {
        "quote_ko": "상상력이 세상을 지배한다.",
        "quote_en": "Imagination rules the world.",
        "meaning_ko": "눈에 보이는 현실의 조각들에 갇혀 한숨 쉬지 말게. 천하를 제패하는 힘은 날카로운 칼끝이 아니라 자네의 머릿속에서 그려내는 한계 없는 상상력에서 시작되는 법. 먼저 머릿속에서 완벽하게 이긴 후, 현실에 그 승리를 각인시키게나.",
        "meaning_en": "Do not sigh while trapped by the visible fragments of reality. The power to conquer the world begins not at the tip of a sharp sword, but in the limitless imagination drawn within your mind. Win perfectly in your mind first, then engrave that victory onto reality."
      },
      {
        "quote_ko": "승리는 가장 끈기 있는 자의 것이다.",
        "quote_en": "Victory belongs to the most persevering.",
        "meaning_ko": "초반의 작은 승리에 도취하거나 한 번의 패배에 엎어지지 말게. 진정한 승부는 모두가 지쳐 떨어져 나가는 그 마지막 1초에서 결정된다네. 입술을 깨물고, 뼈가 부서지는 고통 속에서도 마지막 한 걸음을 내딛는 자가 결국 모든 것을 갖게 될 걸세.",
        "meaning_en": "Do not be intoxicated by small early victories or fall apart at a single defeat. True contests are decided in that final second when everyone else is exhausted and drops out. The one who bites his lip and takes that last step, even in bone-crushing pain, will ultimately possess everything."
      }
    ]
  },
  "king-sejong": {
    "era_ko": "15세기의 거인 (1397~1450)",
    "era_en": "15th Century Giant (1397~1450)",
    "category": "leadership",
    "epic_ko": "피의 숙청으로 왕좌를 찬탈한 아버지 태종. 그 서늘한 칼날 위에서 왕위를 이어받은 젊은 군주 세종의 앞에는, 권력의 단맛에 취한 오만한 사대부들과 무지몽매한 백성들만이 놓여 있었습니다. 하지만 그는 칼 대신 수만 권의 책을 무기로 삼았습니다. 지독한 독서벽으로 두 눈이 짓무르고 시력을 잃어가는 칠흑 같은 고통 속에서도, 그는 백성의 삶을 구제하겠다는 단 하나의 집념으로 밤을 지새웠습니다.\n\n그가 만들어낸 세계 최고의 과학적 기구들, 농사직설, 칠정산은 그저 국가의 위신을 세우기 위함이 아니었습니다. 농사짓는 법을 몰라 굶주리는 늙은 농부, 글을 몰라 관청에서 억울하게 매를 맞는 어리석은 백성들의 피눈물을 닦아주기 위한 숭고한 사랑의 발로였습니다. 기득권 사대부들이 '오랑캐의 글자'라며 목숨을 걸고 반대할 때, 그는 홀로 어둠 속에서 인간의 발음 기관을 해부하듯 분석하여 가장 완벽하고 쉬운 28자의 마법, 훈민정음을 창제했습니다.\n\n등창의 썩어 들어가는 고통과 자식들을 먼저 떠나보내는 피를 토하는 슬픔 속에서도 그는 결코 백성을 포기하지 않았습니다. 세상의 모든 부조리와 무지를 문자의 빛으로 찢어발긴 그의 삶은, 군주라는 이름이 권력이 아니라 백성을 향한 가장 무겁고 처절한 헌신임을 증명해 낸 가장 위대한 성군의 대서사시입니다.",
    "epic_en": "His father, Taejong, had usurped the throne through bloody purges. Upon inheriting the crown on that chilling blade, the young monarch Sejong faced only arrogant scholar-officials drunk on the sweetness of power and ignorant, unenlightened commoners. However, instead of a sword, he armed himself with tens of thousands of books. Even as his eyes festered and he lost his sight to the pitch-black agony of his severe reading habit, he stayed awake through the nights with a single obsession: to save the lives of his people.\n\nThe world's finest scientific instruments, the 'Nongsa Jikseol' (Straight Talk on Farming), and the 'Chiljeongsan' (Calculations of the Seven Luminaries) that he created were not merely to establish national prestige. They were the manifestation of a sublime love to wipe away the tears of blood from old farmers starving because they didn't know how to farm, and foolish commoners unjustly beaten at government offices because they couldn't read. When the establishment scholar-officials opposed him with their lives, calling it 'barbarian script,' he sat alone in the darkness, analyzing human vocal organs as if dissecting them, to invent the most perfect and simple magic of 28 letters: Hunminjeongeum (Hangul).\n\nDespite the rotting agony of back ulcers and the blood-vomiting sorrow of outliving his own children, he never abandoned his people. Tearing through all the absurdities and ignorance of the world with the light of letters, his life is the grandest epic of a sage king, proving that the title of monarch is not about power, but the heaviest, most desperate dedication to the people.",
    "trials_ko": "과도한 업무와 독서로 인한 치명적인 시력 상실과 육체의 질병(등창), 기득권 양반층의 맹렬한 정치적 저항.",
    "trials_en": "Fatal loss of vision and physical illnesses (back ulcers) from excessive work and reading, coupled with fierce political resistance from the establishment aristocratic class.",
    "overcoming_ko": "자신의 육체가 부서지는 고통 속에서도 백성을 향한 지극한 연민(애민정신)으로 한글(훈민정음)을 창제하여, 지식의 독점을 깨고 만백성에게 빛을 선사함.",
    "overcoming_en": "Even as his own body crumbled in agony, his profound compassion for his people (spirit of loving the people) drove him to invent Hangul (Hunminjeongeum), breaking the monopoly on knowledge and gifting light to all commoners.",
    "wisdom": [
      {
        "quote_ko": "백성은 나라의 근본이요, 밥은 백성의 하늘이다.",
        "quote_en": "The people are the root of the state, and food is the heaven of the people.",
        "meaning_ko": "거창한 이념이나 화려한 말잔치로 사람을 움직이려 하지 말게. 조직이든 가정이든, 타인의 마음을 얻으려면 그들의 가장 절박하고 현실적인 고통(배고픔)부터 어루만져 주어야 하는 법. 진정한 리더십은 발을 진흙탕에 담그고 밥을 챙겨주는 데서 시작한다네.",
        "meaning_en": "Do not try to move people with grandiose ideologies or flashy rhetoric. Whether in an organization or a family, to win the hearts of others, you must first soothe their most desperate, practical suffering (hunger). True leadership begins with putting your feet in the mud and ensuring they are fed."
      },
      {
        "quote_ko": "꽃이 지는 것을 슬퍼하지 마라. 바람이 불면 또 다른 씨앗이 흩날릴 것이니.",
        "quote_en": "Do not grieve the falling of flowers. When the wind blows, other seeds will scatter.",
        "meaning_ko": "자네가 공들인 프로젝트나 인간관계가 허무하게 무너졌다고 해서 모든 것이 끝난 양 절망하지 말게. 시련의 거친 바람은 썩은 가지를 꺾어버릴 뿐만 아니라, 자네 안에 잠든 새로운 기회의 씨앗을 더 넓은 세상으로 퍼뜨려 주는 법이라네.",
        "meaning_en": "Do not despair as if everything is over just because a project or relationship you poured effort into collapsed vainly. The harsh winds of trial do not merely snap rotten branches; they scatter the seeds of new opportunities dormant within you to a wider world."
      },
      {
        "quote_ko": "내가 꿈꾸는 태평성대는 백성들이 하고 싶은 일을 하며 살게 하는 것이다.",
        "quote_en": "The peaceful reign I dream of is one where the people can live doing the work they desire.",
        "meaning_ko": "억지로 규율을 옥죄고 채찍질한다고 사람이 성장하는 것이 아닐세. 자네 곁의 사람들이 각자의 무대에서 가장 빛나는 재능을 맘껏 펼칠 수 있도록 판을 깔아주는 것, 그것이 가장 위대한 포용이자 세상을 움직이는 방식임을 잊지 말게나.",
        "meaning_en": "People do not grow by forcibly tightening rules and whipping them. Forget not that the greatest inclusion, and the way to move the world, is to lay the groundwork so that the people around you can freely unleash their most brilliant talents on their respective stages."
      }
    ]
  },
  "genghis-khan": {
    "era_ko": "12세기 후반 - 13세기 초반 (1162?~1227)",
    "era_en": "Late 12th - Early 13th Century (1162?~1227)",
    "category": "leadership",
    "epic_ko": "바람이 몰아치는 매서운 몽골 초원, 아홉 살 소년 테무친의 삶은 아버지가 독살당하면서 처참한 지옥으로 변했습니다. 부족에게 버림받고 들쥐를 잡아먹으며 연명하던 그에게 세상은 한 줌의 자비도 베풀지 않았습니다. 사랑하는 아내마저 적에게 납치당하는 수모를 겪었을 때, 그는 운명을 탓하며 주저앉지 않고 가슴속에 차가운 복수의 칼날을 벼렸습니다. 잔혹한 초원의 법칙을 뼈저리게 체득한 그는, 혈연과 신분을 철저히 파괴하고 오직 능력과 충성심만으로 사람을 거느리는 새로운 질서를 세우기 시작했습니다.\n\n그는 흩어진 몽골의 야성적인 기병들을 하나로 묶어 거대한 태풍으로 만들었습니다. 수백 년간 몽골을 이간질하고 짓밟았던 금나라와 호라즘 제국을 향해 진격할 때, 그의 군대는 며칠 밤낮을 말 위에서 자며 피바람을 몰고 왔습니다. 항복하는 자에게는 모든 종교와 상업을 포용하는 제국의 신민이라는 영광을 주었지만, 저항하는 자의 도시는 철저히 불태우고 수레바퀴보다 큰 자는 모두 도륙하는 압도적인 공포를 심어주었습니다.\n\n유라시아 대륙을 가로지르는 인류 역사상 가장 거대한 제국, 그것은 결코 우연이 아니었습니다. 끊임없이 이동하며 새로운 전술을 흡수하고 낡은 관습을 박살 낸 혁신의 결과물이었습니다. 핏빛 말발굽으로 대륙을 평정하고 죽는 순간까지 초원의 야성을 잃지 않았던 칭기즈 칸의 삶은, 가장 비참한 밑바닥에서 시작해 세계의 절반을 집어삼킨 거대한 늑대의 불멸의 서사시입니다.",
    "epic_en": "On the fierce, windswept Mongolian steppes, the life of nine-year-old Temujin turned into a miserable hell when his father was poisoned. Abandoned by his tribe and surviving by hunting field mice, the world showed him not an ounce of mercy. When he suffered the humiliation of his beloved wife being abducted by enemies, he did not sit down and curse his fate; instead, he forged a cold blade of vengeance in his heart. Having bitterly learned the cruel laws of the steppe, he began to establish a new order, utterly destroying bloodlines and status, gathering people solely based on merit and loyalty.\n\nHe united the scattered, wild Mongolian cavalry into a massive typhoon. As he marched against the Jin dynasty and the Khwarazmian Empire—which had divided and trampled Mongolia for centuries—his army brought storms of blood, sleeping on horseback for days and nights on end. To those who surrendered, he granted the glory of being subjects of an empire that embraced all religions and commerce; but to those who resisted, he instilled overwhelming terror, thoroughly burning their cities and slaughtering anyone taller than a cartwheel.\n\nThe largest contiguous empire in human history stretching across the Eurasian continent was no mere accident. It was the result of relentless innovation—constantly moving, absorbing new tactics, and smashing old customs. Pacifying the continent with blood-stained hooves and never losing the wildness of the steppe until the moment of his death, Genghis Khan's life is the immortal epic of a giant wolf that started from the most miserable rock bottom to swallow half the world.",
    "trials_ko": "유년 시절 아버지의 독살로 시작된 극한의 가난과 부족의 배신, 아내의 납치, 그리고 매 순간 목숨을 걸어야 했던 잔혹한 초원의 생존 경쟁.",
    "trials_en": "Extreme poverty and tribal betrayal following his father's poisoning in childhood, the abduction of his wife, and the cruel competition for survival on the steppe where every moment was a risk to his life.",
    "overcoming_ko": "혈연 대신 능력 위주의 철저한 실력주의와 기동성, 포용과 공포를 오가는 압도적 리더십으로 분열된 부족을 통일하고 세계 제국을 건설함.",
    "overcoming_en": "He united divided tribes and built a world empire through strict meritocracy over bloodlines, unparalleled mobility, and overwhelming leadership that oscillated between inclusion and terror.",
    "wisdom": [
      {
        "quote_ko": "적은 밖에 있는 것이 아니라 내 안에 있다. 나는 내게 거추장스러운 것은 깡그리 쓸어버렸다.",
        "quote_en": "The enemy is not outside, but within me. I swept away everything that was cumbersome to me.",
        "meaning_ko": "자네를 끊임없이 주저앉히는 진짜 적은 세상의 가혹함이 아니라, 핑계를 대며 안주하려는 자네 내면의 나약함이라네. 쓸데없는 자존심과 타인의 시선 같은 무거운 짐들을 가차 없이 베어버리게. 몸이 가벼워질 때 비로소 대륙을 달릴 수 있는 법일세.",
        "meaning_en": "The true enemy that constantly brings you down is not the harshness of the world, but your own inner weakness trying to settle down with excuses. Ruthlessly cut away heavy burdens like useless pride and the gaze of others. Only when your body is light can you run across the continent."
      },
      {
        "quote_ko": "배운 게 없다고 탓하지 마라. 나는 내 이름도 쓸 줄 몰랐지만 남의 말에 귀 기울이면서 현명해지는 법을 배웠다.",
        "quote_en": "Do not blame having no education. I did not even know how to write my own name, but I learned to become wise by listening to the words of others.",
        "meaning_ko": "많이 배우지 못했다고, 가진 것이 없다고 세상의 벽 앞에서 지레 겁먹지 말게나. 책에 쓰인 죽은 지식보다 타인의 지혜를 스펀지처럼 빨아들이는 겸손한 귀야말로 세상을 정복하는 가장 예리하고 무서운 무기라네.",
        "meaning_en": "Do not be prematurely frightened before the walls of the world just because you lack formal education or wealth. A humble ear that absorbs the wisdom of others like a sponge is a far sharper and more terrifying weapon for conquering the world than dead knowledge written in books."
      },
      {
        "quote_ko": "집안이 나쁘다고 탓하지 마라. 나는 아홉 살 때 고아가 되었고 쥐를 잡아먹으며 살아남았다.",
        "quote_en": "Do not blame a bad family background. I became an orphan at nine and survived by eating mice.",
        "meaning_ko": "불공평한 출발선을 원망하느라 소중한 젊음을 탕진하지 말게. 바닥을 쳐본 자만이 가장 높이 튀어 오를 수 있는 독기를 품는 법이네. 자네의 그 끔찍한 결핍이야말로 세상을 집어삼킬 수 있는 가장 거대한 에너지의 근원임을 잊지 말게나.",
        "meaning_en": "Do not squander your precious youth resenting an unfair starting line. Only one who has hit rock bottom harbors the venomous drive to bounce back the highest. Never forget that your horrific deficiency is the very source of the most colossal energy capable of swallowing the world."
      }
    ]
  },
  "alexander-the-great": {
    "era_ko": "기원전 4세기의 거인 (BC 356~323)",
    "era_en": "4th Century BC Giant (356~323 BC)",
    "category": "leadership",
    "epic_ko": "그리스의 거친 변방 마케도니아. 위대한 철학자 아리스토텔레스의 가르침을 스펀지처럼 빨아들이며 자란 젊은 왕자 알렉산드로스의 가슴속에는 아킬레우스와 같은 신화적 영웅이 되겠다는 거대한 불꽃이 타오르고 있었습니다. 20세의 어린 나이에 암살당한 아버지를 이어 왕좌에 올랐을 때, 주변의 반란군들은 그를 풋내기라 조롱했습니다. 그러나 그는 태풍처럼 휘몰아쳐 그리스 전역을 피로 물들이며 단숨에 제압하고, 아득히 먼 동방의 거대 제국 페르시아를 향해 거침없이 창을 겨누었습니다.\n\n가우가멜라 전투에서 수십만 명의 페르시아 대군이 땅을 울리며 몰려올 때, 그는 압도적인 공포 앞에서도 결코 물러서지 않았습니다. 그는 직접 컴패니언 기병대의 최선봉에 서서 적의 대열에 생긴 찰나의 틈새를 꿰뚫고 적장 다리우스 3세를 향해 미친 듯이 돌진했습니다. 그가 휘두른 것은 단순한 무력이 아니라, 동서양을 하나의 거대한 문명으로 융합하겠다는 숭고하고도 미친 야망이었습니다. 그는 정복한 땅의 문화를 파괴하지 않고 스스로 페르시아의 옷을 입으며 헬레니즘이라는 새로운 세계의 씨앗을 뿌렸습니다.\n\n하지만 끝없는 정복욕은 그를 이집트의 사막에서 인도의 정글까지 몰아넣었습니다. 32세의 젊은 나이에 이름 모를 열병에 걸려 침상에 누웠을 때, 후계자를 묻는 부하들의 질문에 그는 가쁜 숨을 몰아쉬며 \"가장 강한 자에게(To the strongest)\"라는 섬뜩한 한마디를 남기고 눈을 감았습니다. 그의 생애는 혜성처럼 짧았지만, 그가 휩쓸고 지나간 발자취는 동서양의 경계를 산산조각 내며 인류 역사의 방향을 완전히 뒤틀어버린 압도적인 불멸의 서사시로 남았습니다.",
    "epic_en": "In Macedonia, the rugged periphery of Greece, young Prince Alexander grew up absorbing the teachings of the great philosopher Aristotle like a sponge, a colossal fire burning in his heart to become a mythical hero like Achilles. When he ascended to the throne at the young age of 20 following his father's assassination, surrounding rebels mocked him as a greenhorn. However, he swept through like a typhoon, subduing all of Greece in a bloodbath in a single breath, and relentlessly leveled his spear toward the vast, distant empire of Persia in the East.\n\nAt the Battle of Gaugamela, when hundreds of thousands of Persian troops surged forward, shaking the earth, he never stepped back in the face of overwhelming terror. Standing at the very vanguard of his Companion Cavalry, he pierced a momentary gap in the enemy's lines and charged madly toward the enemy king, Darius III. What he wielded was not mere martial force, but a sublime and crazed ambition to fuse the East and West into one colossal civilization. Rather than destroying the cultures of the lands he conquered, he donned Persian robes himself and sowed the seeds of a new world called Hellenism.\n\nYet, his endless lust for conquest drove him from the deserts of Egypt to the jungles of India. Bedridden with an unknown fever at the young age of 32, when his generals asked to whom he would leave his empire, he took a ragged breath and left them with a chilling, single phrase: \"To the strongest,\" before closing his eyes. His life was as brief as a comet, but the footsteps he left behind shattered the boundaries of East and West, leaving an overwhelming, immortal epic that completely twisted the direction of human history.",
    "trials_ko": "20세라는 어린 나이에 왕위를 계승하며 겪은 국가의 반란 위기, 그리고 동방 원정 중 마주친 압도적인 수적 열세와 끝없는 낯선 환경의 공포.",
    "trials_en": "The crisis of national rebellions upon inheriting the throne at the young age of 20, and the overwhelming numerical disadvantages and endless terror of unfamiliar environments encountered during his Eastern campaigns.",
    "overcoming_ko": "스스로 최선봉에 서서 돌격하는 압도적인 용기와 전술로 적군을 박살냈으며, 정복지의 문화를 포용하는 융합 정책(헬레니즘)으로 세계 제국을 경영함.",
    "overcoming_en": "He smashed enemy forces with overwhelming courage and tactics by leading the charge himself at the vanguard, and managed his world empire through an integration policy (Hellenism) that embraced the cultures of conquered lands.",
    "wisdom": [
      {
        "quote_ko": "세상의 어떤 성벽도 뚫을 수 있다. 당나귀 한 마리에 황금을 가득 싣고 갈 수만 있다면.",
        "quote_en": "No fortress is so strong that it cannot be taken, if only a donkey loaded with gold can be led inside.",
        "meaning_ko": "목표를 이루기 위해 때로는 우직한 힘보다 교묘한 지혜와 자본이 훨씬 강력한 무기가 되는 법이라네. 꽉 막힌 성벽을 주먹으로 치느라 손에 피를 내지 말고, 사람의 마음을 움직일 수 있는 가장 현실적이고 날카로운 지렛대를 찾아보게나.",
        "meaning_en": "To achieve a goal, cunning wisdom and capital are sometimes far more powerful weapons than honest strength. Do not bloody your hands punching a solid wall; instead, find the most practical, sharp lever that can move human hearts."
      },
      {
        "quote_ko": "나는 승리를 훔치지 않는다.",
        "quote_en": "I will not steal a victory.",
        "meaning_ko": "치졸한 꼼수와 비겁한 속임수로 얻은 성공은 아침 이슬처럼 금방 증발해 버린다네. 진정한 거인은 정정당당하게 적의 한가운데로 돌진하여 실력으로 상대를 압도하는 법. 스스로에게 떳떳하지 못한 승리는 패배보다 못한 것임을 명심하게.",
        "meaning_en": "Success gained through petty tricks and cowardly deception evaporates as quickly as morning dew. A true giant charges fairly into the center of the enemy and overwhelms the opponent with pure skill. Keep in mind that a victory of which you cannot be proud is worse than defeat."
      },
      {
        "quote_ko": "운명은 용기 있는 자의 편이다.",
        "quote_en": "Fortune favors the bold.",
        "meaning_ko": "완벽한 타이밍과 조건이 갖춰지길 기다리며 방구석에 숨어있지 말게. 인생의 거대한 파도는 오직 두려움을 씹어 삼키고 미친 듯이 전진하는 자의 배를 밀어주는 법이라네. 주저하지 말고 자네의 창을 세상의 가장 깊은 곳을 향해 던지게나.",
        "meaning_en": "Do not hide in the corner of your room waiting for perfect timing and conditions. The massive waves of life only push the ships of those who chew through their fear and charge forward madly. Do not hesitate; hurl your spear toward the deepest part of the world."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected rewritten giants (1-5) into final-narratives.json');
