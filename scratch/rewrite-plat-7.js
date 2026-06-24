const fs = require('fs');

const dataToInject = {
  "hypatia": {
    "era_ko": "4세기 후반 - 5세기 초 (350?~415)",
    "era_en": "Late 4th - Early 5th Century (350?~415)",
    "category": "science",
    "epic_ko": "고대 학문과 지식의 심장부이자 거대한 알렉산드리아 도서관이 숨 쉬던 이집트. 이곳에서 당대 최고의 수학자이자 천문학자였던 테온의 딸로 태어난 히파티아는, 여성에게 학문의 문이 굳게 닫혀 있던 가혹한 시대적 장벽을 박살 내버린 경이로운 지성이었습니다. 그녀는 단순히 아버지의 지식을 물려받은 것에 그치지 않고, 자신만의 탁월한 수학적 계산과 플라톤 철학에 대한 깊은 통찰력을 바탕으로 알렉산드리아 철학 학교의 가장 빛나는 수장으로 우뚝 섰습니다. 황제와 귀족, 수많은 남성 학자들이 그녀의 강연을 듣기 위해 구름처럼 몰려들었고, 그녀는 우아하면서도 압도적인 지적 카리스마로 당대의 가장 복잡한 기하학과 천문학의 난제들을 쾌도난마처럼 풀어내며 학문의 황금시대를 이끌었습니다.\n\n그러나 그녀가 쌓아 올린 찬란한 이성의 빛은, 광신적인 종교적 갈등의 어둠 속에서 가장 잔혹한 표적이 되고 말았습니다. 알렉산드리아를 휩쓸던 초기 기독교 세력과 이교도 간의 맹렬한 권력 투쟁 속에서, 어느 쪽에도 치우치지 않고 오직 '수학과 진리'만을 설파하던 그녀의 고결함은 타락한 정치 모리배들과 광신도들에게는 눈엣가시였습니다. 자신들의 정치적 탐욕을 감추기 위해 그녀를 '이교도의 마녀'로 모함한 주교 키릴로스의 선동에 넘어간 끔찍한 폭도들이 마침내 그녀의 마차를 습격했습니다.\n\n날카로운 굴 껍데기와 기왓장으로 그녀의 살점을 찢어발기고 뼈를 산산조각 낸 뒤, 시신마저 불태워버린 폭도들의 야만성은 인간성이 도달할 수 있는 가장 끔찍한 지옥의 풍경이었습니다. 비록 그녀의 육신은 한 줌의 재로 허망하게 사라졌으나, 그녀가 일생을 바쳐 옹호했던 이성과 철학의 불꽃은 결코 꺼지지 않았습니다. 히파티아의 삶은 무지와 광기라는 거대한 시대적 폭력 앞에서도 결단코 진리를 포기하지 않고, 칠흑 같은 암흑시대로 굴러떨어지는 인류의 발걸음 속에서 가장 고결한 지성의 빛을 온몸으로 사수하다 순교한 철학의 가장 처절하고 위대한 대서사시입니다.",
    "epic_en": "In Egypt, the heart of ancient learning and knowledge, where the massive Library of Alexandria breathed. Born here as the daughter of Theon, the greatest mathematician and astronomer of his time, Hypatia was a marvelous intellect who shattered the harsh barriers of an era when the doors of learning were firmly closed to women. She did not merely inherit her father's knowledge; armed with her own brilliant mathematical calculations and profound insight into Platonic philosophy, she stood tall as the most radiant head of the Neoplatonic school in Alexandria. Emperors, nobles, and countless male scholars flocked like clouds to hear her lectures, and with elegant yet overwhelming intellectual charisma, she masterfully unraveled the most complex problems of geometry and astronomy of the era, leading a golden age of scholarship.\n\nHowever, the brilliant light of reason she had built up became the cruelest target in the darkness of fanatical religious conflict. Amidst the fierce power struggle between early Christian factions and pagans sweeping Alexandria, her nobility in preaching only 'mathematics and truth' without bias became a thorn in the side of corrupt political schemers and fanatics. Swayed by the incitement of Bishop Cyril, who framed her as a 'pagan witch' to cloak his political greed, a horrific mob of zealots finally ambushed her carriage.\n\nThe barbarity of the mob—tearing her flesh with sharp oyster shells and roof tiles, shattering her bones, and burning her corpse—was the most horrific hellscape humanity could reach. Although her physical body vainly disappeared into a handful of ashes, the flame of reason and philosophy she dedicated her life to defending was never extinguished. Hypatia's life is the most desperate and great epic of philosophy, a martyr who firmly refused to abandon the truth even before the colossal violence of ignorance and madness, defending the noblest light of intellect with her entire body as humanity tumbled toward a pitch-black dark age.",
    "trials_ko": "여성 학자를 용납하지 않던 시대적 억압과 고정관념, 그리고 정치적 음모와 광신도들의 선동으로 인해 겪어야 했던 참혹하고 잔인한 마녀 사냥과 학살.",
    "trials_en": "The societal oppression and stereotypes that did not tolerate female scholars, and the horrific, cruel witch hunt and massacre she had to endure due to political conspiracy and the incitement of fanatics.",
    "overcoming_ko": "여성이라는 한계를 자신의 압도적인 천문학적, 수학적 천재성으로 완전히 짓밟고 알렉산드리아 학파의 수장이 되었으며, 살이 찢기는 참혹한 죽음 앞에서도 이성과 진리에 대한 신념을 끝까지 굽히지 않음.",
    "overcoming_en": "She completely trampled the limitations of being a woman with her overwhelming astronomical and mathematical genius to become the head of the Alexandrian school, and never bent her conviction in reason and truth to the very end, even before a horrific death where her flesh was torn.",
    "wisdom": [
      {
        "quote_ko": "생각할 권리를 스스로 지켜내라. 왜냐하면 잘못 생각하는 것이 아예 생각하지 않는 것보다 낫기 때문이다.",
        "quote_en": "Reserve your right to think, for even to think wrongly is better than not to think at all.",
        "meaning_ko": "남들이 정해준 얄팍한 정답과 맹목적인 교리에 무비판적으로 고개를 끄덕이며 당신의 고귀한 뇌를 스스로 마비시키지 마십시오. 타인의 앵무새로 전락하느니, 차라리 치열하게 혼자 고민하다가 철저하게 틀리고 비웃음을 당하는 편이 당신의 영혼을 백배 더 위대하게 만듭니다. 그 어떤 협박 앞에서도 당신만의 날 선 생각의 권리만큼은 목숨을 걸고 사수하시길 바랍니다.",
        "meaning_en": "Do not paralyze your own noble brain by uncritically nodding to the shallow right answers and blind doctrines set by others. Rather than degrading into someone else's parrot, agonizing fiercely alone and being completely wrong and mocked makes your soul a hundred times greater. I hope you will risk your life to defend your unique, sharp right to think before any threat."
      },
      {
        "quote_ko": "동화는 동화로 가르쳐야 하고 신화는 신화로 가르쳐야 한다. 우화를 사실인 양 가르치는 것은 끔찍한 일이다.",
        "quote_en": "Fables should be taught as fables, myths as myths, and miracles as poetic fantasies. To teach superstitions as truths is a most terrible thing.",
        "meaning_ko": "현실을 도피하기 위해 달콤한 환상이나 확인되지 않은 맹신 뒤에 비겁하게 숨으려 하지 마시길 바랍니다. 뼈가 시리도록 차갑고 잔혹하더라도, 있는 그대로의 진실(팩트)을 두 눈 부릅뜨고 정면으로 직시하는 자만이 세상을 자신의 뜻대로 조종할 수 있는 무서운 힘을 갖게 됩니다. 거짓된 위안을 가차 없이 찢어버리십시오.",
        "meaning_en": "I hope you do not try to cowardly hide behind sweet fantasies or unverified blind faith to escape reality. Only the one who glares head-on at the raw truth (facts)—no matter how bone-chillingly cold and cruel it may be—gains the terrifying power to manipulate the world as they will. Ruthlessly tear away false comforts."
      },
      {
        "quote_ko": "진리는 인간의 마음 깊은 곳에 묻혀 있으며, 이를 꺼내는 것은 각자의 책임이다.",
        "quote_en": "Truth is buried deep in the human heart, and it is each person's responsibility to bring it forth.",
        "meaning_ko": "세상의 모든 궁극적인 해답을 밖에서, 높은 단상에 선 권위자에게서 구하려는 그 나약한 의존증을 당장 버리십시오. 우주를 꿰뚫는 가장 완벽한 진리와 혜안은 이미 당신 내면의 가장 깊고 은밀한 곳에 다이아몬드처럼 단단하게 박혀 있습니다. 피를 토하는 심정으로 스스로의 내면을 치열하게 파고들어 기어이 그 빛나는 보석을 캐내는 것은 오직 당신만의 몫임을 명심하십시오.",
        "meaning_en": "Immediately discard the weak dependency of trying to seek all the ultimate answers of the world from the outside, from authority figures on high podiums. The most perfect truth and insight piercing the universe is already solidly embedded like a diamond in the deepest, most secret part of your inner self. Keep in mind that it is solely your responsibility to fiercely dig into your own interior with a heart ready to vomit blood, and to relentlessly unearth that shining gem."
      }
    ]
  },
  "oscar-wilde": {
    "era_ko": "19세기 후반의 거인 (1854~1900)",
    "era_en": "Late 19th Century Giant (1854~1900)",
    "category": "arts",
    "epic_ko": "위선과 가식으로 똘똘 뭉친 엄숙한 영국의 빅토리아 시대. 아일랜드 출신의 천재 작가 오스카 와일드는 그 숨 막히는 도덕주의의 면상에 가장 화려하고 예리한 언어의 비수를 꽂아 넣은 시대의 이단아였습니다. 화려한 벨벳 옷과 해바라기 장식, 그리고 누구도 반박할 수 없는 천재적인 재치로 런던 사교계를 단숨에 지배한 그는, '도리언 그레이의 초상'과 수많은 희극을 통해 당대 상류층의 추악한 이중성을 뼈저리게 조롱했습니다. \"예술은 그 자체로 완벽해야 하며 도덕적 교훈을 줄 필요가 없다\"는 유미주의의 깃발 아래, 그는 지루한 현실의 잿빛 캔버스를 미치도록 매혹적인 아름다움으로 도배해 버렸습니다.\n\n가장 눈부신 성공의 정점에 서 있던 그 순간, 끔찍한 몰락의 그림자가 덮쳤습니다. 귀족 청년 알프레드 더글라스와의 동성애 스캔들은 당시 영국 사회에서 절대 용납될 수 없는 최악의 범죄였습니다. 진심 어린 사랑을 증명하려다 덫에 빠진 그는, 오만한 사회의 재판정에 불려가 온갖 모욕을 당하고 결국 '풍기 문란' 죄로 레딩 감옥에 수감되었습니다. 화려했던 런던의 스타가 하루아침에 차가운 감방 바닥에 처박혀 중노동에 시달리고 파산과 이혼의 비극을 겪어야만 했습니다.\n\n하지만 가장 비참하게 부서진 옥중에서도 그의 예술적 영혼은 부패하지 않았습니다. 그는 감옥에서 쓴 처절한 참회록 '심연으로부터(De Profundis)'를 통해 쾌락만을 좇던 자신의 오만함을 찢어내고 고통 속에서 피어나는 진정한 사랑과 영적 구원의 깊이를 성찰했습니다. 출소 후 영국 사회에서 영원히 추방당해 파리의 초라한 호텔에서 이름조차 버린 채 쓸쓸히 병사했지만, 오스카 와일드의 삶은 위선적인 세상의 잣대에 결코 굴복하지 않고 끝까지 '가장 나다운 아름다움'을 사랑했던 매혹적이고도 잔혹한 비극의 대서사시로 우리 곁에 영원히 숨 쉬고 있습니다.",
    "epic_en": "The solemn Victorian era in England, tightly bound by hypocrisy and pretense. The Irish-born genius writer Oscar Wilde was a maverick of his time who plunged the most glamorous and sharp dagger of language directly into the face of that suffocating moralism. Taking the London social scene by storm in an instant with flashy velvet clothes, sunflower adornments, and an irrefutable genius wit, he bitterly mocked the ugly duality of the contemporary upper class through 'The Picture of Dorian Gray' and numerous comedies. Under the banner of Aestheticism—\"Art should be perfect in itself and has no need to provide moral lessons\"—he papered over the gray canvas of boring reality with maddeningly captivating beauty.\n\nAt the very pinnacle of his most dazzling success, the shadow of a horrific downfall struck. His homosexual scandal with the young aristocrat Lord Alfred Douglas was the worst possible crime, absolutely intolerable in English society at the time. Falling into a trap while trying to prove his sincere love, he was dragged before the arrogant society's court, subjected to all manner of insults, and ultimately imprisoned in Reading Gaol for 'gross indecency.' The glamorous star of London was shoved overnight onto the cold floor of a prison cell, suffering hard labor and enduring the tragedies of bankruptcy and divorce.\n\nYet, even most miserably broken in prison, his artistic soul did not rot. Through 'De Profundis,' a desperate confession written in prison, he tore away his own arrogance that had only chased pleasure, and reflected on the depth of true love and spiritual salvation that blooms amidst suffering. After his release, permanently exiled from English society, he died a lonely death from illness in a shabby Paris hotel, having even discarded his name. However, Oscar Wilde's life breathes eternally beside us as the captivating and cruel epic of a tragedy who never submitted to the hypocritical world's standards and loved the 'most me-like beauty' to the very end.",
    "trials_ko": "빅토리아 시대의 숨 막히는 위선, 동성애 스캔들로 인한 재판과 레딩 감옥에서의 끔찍한 중노동 수감 생활, 그리고 모든 명성과 재산을 잃고 맞이한 철저한 파산과 망명지에서의 쓸쓸한 죽음.",
    "trials_en": "The suffocating hypocrisy of the Victorian era, the trial stemming from a homosexual scandal and the horrific hard labor imprisonment in Reading Gaol, and the absolute bankruptcy and lonely death in exile after losing all fame and wealth.",
    "overcoming_ko": "감옥이라는 가장 비참한 밑바닥에서도 '심연으로부터'를 집필하며 자신의 고통을 깊은 예술적·영적 성찰로 승화시켰으며, 죽는 순간까지 세상의 잣대에 굴복하지 않는 예술 지상주의를 온몸으로 증명함.",
    "overcoming_en": "Even at the most miserable rock bottom of prison, he sublimated his suffering into profound artistic and spiritual reflection by writing 'De Profundis,' and proved Aestheticism with his entire body by never submitting to the world's standards until the moment he died.",
    "wisdom": [
      {
        "quote_ko": "너 자신이 되어라. 다른 사람의 자리는 이미 다 차 있다.",
        "quote_en": "Be yourself; everyone else is already taken.",
        "meaning_ko": "세상의 인정과 타인의 박수갈채를 구걸하기 위해, 남들이 만들어놓은 그럴싸한 틀에 당신의 영혼을 구겨 넣는 그 역겨운 짓을 당장 멈추십시오. 누군가의 완벽한 복제품이 되어 얻어낸 가짜 찬사는 아침 이슬처럼 허망하게 사라질 뿐입니다. 차라리 세상 모두가 당신을 괴짜라 부르며 손가락질하더라도, 당신 내면의 가장 기괴하고도 아름다운 본성을 미친 듯이 폭발시키시길 바랍니다.",
        "meaning_en": "Immediately stop the disgusting act of crumpling your soul into plausible molds created by others just to beg for the world's recognition and others' applause. Fake accolades gained by becoming someone's perfect replica will only vanish vainly like morning dew. Even if the whole world points fingers at you calling you a freak, I hope you madly explode the most bizarre yet beautiful nature of your own inner self."
      },
      {
        "quote_ko": "우리는 모두 진흙창에 누워 있지만, 우리 중 몇몇은 별을 바라보고 있다.",
        "quote_en": "We are all in the gutter, but some of us are looking at the stars.",
        "meaning_ko": "잔혹한 현실이 당신의 멱살을 잡고 가장 냄새나는 시궁창 한가운데로 내동댕이쳤습니까? 그렇다고 해서 당신의 눈빛마저 진흙탕 속에 파묻혀 썩어 들어가게 놔두지 마십시오. 육체가 가장 비참한 밑바닥을 나뒹굴 때조차, 밤하늘의 쏟아지는 별빛을 바라보며 우아함을 잃지 않는 그 지독한 정신적 오만함만이, 당신을 기어이 그 시궁창에서 건져 올릴 유일한 동아줄입니다.",
        "meaning_en": "Has cruel reality grabbed you by the collar and hurled you into the center of the foulest gutter? Even so, do not let your gaze be buried and rot away in the mud. Even when your physical body tumbles across the most miserable rock bottom, only that fierce mental arrogance of never losing elegance while gazing up at the pouring starlight of the night sky is the sole rope that will ultimately pull you out of that gutter."
      },
      {
        "quote_ko": "경험이란 모든 사람이 자신의 실수에 붙이는 이름이다.",
        "quote_en": "Experience is simply the name we give our mistakes.",
        "meaning_ko": "실패할까 봐 두려워 아무것도 시작하지 못한 채 뒷걸음질 치는 당신의 비겁함을 '신중함'이라는 그럴싸한 단어로 포장하지 마시길 바랍니다. 인생에서 가장 가치 있고 값비싼 다이아몬드는 완벽한 성공이 아니라, 온몸이 피투성이가 되도록 처참하게 깨지고 부서진 그 치명적인 '실수'의 파편들입니다. 당당하게 실수하고, 그것을 무섭도록 예리한 경험의 무기로 벼려내십시오.",
        "meaning_en": "I hope you do not package your cowardice of stepping back and failing to start anything out of fear of failure with the plausible word 'prudence.' The most valuable and expensive diamonds in life are not perfect successes, but the fatal fragments of 'mistakes' where you were miserably broken and shattered until your whole body was bloodied. Make mistakes proudly, and forge them into terrifyingly sharp weapons of experience."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected Platinum rewritten giants (21-22) into final-narratives.json');
