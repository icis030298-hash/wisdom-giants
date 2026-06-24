const fs = require('fs');

const dataToInject = {
  "diogenes": {
    "era_ko": "기원전 4세기의 거인 (BC 412?~323)",
    "era_en": "4th Century BC Giant (412?~323 BC)",
    "category": "philosophy",
    "epic_ko": "시노페의 은행가 아들로 태어난 디오게네스는, 부유한 어린 시절을 뒤로하고 화폐를 위조했다는 죄목으로 쫓겨나 텅 빈 주머니로 아테네에 도착했습니다. 당시 아테네는 거대한 제국의 부와 철학이 넘쳐나던 곳이었지만, 그가 보기에 사람들은 재물과 명예, 쓸데없는 예의범절에 목을 매는 노예에 불과했습니다. 그는 안티스테네스의 문하에 들어가면서, 인간을 억압하는 모든 가짜 가치들을 철저히 파괴하기로 결심합니다. 그는 집 대신 길거리의 버려진 커다란 와인 통 속에 들어가 살았고, 망토 한 벌과 지팡이, 그리고 빵을 담을 수 있는 작은 배낭 하나가 전 재산의 전부였습니다. 그조차도 한 소년이 손으로 물을 떠 마시는 것을 보고, 유일한 사치품이었던 나무 컵마저 내던져버렸습니다.\n\n그는 개(Kyon)처럼 자유롭고 뻔뻔하게 살아간다고 하여 '견유학파(Cynicism)'라 불렸습니다. 시장 한복판에서 밥을 먹고, 태양 아래 뒹굴며, 권력자들을 서슴없이 조롱했습니다. 어느 날 대낮에 등불을 켜고 아테네 거리를 헤집고 다니자 사람들이 이유를 물었습니다. \"나는 진짜 '인간'을 찾고 있는데, 온통 욕망의 노예들뿐이구나.\" 그의 삶 자체가 가식으로 점철된 문명사회를 향한 거대한 퍼포먼스이자 통렬한 철학적 일격이었습니다.\n\n그의 위대함은 세상을 호령하던 알렉산드로스 대왕과의 만남에서 절정에 달합니다. 세계의 정복자가 통증에 누워 햇볕을 쬐던 거지 철학자에게 다가와 \"무엇이든 소원을 말해보라\"고 했을 때, 그는 귀찮은 듯 답했습니다. \"내가 바라는 것은 단 하나, 당신이 내 햇빛을 가리지 않는 것뿐이오.\" 천하를 다 가진 대왕은 수치심이 아닌 경외감을 느끼며 \"내가 알렉산드로스가 아니었다면 디오게네스가 되고 싶었을 것이다\"라며 물러났습니다. 그의 삶은 인간이 세상의 모든 욕망과 껍데기를 벗어던졌을 때 비로소 진정한 자유와 제왕조차 부러워할 압도적인 권위를 얻게 됨을 보여준 기상천외한 대서사시입니다.",
    "epic_en": "Born the son of a banker in Sinope, Diogenes left his wealthy childhood behind after being exiled for counterfeiting currency, arriving in Athens with empty pockets. Athens at the time was overflowing with the wealth and philosophy of a vast empire, yet to him, the people were mere slaves, obsessing over riches, honor, and meaningless etiquette. Entering the tutelage of Antisthenes, he resolved to utterly destroy all the fake values that oppressed humanity. Instead of a house, he lived in a large, discarded wine barrel on the street; his entire worldly possessions consisted of a single cloak, a walking stick, and a small knapsack for bread. He even threw away his wooden cup—his only luxury—after seeing a boy drink water from his cupped hands.\n\nHe was known as the founder of 'Cynicism' (from the Greek word 'kyon', meaning dog) because he lived as freely and shamelessly as a dog. He ate in the middle of the marketplace, rolled around in the sun, and unhesitatingly mocked the powerful. When people asked why he was walking through the streets of Athens in broad daylight carrying a lit lantern, he replied, \"I am looking for a true 'human being', but I see only slaves to desire.\" His very life was a colossal performance and a scathing philosophical strike against a civilized society riddled with hypocrisy.\n\nHis greatness reached its zenith in his encounter with Alexander the Great, who commanded the world. When the conqueror of the world approached the beggar philosopher basking in the sun and offered, \"Ask of me whatever you wish,\" Diogenes replied with annoyed indifference: \"I desire only one thing: stand a little out of my sun.\" Feeling awe rather than humiliation, the king who possessed the world withdrew, remarking, \"If I were not Alexander, I would wish to be Diogenes.\" His life is a bizarre yet magnificent epic proving that only when humanity strips away all desires and superficial husks can one attain true freedom and an overwhelming authority that even emperors envy.",
    "trials_ko": "추방자 신분으로 겪어야 했던 극심한 가난과, 상식을 뒤엎는 기행으로 인해 쏟아지는 아테네 사람들의 끝없는 조롱과 멸시.",
    "trials_en": "The extreme poverty he endured as an exile, and the endless mockery and contempt poured upon him by the Athenians due to his eccentric behavior that overturned common sense.",
    "overcoming_ko": "가난과 수치를 철학적 무기로 삼아 세상의 모든 관습을 유쾌하게 조롱했으며, 무소유의 삶을 통해 물질적 욕망으로부터 완벽하게 해방된 내면의 절대적 자유를 이룩함.",
    "overcoming_en": "He weaponized poverty and shame to cheerfully mock all worldly conventions, achieving absolute inner freedom perfectly liberated from material desires through a life of non-possession.",
    "wisdom": [
      {
        "quote_ko": "내가 바라는 것은 단 하나, 당신이 내 햇빛을 가리지 않는 것뿐이오.",
        "quote_en": "Stand a little out of my sun.",
        "meaning_ko": "세상의 화려한 권력과 물질에 주눅 들지 마십시오. 당신이 스스로 원하지 않는다면, 세상의 그 어떤 거대한 힘도 당신의 내면을 지배할 수 없습니다. 진정한 자유는 잃을 것이 아무것도 없을 때 비로소 시작됩니다.",
        "meaning_en": "Do not be intimidated by the world's flashy power and material wealth. If you do not desire it yourself, no colossal force in the world can dominate your inner self. True freedom begins only when you have absolutely nothing left to lose."
      },
      {
        "quote_ko": "욕망을 적게 가질수록, 우리는 신에 더 가까워진다.",
        "quote_en": "It is the privilege of the gods to want nothing, and of godlike men to want little.",
        "meaning_ko": "행복은 당신의 가방에 얼마나 많은 것을 구겨 넣느냐가 아니라, 얼마나 많은 불필요한 짐을 덜어내느냐에 달려 있습니다. 채울 수 없는 허기를 벗어던지고, 지금 당신에게 주어진 소박한 햇볕 한 줌에 온전히 만족하십시오.",
        "meaning_en": "Happiness does not depend on how much you can cram into your bag, but on how much unnecessary baggage you can unload. Throw off your insatiable hunger, and be fully content with the simple handful of sunlight given to you right now."
      },
      {
        "quote_ko": "가장 큰 부자는 가장 적게 필요한 사람이다.",
        "quote_en": "He has the most who is most content with the least.",
        "meaning_ko": "세상의 기준에 맞춰 더 크고 더 비싼 것을 소유하려 발버둥 치지 마십시오. 더 이상 세상에 바랄 것이 없을 때, 당신은 비로소 세상의 주인이 됩니다.",
        "meaning_en": "Do not struggle to own bigger and more expensive things to fit the world's standards. When you no longer desire anything from the world, you finally become the master of the world."
      }
    ]
  },
  "james-hutton": {
    "era_ko": "18세기 계몽주의 시대 (1726~1797)",
    "era_en": "18th Century Enlightenment (1726~1797)",
    "category": "science",
    "epic_ko": "18세기, 사람들은 지구가 성경의 창세기 기록에 따라 불과 기원전 4004년에 창조되었으며, 대홍수와 같은 몇 번의 거대한 재앙으로 지금의 지형이 한순간에 깎여 나갔다고 굳게 믿고 있었습니다. 의사이자 법률가, 그리고 성공한 농업가였던 제임스 허튼은, 스코틀랜드의 비바람 치는 들판을 거닐며 땅이 들려주는 이야기에 조용히 귀를 기울였습니다. 그는 농장에서 비에 씻겨 내려가는 흙, 강바닥에 쌓이는 모래, 그리고 스코틀랜드 해안가에 노출된 기묘한 지층의 단면들을 수십 년간 집요하게 관찰했습니다.\n\n그는 눈에 보이는 작은 변화들이 수백만 년이라는 압도적인 시간 동안 쌓일 때, 거대한 산맥을 융기시키고 깊은 계곡을 파낼 수 있다는 사실을 직관적으로 깨달았습니다. 1788년, 그가 시카 포인트(Siccar Point)의 바닷가 절벽에서 수직으로 세워진 고대 지층 위에 수평으로 쌓인 붉은 사암층을 발견했을 때, 그것은 지구의 나이가 성경의 기록과 달리 상상할 수 없을 만큼 깊고 거대하다는 사실을 증명하는 결정적 증거였습니다. 그는 과거를 아는 열쇠는 바로 현재 일어나고 있는 자연의 법칙(동일과정설)에 있다고 선포했습니다.\n\n\"우리는 시작의 흔적도, 끝의 전망도 찾을 수 없다.\" 그의 이 위대한 통찰은 당시 학계와 종교계에 거대한 충격파를 던졌습니다. 하지만 그의 난해한 문장력과 기성세대의 엄청난 비난 탓에 살아서는 큰 빛을 보지 못했습니다. 그러나 허튼이 열어젖힌 '깊은 시간(Deep Time)'이라는 거대한 무대는 찰스 라이엘을 거쳐 찰스 다윈의 진화론이 싹틀 수 있는 거대한 사상적 온상이 되었습니다. 제임스 허튼의 삶은 성경의 짧은 시간관에 갇혀있던 인류의 시야를 수십억 년의 장엄한 지질 시대로 끌어올린 지성사의 위대한 지각 변동이었습니다.",
    "epic_en": "In the 18th century, people firmly believed that the Earth was created a mere 4004 BC according to the biblical Genesis, and that its current topography was carved out instantly by a few massive catastrophes like the Great Flood. James Hutton, a physician, lawyer, and successful agriculturist, listened quietly to the stories the land told as he wandered the windswept fields of Scotland. For decades, he relentlessly observed the soil washed away by rain on his farm, the sand accumulating in riverbeds, and the cross-sections of bizarre rock formations exposed along the Scottish coast.\n\nHe intuitively realized that when these small, visible changes accumulate over the overwhelming span of millions of years, they possess the power to uplift massive mountain ranges and carve out deep valleys. In 1788, when he discovered at Siccar Point a sea cliff where horizontal layers of red sandstone lay upon vertically tilted ancient strata, it was the definitive proof that the Earth's age was unimaginably deep and vast, contrary to biblical records. He proclaimed that the key to understanding the past lies in the very laws of nature operating in the present (Uniformitarianism).\n\n\"We find no vestige of a beginning, no prospect of an end.\" This monumental insight sent a colossal shockwave through the academic and religious communities of his time. However, due to his difficult writing style and the immense criticism from the establishment, he did not see great acclaim during his lifetime. Yet, the massive stage of 'Deep Time' that Hutton forced open became the grand ideological hotbed—passed through Charles Lyell—upon which Charles Darwin's theory of evolution could sprout. James Hutton's life was a great tectonic shift in intellectual history, elevating humanity's vision from the short timeframe of the Bible to the majestic billions of years of geologic time.",
    "trials_ko": "지구의 나이를 불과 6천 년으로 규정하던 당시 사회의 절대적인 종교적 도그마, 그리고 자신의 파격적인 학설에 쏟아진 주류 학계의 거센 비난과 외면.",
    "trials_en": "The absolute religious dogma of a society that defined the Earth's age as a mere 6,000 years, and the fierce criticism and marginalization from the mainstream academic world directed at his radical theories.",
    "overcoming_ko": "종교적 편견에 굴복하지 않고 수십 년간 스코틀랜드 전역의 지층을 직접 관찰하고 발로 뛰어 얻어낸 명백한 지질학적 증거(시카 포인트)로 근대 지질학의 기틀을 완성함.",
    "overcoming_en": "Refusing to bow to religious prejudice, he established the foundation of modern geology using undeniable geological evidence (Siccar Point) gathered through decades of direct observation and fieldwork across Scotland.",
    "wisdom": [
      {
        "quote_ko": "과거를 이해하는 열쇠는 현재에 있다.",
        "quote_en": "The present is the key to the past.",
        "meaning_ko": "먼 미래의 거창한 결과를 상상하며 허황된 꿈을 꾸지 마십시오. 당신의 위대한 내일은 오직 당신이 '오늘 하루' 반복하는 아주 작은 습관과 행동들 속에 숨어 있습니다. 현재의 작은 물방울이 모여 바위를 뚫는 법입니다.",
        "meaning_en": "Do not dream vain dreams imagining grandiose results in the distant future. Your great tomorrow is hidden only in the tiny habits and actions you repeat 'today'. It is the present's small drops of water accumulating that eventually pierce through rock."
      },
      {
        "quote_ko": "우리는 시작의 흔적도, 끝의 전망도 찾을 수 없다.",
        "quote_en": "We find no vestige of a beginning, no prospect of an end.",
        "meaning_ko": "세상에 영원히 변하지 않는 것은 없습니다. 눈앞의 실패로 세상이 끝난 것처럼 절망하거나, 오늘의 성공이 영원할 것이라 자만하지 마십시오. 인생은 정지된 화면이 아니라 끝없이 변화하는 거대한 흐름임을 받아들이십시오.",
        "meaning_en": "There is nothing in the world that remains eternally unchanged. Do not despair as if the world has ended due to a failure before you, nor become arrogant believing today's success will last forever. Accept that life is not a frozen frame, but a colossal, endlessly changing flow."
      },
      {
        "quote_ko": "자연의 힘은 느리지만 멈추지 않고 거대한 산을 깎아낸다.",
        "quote_en": "The powers of nature are slow, but unceasing, and they wear down the great mountains.",
        "meaning_ko": "조급함은 일을 망치는 지름길입니다. 하루아침에 세상을 바꾸려 하지 마십시오. 올바른 방향을 잡았다면 느리더라도 절대 멈추지 마십시오. 당신의 그 우직한 꾸준함이 훗날 가장 거대한 산맥을 융기시킬 것입니다.",
        "meaning_en": "Impatience is a shortcut to ruin. Do not try to change the world overnight. If you have set the right direction, never stop, no matter how slow you are. That steadfast persistence of yours will one day uplift the most colossal mountain ranges."
      }
    ]
  },
  "queen-elizabeth-i": {
    "era_ko": "16세기의 거인 (1533~1603)",
    "era_en": "16th Century Giant (1533~1603)",
    "category": "leadership",
    "epic_ko": "런던 탑의 차가운 돌벽 아래서, 한 소녀는 목숨이 오가는 공포 속에서 숨을 죽이고 자라야 했습니다. 엘리자베스의 유년기는 피비린내 나는 참극의 연속이었습니다. 아버지가 어머니 앤 불린을 참수했고, 가톨릭 지지자인 이복언니 메리 1세가 왕위에 오르자 개신교도였던 엘리자베스는 언제 단두대로 끌려갈지 모르는 죄수 신세로 유폐되었습니다. 그녀가 배운 가장 큰 지혜는 살아남기 위해 철저히 자신의 속내를 숨기고, 감정을 통제하며, 적들 사이에서 균형을 타는 법이었습니다. 마침내 25세의 나이로 잉글랜드의 왕관을 썼을 때, 그녀가 물려받은 것은 종교 갈등으로 반토막이 나고 스페인과 프랑스라는 거대 강대국에 짓눌린 가난하고 위태로운 섬나라였습니다.\n\n하지만 엘리자베스는 이 약소국을 인류 역사상 가장 위대한 제국으로 탈바꿈시켰습니다. 그녀는 종교적 극단주의자들을 배척하고 잉글랜드 국교회라는 절묘한 타협점을 찾아 피비린내 나는 종교 전쟁의 불씨를 껐습니다. 유럽의 수많은 왕과 귀족들이 구애해 왔지만, 그녀는 자신의 결혼을 외교 카드로만 교묘하게 활용할 뿐 끝내 독신을 고집하며 \"나는 이미 잉글랜드와 결혼했다\"라고 선언했습니다. 1588년, 당대 최강이었던 스페인의 '무적함대(아르마다)'가 잉글랜드를 집어삼키기 위해 몰려왔을 때, 그녀는 투구를 쓰고 병사들 앞에 서서 \"나는 연약하고 가녀린 여자의 몸을 가졌으나, 왕의 심장과 담력을 가졌다\"고 사자후를 토해냈습니다.\n\n바다의 날씨와 해적 출신의 제독들을 활용한 신출귀몰한 전술로 스페인의 무적함대를 바닷속에 수장시켰을 때, 잉글랜드는 변방의 섬나라에서 세계의 바다를 지배하는 해상 제국으로 도약했습니다. 그녀의 치세 아래 셰익스피어의 희곡이 무대에 오르고 동인도 회사가 세워지며 경제와 문화는 역사상 가장 찬란하게 꽃피웠습니다. 엘리자베스 1세의 45년은 끝없는 암살 위협과 국가적 파멸의 위기를 압도적인 카리스마와 지독할 만큼 냉철한 이성으로 돌파해 낸, 튜더 왕조를 황금기로 이끈 불멸의 대서사시입니다.",
    "epic_en": "Beneath the cold stone walls of the Tower of London, a young girl had to grow up holding her breath in terror, her life constantly hanging in the balance. Elizabeth's childhood was a continuous bloody tragedy. Her father beheaded her mother, Anne Boleyn, and when her Catholic half-sister Mary I ascended to the throne, the Protestant Elizabeth was imprisoned as a captive, never knowing when she might be dragged to the guillotine. The greatest wisdom she learned was how to thoroughly hide her true intentions, control her emotions, and walk a tightrope among her enemies merely to survive. When she finally donned the crown of England at the age of 25, what she inherited was a poor, precarious island nation ripped in half by religious conflict and crushed under the weight of superpowers like Spain and France.\n\nHowever, Elizabeth transformed this weak nation into the greatest empire in human history. She rejected religious extremists and found a brilliant middle ground with the Church of England, extinguishing the embers of a bloody religious war. Though courted by countless European kings and nobles, she cunningly used her marriage prospects solely as a diplomatic card, steadfastly remaining single and declaring, \"I am already married to England.\" In 1588, when the Spanish 'Invincible Armada'—the greatest power of the age—swept in to swallow England, she donned armor, stood before her troops, and roared like a lioness: \"I know I have the body but of a weak and feeble woman; but I have the heart and stomach of a king.\"\n\nBy leveraging the sea's unpredictable weather and utilizing elusive tactics with admirals of pirate origins, she sank the Spanish Armada to the bottom of the ocean, catapulting England from a peripheral island to a maritime empire ruling the world's seas. Under her reign, Shakespeare's plays graced the stage, the East India Company was founded, and the economy and culture bloomed more brilliantly than ever before. The 45 years of Elizabeth I's reign is an immortal epic of steering the Tudor dynasty into a Golden Age, piercing through endless assassination threats and crises of national ruin with overwhelming charisma and fiercely cold reason.",
    "trials_ko": "유년기의 투옥과 단두대의 공포, 종교 갈등으로 분열된 국가, 끊임없는 암살 위협, 그리고 당대 세계 최강국이었던 스페인 무적함대의 침공.",
    "trials_en": "Imprisonment in her youth and the terror of the guillotine, a nation divided by religious conflict, constant assassination threats, and the massive invasion by the Spanish Armada, the world's greatest power at the time.",
    "overcoming_ko": "철저한 감정 통제와 뛰어난 외교적 줄타기로 국가를 통합했으며, 리더십과 뛰어난 해상 전술로 무적함대를 격파하여 잉글랜드를 세계의 패권국으로 우뚝 세움.",
    "overcoming_en": "She united the nation through meticulous emotional control and brilliant diplomatic tightrope walking, and elevated England to a global hegemon by defeating the Invincible Armada with leadership and superior naval tactics.",
    "wisdom": [
      {
        "quote_ko": "나는 연약하고 가녀린 여자의 몸을 가졌으나, 왕의 심장과 담력을 가졌다.",
        "quote_en": "I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king.",
        "meaning_ko": "세상이 정해놓은 신체적, 환경적 한계를 핑계로 물러서지 마십시오. 거대한 위기 앞에서 당신을 지켜주는 것은 겉으로 보이는 조건이 아니라, 절대로 물러서지 않겠다는 내면의 야성과 강철 같은 담력입니다.",
        "meaning_en": "Do not step back using physical or environmental limitations set by the world as an excuse. In the face of a colossal crisis, what protects you is not your outward conditions, but your inner wildness and an iron-willed nerve that refuses to yield."
      },
      {
        "quote_ko": "나는 사람들의 마음속에 창문을 만들고 싶지 않다.",
        "quote_en": "I have no desire to make windows into men's souls.",
        "meaning_ko": "자신과 생각이 다르다고 해서 타인의 내면까지 통제하고 억압하려 들지 마십시오. 진정한 포용의 리더십은 다름을 심판하는 것이 아니라, 서로 다른 생각들을 국가와 조직의 목표 아래 하나로 묶어내는 유연함에 있습니다.",
        "meaning_en": "Do not attempt to control and oppress the inner souls of others just because they think differently from you. True, inclusive leadership lies not in judging differences, but in the flexibility to bind diverse thoughts together under the goals of the nation or organization."
      },
      {
        "quote_ko": "화를 내는 것은 나의 이성을 흐리게 할 뿐, 문제를 해결해주지 않는다.",
        "quote_en": "Anger makes dull men witty, but it keeps them poor.",
        "meaning_ko": "감정의 소용돌이에 휘말릴 때 당신이 가진 가장 날카로운 무기인 이성이 무뎌집니다. 적 앞에서는 결코 속내를 드러내지 마십시오. 분노를 삼키고 머리를 차갑게 식힐 때, 당신은 승리할 수 있는 가장 완벽한 체스판을 짤 수 있습니다.",
        "meaning_en": "When caught in a vortex of emotion, your sharpest weapon—your reason—is blunted. Never reveal your true feelings before an enemy. Swallow your anger and cool your head; only then can you arrange the most perfect chessboard for victory."
      }
    ]
  },
  "ernest-shackleton": {
    "era_ko": "19세기 말 - 20세기 초 (1874~1922)",
    "era_en": "Late 19th - Early 20th Century (1874~1922)",
    "category": "business",
    "epic_ko": "인류가 아직 닿지 못한 미지의 대륙 남극. 아문센이 먼저 남극점을 정복하자, 어니스트 섀클턴은 인류 최초의 '남극 대륙 횡단'이라는 더 원대하고 미친 꿈을 꾸었습니다. 1914년, 그는 27명의 대원과 함께 인듀어런스(Endurance)호를 타고 살을 에이는 얼음 바다로 향했습니다. 그러나 목적지를 불과 160km 남겨두고 바다의 거대한 유빙들이 배를 포위해버렸습니다. 영하 50도의 칠흑 같은 극야가 찾아오고, 얼음의 압력에 배는 결국 산산조각 나며 심해로 가라앉았습니다. 목적 달성은커녕, 세상과 완전히 단절된 채 거대한 얼음 위에서 혹독한 추위와 굶주림에 맞서 싸워야 하는 절대적인 절망, 그것이 섀클턴이 마주한 잔혹한 현실이었습니다.\n\n\"배는 사라졌지만, 이제 우리의 목표는 살아남아 집으로 돌아가는 것이다.\" 절망의 심연에서 그는 무너지지 않았습니다. 대원들이 공포와 미치광이 같은 절망에 빠지지 않게 하려고 그는 매일 밤 일과를 정해 축구를 하고 노래를 부르게 했습니다. 언제 갈라질지 모르는 살얼음판 위에서 물개와 펭귄을 잡아먹으며 버티던 그들은, 마침내 얼음이 녹자 세 척의 작은 구명보트에 몸을 싣고 폭풍이 몰아치는 바다로 나섰습니다. 무인도인 엘리펀트 섬에 간신히 도착했지만, 구조의 희망은 없었습니다.\n\n섀클턴은 구조선을 부르기 위해 가장 튼튼한 대원 5명을 뽑아, 불과 7미터짜리 돛단배에 목숨을 걸고 남극의 미친 파도를 뚫고 1,300km 떨어진 사우스조지아 섬으로 향하는 불가능한 항해를 시작했습니다. 허리케인급 폭풍과 거대한 파도를 뚫고 간신히 섬에 닿은 후에도, 구조를 요청하기 위해 얼음 덮인 미지의 산맥을 맨몸으로 넘어 포경기지에 도착했습니다. 조난당한 지 무려 634일 만의 일이었습니다. 그는 구조선을 끌고 엘리펀트 섬으로 돌아갔고, 남아있던 22명의 대원들을 단 한 명의 희생자 없이 100% 생환시켰습니다. 탐험의 목적은 철저히 실패했지만, 절대적인 절망 속에서 대원들을 끝까지 포기하지 않고 지켜낸 그의 위대한 실패는 성공보다 아름다운 불멸의 리더십 서사시로 남았습니다.",
    "epic_en": "Antarctica, the unknown continent humanity had yet to fully touch. After Amundsen conquered the South Pole first, Ernest Shackleton dreamed a grander, crazier dream: the first 'trans-Antarctic expedition.' In 1914, he and 27 crew members set sail for the biting icy seas aboard the Endurance. However, just 160 km from their destination, massive pack ice surrounded and trapped the ship. As the pitch-black polar night of minus 50 degrees descended, the crushing pressure of the ice finally splintered the ship, sending it into the abyss. Far from achieving their goal, they faced the absolute despair of being entirely cut off from the world, battling brutal cold and starvation on a giant ice floe—this was the cruel reality Shackleton confronted.\n\n\"The ship and the stores have gone—so now we'll go home.\" In the abyss of despair, he did not break. To prevent his crew from falling into terror and maddening despair, he established daily routines, organizing soccer matches and sing-alongs every night. Surviving on a cracking ice floe by eating seals and penguins, they finally boarded three small lifeboats when the ice melted, venturing into the stormy seas. They barely reached the uninhabited Elephant Island, but there was no hope of rescue.\n\nTo summon a rescue ship, Shackleton selected his five strongest men and embarked on an impossible voyage. Risking their lives in a mere 7-meter sailboat, they smashed through the maddening waves of the Antarctic Ocean to reach South Georgia Island, 1,300 km away. Even after barely reaching the island through hurricane-force storms and colossal waves, they had to cross an unmapped, ice-covered mountain range on foot to reach a whaling station and beg for rescue. It had been 634 grueling days since they were stranded. He returned to Elephant Island with a rescue ship, bringing all 22 remaining crew members home with a 100% survival rate and not a single casualty. Though the expedition completely failed its objective, his great failure—protecting and refusing to abandon his crew in the face of absolute despair—remains an immortal epic of leadership, far more beautiful than success.",
    "trials_ko": "탐험선의 침몰로 영하 50도의 빙해 한가운데 고립되었으며, 구조의 가능성이 제로에 가까운 절대적인 추위, 굶주림, 그리고 절망감.",
    "trials_en": "Isolated in the middle of a frozen sea at minus 50 degrees due to the sinking of their ship, facing absolute cold, starvation, and a sense of despair with near-zero possibility of rescue.",
    "overcoming_ko": "결코 포기하지 않는 강인한 긍정주의와 희생정신으로 소형 보트를 타고 1,300km의 죽음의 바다를 건너 634일 만에 단 한 명의 희생자 없이 대원 전원을 생환시킴.",
    "overcoming_en": "With an unyielding optimism and spirit of sacrifice, he crossed 1,300 km of deadly seas in a small boat, bringing his entire crew back alive without a single casualty after 634 days.",
    "wisdom": [
      {
        "quote_ko": "우리는 어려움 속에서도 별을 본다.",
        "quote_en": "By endurance we conquer.",
        "meaning_ko": "사방이 칠흑 같은 절망으로 가로막혀 있을지라도, 고개를 떨구지 마십시오. 당신이 포기하지 않는 한 하늘에는 반드시 희망의 별이 반짝이고 있습니다. 끝까지 버텨내는 자만이 결국 운명의 폭풍을 이겨낼 수 있습니다.",
        "meaning_en": "Even if you are blocked on all sides by pitch-black despair, do not lower your head. As long as you do not give up, a star of hope is surely twinkling in the sky. Only those who endure to the very end can ultimately conquer the storms of fate."
      },
      {
        "quote_ko": "리더의 가장 위대한 자질은 공포 속에서도 절망을 허락하지 않는 것이다.",
        "quote_en": "A leader's greatest quality is to never allow despair, even in the midst of terror.",
        "meaning_ko": "당신의 조직이나 가정이 위기에 빠졌을 때, 가장 먼저 무너지지 말아야 할 사람은 바로 당신입니다. 당신의 단호한 눈빛 하나가 절망에 빠진 이들의 심장을 다시 뛰게 하는 유일한 구명보트입니다.",
        "meaning_en": "When your organization or family falls into a crisis, you are the one person who must not collapse first. Your single resolute gaze is the only lifeboat that can make the hearts of those drowning in despair beat once again."
      },
      {
        "quote_ko": "위대한 실패는 이기적인 성공보다 영원하다.",
        "quote_en": "A great failure is more eternal than a selfish success.",
        "meaning_ko": "원하는 목표를 이루지 못했다고 해서 인생이 끝난 것은 아닙니다. 실패의 나락 속에서도 인간으로서의 존엄을 지키고 주변 사람들을 품어낼 때, 그 과정 자체가 당신의 인생을 증명하는 가장 위대한 성취가 됩니다.",
        "meaning_en": "Just because you failed to achieve your desired goal does not mean your life is over. When you maintain your human dignity and embrace the people around you even in the abyss of failure, that process itself becomes the greatest achievement, proving the worth of your life."
      }
    ]
  },
  "dorothea-dix": {
    "era_ko": "19세기의 거인 (1802~1887)",
    "era_en": "19th Century Giant (1802~1887)",
    "category": "society",
    "epic_ko": "19세기 중반의 미국, 사회의 가장 어두운 지하실에는 짐승보다 못한 취급을 받으며 사슬에 묶여 신음하는 사람들이 있었습니다. 바로 정신 질환자들이었습니다. 그들은 아픈 환자가 아니라 영혼이 타락한 범죄자 취급을 받았고, 얼어붙은 감옥의 어둠 속에서 오물과 함께 방치되어 있었습니다. 보스턴의 부유한 가정에서 자라 평온한 학교 선생님으로 살아가던 도로시아 딕스의 운명은, 우연히 이스트 케임브리지 교도소에서 주일 학교를 가르치러 갔던 그 날 영원히 바뀌었습니다. 얼어붙는 겨울, 난방도 없는 더러운 감방에 쇠사슬로 묶여 덜덜 떨고 있는 정신 질환자들의 참상을 목격한 순간, 그녀의 심장 속에는 거대한 분노와 사명감이 불타올랐습니다.\n\n그녀는 즉시 안락한 삶을 내던지고 미국 전역의 감옥과 빈민 수용소를 뒤지기 시작했습니다. 여성의 외부 활동이 엄격히 제한되던 시대에, 그녀는 홀로 마차를 타고 수만 마일을 이동하며 지옥 같은 수용소들의 실태를 낱낱이 기록했습니다. 쇠사슬에 묶인 채 채찍질을 당하고 굶주려 죽어가는 수천 명의 참상을 기록한 그녀의 거대한 보고서는 매사추세츠 주 의회에 던져졌습니다. 정치인들은 불편한 진실을 외면하려 했으나, 팩트와 피눈물로 쓰인 그녀의 날카로운 웅변 앞에서는 무릎을 꿇을 수밖에 없었습니다.\n\n딕스의 지독한 투쟁은 단지 한 주의 법을 바꾸는 데 그치지 않았습니다. 그녀는 미국 전역은 물론 유럽과 일본까지 건너가 정치인들과 왕들을 설득했고, 그 결과 전 세계에 30개가 넘는 인도적인 정신 병원이 세워졌습니다. 남북 전쟁 중에는 북군 간호원 총책임자로 임명되어 수많은 병사들의 생명을 구하기도 했습니다. 권력도, 막대한 부도 없었던 한 여성이 오직 '고통받는 자들에 대한 숭고한 연민'과 '불굴의 행동력' 하나로 인류의 인권 역사에 거대한 빛을 쏘아 올린, 기적과도 같은 위대한 사랑의 대서사시입니다.",
    "epic_en": "In mid-19th century America, in the darkest basements of society, lay people chained and groaning, treated worse than animals. These were the mentally ill. They were not viewed as sick patients, but as criminals with corrupted souls, left to languish in filth and darkness within freezing prisons. The destiny of Dorothea Dix, who grew up in a wealthy Boston family and lived a peaceful life as a school teacher, was forever altered the day she volunteered to teach Sunday school at the East Cambridge Jail. The moment she witnessed the horrors of the mentally ill, shivering in chains within filthy, unheated cells during the freezing winter, a massive fire of righteous anger and calling erupted in her heart.\n\nShe immediately cast aside her comfortable life and began investigating prisons and almshouses across the United States. In an era when women's public activities were strictly restricted, she traveled tens of thousands of miles alone by carriage, meticulously documenting the hellish realities of these institutions. Her massive report—recording the horrors of thousands chained, whipped, and starving to death—was hurled before the Massachusetts state legislature. Politicians attempted to turn a blind eye to the inconvenient truth, but they were forced to their knees before her sharp oratory, written in facts and tears of blood.\n\nDix's fierce struggle did not stop at changing the laws of a single state. She crossed not only the United States but traveled to Europe and Japan, persuading politicians and kings. As a result, over 30 humane psychiatric hospitals were established worldwide. During the Civil War, she was appointed Superintendent of Army Nurses for the Union, saving the lives of countless soldiers. Having neither power nor immense wealth, a single woman launched a colossal light into the history of human rights armed only with a 'sublime compassion for the suffering' and an 'indomitable drive for action.' It is a miraculous, grand epic of great love.",
    "trials_ko": "여성의 사회 참여가 제한되었던 시대적 편견, 그리고 사회가 외면하려 했던 정신 질환자들의 끔찍한 실태를 폭로하며 겪은 기득권의 저항과 육체적 피로.",
    "trials_en": "The societal prejudice of an era that restricted women's public participation, and the resistance from the establishment—along with severe physical exhaustion—she faced while exposing the horrific realities of the mentally ill that society wished to ignore.",
    "overcoming_ko": "엄청난 거리를 직접 이동하며 철저한 현장 조사와 팩트(기록)를 무기로 의회를 설득했고, 미국을 넘어 전 세계에 30개가 넘는 정신 병원 건립을 이끌어냄.",
    "overcoming_en": "She traveled immense distances to conduct thorough field research, weaponizing facts and documentation to persuade legislatures, ultimately leading to the construction of over 30 psychiatric hospitals across the U.S. and around the world.",
    "wisdom": [
      {
        "quote_ko": "할 일이 너무나 많은 세상에서, 나 역시 해야 할 무언가가 반드시 있을 것이라는 강렬한 느낌을 받았습니다.",
        "quote_en": "In a world where there is so much to be done, I felt strongly impressed that there must be something for me to do.",
        "meaning_ko": "거창한 성공을 쫓기 전에, 당신의 마음을 아프게 하는 세상의 모순을 응시하십시오. 누군가의 고통을 외면하지 않고 \"내가 무엇을 할 수 있을까?\"라고 묻는 순간, 당신의 인생은 가장 위대한 사명을 향해 방향을 틀게 됩니다.",
        "meaning_en": "Before chasing grandiose success, stare at the contradictions of the world that ache your heart. The moment you refuse to turn away from someone's suffering and ask, 'What can I do?', your life pivots toward its greatest calling."
      },
      {
        "quote_ko": "잘못된 것을 보고도 침묵하는 것은, 그 잘못에 동조하는 것과 같다.",
        "quote_en": "To remain silent when you see a wrong is to become complicit in it.",
        "meaning_ko": "불의와 부조리 앞에서 눈을 감고 모른 척하지 마십시오. 당신의 침묵은 가해자에게 던져주는 암묵적인 허락입니다. 부당함에 맞서 소리를 내는 그 작은 용기가 세상을 바꾸는 첫 번째 불꽃입니다.",
        "meaning_en": "Do not close your eyes and pretend ignorance in the face of injustice and absurdity. Your silence is an implicit permission handed to the perpetrator. The small courage to speak out against injustice is the first spark that changes the world."
      },
      {
        "quote_ko": "권력은 지위에서 나오는 것이 아니라, 지치지 않는 헌신에서 나온다.",
        "quote_en": "Power comes not from position, but from tireless dedication.",
        "meaning_ko": "세상을 바꾸기 위해 대단한 직함이나 막대한 돈이 필요하다는 핑계를 대지 마십시오. 오직 팩트를 손에 쥐고 지치지 않고 문을 두드리는 지독한 집념만이 굳게 닫힌 세상의 문을 부수고 열어젖힙니다.",
        "meaning_en": "Do not make the excuse that you need a grand title or immense wealth to change the world. Only a fierce obsession, armed with facts and tirelessly knocking on doors, can smash open the tightly shut doors of the world."
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
