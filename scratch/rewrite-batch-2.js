const fs = require('fs');

const dataToInject = {
  "walt-disney": {
    "era_ko": "20세기의 거인 (1901~1966)",
    "era_en": "20th Century Giant (1901~1966)",
    "category": "arts",
    "epic_ko": "농장의 혹독한 노동에 지친 소년은, 헛간의 쥐라든가 농장의 동물들을 그리며 지독한 가난의 현실을 도피했습니다. 월트 디즈니의 시작은 결코 화려하지 않았습니다. 청년이 되어 세운 첫 애니메이션 회사는 참담한 실패로 파산했고, 그의 첫 번째 성공작이었던 '오스왈드 래빗'마저 악덕 배급사에게 판권과 애니메이터들을 몽땅 빼앗기는 비참한 사기를 당했습니다. 빈털터리로 뉴욕에서 LA로 돌아오는 절망적인 기차 안에서, 그는 분노의 눈물을 삼키며 수첩에 조그만 생쥐 한 마리를 스케치했습니다. 그것이 바로 세계의 문화사를 영원히 바꿀 '미키 마우스'의 탄생이었습니다.\n\n그는 애니메이션이 단지 아이들의 시간 때우기용 장난이라는 세상의 편견을 산산조각 냈습니다. 역사상 최초로 소리가 들어간 유성 애니메이션 '증기선 윌리'를 성공시켰고, 모든 할리우드 제작자들이 \"미친 짓\"이라며 비웃었던 세계 최초의 장편 애니메이션 '백설공주와 일곱 난쟁이'를 만들기 위해 자신의 집마저 담보로 잡혔습니다. 완벽함을 향한 그의 지독한 강박은 종이에 그려진 그림들이 마치 생명을 얻은 것처럼 눈물과 감동을 자아내게 만들었고, 마침내 개봉 날 극장은 어른들의 기립박수와 눈물바다로 변했습니다.\n\n나아가 그는 스크린의 환상을 현실의 흙바닥 위에 건설하겠다는 더욱 미친 꿈을 꾸었습니다. 세상의 지독한 현실을 잠시 잊고 모든 가족이 동심으로 돌아갈 수 있는 거대한 마법의 왕국, '디즈니랜드'를 세운 것입니다. 비록 암으로 쓰러져 디즈니월드의 완성을 보지 못하고 눈을 감았지만, 월트 디즈니의 삶은 가난과 사기라는 참혹한 현실 속에서도 '꿈꾸는 능력을 잃지 않는 자'가 어떻게 세상을 가장 거대하고 아름다운 마법으로 물들일 수 있는지를 증명한 불멸의 대서사시입니다.",
    "epic_en": "Exhausted by the brutal labor on his family's farm, a young boy escaped the reality of crushing poverty by drawing the mice in the barn and farm animals. Walt Disney's beginnings were anything but glamorous. His first animation studio went bankrupt in a dismal failure, and he suffered the miserable fraud of losing the rights to his first successful creation, 'Oswald the Lucky Rabbit,' along with all his animators, to a ruthless distributor. On a despairing train ride back to LA from New York, completely broke, he swallowed his tears of anger and sketched a small mouse in his notebook. That was the birth of 'Mickey Mouse,' which would forever change global cultural history.\n\nHe shattered the world's prejudice that animation was merely a toy for children to pass the time. He succeeded with 'Steamboat Willie,' the first animated film with synchronized sound, and mortgaged his own home to create the world's first feature-length animated film, 'Snow White and the Seven Dwarfs,' a project every Hollywood producer mocked as \"Disney's Folly.\" His fierce obsession with perfection made drawings on paper evoke tears and emotion as if they had gained life. On premiere night, the theater transformed into a sea of tears and a standing ovation from adults.\n\nFurthermore, he dreamed an even crazier dream: to construct the illusions of the screen upon the real soil of the earth. He built 'Disneyland,' a massive magical kingdom where families could temporarily forget the harsh realities of the world and return to the innocence of childhood. Though cancer struck him down before he could see the completion of Disney World, Walt Disney's life is an immortal epic proving how 'one who never loses the ability to dream' can paint the world with the grandest, most beautiful magic, even amidst the horrific realities of poverty and betrayal.",
    "trials_ko": "첫 회사의 파산과 성공작 판권 탈취라는 참혹한 배신, 장편 애니메이션 제작을 위한 지독한 자금난, 그리고 끝없는 세상의 비웃음과 회의적인 시선.",
    "trials_en": "The catastrophic betrayal of losing the rights to his first success and his first company's bankruptcy, severe financial struggles to produce feature-length animations, and the endless mockery and skepticism of the world.",
    "overcoming_ko": "절망의 기차 안에서 미키 마우스를 창조하고, 모든 것을 거는 광기 어린 도전으로 백설공주와 디즈니랜드를 성공시키며 애니메이션을 숭고한 예술과 현실의 마법으로 승화시킴.",
    "overcoming_en": "He created Mickey Mouse on a train of despair, and through mad, all-in bets, succeeded with Snow White and Disneyland, sublimating animation into sublime art and real-world magic.",
    "wisdom": [
      {
        "quote_ko": "꿈을 꿀 수 있다면, 해낼 수도 있다.",
        "quote_en": "If you can dream it, you can do it.",
        "meaning_ko": "현실의 차가운 벽 앞에서 상상하기를 멈추지 말게. 자네의 머릿속에 생생하게 그려낼 수 없는 것은 현실에서도 결코 이루어질 수 없지. 세상이 자네를 비웃을 만큼 거대하고 미친 꿈을 꾸게나. 그 미친 꿈만이 잿빛 세상을 자네만의 마법으로 물들일 유일한 붓이라네.",
        "meaning_en": "Do not stop imagining before the cold walls of reality. What you cannot vividly picture in your mind can never be achieved in reality. Dream a colossal, crazy dream big enough for the world to mock you. That crazy dream is the only brush that can paint the gray world with your own magic."
      },
      {
        "quote_ko": "모든 역경과 실패는 나를 더 강하게 만들었다.",
        "quote_en": "All the adversity I've had in my life, all my troubles and obstacles, have strengthened me.",
        "meaning_ko": "믿었던 이에게 배신당하고 가진 것을 몽땅 빼앗겨 빈털터리가 되었는가? 그 참담한 절망감이야말로 자네 내면에 잠든 진짜 거인을 깨우는 가장 날카로운 바늘일세. 눈물을 닦고 그 바닥에서 가장 위대한 스케치를 시작하게나.",
        "meaning_en": "Have you been betrayed by someone you trusted and lost everything to become penniless? That miserable despair is the very sharpest needle that wakes the true giant sleeping within you. Wipe your tears and begin your greatest sketch right there on the bottom."
      },
      {
        "quote_ko": "차이를 만드는 것은 오직 끝까지 해내는 능력이다.",
        "quote_en": "The difference in winning and losing is most often...not quitting.",
        "meaning_ko": "적당히 타협하고 싶은 유혹을 뼈를 깎는 심정으로 거부하게나. 99%의 완성과 100%의 완성 사이의 그 1% 차이가 세상의 기립박수를 이끌어내는 법. 자네의 모든 것을 갈아 넣어 그림에 생명을 불어넣을 때, 비로소 마법이 펼쳐질 걸세.",
        "meaning_en": "Reject the temptation to lazily compromise with a bone-grinding resolve. The 1% difference between 99% completion and 100% completion is what draws a standing ovation from the world. Only when you grind up everything you have and breathe life into your drawing will magic unfold."
      }
    ]
  },
  "thomas-edison": {
    "era_ko": "19세기 후반 - 20세기 초반 (1847~1931)",
    "era_en": "Late 19th - Early 20th Century (1847~1931)",
    "category": "science",
    "epic_ko": "학교에서는 '머리가 썩은 아이'라며 불과 3개월 만에 쫓겨났고, 어린 시절 앓은 성홍열로 인해 한쪽 귀의 청력을 잃어 평생 고독한 고요 속에서 살아야 했던 소년 토머스 에디슨. 그에게 세상의 정규 교육은 아무런 의미가 없었습니다. 기차역에서 신문을 팔며 화물칸 구석에 작은 실험실을 차렸던 그는, 불이 나는 사고를 쳐 귀싸대기를 맞고 쫓겨나면서도 호기심의 불꽃을 끄지 않았습니다. 그는 대학의 상아탑에 갇힌 우아한 학자가 아니라, 기름때 묻은 손으로 수만 번의 실패를 뚫고 나가는 처절한 발명 노동자였습니다.\n\n그가 인류에게 안겨준 가장 위대한 선물, '실용적인 백열전구'의 발명 과정은 그야말로 지옥 같은 인내의 연속이었습니다. 필라멘트를 찾기 위해 짐승의 털, 수염, 낚싯줄 등 세상에 존재하는 6천여 종의 재료를 태웠지만 번번이 잿더미로 변했습니다. 동료들이 절망하여 포기하려 할 때, 그는 \"우리는 6천 번 실패한 것이 아니라, 안 되는 방법 6천 가지를 알아냈을 뿐이다\"라고 일갈했습니다. 마침내 대나무 섬유가 어둠 속에서 수백 시간 동안 타오르며 빛을 냈을 때, 인류는 수만 년간 지배해 오던 밤의 어둠으로부터 영원한 해방을 선고받았습니다.\n\n그는 축음기, 영사기 등 1,093개의 특허를 쏟아내며 세상을 시각과 청각의 혁명으로 이끌었지만, 교류 전기를 둘러싼 테슬라와의 전류 전쟁에서는 추악한 언론 플레이를 동원할 만큼 승리에 대한 비정상적인 집착을 보이기도 했습니다. 에디슨의 삶은 한 천재의 번뜩이는 영감이 아니라, 육신이 부서질 듯한 땀방울과 실패의 늪을 미친 듯이 뒹굴며 어둠을 빛으로 강제 변환시킨 한 인간의 지독하고 압도적인 투쟁의 서사시입니다.",
    "epic_en": "Expelled from school after just three months as a boy with an 'addled brain,' and losing the hearing in one ear to scarlet fever, Thomas Edison was forced to live his entire life in a solitary quiet. Formal education meant nothing to him. Selling newspapers at a train station, he set up a small laboratory in the corner of a baggage car; even when he caused a fire, got slapped, and was thrown out, the flames of his curiosity were never extinguished. He was not an elegant scholar trapped in an ivory tower, but a desperate invention laborer, pushing through tens of thousands of failures with grease-stained hands.\n\nThe process of inventing his greatest gift to humanity—the practical incandescent light bulb—was an endless stretch of hellish endurance. To find a filament, he burned over 6,000 materials existing in the world, including animal hair, beards, and fishing line, only for them to turn to ash time and time again. When his colleagues despaired and wanted to quit, he roared, \"We haven't failed 6,000 times; we've just found 6,000 ways that won't work.\" When a bamboo fiber finally burned in the darkness and emitted light for hundreds of hours, humanity was granted eternal emancipation from the darkness of the night that had ruled it for tens of thousands of years.\n\nPouring out 1,093 patents, including the phonograph and motion picture camera, he led the world into a visual and auditory revolution. Yet, in the 'War of the Currents' with Tesla over alternating current, he displayed an abnormal obsession with winning, even resorting to ugly media manipulation. Edison's life is not a tale of a genius's flashing inspiration, but an intense, overwhelming epic of a human being who forcibly converted darkness into light by madly rolling through the swamps of failure and pouring out bone-crushing sweat.",
    "trials_ko": "학창 시절의 퇴학과 청력 상실이라는 치명적 신체 결함, 그리고 백열전구 하나를 만들기 위해 견뎌야 했던 6,000번이 넘는 지독한 실패의 고통.",
    "trials_en": "The fatal physical defect of hearing loss and expulsion during his school days, and the excruciating pain of enduring over 6,000 failures to create a single incandescent light bulb.",
    "overcoming_ko": "신체적 결함과 무수한 실패를 '성공으로 가는 필수적인 데이터'로 재해석하는 강철 같은 멘탈로 전구, 축음기, 영사기 등을 발명하며 밤의 어둠을 몰아냄.",
    "overcoming_en": "With an iron mentality that reinterpreted physical defects and countless failures as 'essential data toward success,' he invented the light bulb, phonograph, and motion picture camera, driving away the darkness of the night.",
    "wisdom": [
      {
        "quote_ko": "나는 실패한 적이 없다. 그저 작동하지 않는 만 가지 방법을 발견했을 뿐이다.",
        "quote_en": "I have not failed. I've just found 10,000 ways that won't work.",
        "meaning_ko": "실패라는 단어를 자네의 머릿속에서 완전히 도려내게. 넘어졌을 때 부끄러워하며 숨지 말게나. 그것은 실패가 아니라 자네가 원하는 정답으로 가는 길에 지뢰 하나를 완벽하게 제거한 위대한 순간일 뿐이니. 흙먼지를 털고 다시 실험실로 돌아가게.",
        "meaning_en": "Completely carve out the word 'failure' from your mind. Do not hide in shame when you fall. It is not a failure, but a magnificent moment where you have perfectly cleared one landmine from the path to the right answer you seek. Brush off the dirt and return to the laboratory."
      },
      {
        "quote_ko": "천재는 1%의 영감과 99%의 땀으로 이루어진다.",
        "quote_en": "Genius is one percent inspiration and ninety-nine percent perspiration.",
        "meaning_ko": "하늘에서 번뜩이는 아이디어가 뚝 떨어지기만을 기다리며 입을 벌리고 있지 말게. 세상을 바꾸는 위대한 마법은 머리가 아니라, 손에 피멍이 들도록 묵묵히 버텨내는 지독한 육체적 끈기에서 탄생한다네. 핑계 대지 말고 몸을 움직이게나.",
        "meaning_en": "Do not sit with your mouth open, waiting for a brilliant idea to drop from the sky. The great magic that changes the world is not born from the head, but from the fierce physical persistence of silently enduring until your hands are bruised and bloodied. Stop making excuses and move your body."
      },
      {
        "quote_ko": "가장 큰 약점은 포기하는 것이다. 성공을 위한 가장 확실한 방법은 항상 한 번 더 시도하는 것이다.",
        "quote_en": "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
        "meaning_ko": "모든 에너지가 소진되고 당장이라도 주저앉고 싶은 그 벼랑 끝의 순간, 딱 한 번만 더 부딪혀 보게나. 자네를 구원할 기적의 열쇠는 항상 자네가 포기하려던 바로 그다음 순간에 숨겨져 있는 법이라네.",
        "meaning_en": "At that very edge of the cliff when all your energy is exhausted and you want to collapse right now, crash against it just one more time. The miraculous key that will save you is always hidden in the very next moment after you were about to give up."
      }
    ]
  },
  "julius-caesar": {
    "era_ko": "기원전 1세기의 거인 (BC 100~44)",
    "era_en": "1st Century BC Giant (100~44 BC)",
    "category": "leadership",
    "epic_ko": "기득권 원로원 귀족들이 공화정이라는 이름 아래 부패와 탐욕을 일삼던 고대 로마. 몰락한 귀족 가문 출신의 율리우스 카이사르는, 청년 시절 해적에게 납치당해 몸값을 요구받는 굴욕적인 상황에서도 오히려 \"내 몸값이 너무 싸다\"며 호통을 치고, 풀려난 후 해적들을 모조리 토벌해 버리는 범상치 않은 광기를 지닌 사내였습니다. 그는 기득권의 견제를 뚫고 권력을 잡기 위해, 목숨을 걸고 야만족이 들끓는 갈리아(현재의 프랑스) 원정을 떠났습니다. 8년 동안 혹독한 추위와 배고픔 속에서 부하들과 똑같이 흙바닥에서 자고 빵을 씹으며, 그는 갈리아 전역을 정복해 로마의 영토를 두 배로 늘려놓았습니다.\n\n그가 압도적인 군사적 명성과 부를 거머쥐고 영웅으로 떠오르자, 공포에 질린 로마 원로원은 그에게 군대를 해산하고 맨몸으로 귀환하라는 사형 선고와도 같은 명령을 내렸습니다. 국경선인 루비콘강 앞에서 그는 잠시 말을 멈췄습니다. 강을 건너는 순간 로마에 대한 반역자가 되며, 돌이킬 수 없는 내전의 피바람이 불 것이 뻔했습니다. 하지만 그는 단호히 칼을 뽑아 들고 \"주사위는 던져졌다!\"고 외치며 차가운 강물로 뛰어들었습니다. 그의 결단은 부패한 원로원 중심의 천 년 공화정을 박살 내고 새로운 제국 시대를 여는 거대한 신호탄이 되었습니다.\n\n폼페이우스와의 내전에서 승리하고 이집트의 클레오파트라와 역사적인 동맹을 맺으며 최고 권력자(종신 독재관)의 자리에 오른 그는, 율리우스력을 제정하고 빈민을 구제하는 등 로마를 완전히 뜯어고쳤습니다. 하지만 황제가 되려 한다는 의심을 품은 공화주의자 친구 브루투스의 칼날에 원로원 한복판에서 피를 토하며 쓰러졌습니다. \"브루투스, 너마저!\"라는 비극적인 유언을 남기고 최후를 맞이했지만, 카이사르의 삶은 기득권의 부패를 돌파하기 위해 스스로 반역의 강을 건넜던 가장 압도적이고 매혹적인 정치적 대서사시로 영원히 기억되고 있습니다.",
    "epic_en": "In ancient Rome, where the establishment patrician senators engaged in corruption and greed under the guise of a republic. Born into a fallen noble family, Julius Caesar was a man of extraordinary madness. In his youth, when kidnapped by pirates demanding ransom, he audaciously scoffed, \"My ransom is too low,\" and upon his release, he tracked down and eradicated all of them. To break through the checks of the establishment and seize power, he risked his life embarking on the Gallic Wars. For eight years, amidst brutal cold and starvation, sleeping on the dirt and chewing hard bread alongside his men, he conquered all of Gaul and doubled the territory of Rome.\n\nAs he emerged as a hero wielding overwhelming military fame and wealth, the terrified Roman Senate issued an order tantamount to a death sentence: disband his army and return to Rome as a private citizen. Standing before the Rubicon River, the borderline of Italy, he paused his horse. The moment he crossed that river, he would become a traitor to Rome, and an irreversible bloodstorm of civil war would follow. Yet, he decisively drew his sword, shouted \"The die is cast!\" and plunged into the cold waters. His resolve served as the colossal flare that shattered the corrupt, Senate-led, centuries-old republic, ushering in the new era of the Empire.\n\nVictorious in the civil war against Pompey, and making a historic alliance with Egypt's Cleopatra, he rose to the position of supreme power (Dictator in Perpetuity). He completely overhauled Rome, instituting the Julian calendar and providing relief for the poor. However, suspected of aiming for kingship, he was stabbed to death by his republican friend Brutus in the middle of the Senate. Coughing blood, he left his tragic final words, \"Et tu, Brute?\" Though he met his end, Caesar's life is eternally remembered as the most overwhelming and captivating political epic of a man who willingly crossed the river of treason to break through the corruption of the establishment.",
    "trials_ko": "해적 납치 사건의 위협, 부패한 로마 원로원의 끝없는 정치적 견제와 군대 해산(사형 선고) 명령, 그리고 배신당한 믿음(브루투스의 암살).",
    "trials_en": "The threat of pirate kidnapping, the endless political checks and the order to disband his army (a death sentence) by the corrupt Roman Senate, and the ultimate betrayal of trust (assassination by Brutus).",
    "overcoming_ko": "주사위는 던져졌다는 결단력으로 반역의 십자가를 짊어지고 루비콘강을 건너 내전에서 승리했으며, 천 년의 낡은 공화정을 박살 내고 거대 로마 제국의 기틀을 마련함.",
    "overcoming_en": "With the decisive 'The die is cast,' he bore the cross of treason to cross the Rubicon, triumphed in civil war, smashed the old millennia-old republic, and laid the foundation for the massive Roman Empire.",
    "wisdom": [
      {
        "quote_ko": "주사위는 던져졌다.",
        "quote_en": "Alea iacta est (The die is cast).",
        "meaning_ko": "수만 번의 계산과 고민이 끝났다면, 남은 것은 오직 두려움을 집어삼키는 과감한 실행뿐이네. 돌아갈 다리를 스스로 불태워버리고 루비콘 강으로 뛰어들게. 퇴로가 완전히 차단된 자만이 세상을 거머쥘 수 있는 폭발적인 힘을 발휘하는 법이라네.",
        "meaning_en": "Once tens of thousands of calculations and agonies have ended, all that remains is bold execution that swallows fear. Burn the bridges behind you yourself and plunge into the Rubicon. Only one whose retreat is completely cut off can unleash the explosive power to grasp the world."
      },
      {
        "quote_ko": "왔노라, 보았노라, 이겼노라.",
        "quote_en": "Veni, vidi, vici.",
        "meaning_ko": "구구절절한 변명이나 미사여구로 자네의 실패를 덮으려 하지 말게. 세상은 과정의 눈물을 알아주지 않는다네. 오직 반박할 수 없는 압도적인 결과와 짧고 굵은 성과로만 증명하게나. 진정한 위대함은 설명이 필요 없는 법일세.",
        "meaning_en": "Do not try to cover your failures with lengthy excuses or flowery rhetoric. The world does not acknowledge the tears of the process. Prove yourself solely through irrefutable, overwhelming results and short, heavy achievements. True greatness requires no explanation."
      },
      {
        "quote_ko": "경험이 모든 것의 스승이다.",
        "quote_en": "Experience is the teacher of all things.",
        "meaning_ko": "책상머리에서 배운 창백한 지식으로 세상을 다 안다고 자만하지 말게. 직접 진흙탕을 뒹굴고, 뼈가 부러지는 실패를 맛보며 육체에 새긴 피 묻은 경험만이, 전쟁 같은 인생에서 자네의 목숨을 구원할 유일하고 진짜 스승이라네.",
        "meaning_en": "Do not arrogantly believe you know the world with pale knowledge learned at a desk. Only the blood-stained experience carved into your flesh through rolling in the mud and tasting bone-breaking failures is your true, only teacher capable of saving your life in this war-like existence."
      }
    ]
  },
  "henry-ford": {
    "era_ko": "19세기 후반 - 20세기 중반 (1863~1947)",
    "era_en": "Late 19th - Mid 20th Century (1863~1947)",
    "category": "business",
    "epic_ko": "20세기 초반, 자동차는 백만장자들이나 탈 수 있는 귀족들의 사치스러운 장난감에 불과했습니다. 미시간주의 가난한 농부의 아들로 태어나 기계 조립의 매력에 빠져 집을 뛰쳐나온 헨리 포드는, 세상을 바꿀 불온한 상상을 품고 있었습니다. \"어떻게 하면 일반 노동자들도 말을 타듯 쉽게 자동차를 소유하게 할 수 있을까?\" 그는 투자자들의 압박과 두 번이나 회사가 파산하는 끔찍한 실패 앞에서도 이 고집스러운 신념을 결코 꺾지 않았습니다.\n\n마침내 1908년, 그는 수백 개의 부품을 표준화하고 군더더기를 모두 빼버린 단단한 쇳덩어리, '모델 T'를 세상에 내놓았습니다. 하지만 진짜 혁명은 자동차 그 자체가 아니었습니다. 도축장의 컨베이어 벨트에서 영감을 얻은 그는, 세계 최초로 '이동식 조립 라인'을 자동차 공장에 도입했습니다. 작업자가 차를 따라다니며 조립하던 방식을 버리고, 컨베이어 벨트가 부품을 작업자 앞으로 가져다주는 이 기상천외한 발상의 전환은 12시간이 걸리던 조립 시간을 단 93분으로 압축해 버렸습니다.\n\n원가가 폭락하자 그는 자동차 가격을 절반으로 후려쳤고, 당시로서는 상상도 할 수 없는 '일당 5달러'라는 파격적인 임금을 노동자들에게 지급했습니다. 경쟁자들은 그가 미쳤다며 파산할 것이라 조롱했지만, 주머니가 두둑해진 포드의 노동자들은 자신이 만든 모델 T를 사기 시작했습니다. 이것은 단순한 산업 혁명이 아니라, 중산층을 탄생시키고 인류의 삶을 말의 속도에서 엔진의 속도로 진화시킨 거대한 사회적 폭발이었습니다. 헨리 포드의 삶은, 대중의 삶을 바꾸겠다는 단 하나의 철학이 어떻게 자본주의의 심장을 완전히 새로 뛰게 만들었는지를 보여주는 강철과 땀의 대서사시입니다.",
    "epic_en": "In the early 20th century, the automobile was merely a luxurious toy for millionaires and nobles. Born the son of a poor farmer in Michigan, Henry Ford ran away from home captivated by the allure of machine assembly, harboring a subversive imagination that would change the world: \"How can I make it so ordinary workers can own a car as easily as they ride a horse?\" Despite the pressure from investors and the horrific failure of his companies going bankrupt twice, he never broke this stubborn conviction.\n\nFinally, in 1908, he released the 'Model T,' a solid block of iron stripped of all frills with hundreds of standardized parts. But the true revolution was not the car itself. Inspired by the conveyor belts in slaughterhouses, he introduced the world's first 'moving assembly line' to an automobile factory. Abandoning the method where workers moved around the car, this bizarre paradigm shift—having the conveyor belt bring parts to the worker—compressed assembly time from 12 hours to a mere 93 minutes.\n\nAs costs plummeted, he slashed the price of the car in half and paid his workers an unprecedented wage of 'Five Dollars a Day,' an unimaginable sum at the time. Competitors mocked him as mad and predicted his bankruptcy, but Ford's workers, with heavy pockets, began buying the very Model Ts they built. This was not a simple industrial revolution; it was a colossal social explosion that birthed the middle class and evolved human life from the speed of a horse to the speed of an engine. Henry Ford's life is an epic of steel and sweat, showing how a single philosophy to change the lives of the masses made the heart of capitalism beat entirely anew.",
    "trials_ko": "가난한 농부의 아들이라는 출신, 투자자들의 비난 속에서 겪은 두 번의 치명적인 사업 파산, 그리고 새로운 조립 라인을 미친 짓이라 조롱하던 세상의 편견.",
    "trials_en": "His background as the son of a poor farmer, two fatal business bankruptcies amidst criticism from investors, and the world's prejudice that mocked his new assembly line as madness.",
    "overcoming_ko": "타협을 거부하는 강박적 신념으로 세계 최초의 컨베이어 벨트(조립 라인)를 고안해 내어, 대량 생산과 고임금 정책으로 중산층을 탄생시키고 자동차 대중화 시대를 엶.",
    "overcoming_en": "With an uncompromising obsessive conviction, he invented the world's first moving assembly line, birthing the middle class through mass production and high-wage policies, thus opening the era of the popularized automobile.",
    "wisdom": [
      {
        "quote_ko": "사람들에게 무엇을 원하느냐고 물었다면, 그들은 '더 빠른 말'이라고 대답했을 것이다.",
        "quote_en": "If I had asked people what they wanted, they would have said faster horses.",
        "meaning_ko": "타인의 평범한 조언과 시장의 여론에 자네의 위대한 비전을 구걸하지 말게. 대중은 자신이 겪어보지 못한 새로운 세상을 상상하지 못하는 법. 혁신은 사람들의 요구를 맞추는 것이 아니라, 자네의 미친 상상력으로 사람들이 원하게 될 미래를 강제로 창조해 내는 것이라네.",
        "meaning_en": "Do not beg for your great vision in the ordinary advice of others and market opinions. The masses cannot imagine a new world they have not yet experienced. Innovation is not meeting people's demands; it is forcibly creating the future people will eventually want through your crazy imagination."
      },
      {
        "quote_ko": "실패는 더 지능적으로 다시 시작할 수 있는 유일한 기회다.",
        "quote_en": "Failure is simply the opportunity to begin again, this time more intelligently.",
        "meaning_ko": "공들인 탑이 무너졌다고 그 자리에 주저앉아 눈물 짜지 말게. 그 참담한 실패야말로 자네가 어디서 실수를 했는지 가장 정확한 엑스레이를 찍어준 위대한 자산이라네. 변명을 멈추고 실패의 잔해 속에서 새로운 부품을 주워 담아 엔진을 다시 설계하게나.",
        "meaning_en": "Do not sit down and squeeze out tears just because the tower you built collapsed. That miserable failure is the greatest asset, taking the most accurate X-ray of where you made a mistake. Stop making excuses, pick up new parts from the wreckage of your failure, and redesign your engine."
      },
      {
        "quote_ko": "스스로 할 수 있다고 생각하든, 할 수 없다고 생각하든, 당신이 옳다.",
        "quote_en": "Whether you think you can, or you think you can't – you're right.",
        "meaning_ko": "세상의 한계는 철저히 자네의 머릿속에서 결정된다네. '안 될 거야'라고 마음먹는 순간 뇌는 멈추고, '반드시 해낸다'고 믿는 순간 온몸의 신경이 길을 찾아내는 법이지. 자네의 신념이 곧 자네의 현실을 창조하는 가장 강력한 설계도임을 잊지 말게.",
        "meaning_en": "The limits of the world are entirely decided within your mind. The moment you decide 'it won't work,' your brain stops; the moment you believe 'I will absolutely do it,' the nerves in your entire body find a way. Forget not that your conviction is the most powerful blueprint creating your reality."
      }
    ]
  },
  "frida-kahlo": {
    "era_ko": "20세기의 거인 (1907~1954)",
    "era_en": "20th Century Giant (1907~1954)",
    "category": "arts",
    "epic_ko": "신의 저주를 받은 듯한 참혹한 육체의 고통 속에서도 눈부신 꽃을 피워낸 멕시코의 야성적인 영혼. 18살의 프리다 칼로는 전차가 버스를 들이받는 끔찍한 척추 관통 사고를 당했습니다. 강철봉이 골반을 부수고 지나간 그녀의 몸은 산산조각 났고, 평생토록 30번이 넘는 지옥 같은 수술을 받으며 전신 깁스에 갇혀 지내야 했습니다. 의사를 꿈꿨던 소녀의 인생이 어두운 침대 위에서 끝나는 듯 보였지만, 그녀는 절망의 심연에서 천장에 달린 거울을 보며 붓을 집어 들었습니다. \"나는 너무나 자주 혼자이기에, 내가 가장 잘 아는 주제인 나 자신을 그린다.\"\n\n그녀의 그림은 현실을 도피하는 아름다운 풍경화가 아니었습니다. 피 흘리는 심장, 못이 박힌 척추, 불임의 슬픔을 화폭 위에 적나라하게 토해냈습니다. 멕시코 벽화 운동의 거장 디에고 리베라와의 결혼은 그녀에게 또 다른 형태의 끔찍한 고통이었습니다. 남편의 끝없는 외도, 심지어 프리다의 친동생과의 불륜은 그녀의 영혼을 갈기갈기 찢어 놓았습니다. 하지만 프리다는 그 배신과 고독마저 강렬한 원색의 물감으로 버무려 자신만의 위대한 자화상으로 캔버스 위에 각인시켰습니다.\n\n죽음이 턱밑까지 다가온 말년, 오른쪽 다리를 절단하는 고통 속에서도 그녀는 진통제를 거부한 채 휠체어를 타고 자신의 첫 개인전 오프닝 파티에 침대째 실려 나타나는 광기를 보여주었습니다. 그녀의 마지막 캔버스에 그려진 수박 단면에는 \"Viva La Vida (인생 만세)\"라는 글귀가 적혀 있었습니다. 프리다 칼로의 삶은 육체의 파멸과 사랑의 배신이라는 잔혹한 운명 앞에서도, 자신의 상처를 피 흘리는 예술로 승화시키며 끝까지 인생을 긍정한 가장 처절하고 매혹적인 불멸의 대서사시입니다.",
    "epic_en": "The wild soul of Mexico, who bloomed dazzling flowers even within horrific bodily torment that seemed like a curse from the gods. At 18, Frida Kahlo suffered a gruesome accident when a streetcar rammed into her bus, impaling her spine. Her body, shattered as an iron handrail pierced her pelvis, confined her to full-body casts and subjected her to over 30 hellish surgeries throughout her life. The life of the girl who dreamed of becoming a doctor seemed to end on a dark bed, but from the abyss of despair, she looked into a mirror mounted on her canopy and picked up a brush. \"I paint self-portraits because I am so often alone, because I am the person I know best.\"\n\nHer paintings were not beautiful landscapes escaping reality. She explicitly spewed bleeding hearts, nailed spines, and the sorrow of infertility onto her canvas. Her marriage to Diego Rivera, the master of the Mexican mural movement, was another form of horrific pain. Her husband's endless infidelities, even an affair with Frida's own younger sister, tore her soul to shreds. Yet, Frida blended that betrayal and solitude with intense, primary-colored paints, etching them onto the canvas as her own magnificent self-portraits.\n\nIn her final years, with death at her doorstep and enduring the agony of having her right leg amputated, she exhibited the madness of arriving at the opening party of her first solo exhibition carried in her bed, refusing painkillers. Carved into the slice of watermelon in her final painting were the words \"Viva La Vida (Long Live Life).\" Frida Kahlo's life is the most desperate, captivating, immortal epic of affirming life to the very end, sublimating her wounds into bleeding art in the face of the cruel fate of bodily destruction and betrayal in love.",
    "trials_ko": "전차 사고로 인한 척추 관통과 평생을 짓누른 육체의 극심한 고통, 거장 디에고 리베라와의 결혼에서 겪은 수차례의 불륜과 참혹한 정신적 배신.",
    "trials_en": "The extreme bodily torment from a spine-impaling streetcar accident that crushed her her entire life, and the horrific emotional betrayal and infidelities endured in her marriage to Diego Rivera.",
    "overcoming_ko": "전신 깁스에 묶인 절망 속에서 천장에 거울을 달고 자신을 그리기 시작했으며, 육체적/정신적 상처를 숨기지 않고 가장 강렬하고 초현실적인 예술 작품으로 승화시킴.",
    "overcoming_en": "Confined in full-body casts in despair, she hung a mirror on the ceiling and began painting herself, not hiding her physical and mental wounds but sublimating them into the most intense, surreal works of art.",
    "wisdom": [
      {
        "quote_ko": "발이 왜 필요하겠어, 나에겐 날아갈 날개가 있는데.",
        "quote_en": "Feet, what do I need you for when I have wings to fly?",
        "meaning_ko": "자네가 잃어버린 것들, 부서진 조건들에 얽매여 세상 탓만 하며 침대에 누워있지 말게. 다리가 잘려 나갔다면 영혼의 날개를 펼쳐 날아오르면 그만인 것을. 가장 잔혹한 신체적, 환경적 결핍이야말로 자네만의 독창적인 비상을 만들어낼 가장 강력한 엔진이라네.",
        "meaning_en": "Do not lie in bed blaming the world, bound by the things you have lost and the broken conditions you suffer. If your legs have been cut off, simply unfold the wings of your soul and soar. The cruelest physical and environmental deficiencies are the most powerful engines that will create your unique flight."
      },
      {
        "quote_ko": "나는 아픈 것이 아니라 부서진 것이다. 하지만 그림을 그릴 수 있는 한 나는 살아있다.",
        "quote_en": "I am not sick. I am broken. But I am happy to be alive as long as I can paint.",
        "meaning_ko": "삶이 자네를 무참히 짓밟아 뼛조각 하나 남지 않게 부서졌다고 생각될 때, 그 핏빛 고통을 억누르지 말고 캔버스든 종이든 세상에 토해내게나. 자네의 상처를 정면으로 응시하고 예술과 일로 승화시키는 순간, 부서진 파편들은 가장 찬란한 보석이 될 테니.",
        "meaning_en": "When life ruthlessly tramples you to the point where you feel broken without a single bone left intact, do not suppress that blood-red pain; spew it out onto the world, whether on a canvas or paper. The moment you face your wounds head-on and sublimate them into art or work, the broken fragments will become the most radiant jewels."
      },
      {
        "quote_ko": "가장 견디기 힘든 것은 고통 그 자체가 아니라, 그 고통의 무의미함이다. 나의 고통은 예술이 되었다.",
        "quote_en": "The most difficult thing is not the pain itself, but the meaninglessness of the pain. My pain has become art.",
        "meaning_ko": "세상의 배신과 고독 앞에서 타인을 저주하느라 에너지를 낭비하지 말게. 그 저주를 거두어들여 강렬한 물감으로 버무리고 자네만의 위대한 자화상을 그리게나. 상처 입은 자네의 민낯을 부끄러워하지 않는 자만이 세상을 압도하는 매력을 갖는 법일세.",
        "meaning_en": "Do not waste energy cursing others in the face of the world's betrayal and solitude. Reel in those curses, mix them with intense colors, and paint your own magnificent self-portrait. Only the one who is not ashamed of their wounded bare face possesses a charm that overwhelms the world."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected rewritten giants (6-10) into final-narratives.json');
