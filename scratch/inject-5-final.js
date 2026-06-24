const fs = require('fs');

const dataToInject = {
  "franz-schubert": {
    "era_ko": "19세기의 거인 (1797~1828)",
    "era_en": "19th Century Giant (1797~1828)",
    "category": "arts",
    "epic_ko": "모차르트와 베토벤의 거대한 그림자가 짙게 드리운 음악의 도시 빈. 그곳에서 태어난 프란츠 슈베르트는 평생토록 단 한 번의 눈부신 화려함도 누리지 못한 채 조용히 세상을 스쳐 지나갔습니다. 가난한 교장의 아들로 태어난 그는 정식 음악 교육의 기회마저 넉넉지 않았고, 귀족들의 화려한 후원도, 수천 명의 관객이 환호하는 대규모 콘서트의 주인공이 된 적도 없었습니다. 150cm 남짓한 작은 키에 소심한 성격, 늘 가난에 쪼들려 피아노조차 가질 수 없었던 그가 할 수 있는 유일한 일은, 머릿속에서 폭포수처럼 쏟아져 나오는 멜로디를 종이 위에 미친 듯이 써 내려가는 것뿐이었습니다.\n\n그는 세속적인 성공에 무능했습니다. 출판업자들에게 헐값에 곡을 넘기기 일쑤였고, 일정한 직업 없이 친구들의 집을 전전하며 빌붙어 살았습니다. 하지만 그가 친구들과 카페나 작은 방에 모여 자신의 가곡(Lied)을 연주하던 조촐한 모임인 '슈베르티아데(Schubertiade)'에서만큼은 그는 세상에서 가장 위대한 음악의 제왕이었습니다. 괴테의 시에 선율을 붙인 '마왕'을 불과 18세의 나이에 작곡해 냈고, 피아노 반주를 단순한 화음에서 벗어나 시의 감정과 숨결을 그대로 표현하는 독립적인 예술로 끌어올리며 낭만주의 음악의 거대한 문을 열어젖혔습니다.\n\n가난과 지독한 매독이라는 끔찍한 병마가 그의 젊은 육체를 파괴해가는 절망 속에서도, 그의 펜 끝은 멈추지 않았습니다. 죽음을 예감한 만년의 불과 몇 달 동안, 그는 '겨울 나그네'와 '백조의 노래', 그리고 위대한 교향곡들을 폭풍처럼 작곡해 냈습니다. 불과 31세라는 너무나도 짧고 비참한 생애 동안 1,000여 곡의 명곡을 남기고 그는 베토벤의 무덤 곁에 쓸쓸히 묻혔습니다. 슈베르트의 삶은 세상의 박수갈채나 부유함 없이도, 내면에서 솟구치는 순수한 예술적 열정이 어떻게 인간의 가장 깊은 슬픔을 가장 아름다운 선율로 승화시킬 수 있는지를 보여주는 가슴 시린 대서사시입니다.",
    "epic_en": "In Vienna, the city of music heavily shaded by the colossal legacies of Mozart and Beethoven, Franz Schubert was born and quietly passed through the world without ever experiencing a single moment of dazzling splendor. Born the son of a poor schoolmaster, he had sparse opportunities for formal musical education; he never enjoyed the lavish patronage of nobles, nor was he ever the star of a grand concert cheered by thousands. Short in stature at barely 150 cm, timid in personality, and so constantly plagued by poverty that he could not even own a piano, the only thing he could do was frantically write down the melodies that poured from his mind like a waterfall onto paper.\n\nHe was inept at worldly success. He frequently sold his compositions to publishers for a pittance and lived as a vagabond, drifting between his friends' homes without a steady job. However, in the 'Schubertiades'—the modest gatherings where he and his friends met in cafes or small rooms to play his Lieder (art songs)—he was the greatest musical monarch in the world. He composed 'Erlkönig' (The Erlking), setting Goethe's poem to music, at the mere age of 18. He elevated the piano accompaniment from simple chords into an independent art form that breathed with the emotion of the poetry, throwing open the massive doors to Romantic music.\n\nEven as poverty and the horrific disease of syphilis destroyed his young body, his pen never stopped. In the abyss of despair, sensing his approaching death, he composed masterpieces like 'Winterreise' (Winter Journey), 'Schwanengesang' (Swan Song), and great symphonies in a stormy frenzy during his final few months. Leaving behind over 1,000 masterpieces in a tragically short and miserable life of only 31 years, he was buried quietly near Beethoven's grave. Schubert's life is a heart-wrenching epic demonstrating how pure artistic passion welling from within, devoid of the world's applause or wealth, can sublimate humanity's deepest sorrows into the most beautiful melodies.",
    "trials_ko": "평생을 옭아맨 지독한 가난, 대중적 성공과 귀족들의 후원 부재, 그리고 불과 31세의 젊은 나이에 생을 마감하게 한 치명적인 질병(매독).",
    "trials_en": "The crushing poverty that bound him throughout his life, the absence of popular success and aristocratic patronage, and the fatal disease (syphilis) that ended his life at the young age of 31.",
    "overcoming_ko": "세속적인 성공에 연연하지 않고 진실한 친구들과의 우정(슈베르티아데)에 기대어 1,000여 곡이 넘는 방대한 명곡들을 작곡해 내며 슬픔을 아름다움으로 승화시킴.",
    "overcoming_en": "Unattached to worldly success, he relied on the true friendship of his circle (the Schubertiades) and sublimated his sorrow into beauty, composing over 1,000 vast and magnificent masterpieces.",
    "wisdom": [
      {
        "quote_ko": "나의 작품은 음악에 대한 나의 이해와 슬픔의 산물이다. 슬픔에서 태어난 작품만이 세상을 가장 크게 위로할 수 있다.",
        "quote_en": "My productions in music are the product of the understanding, and spring from my sorrow; those only which are the product of pain seem to please the great world most.",
        "meaning_ko": "당신이 겪고 있는 절망과 슬픔을 쓸모없는 감정이라 여겨 숨기거나 도망치지 마십시오. 세상에서 가장 아름다운 예술과 타인을 울리는 깊은 공감은 찢어지는 고통 속에서 피어납니다. 당신의 눈물을 당신만의 걸작으로 승화시키십시오.",
        "meaning_en": "Do not hide or flee from the despair and sorrow you are experiencing, deeming them useless emotions. The most beautiful art in the world, and the deep empathy that moves others to tears, bloom amidst tearing pain. Sublimate your tears into your own masterpiece."
      },
      {
        "quote_ko": "우리는 결코 타인에게 마음을 온전히 털어놓을 수 없다. 우리는 영원히 서로의 곁을 스쳐 지나갈 뿐이다.",
        "quote_en": "No one feels another's grief, no one understands another's joy. People imagine they can reach one another. In reality they only pass each other by.",
        "meaning_ko": "다른 사람에게 온전히 이해받기를 바라는 환상을 버리십시오. 인간은 본질적으로 철저히 고독한 존재입니다. 그 고독을 인정하고 끌어안을 때, 비로소 타인의 고독을 이해하고 다정하게 손 내밀 수 있는 진정한 어른이 됩니다.",
        "meaning_en": "Discard the illusion of wanting to be completely understood by others. Humans are essentially, profoundly solitary beings. Only when you acknowledge and embrace that solitude can you become a true adult capable of understanding another's loneliness and extending a warm hand."
      },
      {
        "quote_ko": "가장 아름다운 것은 눈이 아니라 마음으로 들어온다.",
        "quote_en": "The most beautiful things are not seen with the eyes, but felt with the heart.",
        "meaning_ko": "세상의 화려한 겉포장과 시끄러운 명성에 현혹되지 마십시오. 화려한 무대나 웅장한 박수 소리가 없어도, 당신의 작은 방에서 흘러나오는 진실한 열정 하나가 세상 그 무엇보다 위대한 울림을 만들어 냅니다.",
        "meaning_en": "Do not be dazzled by the world's flashy packaging and loud fame. Even without a glamorous stage or roaring applause, a single, sincere passion emanating from your small room creates a resonance greater than anything else in the world."
      }
    ]
  },
  "frederick-the-great": {
    "era_ko": "18세기의 거인 (1712~1786)",
    "era_en": "18th Century Giant (1712~1786)",
    "category": "leadership",
    "epic_ko": "18세기, 혹독한 훈련과 무자비한 규율로 악명 높았던 프로이센(독일의 전신). 왕세자 프리드리히는 피비린내 나는 전쟁보다는 철학과 플루트 연주를 사랑하는 섬세한 문학 청년이었습니다. 하지만 군국주의자였던 아버지 빌헬름 1세에게 아들의 유약함은 참을 수 없는 수치였습니다. 아버지는 그를 매질하고, 수많은 신하들 앞에서 모욕을 주었으며, 심지어 프리드리히가 절친한 친구와 영국으로 도망치려다 붙잡히자, 그의 눈앞에서 친구의 목을 베어버리는 끔찍한 처형을 강행했습니다. 친구의 잘린 머리 앞에서 절망의 비명을 지르며 기절했던 청년은, 그 지옥 같은 트라우마 속에서 자신의 나약한 껍데기를 박살 내고 차갑고 강철 같은 '대왕'으로 거듭나야만 했습니다.\n\n왕좌에 오른 프리드리히 2세는 아버지가 물려준 훈련된 군대를 이끌고, 주변 강대국들을 향해 발톱을 드러냈습니다. 그는 철학자의 우아함을 버리지 않으면서도 전장에서는 누구보다 무자비한 사령관이었습니다. 7년 전쟁이 발발하자 프로이센은 프랑스, 오스트리아, 러시아라는 유럽 3대 강국의 거대한 연합군에게 포위되어 국가가 지도에서 완전히 지워질 절체절명의 위기에 처했습니다. 하지만 그는 도망치거나 항복하지 않고 독약을 품에 지닌 채 전장의 맨 앞장서서 미친 듯이 싸웠습니다. 압도적인 수적 열세 속에서도 기동력을 앞세운 '사선대형' 전술로 적의 측면을 박살 내며 불가능해 보이던 로스바흐 전투와 로이텐 전투를 승리로 이끌었습니다.\n\n기적처럼 프로이센을 유럽의 최고 강대국 반열에 올려놓은 후, 그는 다시 펜을 들었습니다. \"군주는 국가의 제1공복(머슴)일 뿐이다\"라고 선언하며 고문 제도를 폐지하고 종교적 관용을 베풀며 계몽주의를 국가 통치에 도입했습니다. 그는 당대 최고의 지성 볼테르와 편지를 주고받으며 국가를 근대화시켰지만, 평생 아버지의 학대와 배신당한 우정의 상처로 인해 철저히 고독했습니다. 그의 곁에는 사람이 아닌 반려견들만이 머물렀습니다. 프리드리히 대왕의 삶은 가혹한 시련이 어떻게 한 섬세한 영혼을 역사상 가장 차갑고도 위대한 철인 군주로 벼려냈는지를 보여주는 핏빛 대서사시입니다.",
    "epic_en": "In the 18th century, Prussia (the predecessor to Germany) was notorious for its harsh training and ruthless discipline. Crown Prince Frederick was a delicate, literary youth who loved philosophy and playing the flute far more than bloody wars. However, to his militaristic father, Frederick William I, his son's frailty was an unbearable disgrace. His father beat him, humiliated him before the court, and when Frederick attempted to flee to England with his closest friend, his father caught them and forced Frederick to watch his friend beheaded. Fainting with a scream of despair before his friend's severed head, the young prince had to shatter his weak shell in the abyss of that hellish trauma, rebirthing himself as a cold, iron-willed 'Great King.'\n\nUpon ascending the throne, Frederick II took the well-trained army his father had left him and bared his claws against the surrounding great powers. While he never abandoned the elegance of a philosopher, on the battlefield he was a more ruthless commander than anyone. When the Seven Years' War broke out, Prussia was surrounded by a massive alliance of Europe's three greatest powers—France, Austria, and Russia—facing the existential crisis of being wiped off the map. Yet, he did not flee or surrender; carrying a vial of poison, he fought like a madman at the very front lines. Even wildly outnumbered, he utilized the 'oblique order' tactic, prioritizing mobility to smash the enemy's flanks, leading his forces to impossible victories at the Battles of Rossbach and Leuthen.\n\nAfter miraculously elevating Prussia to the ranks of Europe's greatest powers, he took up the pen once more. Declaring, \"The sovereign is merely the first servant of the state,\" he abolished torture, granted religious tolerance, and integrated the Enlightenment into his rule. Though he modernized the nation while corresponding with the greatest minds of the era like Voltaire, he remained profoundly lonely throughout his life, scarred by his father's abuse and betrayed friendships. In his later years, he kept only his dogs by his side, not people. Frederick the Great's life is a blood-soaked epic of how harsh trials forged a delicate soul into history's coldest, yet greatest philosopher-king.",
    "trials_ko": "가정 폭력과 친구의 참수를 눈앞에서 목격해야 했던 끔찍한 유년기의 트라우마, 그리고 유럽 3대 강국(프랑스, 오스트리아, 러시아)의 거대한 연합군에 둘러싸인 국가 존립의 위기.",
    "trials_en": "The horrific childhood trauma of domestic abuse and witnessing the beheading of his closest friend, coupled with the existential crisis of his nation being surrounded by a massive alliance of Europe's three greatest powers (France, Austria, and Russia).",
    "overcoming_ko": "유약함을 버리고 전장의 최선봉에 서서 천재적인 군사 전술(사선대형)로 압도적 열세를 뒤집었으며, 전쟁 후에는 철인 군주로서 계몽주의 개혁을 단행해 국가를 부흥시킴.",
    "overcoming_en": "He discarded his frailty to stand at the forefront of the battlefield, reversing overwhelming odds with brilliant military tactics (the oblique order), and after the war, as a philosopher-king, he executed Enlightenment reforms to revive the nation.",
    "wisdom": [
      {
        "quote_ko": "모든 것을 방어하려는 자는 아무것도 방어하지 못한다.",
        "quote_en": "He who defends everything defends nothing.",
        "meaning_ko": "당신의 한정된 에너지와 자원을 모든 곳에 분산시키지 마십시오. 모든 사람에게 사랑받으려 하고, 모든 일을 완벽하게 해내려다가는 결국 어느 것 하나 이뤄내지 못하고 파멸할 것입니다. 버려야 할 것을 냉혹하게 잘라내고, 오직 가장 치명적인 단 하나에 당신의 모든 것을 집중하십시오.",
        "meaning_en": "Do not scatter your limited energy and resources everywhere. If you try to be loved by everyone and do everything perfectly, you will ultimately achieve nothing and face ruin. Ruthlessly cut away what must be discarded, and focus everything you have on the single most critical point."
      },
      {
        "quote_ko": "군주는 국가의 제1공복(머슴)일 뿐이다.",
        "quote_en": "A sovereign is the first servant of the State.",
        "meaning_ko": "리더의 자리에 올랐다고 해서 타인 위에 군림하려 들지 마십시오. 권력은 특권이 아니라 뼈를 깎는 책임과 봉사의 자리입니다. 조직원들보다 가장 먼저 일어나 가장 궂은일을 도맡을 각오가 없다면 리더의 자격이 없습니다.",
        "meaning_en": "Do not attempt to reign over others just because you have ascended to a leadership position. Power is not a privilege, but a position of bone-grinding responsibility and service. If you are not prepared to rise before your members and take on the dirtiest tasks, you are not qualified to be a leader."
      },
      {
        "quote_ko": "개에 대해 더 많이 알게 될수록, 사람을 덜 사랑하게 된다.",
        "quote_en": "The more I see of men, the better I like my dog.",
        "meaning_ko": "인간관계에서 쏟아지는 배신과 가식에 너무 큰 기대를 걸지 마십시오. 세상의 인정과 얄팍한 우정에 목매기보다, 묵묵히 당신의 곁을 지키는 존재와 당신 내면의 흔들리지 않는 원칙에 의지하며 고독을 씹어 삼키십시오.",
        "meaning_en": "Do not place too much expectation on human relationships fraught with betrayal and hypocrisy. Rather than hungering for the world's validation and shallow friendships, rely on those who silently stand by you and your own unshakeable internal principles, and chew through your solitude."
      }
    ]
  },
  "harriet-martineau": {
    "era_ko": "19세기의 거인 (1802~1876)",
    "era_en": "19th Century Giant (1802~1876)",
    "category": "society",
    "epic_ko": "여성은 대학에 갈 수도 없고, 오직 결혼하여 좋은 아내가 되는 것만이 유일한 미덕이던 19세기 영국 빅토리아 시대. 해리엇 마티노는 섬유업을 하는 평범한 집안에서 태어났지만, 어린 시절부터 청력을 점점 잃어가는 가혹한 신체적 시련을 겪어야 했습니다. 엎친 데 덮친 격으로 아버지의 사업이 파산하고 세상을 떠나자, 그녀의 가족은 차가운 길거리에 나앉을 위기에 처했습니다. 귀가 들리지 않는 가난한 독신 여성이 당시 사회에서 생존할 수 있는 길은 남의 집 하녀가 되거나 바느질을 하는 것뿐이었습니다. 하지만 해리엇은 절망의 끄트머리에서 펜을 집어 들었습니다. 그녀는 귀가 들리지 않는 대신, 세상의 부조리를 꿰뚫어 보는 가장 예리하고 차가운 이성의 눈을 가지고 있었습니다.\n\n그녀는 당시 학자들의 전유물로 여겨지던 복잡한 정치경제학을 소설이라는 형식에 녹여내 대중에게 선보였습니다. '정치경제학 예화'라는 그녀의 책은 발간되자마자 영국 전역을 발칵 뒤집어놓으며 베스트셀러가 되었습니다. 그녀는 감정에 호소하는 눈물겨운 소설을 쓰지 않았습니다. 대신 시장의 원리, 세금의 문제, 노동자의 빈곤이 어떻게 구조적으로 얽혀 있는지를 냉철하게 해부했습니다. 그녀의 책은 정치인들마저 필독서로 삼을 정도로 압도적인 영향력을 발휘했으며, 그녀는 남성들의 성역이었던 지식인의 세계 한가운데를 당당히 돌파해 최초의 여성 사회학자로 우뚝 섰습니다.\n\n그녀의 통찰은 영국을 넘어 미국으로 향했습니다. 미국을 직접 여행한 후, 그녀는 '미국의 사회'라는 책을 통해 미국의 민주주의가 자랑하는 자유 뒤에 흑인 노예제라는 끔찍한 위선과 여성 차별이 숨어있음을 가차 없이 폭로했습니다. 청력 상실로 커다란 나팔 모양의 보청기를 쥐고 다녀야 했지만, 그녀의 날카로운 펜끝은 수백만 군대의 함성보다 더 거대하게 세상을 뒤흔들었습니다. 해리엇 마티노의 삶은 신체적 장애와 시대의 억압을 차가운 지성과 불굴의 지적 투쟁으로 박살 낸 위대한 선구자의 대서사시입니다.",
    "epic_en": "In the 19th-century Victorian era of England, women could not attend university, and their only virtue was considered to be marrying well and becoming a good wife. Harriet Martineau was born into a modest textile-manufacturing family, but from a young age, she faced the harsh physical trial of progressively losing her hearing. Making matters worse, her father's business went bankrupt and he passed away, leaving her family on the brink of being thrown onto the cold streets. The only paths to survival for a poor, deaf, single woman in that society were becoming a maid or taking up sewing. Yet, at the edge of despair, Harriet picked up a pen. What she lacked in hearing, she made up for with the sharpest, coldest eyes of reason that pierced through the absurdities of the world.\n\nShe took complex political economy—then considered the exclusive domain of male scholars—and wove it into the accessible format of fiction for the public. Upon publication, her 'Illustrations of Political Economy' sent shockwaves across England and became a massive bestseller. She did not write tear-jerking novels appealing to emotion; instead, she coldly dissected the principles of the market, issues of taxation, and how the poverty of workers was structurally entangled. Her books wielded such overwhelming influence that even politicians made them mandatory reading. She proudly broke through the center of the male-dominated intellectual sanctuary to stand tall as the first female sociologist.\n\nHer insights reached beyond England to the United States. After traveling across America, she published 'Society in America,' ruthlessly exposing the horrific hypocrisy of black slavery and the discrimination against women hiding behind the much-boasted American democracy. Though forced to carry a large, trumpet-shaped earhorn due to her hearing loss, the sharp tip of her pen shook the world more massively than the roars of an army of millions. Harriet Martineau's life is a grand epic of a great pioneer who smashed physical disabilities and the oppression of her era with cold intellect and an indomitable intellectual struggle.",
    "trials_ko": "점진적인 청력 상실이라는 가혹한 장애, 가세가 기운 후 다가온 극심한 빈곤, 그리고 여성이 지식인으로 활동하는 것을 금기시하던 빅토리아 시대의 편견.",
    "trials_en": "The harsh disability of progressive hearing loss, the extreme poverty that followed her family's ruin, and the prejudice of the Victorian era that tabooed women from acting as intellectuals.",
    "overcoming_ko": "장애와 편견에 굴복하지 않고 독학으로 정치경제학을 통달했으며, 대중이 이해하기 쉬운 예화(소설) 형식으로 출판해 베스트셀러 작가이자 최초의 여성 사회학자로 거듭남.",
    "overcoming_en": "Refusing to succumb to her disability and societal prejudice, she self-educated herself in political economy and published it in easily understood fictional narratives, becoming a bestselling author and the first female sociologist.",
    "wisdom": [
      {
        "quote_ko": "읽는 이는 넘쳐나지만, 생각하는 이는 드물다.",
        "quote_en": "Readers are plentiful; thinkers are rare.",
        "meaning_ko": "세상에 떠도는 가벼운 정보와 타인의 주장을 아무런 의심 없이 주워 담지 마십시오. 글자를 읽는 행위로 지식인이 될 수 없습니다. 날카로운 이성의 칼날로 현상의 이면을 도려내어 본질을 해부하는 자만이 세상을 이끌어가는 진짜 리더가 됩니다.",
        "meaning_en": "Do not uncritically scoop up the superficial information and opinions floating around the world. Merely reading words does not make you an intellectual. Only those who dissect the essence of phenomena by carving away the surface with the sharp blade of reason become true leaders who guide the world."
      },
      {
        "quote_ko": "우리의 삶은 우리가 무엇을 믿느냐에 따라 형성된다.",
        "quote_en": "Our life is what our thoughts make it.",
        "meaning_ko": "당신의 한계를 환경이나 신체의 장애 탓으로 돌리지 마십시오. 당신을 억압하는 가장 강력한 사슬은 세상의 편견이 아니라, 당신 스스로가 불가능하다고 믿는 그 나약한 생각입니다. 생각을 뒤집는 순간, 닫혀있던 문이 부서집니다.",
        "meaning_en": "Do not blame your limitations on your environment or physical disabilities. The strongest chains oppressing you are not the prejudices of the world, but your own weak belief that it is impossible. The moment you flip your thinking, the locked doors shatter."
      },
      {
        "quote_ko": "도덕적 용기가 없는 지식은 쓸모없는 장식품에 불과하다.",
        "quote_en": "Knowledge without moral courage is a useless ornament.",
        "meaning_ko": "머릿속에 든 지식이 아무리 많아도, 부당한 현실 앞에서 목소리를 내지 못한다면 그것은 썩어버린 쓰레기입니다. 두려움을 떨치고 펜과 행동으로 당신의 정의를 세상에 들이밀 때, 지식은 비로소 세상을 베는 무기가 됩니다.",
        "meaning_en": "No matter how much knowledge you hold in your head, if you cannot speak out in the face of unjust reality, it is rotting garbage. Only when you shake off fear and thrust your sense of justice into the world through your pen and actions does knowledge truly become a weapon that cleaves the world."
      }
    ]
  },
  "ida-b-wells": {
    "era_ko": "19세기 후반 ~ 20세기 초 (1862~1931)",
    "era_en": "Late 19th - Early 20th Century (1862~1931)",
    "category": "society",
    "epic_ko": "남북전쟁 중 노예의 신분으로 태어난 아이다 B. 웰스. 그녀가 태어난 직후 노예 해방 선언이 발표되었지만, 현실은 결코 자유롭지 않았습니다. 흑인을 향한 백인 우월주의자들의 증오와 잔혹한 폭력이 여전히 미국 남부를 피로 물들이고 있었습니다. 16살에 부모님을 황열병으로 잃은 후, 그녀는 나이를 속이고 교사가 되어 동생들을 부양해야 했습니다. 어느 날 기차의 일등석 표를 정당하게 구매했음에도 흑인이라는 이유로 짐짝 칸으로 쫓겨날 위기에 처했을 때, 그녀는 차장의 손을 깨물며 온몸으로 저항했습니다. 폭력으로 끌려 나갔지만, 그녀는 백인들을 상대로 소송을 제기하며 굴복하지 않는 불씨를 자신의 가슴속에 당겼습니다.\n\n그녀의 인생을 송두리째 바꾼 결정적인 사건은 1892년 멤피스에서 일어났습니다. 흑인이라는 이유만으로 그녀의 절친한 친구 세 명이 백인 폭도들에게 끌려가 잔혹하게 '린치(사형 조작 및 사적 제재)'를 당하고 목매달려 죽은 것입니다. 이 참혹한 사건 앞에서 사람들은 공포에 질려 침묵했습니다. 하지만 웰스는 분노의 눈물을 삼키고 펜을 칼처럼 빼 들었습니다. 그녀는 자신이 운영하던 신문 '자유의 언론(Free Speech)'을 통해 린치의 끔찍한 실상과 흑인 남성들을 향한 백인들의 거짓 성폭행 누명을 낱낱이 폭로했습니다. \"린치는 법이 아니라 백인 우월주의자들의 잔혹한 살인 파티다!\"\n\n이 폭로로 그녀의 신문사는 백인 폭도들에 의해 불태워졌고, 그녀에게는 목숨을 노리는 현상금이 걸렸습니다. 남부로 돌아가면 죽이겠다는 살해 협박 속에서도 그녀는 총을 품고 다니며 북부와 유럽 전역으로 망명, 수백 번의 강연을 통해 린치의 만행을 전 세계에 폭로했습니다. 권력도 보호막도 없는 흑인 여성이 오직 차가운 팩트가 담긴 통계와 불타는 언어로 국가 규모의 광기와 폭력에 맞서 싸운 아이다 B. 웰스의 삶은, 펜의 힘이 무지한 군중의 횃불보다 강하다는 것을 증명한 위대한 저항의 대서사시입니다.",
    "epic_en": "Born a slave during the American Civil War, Ida B. Wells saw the Emancipation Proclamation issued shortly after her birth, but the reality was far from freedom. The hatred and brutal violence of white supremacists against African Americans continued to stain the American South with blood. Losing her parents to yellow fever at the age of 16, she had to lie about her age to become a teacher and support her siblings. One day, after legitimately purchasing a first-class train ticket, she was ordered to move to the segregated baggage car solely because of her race. She resisted with her entire body, biting the conductor's hand. Though dragged off by force, she filed a lawsuit against the white-owned railroad, igniting an unyielding spark within her breast.\n\nThe defining event that completely altered her life occurred in Memphis in 1892. Three of her closest friends were dragged away by a white mob and brutally 'lynched' (extrajudicially murdered) and hanged, simply for being successful black men. Faced with this horrific event, people fell silent in terror. However, Wells swallowed her tears of rage and drew her pen like a sword. Through her newspaper, 'Free Speech,' she exposed every detail of the horrific reality of lynchings and the false accusations of rape leveled against black men by whites. \"Lynching is not about justice; it is a brutal murder party of white supremacists!\"\n\nBecause of this exposé, her newspaper office was burned down by a white mob, and a bounty was placed on her head. Under death threats warning her never to return to the South, she carried a pistol for protection and fled to the North and eventually Europe. Through hundreds of lectures, she exposed the atrocities of lynching to the world. A black woman with no power or protection, she fought against national-scale madness and violence using only cold statistical facts and blazing rhetoric. Ida B. Wells' life is a grand epic of resistance, proving that the power of the pen is mightier than the torches of an ignorant mob.",
    "trials_ko": "16살에 고아가 되어 가족을 부양해야 했던 지독한 가난, 그리고 린치(사적 처형)의 실태를 폭로한 후 백인 우월주의자들로부터 받은 끔찍한 살해 위협과 신문사 방화.",
    "trials_en": "The crushing poverty of becoming an orphan and having to support her family at age 16, and the horrific death threats and the burning of her newspaper office by white supremacists after she exposed the reality of lynchings.",
    "overcoming_ko": "살해 협박 속에서도 총을 품고 다니며 린치에 관한 철저한 통계와 팩트를 수집했고, 미국 전역과 유럽을 돌며 진실을 폭로하여 반린치 운동의 세계적인 선구자가 됨.",
    "overcoming_en": "Despite death threats, she carried a gun for protection and collected thorough statistics and facts about lynchings. Traveling across the U.S. and Europe to expose the truth, she became the global pioneer of the anti-lynching movement.",
    "wisdom": [
      {
        "quote_ko": "잘못된 것을 바로잡는 방법은 진실의 빛을 비추는 것이다.",
        "quote_en": "The way to right wrongs is to turn the light of truth upon them.",
        "meaning_ko": "불의가 지배하는 칠흑 같은 어둠 속에서 타협하거나 숨지 마십시오. 세상을 바꾸는 첫걸음은 피 묻은 사실(Fact)을 두려움 없이 세상 밖으로 끌어내는 것입니다. 진실의 찬란한 빛 앞에서 거대한 광기도 결국 녹아내립니다.",
        "meaning_en": "Do not compromise or hide in the pitch-black darkness where injustice rules. The first step to changing the world is to fearlessly drag the blood-stained facts out into the open. Before the radiant light of truth, even colossal madness eventually melts away."
      },
      {
        "quote_ko": "침묵은 동조를 의미한다.",
        "quote_en": "Silence is consent.",
        "meaning_ko": "당신과 직접 관련이 없다고 부당한 폭력을 외면하지 마십시오. 악이 승리하는 유일한 조건은 선한 사람들이 아무것도 하지 않는 것입니다. 당신의 비겁한 침묵은 가장 잔혹한 칼날이 되어 타인을, 그리고 결국 당신을 찌를 것입니다.",
        "meaning_en": "Do not turn a blind eye to unjust violence simply because it does not directly concern you. The only condition necessary for evil to triumph is for good people to do nothing. Your cowardly silence will become the cruelest blade, stabbing others and, ultimately, yourself."
      },
      {
        "quote_ko": "총을 가진 여자는 두려울 것이 없다.",
        "quote_en": "A Winchester rifle should have a place of honor in every black home.",
        "meaning_ko": "세상이 당신을 보호해주지 않을 때, 정의감에만 호소하지 마십시오. 철저히 스스로를 무장해야 합니다. 당신의 육체적 안전은 물론, 지식과 논리라는 총을 가슴에 품고 다닐 때 당신은 그 어떤 위협 앞에서도 당당하게 걸을 수 있습니다.",
        "meaning_en": "When the world fails to protect you, do not appeal solely to a sense of justice. You must thoroughly arm yourself. When you carry the gun of knowledge and logic in your heart, as well as protecting your physical safety, you can walk proudly before any threat."
      }
    ]
  },
  "rembrandt": {
    "era_ko": "17세기 네덜란드 황금시대 (1606~1669)",
    "era_en": "17th Century Dutch Golden Age (1606~1669)",
    "category": "arts",
    "epic_ko": "17세기, 네덜란드는 전 세계의 부가 모여드는 상업의 심장부였고, 예술은 상인과 귀족들의 권력을 과시하는 화려한 장식품에 불과했습니다. 제분업자의 아들로 태어난 렘브란트 판 레인은 이 화려하고 들뜬 암스테르담에 혜성처럼 등장했습니다. 그는 20대의 젊은 나이에 극적인 빛과 어둠의 대비(키아로스쿠로)를 통해 사람의 영혼까지 꿰뚫어 보는 듯한 초상화로 엄청난 성공을 거두었습니다. 사랑하는 아내 사스키아와 결혼하여 거대한 저택에서 귀족처럼 살았고, 그의 화실에는 그림을 사려는 돈 많은 고객들이 줄을 섰습니다. 그에게 세상은 오직 찬란한 빛으로만 가득 차 보였습니다.\n\n하지만 위대한 예술의 신은 그가 편안함에 안주하는 것을 허락하지 않았습니다. 그의 마스터피스인 '야간 순찰(The Night Watch)'을 그렸을 때, 초상화의 주인공들은 자신들을 똑같이 화려하게 그려주지 않고 어둠 속에 묻히게 한 그의 예술적 실험에 격분했습니다. 이 사건을 기점으로 주문은 끊겼고, 연이어 사랑하는 아내와 세 아이가 병으로 세상을 떠나는 비극이 덮쳤습니다. 과도한 사치와 빚더미에 눌려 그의 거대한 저택과 그가 평생 모은 진귀한 수집품들은 모두 경매에 넘어가고 말았습니다. 화려했던 빛의 화가는 철저한 파산과 지독한 어둠 속으로 내동댕이쳐졌습니다.\n\n그러나 모든 것을 잃은 절망의 심연에서, 렘브란트의 붓끝은 세상에서 가장 깊고 숭고한 빛을 뿜어내기 시작했습니다. 그는 자신을 돋보이게 포장하지 않고, 가난하고 주름진 자신의 자화상과 밑바닥 사람들의 모습을 그렸습니다. 캔버스 위에 두껍게 덧칠해진 물감 사이로, 인생의 모든 고통과 덧없음을 처절하게 깨달은 자만이 낼 수 있는 따뜻하고 인간적인 빛이 새어 나왔습니다. 만년에 이르러 남은 가족마저 모두 잃고 쓸쓸히 숨을 거두었지만, 렘브란트의 삶은 세상의 모든 부귀영화가 산산조각 난 뒤에야 비로소 인간 내면의 진실이라는 가장 위대한 빛을 포착해 낸 장엄한 대서사시입니다.",
    "epic_en": "In the 17th century, the Netherlands was the beating commercial heart where the world's wealth converged, and art was largely an ornate decoration to flaunt the power of merchants and nobles. Born the son of a miller, Rembrandt van Rijn emerged like a comet in this vibrant, bustling Amsterdam. In his twenties, he achieved immense success with portraits that seemed to pierce through to a person's soul, utilizing the dramatic contrast of light and darkness (chiaroscuro). He married his beloved wife Saskia, lived like a noble in a massive mansion, and wealthy clients lined up at his studio. To him, the world appeared filled only with radiant light.\n\nHowever, the god of great art did not allow him to settle into comfort. When he painted his masterpiece, 'The Night Watch,' the subjects of the portrait were furious at his artistic experimentation, which left some of them cast in shadows rather than painting them all equally glamorous. Following this incident, commissions dried up, and tragedy struck in succession as his beloved wife and three children died of illness. Crushed by excessive spending and a mountain of debt, his grand mansion and his lifelong collection of rare items were all auctioned off. The glamorous painter of light was hurled into absolute bankruptcy and profound darkness.\n\nYet, in the abyss of despair where he had lost everything, Rembrandt's brush began to emit the deepest, most sublime light in the world. He stopped packaging himself to look impressive, instead painting poor, deeply wrinkled self-portraits and depicting people at the bottom of society. Through the thick layers of paint on his canvas, a warm, profoundly human light seeped out—a light that could only be produced by one who had bitterly realized all of life's suffering and transience. In his final years, he lost his remaining family and passed away in solitude. Rembrandt's life is a magnificent epic, proving that only after all worldly wealth and glory have been shattered can one finally capture the greatest light: the truth of the human soul.",
    "trials_ko": "'야간 순찰' 이후 쏟아진 사회적 외면과 지독한 파산, 그리고 사랑하는 아내와 자식들을 모두 먼저 떠나보내야 했던 잔혹한 상실의 고통.",
    "trials_en": "The social ostracization and severe bankruptcy that poured down upon him following 'The Night Watch,' and the cruel pain of loss from having to bury his beloved wife and all his children before him.",
    "overcoming_ko": "모든 세속적 성공과 재산을 잃은 절망 속에서도 붓을 놓지 않았으며, 오히려 고통의 경험을 통해 껍데기를 벗어던지고 인간 내면의 진실을 담아내는 가장 깊은 명암법을 완성함.",
    "overcoming_en": "He never laid down his brush even in the despair of losing all secular success and wealth; instead, through his experiences of pain, he shed superficial husks to perfect a chiaroscuro that captured the deep truths of the human soul.",
    "wisdom": [
      {
        "quote_ko": "그림은 완성되는 것이 아니라, 화가가 붓을 멈추었을 때 비로소 끝나는 것이다.",
        "quote_en": "A painting is not finished when it is done, but when the painter stops.",
        "meaning_ko": "타인의 기준에 맞춰 당신의 삶을 완벽하게 포장하려 애쓰지 마십시오. 당신의 삶은 그 자체로 치열하게 그려나가는 거친 캔버스입니다. 세상의 평가가 아니라, 당신 스스로 만족하여 붓을 내려놓을 때 그것이 곧 위대한 걸작입니다.",
        "meaning_en": "Do not strive to package your life perfectly to fit the standards of others. Your life is a rough canvas being fiercely painted in its own right. It is not the world's evaluation, but the moment you lay down your brush in your own satisfaction, that marks a great masterpiece."
      },
      {
        "quote_ko": "어둠이 짙어질수록, 내면의 빛은 더욱 선명하게 타오른다.",
        "quote_en": "The darker the shadow, the brighter the light.",
        "meaning_ko": "가진 것을 모두 잃고 절망의 밑바닥에 떨어졌다고 좌절하지 마십시오. 화려한 태양 아래서는 별이 보이지 않는 법입니다. 철저한 상실과 고독의 어둠 속에서, 당신의 영혼이 뿜어내는 진짜 위대한 빛을 발견하게 될 것입니다.",
        "meaning_en": "Do not despair if you have lost everything and fallen to the bottom of the abyss. You cannot see the stars under a glaring sun. In the darkness of absolute loss and solitude, you will discover the truly great light emitted by your soul."
      },
      {
        "quote_ko": "진실은 겉옷을 벗겨낼 때 비로소 모습을 드러낸다.",
        "quote_en": "Truth reveals itself only when the outer garments are stripped away.",
        "meaning_ko": "돈, 직함, 타인의 환호 같은 화려한 겉옷들에 집착하지 마십시오. 언젠가 거대한 파도가 덮치면 그 모든 껍데기는 벗겨집니다. 모든 것을 잃은 후 거울 앞에 섰을 때 남는 당신의 민낯, 그 단단한 본질을 가꾸는 데 평생을 바치십시오.",
        "meaning_en": "Do not obsess over flashy outer garments like money, titles, or the cheers of others. Someday, a massive wave will strike, and all those husks will be stripped away. Devote your life to cultivating the solid essence—the bare face that remains when you stand before the mirror after losing everything."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected final 5 giants into final-narratives.json');
