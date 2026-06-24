const fs = require('fs');

const dataToInject = {
  "charlemagne": {
    "era_ko": "8~9세기의 거인 (742~814)",
    "era_en": "8th-9th Century Giant (742~814)",
    "category": "leadership",
    "epic_ko": "로마 제국이 무너지고 어둠이 드리운 중세 초기의 유럽, 야만과 혼돈이 지배하던 대지 위에 한 거인이 일어섰습니다. 샤를마뉴, 피핀의 아들로 태어난 그는 분열된 프랑크 왕국을 물려받았을 때 결코 평탄한 길을 걷지 않았습니다. 그의 앞에는 밖으로는 색슨족의 끊임없는 침략과 이슬람 제국의 위협이, 안으로는 권력을 노리는 반역의 불씨가 도사리고 있었습니다. 매일 밤 피비린내 나는 전장에 서야 했고, 형제와의 권력 투쟁 속에서 철저한 고독과 배신을 견뎌야만 했습니다. 그의 젊은 시절은 생존을 위한 처절한 몸부림 그 자체였습니다.\n\n그러나 그는 단순히 무력으로 세상을 정복하려 하지 않았습니다. 샤를마뉴는 검을 들어 제국의 영토를 넓히는 동시에, 펜과 책을 들어 야만적인 시대에 빛을 가져왔습니다. 그는 흩어진 지식인들을 궁정으로 불러 모아 라틴어 문법을 통일하고, 쇠락해가던 학문과 예술의 불씨를 되살리는 '카롤링거 르네상스'를 이룩했습니다. 글을 읽지 못했던 그 자신이 밤마다 베개 밑에 석판을 두고 글을 연습했던 일화는, 무지가 지배하던 시대에 앎을 향한 그의 치열한 갈망을 보여줍니다.\n\n서기 800년의 크리스마스, 성 베드로 대성당에서 교황으로부터 서로마 제국 황제의 관을 받았을 때, 그는 비로소 서로마 멸망 이후 300년 동안 분열되었던 서유럽을 하나로 묶어낸 진정한 대제가 되었습니다. 하지만 영광의 정점에서도 그는 결코 오만하지 않았으며, 제국 전역에 관리를 파견해 가난한 자와 과부들이 억울한 일을 당하지 않도록 법과 정의를 바로 세웠습니다. 그의 삶은 무력으로 세운 제국 위에 문화와 교육이라는 영원한 기둥을 박아넣은 거대한 서사시였으며, 오늘날 그가 '유럽의 아버지'로 불리는 이유는 칼날이 아닌 지혜로 세상을 통일했기 때문입니다.",
    "epic_en": "In the early Middle Ages, when the shadow of Rome's fall plunged Europe into darkness and chaos, a giant arose upon the fractured continent. Charlemagne, born to Pepin the Short, inherited a divided Frankish kingdom and walked a path fraught with peril. Before him lay the relentless invasions of the Saxons, the looming threat of the Islamic empire, and the treacherous whispers of rebellion within his own court. He spent his days in blood-soaked battlefields and his nights navigating the profound isolation of power and the bitter rivalry with his brother. His youth was a desperate struggle for survival.\n\nYet, Charlemagne did not seek to conquer the world with the sword alone. As he expanded the borders of his empire, he championed the pen and the book to bring light to a barbaric age. He gathered the greatest minds of his time to his court, standardized Latin grammar, and ignited the 'Carolingian Renaissance'—reviving the dying embers of scholarship and art. The legend of the illiterate king keeping a slate under his pillow to practice writing in the dead of night stands as a monumental testament to his fierce thirst for knowledge in an era ruled by ignorance.\n\nOn Christmas Day in the year 800, when he was crowned Emperor of the Romans at St. Peter's Basilica, he finally united Western Europe for the first time in three centuries. But even at the pinnacle of his glory, he remained steadfast in his duty, dispatching emissaries across the empire to ensure that the poor and the marginalized were protected by law and justice. His life was a grand epic that hammered the eternal pillars of culture and education into an empire built by force. Today, he is remembered as the 'Father of Europe' not for the lands he conquered, but for the light he restored to the world.",
    "trials_ko": "형제 카를로만과의 피 말리는 권력 투쟁과 제국의 분열 위기, 그리고 평생에 걸쳐 멈추지 않았던 수많은 이민족들의 침략과 전쟁.",
    "trials_en": "The bitter power struggle with his brother Carloman, the constant threat of a fractured empire, and a lifetime of unending wars against relentless foreign invasions.",
    "overcoming_ko": "강력한 군사력으로 영토를 통일함과 동시에, 학문과 법률을 정비하여 피비린내 나는 폭력이 아닌 '문화와 제도'로 다민족 제국을 하나로 결속시켰습니다.",
    "overcoming_en": "He united the territories through formidable military might, while simultaneously establishing a cohesive multi-ethnic empire not merely through violence, but by cultivating law, culture, and standardized education.",
    "wisdom": [
      {
        "quote_ko": "올바른 행동이 지식보다 낫다. 그러나 올바른 일을 하려면 무엇이 올바른지 알아야 한다.",
        "quote_en": "Right action is better than knowledge; but in order to do what is right, we must know what is right.",
        "meaning_ko": "지식의 궁극적인 목적은 머릿속에 머무는 것이 아니라 실천에 있습니다. 하지만 무엇이 옳은지 치열하게 고민하고 배우지 않는다면 당신의 행동은 길을 잃을 것입니다. 배움과 실천의 수레바퀴를 멈추지 마십시오.",
        "meaning_en": "The ultimate purpose of knowledge is not to remain in the mind, but to manifest in action. Yet, if you do not fiercely seek to understand what is true and just, your actions will wander aimlessly. Never stop the wheel of learning and doing."
      },
      {
        "quote_ko": "또 다른 언어를 갖는 것은 두 번째 영혼을 소유하는 것과 같다.",
        "quote_en": "To have another language is to possess a second soul.",
        "meaning_ko": "당신의 세계는 당신이 이해하는 언어의 크기만큼만 넓어집니다. 낯선 것을 배척하지 말고 기꺼이 배우십시오. 타인의 관점을 이해하려는 노력은 당신의 영혼을 두 배로 크고 단단하게 만들어 줄 것입니다.",
        "meaning_en": "Your world is only as large as the language you comprehend. Do not reject the unfamiliar, but embrace it willingly. The effort to understand another's perspective will double the size and strength of your soul."
      },
      {
        "quote_ko": "검을 통치하는 자는 법 아래에 머물러야 한다.",
        "quote_en": "He who rules by the sword must remain under the law.",
        "meaning_ko": "힘과 권력이 당신에게 주어졌을 때, 그것을 통제하는 것은 당신 내면의 엄격한 원칙이어야 합니다. 진정한 리더는 스스로 세운 규칙에 가장 먼저 복종하는 법입니다. 힘에 취하지 마십시오.",
        "meaning_en": "When power and might are granted to you, they must be governed by your strict internal principles. A true leader is the first to submit to the rules they establish. Do not become intoxicated by power."
      }
    ]
  },
  "pachacuti": {
    "era_ko": "15세기의 거인 (1418~1471)",
    "era_en": "15th Century Giant (1418~1471)",
    "category": "leadership",
    "epic_ko": "안데스 산맥의 험준한 골짜기, 거대한 폭풍이 몰아치던 쿠스코 왕국에서 한 전설이 태어났습니다. 왕자 시절 쿠시 유판키라 불렸던 파차쿠티의 초기 삶은 위태로운 시련의 연속이었습니다. 잔혹한 찬카족 대군이 쿠스코를 쳐들어왔을 때, 나약했던 그의 아버지와 후계자인 형은 도망쳐버렸습니다. 왕국이 불타고 백성들이 절망의 비명을 지르는 순간, 모두가 끝이라고 생각했던 그곳에 그가 남았습니다. 그는 절망 대신 칼을 움켜쥐었고, 흩어진 병사들을 규합하여 압도적인 찬카족 대군과 맞섰습니다. 그의 사자후는 겁에 질린 병사들의 심장을 깨웠고, 결국 기적적인 승리를 쟁취해냈습니다. 이 전투는 쿠스코를 구했을 뿐만 아니라, 그를 '세상을 변화시키는 자', 파차쿠티로 거듭나게 했습니다.\n\n왕좌에 오른 파차쿠티는 작은 부족 국가에 불과했던 쿠스코를 역사상 가장 위대한 제국 중 하나인 잉카 제국(타완틴수유)으로 탈바꿈시켰습니다. 그는 단순한 정복자가 아니라 위대한 건축가이자 행정가였습니다. 그의 명령 아래 거대한 산맥을 깎아 테라스식 농경지를 만들고, 수천 킬로미터에 달하는 잉카의 도로망이 깔렸습니다. 하늘에 맞닿은 구름 위의 도시 마추픽추 또한 그의 웅장한 비전에서 탄생했습니다. 그는 산과 계곡의 파편들을 모아 하나의 거대한 태양의 제국으로 조각해낸 예술가였습니다.\n\n정복된 부족들에게 그는 공포의 대상이자 동시에 자비로운 아버지였습니다. 무력으로 제압한 후에는 그들의 문화를 존중하고, 제국의 풍요로운 곡물 창고를 열어 굶주림을 해결해 주었습니다. 케추아어를 제국의 공용어로 지정하여 수백 개의 언어로 분열된 대륙을 소통하게 만들었습니다. 파차쿠티의 삶은 절체절명의 위기 속에서 뒤로 물러서지 않은 한 인간의 용기가 어떻게 역사의 흐름을 뒤바꾸고, 거대한 문명을 대지에 뿌리내리게 할 수 있는지를 보여주는 눈부신 대서사시입니다.",
    "epic_en": "In the rugged valleys of the Andes, amidst a great storm brewing over the Kingdom of Cusco, a legend was born. Known in his youth as Cusi Yupanqui, Pachacuti's early life was a succession of perilous trials. When the fearsome Chanca army marched upon Cusco, his frail father and the heir apparent abandoned the city and fled. As the kingdom faced annihilation and his people cried out in despair, he chose to remain where everyone else saw only the end. Grasping his sword instead of despair, he rallied the scattered defenders to face the overwhelming Chanca horde. His roar awakened the hearts of terrified soldiers, securing a miraculous victory. This battle did not merely save Cusco; it forged him into Pachacuti—'He who overturns space and time.'\n\nUpon taking the throne, Pachacuti transformed the modest Kingdom of Cusco into the Inca Empire (Tawantinsuyu), one of the greatest empires in history. He was not merely a conqueror, but a visionary architect and administrator. Under his command, the colossal mountains were carved into terraced farms, and a sprawling network of Inca roads spanning thousands of kilometers was laid. The city above the clouds, Machu Picchu, was born of his magnificent vision. He was an artist who gathered the fragments of mountains and valleys to sculpt a colossal Empire of the Sun.\n\nTo the conquered tribes, he was both a terrifying force and a benevolent father. After subduing them, he respected their cultures and opened the empire's abundant granaries to end their starvation. By decreeing Quechua as the lingua franca, he enabled a continent divided by hundreds of dialects to communicate. Pachacuti's life is a dazzling epic showing how the courage of one man, refusing to step back in the face of absolute ruin, can alter the course of history and root a monumental civilization into the earth.",
    "trials_ko": "국가가 멸망할 절체절명의 위기 속에서 아버지를 포함한 왕실의 버림을 받고, 절대적으로 불리한 병력으로 적군에 맞서야 했던 절망적인 상황.",
    "trials_en": "Abandoned by the royal family, including his own father, during an existential crisis of the state, and forced to face an overwhelming enemy army with severely disadvantaged forces.",
    "overcoming_ko": "도망치는 대신 죽음을 각오하고 전선의 맨 앞에 서서 병사들을 규합하는 압도적인 리더십으로 기적적인 승리를 이끌어내고 왕좌를 차지함.",
    "overcoming_en": "Instead of fleeing, he stood at the very front of the battle line, risking his life to rally his troops. His overwhelming leadership led to a miraculous victory and secured his place on the throne.",
    "wisdom": [
      {
        "quote_ko": "고귀하고 용기 있는 자는 역경 속에서 보여주는 인내심으로 알 수 있다.",
        "quote_en": "The noble and courageous man is known by the patience he shows in adversity.",
        "meaning_ko": "진정한 용기는 평온한 시기가 아니라, 사방이 무너져 내리는 절망 속에서 피어납니다. 모두가 도망치려 할 때 그 자리를 굳건히 지켜내십시오. 그 버텨내는 인내의 시간이 당신을 거인으로 만들 것입니다.",
        "meaning_en": "True courage blooms not in times of peace, but in the despair when everything around you collapses. When everyone else attempts to flee, stand your ground firmly. That time of enduring patience will forge you into a giant."
      },
      {
        "quote_ko": "세상을 뒤바꾸고 싶다면, 먼저 너 자신의 두려움부터 뒤바꿔라.",
        "quote_en": "If you wish to overturn the world, first overturn your own fear.",
        "meaning_ko": "바깥 세상의 거대한 적보다 더 무서운 것은 당신 내면의 두려움입니다. 실패할 것이라는 확신을 깨부술 때, 비로소 세상을 재창조할 수 있는 지혜와 에너지가 솟아납니다.",
        "meaning_en": "More terrifying than the colossal enemies of the outside world is the fear within you. Only when you shatter the conviction that you will fail does the wisdom and energy to recreate the world spring forth."
      },
      {
        "quote_ko": "태양의 빛이 모든 계곡을 비추듯, 리더의 시선은 가장 낮은 자를 향해야 한다.",
        "quote_en": "Just as the light of the sun illuminates all valleys, a leader's gaze must fall upon the lowest among us.",
        "meaning_ko": "성공의 정점에 섰을 때 홀로 빛나려 하지 마십시오. 당신이 가진 성취와 자원을 주변과 나누고, 가장 낮은 곳에 있는 자들의 굶주림을 살필 때 당신의 제국은 흔들리지 않을 것입니다.",
        "meaning_en": "When you stand at the pinnacle of success, do not seek to shine alone. Your empire will remain unshakable only when you share your achievements and resources, attending to the hunger of those at the lowest depths."
      }
    ]
  },
  "akbar-the-great": {
    "era_ko": "16세기의 거인 (1542~1605)",
    "era_en": "16th Century Giant (1542~1605)",
    "category": "leadership",
    "epic_ko": "사막의 모래바람이 불어오던 1542년, 쫓겨난 망명객 신세의 아버지를 둔 악바르는 거친 피난길에서 태어났습니다. 위대한 무굴 제국의 황통을 이었지만, 그의 유년기는 화려한 황궁이 아닌 흙먼지 날리는 전장과 친척들의 암살 위협으로 얼룩져 있었습니다. 13살이라는 어린 나이에 아버지가 급사하며 왕좌에 올랐을 때, 무굴 제국은 멸망의 벼랑 끝에 서 있었습니다. 반란군이 수도를 위협했고, 어린 소년 황제는 허수아비로 전락할 운명처럼 보였습니다. 하지만 악바르의 내면에는 조상들의 야성과 폭풍 같은 의지가 잠들어 있었습니다.\n\n그는 무기력한 꼭두각시가 되는 대신, 직접 칼을 들고 전장을 지휘하며 자신을 위협하는 섭정들과 반란군을 무자비하게 진압했습니다. 반대를 무력으로 잠재우고 북인도 전체를 정복한 그는 역사상 가장 강력한 군주로 우뚝 섰습니다. 그러나 악바르의 진정한 위대함은 정복의 피비린내가 걷힌 후에 피어났습니다. 그는 칼이 영토를 넓힐 수는 있어도 사람의 마음을 지배할 수는 없다는 깊은 통찰을 깨달았습니다. 소수파인 이슬람 교도 황제로서 다수의 힌두교도를 지배해야 하는 현실 속에서, 그는 억압 대신 파격적인 '관용'을 선택했습니다.\n\n그는 이교도에게 부과되던 세금인 지즈야를 폐지했고, 힌두교 공주와 결혼하여 서로 다른 문화를 피로 섞었으며, 모든 종교의 학자들을 이바다트 카나(예배의 집)로 불러 모아 밤새도록 진리를 토론하게 했습니다. 그는 자신이 글을 읽지 못하는 문맹이었음에도 불구하고 세상의 모든 지식을 경청하고 수용하는 가장 열린 귀를 가졌습니다. 종교와 혈통을 초월하여 능력만으로 인재를 등용한 그의 통치 아래, 무굴 제국은 전례 없는 문화적 르네상스와 경제적 번영을 누렸습니다. 악바르 대제의 삶은 칼로 세상을 정복한 영웅이 어떻게 관용과 화합이라는 지혜를 통해 진정한 대제(The Great)로 진화하는가를 보여주는 인류 역사의 위대한 대서사시입니다.",
    "epic_en": "In 1542, amidst the desert sandstorms, Akbar was born on a harsh trail of exile to an ousted father. Though he carried the bloodline of the great Mughal Empire, his childhood was not spent in a magnificent palace, but stained by dusty battlefields and assassination threats from his own relatives. When his father died suddenly, propelling him to the throne at the tender age of thirteen, the Mughal Empire stood on the brink of collapse. Rebels threatened the capital, and the young emperor seemed destined to be a mere puppet. Yet, within Akbar slumbered the wild spirit and tempestuous will of his ancestors.\n\nInstead of becoming a powerless figurehead, he took up the sword himself, commanded the battlefields, and ruthlessly crushed the regents and rebels who threatened him. Having silenced opposition with force and conquered all of Northern India, he stood tall as one of history's most powerful monarchs. But Akbar's true greatness blossomed after the stench of conquest had faded. He gained the profound insight that while the sword can expand territories, it can never rule the hearts of people. Ruling as a minority Muslim emperor over a vast Hindu majority, he chose radical 'tolerance' over oppression.\n\nHe abolished the jizya—the tax levied on non-Muslims—married a Hindu princess to blend differing cultures through blood, and gathered scholars of all faiths to the Ibadat Khana (House of Worship) to debate the ultimate truth late into the night. Despite being illiterate himself, he possessed the most open ears, listening to and absorbing the wisdom of the world. By promoting talent based solely on merit, transcending religion and lineage, the Mughal Empire enjoyed an unprecedented cultural renaissance and economic prosperity under his rule. Akbar the Great's life is a magnificent epic in human history, illustrating how a hero who conquers the world with a blade evolves into a true Great through the wisdom of tolerance and harmony.",
    "trials_ko": "13세의 어린 나이에 왕위에 올라 섭정의 꼭두각시가 될 위기에 처했으며, 반란과 끊임없는 암살 위협 속에서 분열된 제국을 물려받음.",
    "trials_en": "Ascending the throne at the tender age of 13, he faced the risk of becoming a regent's puppet, inheriting a fractured empire amidst rebellions and constant threats of assassination.",
    "overcoming_ko": "뛰어난 군사적 재능으로 반란을 무자비하게 진압하여 제국을 평정하고, 이후 파격적인 종교적 관용과 문화 융합 정책을 펼쳐 제국의 황금기를 이룩함.",
    "overcoming_en": "He pacified the empire by ruthlessly crushing rebellions with exceptional military genius, and subsequently established a golden age through unprecedented policies of religious tolerance and cultural fusion.",
    "wisdom": [
      {
        "quote_ko": "모든 사람들과 좋은 관계를 유지하는 것이 나의 의무이다.",
        "quote_en": "It is my duty to be in good understanding with all men.",
        "meaning_ko": "진정한 권력은 타인을 짓누르는 데서 오는 것이 아니라, 다름을 포용하는 데서 나옵니다. 적을 만들지 않고 서로 다른 생각들을 하나로 모으는 포용력이 당신을 흔들리지 않는 위치로 이끌 것입니다.",
        "meaning_en": "True power does not come from crushing others, but from embracing differences. The magnanimity to unite disparate thoughts without making enemies will elevate you to an unshakeable position."
      },
      {
        "quote_ko": "참된 진리는 하나의 신앙에 독점될 수 없다.",
        "quote_en": "True truth cannot be monopolized by a single faith.",
        "meaning_ko": "당신의 지식과 신념만이 절대적으로 옳다는 오만을 버리십시오. 다양한 관점을 기꺼이 수용하고 경청하는 겸손함이야말로 더 크고 깊은 진리로 나아가는 유일한 길입니다.",
        "meaning_en": "Discard the arrogance that your knowledge and beliefs alone are absolutely right. The humility to willingly accept and listen to diverse perspectives is the only path to greater, deeper truths."
      },
      {
        "quote_ko": "행위의 위대함은 목적의 순수성에 달려 있다.",
        "quote_en": "The greatness of an action lies in the purity of its purpose.",
        "meaning_ko": "어떤 일을 성취하려거든 그 동기를 먼저 점검하십시오. 사사로운 이익이 아닌, 타인과 세상에 이로움을 주겠다는 순수한 목적을 가질 때 당신의 행동은 거대한 파급력을 갖게 될 것입니다.",
        "meaning_en": "Before you seek to achieve anything, examine your motives first. When your purpose is pure—aimed not at selfish gain but at benefiting others and the world—your actions will carry immense ripple effects."
      }
    ]
  },
  "queen-nzinga": {
    "era_ko": "17세기의 거인 (1583~1663)",
    "era_en": "17th Century Giant (1583~1663)",
    "category": "leadership",
    "epic_ko": "노예선의 사슬 소리가 아프리카 대륙을 공포로 몰아넣던 17세기, 앙골라 지역의 은동고 왕국에서 한 전설적인 여인이 등장했습니다. 은징가는 평탄한 왕족의 길을 걷지 못했습니다. 그녀의 아버지가 죽고 권력을 탐한 오빠가 왕위에 오르자, 그녀는 오빠로부터 아들을 살해당하는 끔찍한 비극을 겪어야만 했습니다. 서구 열강인 포르투갈이 무자비한 무력으로 왕국을 침략하고 백성들을 노예로 끌고 가는 절망적인 상황 속에서, 무능했던 오빠는 결국 스스로 목숨을 끊었습니다. 철저히 부서진 왕국과 절망에 빠진 백성들, 그것이 은징가가 여왕으로 즉위하며 물려받은 차가운 왕좌였습니다.\n\n그러나 은징가는 슬픔에 주저앉지 않고 강철 같은 의지로 일어섰습니다. 포르투갈 총독과의 협상 자리에 불려 갔을 때, 총독이 그녀를 무시하며 의자를 내어주지 않자 그녀의 시녀가 엎드려 인간 의자가 되어주었던 일화는 그녀의 굽히지 않는 자존심과 위엄을 보여주는 상징적인 사건입니다. 그녀는 침략자들과 대등하게 맞서기 위해 스스로 기독교 세례를 받는 외교적 유연성을 보였으나, 그들이 노예 사냥을 멈추지 않자 주저 없이 검을 뽑았습니다. 그녀는 숲의 그림자 속으로 숨어들어 게릴라 전술의 대가가 되었고, 스스로 군복을 입고 환갑이 넘은 나이에도 전장의 맨 앞에서 군대를 지휘했습니다.\n\n포르투갈의 압도적인 화력 앞에서도 은징가는 마탐바 왕국이라는 새로운 거점을 세우고, 네덜란드와 동맹을 맺는 등 탁월한 국제 외교술로 적을 농락했습니다. 무려 40년이라는 끈질긴 세월 동안, 그녀는 포르투갈 제국주의에 맞서는 아프리카 저항의 불멸의 상징이 되었습니다. 백성을 지키기 위해 군주이자 전사, 그리고 외교관으로서 모든 것을 불태운 그녀의 삶은, 자유를 향한 불굴의 투지가 제국의 포성조차 잠재울 수 있음을 증명한 위대한 자유의 대서사시입니다.",
    "epic_en": "In the 17th century, when the clanking chains of slave ships struck terror across the African continent, a legendary woman emerged from the Ndongo kingdom in present-day Angola. Nzinga did not walk a smooth royal path. When her father died and her power-hungry brother took the throne, she endured the horrific tragedy of having her son murdered by him. As the Western power of Portugal invaded the kingdom with ruthless force, dragging its people into slavery, her incompetent brother eventually took his own life. A utterly broken kingdom and a people drowning in despair—this was the cold throne Nzinga inherited as she was crowned Queen.\n\nHowever, Nzinga did not succumb to sorrow; she rose with a will of steel. During a negotiation with the Portuguese governor, when he insulted her by refusing to offer a chair, her maidservant knelt to become a human throne for her. This iconic event demonstrated her unbending pride and dignity. To stand as an equal against the invaders, she displayed diplomatic flexibility by converting to Christianity. Yet, when they refused to halt their slave raids, she drew her sword without hesitation. Slipping into the shadows of the forest, she became a master of guerrilla warfare, donning battle armor and leading her army from the frontlines even in her sixties.\n\nFacing the overwhelming firepower of the Portuguese, Nzinga established a new stronghold in the Kingdom of Matamba and manipulated her enemies with brilliant international diplomacy, even forging an alliance with the Dutch. For forty grueling years, she became the immortal symbol of African resistance against Portuguese imperialism. Her life—burning everything she had as a monarch, warrior, and diplomat to protect her people—is a great epic of liberty, proving that an indomitable will for freedom can silence even the cannons of an empire.",
    "trials_ko": "권력 투쟁 속에서 친오빠에게 아들을 잃는 끔찍한 비극과, 강력한 화기로 무장한 포르투갈 제국주의의 무자비한 노예 사냥과 침략.",
    "trials_en": "The horrific tragedy of losing her son to her own brother in a power struggle, coupled with the ruthless slave raids and invasions by the heavily armed Portuguese imperialists.",
    "overcoming_ko": "여성의 몸으로 환갑이 넘어서까지 직접 전장을 지휘하며 40년간 끈질긴 게릴라전과 탁월한 외교술을 펼쳐 포르투갈의 침략을 막아내고 백성들의 자유를 수호함.",
    "overcoming_en": "Leading from the front lines even into her sixties, she waged a relentless 40-year guerrilla war and deployed brilliant diplomacy to repel Portuguese invasions and defend her people's freedom.",
    "wisdom": [
      {
        "quote_ko": "정복당한 자만이 공물을 바칠 뿐, 내 백성은 자유롭다.",
        "quote_en": "Only the conquered pay tribute, and my people are free.",
        "meaning_ko": "당신의 자존심과 가치는 타인이 허락하는 것이 아니라 스스로 선언하는 것입니다. 부당한 요구에 고개 숙이지 말고, 당신의 자유와 존엄을 위해 당당히 맞서 싸우십시오.",
        "meaning_en": "Your pride and value are not granted by others, but declared by yourself. Do not bow to unjust demands; stand tall and fight fiercely for your freedom and dignity."
      },
      {
        "quote_ko": "강자 앞에서 의자가 없다면, 스스로 의자를 만들어라.",
        "quote_en": "If there is no chair before the powerful, make your own.",
        "meaning_ko": "세상이 당신을 무시하고 기회를 주지 않는다고 불평하지 마십시오. 압도적인 역경 속에서도 창의력과 기지를 발휘하여 스스로 당신이 앉을 자격을 증명해내야 합니다.",
        "meaning_en": "Do not complain that the world ignores you and denies you opportunities. Even amidst overwhelming adversity, use your creativity and wit to prove that you have earned the right to take your seat."
      },
      {
        "quote_ko": "칼을 피할 수 없다면, 적의 칼등 위에 서는 법을 배워라.",
        "quote_en": "If you cannot avoid the sword, learn to stand upon its blunt edge.",
        "meaning_ko": "절대적으로 불리한 싸움에서는 정면 돌파만이 답이 아닙니다. 때로는 유연하게 굽히고, 때로는 적의 힘을 역이용하는 지혜로운 전술만이 당신의 사람들을 지켜낼 수 있습니다.",
        "meaning_en": "In an absolutely disadvantaged fight, a frontal assault is not the only answer. Sometimes, only the wise tactic of flexibly yielding and leveraging the enemy's strength against them can protect your people."
      }
    ]
  },
  "epicurus": {
    "era_ko": "고대 헬레니즘 시대 (BC 341~270)",
    "era_en": "Ancient Hellenistic Era (341~270 BC)",
    "category": "philosophy",
    "epic_ko": "알렉산드로스 대왕의 거대한 제국이 무너지고 헬레니즘 세계가 끊임없는 전쟁과 정치적 혼란에 휩싸이던 시대. 아테네의 권력 다툼과 신에 대한 공포로 민중의 삶이 피폐해져 갈 때, 사모스 섬 출신의 한 사상가가 조용히 역사의 무대에 등장했습니다. 에피쿠로스는 정치적 성공이나 세속적인 권력이 인간을 구원할 수 있다고 믿지 않았습니다. 그는 인간의 영혼을 갉아먹는 진짜 적은 '채울 수 없는 욕망'과 '죽음과 신에 대한 근거 없는 공포'라고 꿰뚫어 보았습니다.\n\n그는 아테네 외곽에 '정원(The Garden)'이라는 작고 소박한 공동체를 세웠습니다. 당시 철학 학교들이 귀족과 남성들만의 전유물이었던 것과 달리, 그의 정원에는 노예, 여성, 매춘부를 막론하고 평안을 갈구하는 모든 이들에게 문이 활짝 열려 있었습니다. 이곳에서 그는 사람들에게 진짜 행복을 가르쳤습니다. 화려한 연회나 엄청난 부가 아니라, 보리빵 한 조각과 맑은 물, 그리고 뜻이 맞는 벗들과의 진실한 대화만으로도 인간은 완벽한 평정심, 즉 '아타락시아(Ataraxia)'에 도달할 수 있음을 몸소 증명해 보였습니다.\n\n에피쿠로스는 세상을 구성하는 것은 원자와 허공뿐이며, 죽음은 단순히 원자가 흩어지는 현상일 뿐이므로 두려워할 이유가 없다고 가르쳤습니다. 말년에 그는 극심한 신장 결석의 고통에 시달렸지만, 제자들에게 보내는 편지에서는 과거에 나눴던 철학적 대화의 기쁨이 육체의 고통을 덮어버리고 남는다고 썼습니다. 그의 철학은 방탕한 쾌락주의로 오해받기도 했지만, 실상 그의 삶은 욕망의 노예가 된 인류에게 어떻게 스스로를 구원하고 내면의 평화를 찾을 수 있는지 알려준 철학적 투쟁의 대서사시였습니다.",
    "epic_en": "In an era when Alexander the Great's colossal empire had crumbled and the Hellenistic world was engulfed in ceaseless war and political turmoil. As the lives of the people withered under the power struggles of Athens and the terrifying dread of the gods, a thinker from the island of Samos quietly stepped onto the stage of history. Epicurus did not believe that political success or worldly power could save humanity. He pierced through the illusion, realizing that the true enemies gnawing at the human soul were 'insatiable desire' and 'groundless fear of death and the gods.'\n\nOn the outskirts of Athens, he founded a small, modest community known simply as 'The Garden'. Unlike the philosophical schools of the time, which were the exclusive domain of aristocratic men, the gates of his Garden were thrown wide open to all who thirsted for peace—regardless of whether they were slaves, women, or outcasts. Here, he taught the people true happiness. He proved through his own life that perfect tranquility—'Ataraxia'—is not reached through lavish banquets or immense wealth, but can be attained with a piece of barley bread, clear water, and earnest conversation with like-minded friends.\n\nEpicurus taught that the universe consists only of atoms and the void, and that death is merely the scattering of atoms—leaving nothing to be feared. In his final days, though tormented by the agonizing pain of kidney stones, he wrote in a letter to his disciples that the memory of their past philosophical discussions brought him a joy that completely eclipsed his physical agony. Though his philosophy was later misunderstood as debauched hedonism, his life was, in truth, a magnificent epic of philosophical struggle, teaching an enslaved humanity how to save themselves and discover profound inner peace.",
    "trials_ko": "지독한 질병(신장 결석)으로 인한 육체적 고통, 그리고 당대 주류 철학계의 배척과 그의 철학을 방탕한 쾌락주의로 왜곡하는 세간의 오해.",
    "trials_en": "The severe physical agony caused by kidney stones, the rejection by the mainstream philosophical establishment of his time, and the public misunderstanding that distorted his teachings into debauched hedonism.",
    "overcoming_ko": "소박한 식사와 우정이라는 정신적 기쁨으로 육체의 고통을 완전히 극복했으며, 죽음의 순간까지도 평정심(아타락시아)을 유지하며 제자들을 가르침.",
    "overcoming_en": "He completely overcame physical pain through the spiritual joy of simple meals and deep friendship, maintaining perfect tranquility (Ataraxia) and continuing to teach his disciples until his dying breath.",
    "wisdom": [
      {
        "quote_ko": "가지지 못한 것을 욕망하느라 가진 것을 망치지 마십시오. 당신이 지금 가진 것은 한때 당신이 그토록 바라기만 했던 것임을 기억하십시오.",
        "quote_en": "Do not spoil what you have by desiring what you have not; remember that what you now have was once among the things you only hoped for.",
        "meaning_ko": "채워도 채워지지 않는 결핍에 시달리고 있습니까? 당신의 시선을 '없는 것'에서 '이미 곁에 있는 것'으로 돌리십시오. 소박한 일상의 가치를 온전히 음미할 때 내면의 평화가 시작됩니다.",
        "meaning_en": "Are you suffering from a deficiency that cannot be filled? Shift your gaze from 'what is lacking' to 'what is already beside you'. Inner peace begins the moment you fully savor the value of your simple, everyday life."
      },
      {
        "quote_ko": "죽음은 우리에게 아무것도 아니다. 우리가 존재하는 한 죽음은 오지 않았으며, 죽음이 왔을 때 우리는 이미 존재하지 않기 때문이다.",
        "quote_en": "Death is nothing to us. When we exist, death is not; and when death exists, we are not.",
        "meaning_ko": "다가오지 않은 미래의 두려움 때문에 현재의 소중한 시간을 낭비하지 마십시오. 죽음에 대한 공포를 내려놓고, 지금 숨 쉬고 밥을 먹으며 사랑하는 이 순간의 기쁨에 집중하십시오.",
        "meaning_en": "Do not waste your precious present agonizing over a fear of a future that has not yet arrived. Let go of your terror of death, and focus completely on the joy of this moment—breathing, eating, and loving here and now."
      },
      {
        "quote_ko": "모든 철학적 탐구는 영혼의 고통을 덜어주지 못한다면 공허한 것이다.",
        "quote_en": "Empty is the argument of the philosopher which does not relieve any human suffering.",
        "meaning_ko": "공허한 지식의 나열이나 쓸데없는 논쟁에 에너지를 쏟지 마십시오. 당신이 배우는 모든 지혜와 철학은 결국 당신과 타인의 삶을 짓누르는 고통을 덜어내고, 더 자유로워지기 위한 실전 도구여야 합니다.",
        "meaning_en": "Do not pour your energy into empty displays of knowledge or useless debates. Every piece of wisdom and philosophy you acquire must serve as a practical tool to alleviate the suffering that crushes you and others, leading you to true freedom."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected 5 giants into final-narratives.json');
