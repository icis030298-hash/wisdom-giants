const fs = require('fs');

const dataToInject = {
  "james-clerk-maxwell": {
    "era_ko": "19세기의 거인 (1831~1879)",
    "era_en": "19th Century Giant (1831~1879)",
    "category": "science",
    "epic_ko": "19세기, 과학계는 눈에 보이지 않는 힘인 전기와 자기를 다루는 수많은 실험과 발견들로 들끓고 있었습니다. 하지만 이 현상들은 개별적인 조각들로 흩어져 있을 뿐, 우주의 비밀을 관통하는 하나의 거대한 법칙으로는 이어지지 못했습니다. 스코틀랜드의 부유한 가정에서 태어난 제임스 클러크 맥스웰은 어릴 적부터 '이건 어떻게 움직이는 걸까?'라는 질문을 입에 달고 살던 소년이었습니다. 14세의 어린 나이에 수학 논문을 발표할 정도로 천재였던 그는, 마이클 패러데이가 실험으로 증명한 '역선'의 직관적인 아이디어를 수학의 언어로 완벽하게 번역해 내는 거대한 작업에 뛰어들었습니다.\n\n맥스웰은 차가운 수식 속에서 우주의 가장 아름다운 대칭성을 발견했습니다. 그는 전기와 자기라는 두 개의 다른 힘이 사실은 '전자기파'라는 하나의 거대한 물결임을 증명해 냈습니다. 그리고 이 전자기파의 속도를 계산해낸 순간, 그는 인류 역사상 가장 경이로운 깨달음에 도달했습니다. 그 속도가 바로 빛의 속도와 정확히 일치했던 것입니다. \"빛은 곧 전자기파다.\" 그의 이 선언은 뉴턴 이후 물리학 역사상 가장 위대한 통합이었으며, 우주의 빛이 결국 전기와 자기가 엮어내는 거대한 춤사위임을 밝혀낸 기념비적인 순간이었습니다.\n\n그는 48세라는 이른 나이에 위암으로 세상을 떠났지만, 그가 남긴 4개의 짧고 우아한 수식, '맥스웰 방정식'은 세상을 영원히 바꿔놓았습니다. 아인슈타인이 자신의 연구실 벽에 뉴턴, 패러데이와 함께 그의 초상화를 걸어두고 \"나는 뉴턴의 어깨가 아니라 맥스웰의 어깨 위에 서 있다\"라고 고백했을 만큼, 그의 이론은 상대성 이론과 양자역학의 탄생을 알리는 신호탄이 되었습니다. 오늘날 우리가 누리는 라디오, 텔레비전, 스마트폰, 그리고 무선 통신의 시대는 모두 이 조용한 스코틀랜드 과학자가 머릿속으로 그려낸 거대한 방정식의 파동 위에서 탄생한 것입니다.",
    "epic_en": "In the 19th century, the scientific world was bubbling with countless experiments and discoveries regarding the invisible forces of electricity and magnetism. However, these phenomena were scattered as individual fragments, failing to connect into a single, grand law piercing through the secrets of the universe. Born into a wealthy Scottish family, James Clerk Maxwell was a boy who constantly asked, 'How does this work?' A genius who published a mathematical paper at the tender age of 14, he plunged into the monumental task of perfectly translating Michael Faraday's intuitive idea of 'lines of force' into the rigorous language of mathematics.\n\nWithin cold formulas, Maxwell discovered the most beautiful symmetry of the universe. He proved that the two distinct forces of electricity and magnetism were, in fact, a single massive wave known as 'electromagnetic waves.' And the moment he calculated the speed of these waves, he arrived at one of the most wondrous epiphanies in human history: the speed exactly matched the speed of light. \"Light is an electromagnetic wave.\" This declaration was the greatest unification in the history of physics since Newton, a monumental moment revealing that the light of the universe is ultimately a grand dance woven by electricity and magnetism.\n\nThough he passed away from stomach cancer at the early age of 48, the four short, elegant equations he left behind—'Maxwell's Equations'—forever changed the world. Albert Einstein hung Maxwell's portrait on his study wall alongside Newton and Faraday, confessing, \"I stand not on the shoulders of Newton, but on the shoulders of Maxwell.\" Maxwell's theories became the flare that heralded the birth of relativity and quantum mechanics. The era of radios, televisions, smartphones, and wireless communication we enjoy today was entirely born upon the waves of the colossal equations conceived in the mind of this quiet Scottish scientist.",
    "trials_ko": "당대 학계가 이해하기 힘들었던 고도의 수학적 접근으로 인한 초기 이론의 외면과, 48세라는 이른 나이에 찾아온 치명적인 위암 투병.",
    "trials_en": "The initial dismissal of his theories due to his highly advanced mathematical approach, which was difficult for his contemporaries to grasp, and his battle with fatal stomach cancer that claimed his life at the early age of 48.",
    "overcoming_ko": "결코 좌절하지 않고 패러데이의 직관과 수학을 결합해 전자기학을 완벽히 통합했으며, 죽음의 고통 속에서도 학문에 대한 순수한 열정을 잃지 않음.",
    "overcoming_en": "Without despair, he successfully combined Faraday's intuition with mathematics to perfectly unify electromagnetism, maintaining his pure passion for science even amidst the agony of his impending death.",
    "wisdom": [
      {
        "quote_ko": "우리의 가장 큰 지식은 우리 자신의 무지를 아는 것입니다.",
        "quote_en": "Thoroughly conscious ignorance is the prelude to every real advance in science.",
        "meaning_ko": "스스로 모든 것을 알고 있다는 오만에 빠지는 순간, 성장은 멈춥니다. 자신이 무엇을 모르는지 뼈저리게 인식하고 질문을 던질 때, 비로소 세상의 진짜 비밀을 푸는 열쇠를 쥐게 될 것입니다.",
        "meaning_en": "The moment you fall into the arrogance of believing you know everything, your growth stops. Only when you acutely recognize what you do not know and cast your questions, will you hold the key to unlocking the true secrets of the world."
      },
      {
        "quote_ko": "과학에서 가장 유용한 발견은 현상들 사이의 숨겨진 연관성을 찾아내는 것이다.",
        "quote_en": "In Science, it is when we take some interest in the great discoverers and their lives that it becomes endurable.",
        "meaning_ko": "전혀 관련이 없어 보이는 것들 사이에서 보이지 않는 실을 찾아내십시오. 당신의 일상 속에 흩어진 파편들을 하나의 거대한 통찰력으로 엮어낼 때, 세상을 뒤바꿀 혁신이 탄생합니다.",
        "meaning_en": "Find the invisible threads between things that seem entirely unrelated. When you weave the scattered fragments of your daily life into a single, colossal insight, an innovation that changes the world is born."
      },
      {
        "quote_ko": "수학은 자연의 언어이며, 우리는 그 언어로 우주의 시를 읽는다.",
        "quote_en": "Mathematics is the language of nature, and through it, we read the poetry of the universe.",
        "meaning_ko": "세상의 복잡한 문제들을 당신만의 명확하고 논리적인 언어로 정의하십시오. 현상에 압도당하지 않고 그 본질을 당신의 언어로 번역할 수 있을 때, 당신은 운명을 지배할 수 있습니다.",
        "meaning_en": "Define the world's complex problems in your own clear, logical language. When you are not overwhelmed by phenomena but can translate their essence into your own words, you can master your destiny."
      }
    ]
  },
  "moctezuma-ii": {
    "era_ko": "15세기 후반 ~ 16세기 초 (1466~1520)",
    "era_en": "Late 15th - Early 16th Century (1466~1520)",
    "category": "leadership",
    "epic_ko": "아메리카 대륙의 중앙, 호수 위에 떠 있는 거대한 제국의 심장 테노치티틀란. 몬테수마 2세가 황제(틀라토아니)로 등극했을 때, 아스텍 제국은 역사상 가장 거대하고 찬란한 황금기를 누리고 있었습니다. 그는 단순한 통치자가 아니라 신과 인간을 이어주는 대제사장이었으며, 그의 말 한마디에 수백만 명의 운명이 결정되었습니다. 제국의 영토는 끝없이 확장되었고, 조공국들은 금과 은, 진귀한 새의 깃털을 바쳤습니다. 그는 막강한 권력과 정교한 신화적 세계관 속에서 우주의 질서를 유지하는 태양과도 같은 존재였습니다.\n\n그러나 1519년, 제국의 해안에 한 번도 본 적 없는 기이한 짐승(말)을 타고, 번개를 쏘아대는 쇠 옷을 입은 이방인들이 나타났습니다. 바로 에르난 코르테스가 이끄는 스페인 정복자들이었습니다. 몬테수마는 이들을 어떻게 대할 것인가를 두고 깊은 고뇌에 빠졌습니다. 전설 속 파괴와 창조의 신 '케찰코아틀'이 돌아온 것일까, 아니면 제국을 집어삼키려는 탐욕스러운 인간일까? 그는 무력으로 그들을 짓밟는 대신, 그들을 수도로 정중히 초대하여 신들의 의도를 파악하고 외교적으로 상황을 통제하려 했습니다. 하지만 이 치명적인 오판은 거대한 비극의 서막이었습니다.\n\n황금에 눈이 먼 코르테스는 황제의 환대를 배신하고 그를 자신의 궁전에서 인질로 포획했습니다. 신처럼 군림하던 황제가 꼭두각시로 전락하자, 긍지 높은 아스텍 민중들은 끓어오르는 분노를 참지 못하고 반란을 일으켰습니다. 성난 군중 앞에서 그들을 진정시키려 발코니에 섰던 몬테수마는, 결국 자신이 다스리던 백성들이 던진 돌에 맞고 비참한 최후를 맞이했습니다. 그의 삶은 찬란했던 고대 제국의 영광과, 새로운 시대의 거대한 파도 앞에서 한 리더의 치명적인 오판이 어떻게 한 문명을 송두리째 파멸로 몰아넣을 수 있는지를 보여주는 비통하고도 웅장한 비극의 대서사시입니다.",
    "epic_en": "In the heart of the Americas, atop a lake stood Tenochtitlan, the beating heart of a colossal empire. When Moctezuma II ascended as the Emperor (Tlatoani), the Aztec Empire was experiencing its grandest and most brilliant golden age in history. He was not merely a ruler, but the High Priest who bridged the gap between the gods and humanity; a single word from him determined the fate of millions. The empire's territory expanded endlessly, and vassal states offered tributes of gold, silver, and precious bird feathers. Immersed in immense power and an intricate mythological worldview, he was a sun-like figure maintaining the order of the universe.\n\nHowever, in 1519, strangers appeared on the empire's shores—men wearing iron clothes that shot lightning, riding bizarre, never-before-seen beasts (horses). These were the Spanish conquistadors led by Hernán Cortés. Moctezuma was plunged into profound agony over how to deal with them. Was this the return of the legendary god of creation and destruction, Quetzalcoatl, or were they greedy mortals intent on swallowing his empire? Instead of crushing them with military force, he respectfully invited them into the capital, attempting to discern the will of the gods and control the situation diplomatically. But this fatal misjudgment was the prelude to a monumental tragedy.\n\nBlinded by gold, Cortés betrayed the Emperor's hospitality and took him hostage within his own palace. As the emperor, who once reigned like a god, was reduced to a puppet, the proud Aztec people could not contain their seething rage and rose in rebellion. Standing on a balcony to pacify the furious mob, Moctezuma ultimately met a miserable end, struck by rocks thrown by the very subjects he once ruled. His life is a sorrowful yet majestic epic of tragedy, demonstrating how the glory of a radiant ancient empire, combined with a leader's fatal misjudgment in the face of a colossal new wave of an era, can drive an entire civilization into absolute ruin.",
    "trials_ko": "전혀 다른 세계관을 가진 이질적인 서구 문명(스페인 정복자들)과의 충돌, 그리고 종교적 신념과 현실의 군사적 위협 사이에서의 극심한 딜레마.",
    "trials_en": "The collision with a totally alien Western civilization (the Spanish conquistadors) holding an entirely different worldview, and the extreme dilemma between his profound religious beliefs and a realistic military threat.",
    "overcoming_ko": "결과적으로 제국의 몰락을 막지 못하고 비극적인 최후를 맞았으나, 이 사건은 리더의 결단이 문명의 운명을 어떻게 좌우하는지 인류에게 영원한 교훈으로 남음.",
    "overcoming_en": "Though he ultimately failed to prevent the empire's downfall and met a tragic end, this monumental event remains an eternal lesson for humanity on how a leader's decisions can seal the fate of a civilization.",
    "wisdom": [
      {
        "quote_ko": "나를 보라, 나는 살과 피로 이루어진 인간일 뿐이다. 나는 신이 아니며 당신들과 같은 필멸자이다.",
        "quote_en": "See me, I am but a man of flesh and blood. I am no god, but a mortal like yourselves.",
        "meaning_ko": "당신이 얻은 권력과 지위가 당신을 신앙의 대상이나 절대자로 만들어주지 않습니다. 가장 높은 곳에 있을 때일수록 자신의 유한함과 인간적인 한계를 직시하십시오. 겸손을 잃는 순간 몰락이 시작됩니다.",
        "meaning_en": "The power and status you have acquired do not make you an object of worship or an absolute being. The higher you ascend, the more you must confront your own mortality and human limitations. The moment you lose humility, your downfall begins."
      },
      {
        "quote_ko": "불확실한 전설에 운명을 맡기는 자는, 눈앞의 실재하는 검에 찔리게 될 것이다.",
        "quote_en": "He who entrusts his fate to uncertain legends shall be pierced by the real sword before his eyes.",
        "meaning_ko": "과거의 성공 방식이나 낡은 믿음에 기대어 눈앞에 닥친 현실의 위기를 외면하지 마십시오. 냉철하고 현실적인 판단력이 흐려지는 순간, 당신이 쌓아올린 모든 것이 적의 입속으로 빨려 들어갈 것입니다.",
        "meaning_en": "Do not lean on past methods of success or outdated beliefs to ignore the realistic crises looming before you. The moment your cold, realistic judgment is clouded, everything you have built will be swallowed into the enemy's maw."
      },
      {
        "quote_ko": "거대한 성벽은 외부의 적이 아니라, 리더의 주저함 속에서 무너져 내린다.",
        "quote_en": "A great wall crumbles not from the enemy without, but from the hesitation of the leader within.",
        "meaning_ko": "결정적인 순간에 결단을 내리지 못하고 타협하려 든다면, 그것은 가장 치명적인 패배를 부릅니다. 리더의 모호한 태도는 적에게는 용기를, 내부의 아군에게는 절망과 불신을 심어줄 뿐입니다.",
        "meaning_en": "If you fail to make a decisive choice at a critical moment and attempt to compromise, you invite the most fatal defeat. A leader's ambiguous stance only instills courage in the enemy and despair and distrust among allies."
      }
    ]
  },
  "tran-hung-dao": {
    "era_ko": "13세기 쩐 왕조 (1228~1300)",
    "era_en": "13th Century Tran Dynasty (1228~1300)",
    "category": "leadership",
    "epic_ko": "13세기, 아시아부터 유럽까지 전 세계를 공포에 떨게 한 몽골 제국의 발굽 아래 수많은 국가들이 추풍낙엽처럼 무너져 내렸습니다. 그러나 동남아시아의 작고 습한 땅 다이비엣(베트남 쩐 왕조)에는 그 거대한 폭풍 앞에서도 결코 무릎 꿇지 않은 한 거인이 있었습니다. 쩐흥다오는 왕족의 핏줄을 안고 태어났으나, 그의 가문은 왕권 다툼의 피비린내 나는 비극에 휩싸여 있었습니다. 아버지의 원수를 갚으라는 유언을 받았지만, 몽골의 대군이 국경을 짓밟고 들어오자 그는 개인의 사사로운 원한을 접어두고 조국의 절체절명 위기 앞에 자신을 완전히 던졌습니다.\n\n몽골 제국의 쿠빌라이 칸이 수십만의 대군과 수백 척의 함대를 이끌고 침공해왔을 때, 다이비엣의 조정은 공포에 질려 항복을 논의했습니다. 왕마저 두려움에 떨며 후퇴를 고민할 때, 쩐흥다오는 왕의 앞에 나서며 외쳤습니다. \"적군이 항복하기를 원하신다면 먼저 신의 목을 베소서!\" 이 사자후는 벼랑 끝에 몰려있던 백성과 군인들의 심장에 불을 지폈습니다. 그는 정면으로 맞서기보다 정글과 강이라는 지형을 이용해 적의 식량 보급을 끊고 끝없는 게릴라 전술로 적을 지치게 만드는 '청야전술'을 완벽하게 구사했습니다.\n\n그의 천재적인 군사 전략은 1288년 바익당 강 전투에서 신화로 완성되었습니다. 강바닥에 쇠를 박은 뾰족한 나무 말뚝을 숨겨두고 몽골의 거대한 함대를 유인한 후, 썰물 때 물이 빠져나가며 적의 배들이 말뚝에 꿰뚫리게 만든 이 놀라운 전술로 몽골의 무적 함대는 완전히 전멸했습니다. 무려 세 차례에 걸친 몽골의 침략을 막아낸 그의 승리는 기적이 아니라, 개인의 복수를 초월하여 조국을 위해 목숨을 건 한 영웅의 압도적인 지혜와 용기가 만들어낸 불멸의 대서사시입니다.",
    "epic_en": "In the 13th century, countless nations crumbled like autumn leaves under the hooves of the Mongol Empire, which struck terror from Asia to Europe. However, in the small, humid land of Dai Viet (the Tran Dynasty of Vietnam) in Southeast Asia, there stood a giant who refused to bow before that colossal storm. Tran Hung Dao was born of royal blood, yet his family was embroiled in the bloody tragedy of a power struggle for the throne. Though he received his father's dying wish to avenge his honor, when the massive Mongol army trampled over the borders, he set aside his personal vendetta and threw himself entirely into the existential crisis of his homeland.\n\nWhen Kublai Khan of the Mongol Empire invaded with hundreds of thousands of troops and a massive fleet, the court of Dai Viet, paralyzed by fear, debated surrender. As even the king trembled in terror and considered retreating, Tran Hung Dao stepped forward and roared, \"If Your Majesty wishes to surrender, please have my head cut off first!\" This lion's roar ignited the hearts of the soldiers and people pushed to the brink. Rather than fighting a head-on battle, he perfectly executed a 'scorched-earth' strategy, utilizing the jungles and rivers to sever the enemy's supply lines and exhausting them through relentless guerrilla warfare.\n\nHis military genius was mythologized at the Battle of Bach Dang River in 1288. He hid iron-tipped wooden stakes in the riverbed and lured the colossal Mongol fleet inward; as the tide ebbed, the enemy ships were impaled upon the hidden stakes. Through this astonishing tactic, the supposedly invincible Mongol fleet was utterly annihilated. His victory, repelling three separate Mongol invasions, was no miracle—it is an immortal epic forged by the overwhelming wisdom and courage of a hero who transcended personal revenge to risk his life for his country.",
    "trials_ko": "가족의 비극적인 원한과 복수심, 그리고 세계 최강이었던 몽골 제국의 압도적이고 반복적인 세 차례의 대규모 침공.",
    "trials_en": "The tragedy and thirst for vengeance within his own family, coupled with the overwhelming and repeated massive invasions by the Mongol Empire, the most powerful force in the world at the time.",
    "overcoming_ko": "사사로운 원한을 버리고 대의를 선택했으며, 조국의 지형을 완벽히 이해한 천재적인 게릴라 전술(바익당 강 전투)로 몽골군을 섬멸함.",
    "overcoming_en": "He discarded personal grudges in favor of the greater cause, and annihilated the Mongol forces using his brilliant guerrilla tactics (Battle of Bach Dang), perfectly utilizing his homeland's geography.",
    "wisdom": [
      {
        "quote_ko": "적군이 항복하기를 원하신다면 먼저 신의 목을 베소서.",
        "quote_en": "If Your Majesty wishes to surrender, please have my head cut off first.",
        "meaning_ko": "절대적인 위기 앞에서 타협과 굴복을 논하지 마십시오. 당신의 목숨을 걸고 물러서지 않겠다는 확고한 결의만이 주변 사람들의 두려움을 깨부수고 불가능한 승리를 가져다줄 것입니다.",
        "meaning_en": "In the face of absolute crisis, do not debate compromise or submission. Only your firm resolution to stand your ground, even at the cost of your life, will shatter the fear of those around you and deliver an impossible victory."
      },
      {
        "quote_ko": "군대의 힘은 숫자가 아니라 단합에 있다.",
        "quote_en": "The strength of an army lies not in numbers, but in its unity.",
        "meaning_ko": "압도적인 자원이나 거대한 규모를 부러워하지 마십시오. 하나의 뚜렷한 목표 아래 서로 믿고 의지하며 하나로 결속된 조직은, 모래알처럼 흩어진 거대한 제국도 무너뜨릴 수 있는 날카로운 칼이 됩니다.",
        "meaning_en": "Do not envy overwhelming resources or massive scale. An organization firmly united under a single, clear goal, trusting and relying on one another, becomes a sharp blade capable of bringing down even a massive empire scattered like grains of sand."
      },
      {
        "quote_ko": "국가의 가장 강력한 방어선은 성벽이 아니라 백성들의 마음이다.",
        "quote_en": "The strongest defense of a nation is not its walls, but the hearts of its people.",
        "meaning_ko": "리더가 갖추어야 할 가장 강력한 무기는 최첨단 기술도, 막대한 자본도 아닙니다. 당신과 함께하는 사람들의 마음을 얻고 그들에게 깊은 헌신을 끌어낼 때, 당신의 성벽은 절대 무너지지 않습니다.",
        "meaning_en": "The most powerful weapon a leader must possess is neither cutting-edge technology nor immense capital. When you win the hearts of those who stand with you and draw out their deep devotion, your walls will never crumble."
      }
    ]
  },
  "zenobia": {
    "era_ko": "3세기 고대 로마 시대 (240~274)",
    "era_en": "3rd Century Ancient Rome (240~274)",
    "category": "leadership",
    "epic_ko": "거대한 로마 제국이 내부의 분열과 외부의 침략으로 삐걱거리던 서기 3세기, 중동의 심장부 시리아 사막에 피어난 오아시스 도시 팔미라에서 한 전설적인 여왕이 등장했습니다. 제노비아는 아랍과 아람의 피를 이어받았으며, 스스로를 클레오파트라의 후손이라 칭할 만큼 강렬한 프라이드와 지성을 갖춘 여인이었습니다. 남편인 오데나투스 왕이 암살당하는 비극 속에서 어린 아들이 왕위를 잇게 되자, 그녀는 슬픔에 주저앉지 않고 섭정으로서 권력의 전면에 나섰습니다. 무너져가는 로마의 그늘에 숨어있기를 거부한 그녀의 가슴속에는 팔미라를 세계의 중심에 세우겠다는 거대한 야망이 불타고 있었습니다.\n\n그녀는 단순히 궁전에 앉아 정치를 하는 여왕이 아니었습니다. 전장에 나갈 때면 화려한 장신구 대신 갑옷을 입고 군인들과 함께 수 킬로미터를 걸었으며, 웅변으로 병사들의 심장을 뜨겁게 달궜습니다. 그녀의 지휘 아래 팔미라의 기병대는 사막의 모래폭풍처럼 이집트부터 소아시아에 이르는 거대한 영토를 집어삼켰습니다. 무적을 자랑하던 로마 제국의 동방 영토를 차지하고, 동양과 서양의 상권을 모두 틀어쥔 팔미라 제국의 대여왕이 된 그녀 앞에서는 당대의 지식인들도 무릎을 꿇고 지혜를 나누었습니다.\n\n로마의 아우렐리아누스 황제가 잃어버린 제국을 되찾기 위해 대군을 이끌고 쳐들어왔을 때도 그녀는 항복을 거부하고 끝까지 칼을 맞댔습니다. 비록 혹독한 포위전 끝에 사로잡혀 로마의 개선식에 황금 사슬로 묶인 채 끌려가는 치욕을 겪어야 했지만, 그녀의 당당하고 오만한 눈빛은 로마 시민들을 압도했습니다. 로마에 굴복하지 않고 사막의 심장부에 자신만의 거대한 제국을 세우려 했던 그녀의 불꽃 같은 삶은, 권력과 야망의 중심에서 세상을 호령한 위대한 여왕의 지워지지 않는 대서사시입니다.",
    "epic_en": "In the 3rd century AD, as the colossal Roman Empire creaked under the weight of internal division and external invasions, a legendary queen emerged from Palmyra, an oasis city blooming in the heart of the Syrian desert. Zenobia, inheriting Arab and Aramean blood, was a woman of such intense pride and intellect that she claimed descent from Cleopatra herself. Amidst the tragedy of her husband King Odenathus's assassination, leaving her young son to inherit the throne, she did not succumb to sorrow. Instead, she stepped to the forefront of power as regent. Refusing to hide in the shadow of a crumbling Rome, a monumental ambition burned within her breast to elevate Palmyra to the center of the world.\n\nShe was not a queen who merely governed from the comfort of a palace. When marching to war, she eschewed lavish jewelry for armor, walking miles alongside her soldiers and igniting their hearts with her stirring oratory. Under her command, the Palmyrene cavalry swallowed up vast territories from Egypt to Asia Minor like a desert sandstorm. Having seized the eastern provinces of the supposedly invincible Roman Empire and monopolized the trade routes between East and West, she became the great Queen of the Palmyrene Empire, before whom even the intellectuals of the era bowed to share their wisdom.\n\nEven when the Roman Emperor Aurelian marched upon her with a massive army to reclaim the lost empire, she refused to surrender, crossing swords with him to the bitter end. Although captured after a brutal siege and enduring the humiliation of being paraded in golden chains through Aurelian's triumph in Rome, her dignified and haughty gaze captivated and overwhelmed the Roman citizens. Her fiery life—refusing to submit to Rome and attempting to forge her own colossal empire in the heart of the desert—is an indelible epic of a great queen who commanded the world from the center of power and ambition.",
    "trials_ko": "남편의 암살이라는 비극 속에서 왕국을 지켜야 했으며, 당시 세계 최강이었던 로마 제국의 황제(아우렐리아누스)와 피할 수 없는 전면전을 벌여야 했던 벼랑 끝의 운명.",
    "trials_en": "The tragedy of her husband's assassination, leaving her to defend the kingdom, and her destiny at the edge of a precipice, forced into an inevitable all-out war with the Emperor of Rome (Aurelian), the greatest power in the world.",
    "overcoming_ko": "탁월한 카리스마와 군사적 재능으로 이집트와 소아시아를 정복하여 독자적인 제국을 건설했으며, 패배하여 황금 사슬에 묶인 채 끌려가면서도 꺾이지 않는 위엄을 보여줌.",
    "overcoming_en": "With exceptional charisma and military genius, she conquered Egypt and Asia Minor to build her own independent empire. Even when defeated and dragged in golden chains, she displayed an unbroken, majestic dignity.",
    "wisdom": [
      {
        "quote_ko": "클레오파트라가 포로로 사느니 여왕으로서 죽기를 택했다는 사실을 모르는 것처럼 내게 항복을 요구하는구나.",
        "quote_en": "You demand my surrender as though you do not know that Cleopatra preferred to die a queen rather than remain alive as a captive.",
        "meaning_ko": "당신의 목숨이나 지위를 보존하기 위해 당신의 영혼과 자존심을 헐값에 팔아넘기지 마십시오. 타인의 발밑에 무릎 꿇고 얻어낸 비루한 생존보다는, 당신의 존엄을 지키며 치열하게 저항하는 길이 거인의 길입니다.",
        "meaning_en": "Do not sell your soul and pride at a bargain price merely to preserve your life or status. Rather than a pathetic survival earned by kneeling at the feet of others, fiercely resisting while defending your dignity is the path of a giant."
      },
      {
        "quote_ko": "리더는 보석이 아니라, 갑옷의 무게를 견디는 자이다.",
        "quote_en": "A leader is one who bears the weight of armor, not the glitter of jewels.",
        "meaning_ko": "왕관의 화려함에 취하려 하지 마십시오. 사람들의 존경을 얻고 싶다면 가장 먼저 진흙탕으로 걸어 들어가 그들과 함께 고통의 무게를 짊어져야 합니다. 그 묵묵한 헌신만이 진정한 권위를 만듭니다.",
        "meaning_en": "Do not become intoxicated by the splendor of the crown. If you wish to earn the respect of the people, you must be the first to walk into the mud and shoulder the weight of suffering alongside them. Only that silent devotion creates true authority."
      },
      {
        "quote_ko": "야망이 없는 삶은 모래 위에 지은 성과 같다.",
        "quote_en": "A life without ambition is like a castle built on sand.",
        "meaning_ko": "당신의 한계를 남들이 그어놓은 선에 맞추지 마십시오. 당신의 심장이 시키는 가장 거대한 야망을 향해 칼을 뽑아 드십시오. 실패의 두려움 때문에 안전한 우물 안으로 숨는다면, 당신은 영원히 비범해질 수 없습니다.",
        "meaning_en": "Do not adjust your limits to the lines drawn by others. Draw your sword towards the greatest ambition your heart commands. If you hide in a safe well out of fear of failure, you will never achieve the extraordinary."
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
