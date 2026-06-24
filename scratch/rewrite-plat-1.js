const fs = require('fs');

const dataToInject = {
  "steve-jobs": {
    "era_ko": "20세기 후반 - 21세기 초반 (1955~2011)",
    "era_en": "Late 20th - Early 21st Century (1955~2011)",
    "category": "business",
    "epic_ko": "차가운 금속과 복잡한 회로 기판에 불과했던 컴퓨터라는 기계에 따뜻한 인간의 숨결을 불어넣어, 기술을 인류가 누릴 수 있는 가장 우아하고 직관적인 예술품으로 승화시킨 시대의 연금술사. 스티브 잡스는 태어나자마자 친부모에게 버려지는 가장 깊은 원초적 상처를 안고 삶을 시작했습니다. 그러나 그 끔찍한 결핍과 고독은 그를 무너뜨리기는커녕, 완벽함을 향해 미친 듯이 집착하게 만드는 지독한 갈망의 불쏘시개가 되었습니다. 자신이 청춘을 바쳐 세운 애플에서 쿠데타로 쫓겨나는 참담하고 굴욕적인 순간에도, 그는 결단코 세상과 타협하거나 주저앉지 않았습니다. 픽사와 넥스트를 거치며 황야에서 자신의 감각을 뼈를 깎듯 날카롭게 벼려낸 그는, 파산 직전의 애플로 화려하게 귀환하여 세상을 송두리째 뒤바꿀 '아이폰'이라는 혁명적 마법을 인류의 손에 쥐여주었습니다.\n\n그는 대중이 무엇을 원하는지 시장 조사를 하지 않았습니다. \"사람들은 자신이 무엇을 원하는지 모른다\"는 확고한 신념 아래, 인간의 가장 깊고 무의식적인 욕망을 꿰뚫어 보는 섬뜩할 정도의 직관력을 발휘했습니다. 수많은 버튼과 복잡한 매뉴얼을 전부 지워버리고, 오직 손가락 끝의 직관적인 터치 하나만으로 전 세계를 하나로 연결해버린 그의 미니멀리즘 디자인 철학은, 차가운 기술과 따뜻한 인문학의 교차점에서 피어난 기적이었습니다. 하나의 제품이 출시될 때마다 1밀리미터의 오차도 허용하지 않는 그의 편집광적인 완벽주의는 수많은 직원들을 지옥 같은 고통으로 몰아넣었지만, 결국 그 고통은 전 세계 수십억 명을 매혹시킨 압도적인 혁신으로 결실을 맺었습니다.\n\n죽음이라는 가장 명확하고 두려운 인생의 종착역 앞에서도 그의 시선은 결코 흔들리지 않았습니다. 살이 빠지고 뼈가 앙상하게 드러나는 치명적인 췌장암의 고통 속에서도, 그는 마지막 숨결이 다하는 순간까지 다음 세대를 위한 새로운 디자인과 혁신을 갈구했습니다. 56세라는 너무나도 이른 나이에 세상을 떠났지만, 스티브 잡스의 궤적은 현실의 안주를 맹렬히 거부하고 우주에 거대한 흔적(Dent in the universe)을 남긴 가장 위대한 창조적 파괴자의 압도적인 대서사시로 우리 곁에 영원히 살아 숨 쉬고 있습니다.",
    "epic_en": "The alchemist of an era who breathed warm human breath into computers—mere machines of cold metal and complex circuit boards—sublimating technology into the most elegant and intuitive works of art humanity could enjoy. Steve Jobs began his life bearing the deepest primal wound of being abandoned by his biological parents immediately after birth. However, that horrific deficiency and solitude did not destroy him; instead, it became the kindling for a fierce, mad thirst that drove his obsessive pursuit of perfection. Even during the devastating and humiliating moment of being ousted in a coup from Apple, the company he dedicated his youth to building, he categorically refused to compromise with the world or surrender. Sharpening his senses to a razor's edge in the wilderness through his time at Pixar and NeXT, he made a triumphant return to an Apple on the brink of bankruptcy, placing into humanity's hands the revolutionary magic known as the 'iPhone,' which would completely overturn the world.\n\nHe did not conduct market research to ask the masses what they wanted. Under his firm conviction that \"people don't know what they want until you show it to them,\" he wielded an almost eerie intuition that pierced through humanity's deepest, unconscious desires. Erasing countless buttons and complex manuals to connect the entire world through the single, intuitive touch of a fingertip, his minimalist design philosophy was a miracle blooming at the intersection of cold technology and warm liberal arts. His paranoid perfectionism, which permitted not even a single millimeter of error for any product launch, drove countless employees through hellish suffering, yet that pain ultimately bore fruit in an overwhelming innovation that captivated billions globally.\n\nEven facing death, the most certain and terrifying final destination of life, his gaze never wavered. Amidst the excruciating pain of fatal pancreatic cancer that left him emaciated, he craved new designs and innovations for the next generation until his final breath. Though he passed away at the far too early age of 56, Steve Jobs's trajectory vividly breathes eternally beside us as the overwhelming epic of the greatest creative destroyer, who fiercely rejected complacency to leave a colossal 'dent in the universe.'",
    "trials_ko": "태어나자마자 친부모에게 버림받은 입양아라는 깊은 상실감, 청춘을 바쳐 창업한 애플에서의 비참하고 굴욕적인 축출, 그리고 너무 일찍 찾아온 치명적인 췌장암의 참혹한 육체적 고통.",
    "trials_en": "The profound sense of loss of being an adopted child abandoned immediately at birth, the miserable and humiliating ousting from Apple which he dedicated his youth to found, and the horrific physical agony of fatal pancreatic cancer that arrived far too soon.",
    "overcoming_ko": "자신을 옭아매는 상실과 절망의 감정을 예술적 직관과 편집광적인 완벽주의로 벼려내어, 아이폰이라는 혁명적 기기를 통해 전 세계 인류의 소통 방식과 라이프스타일을 완전히 재창조해냄.",
    "overcoming_en": "He forged the emotions of loss and despair that bound him into artistic intuition and paranoid perfectionism, entirely reinventing the way humanity communicates and lives through the revolutionary device known as the iPhone.",
    "wisdom": [
      {
        "quote_ko": "죽음은 삶이 만든 최고의 발명품이다. 죽음은 낡은 것을 치우고 새로운 것을 위한 길을 만들어준다.",
        "quote_en": "Death is very likely the single best invention of Life. It clears out the old to make way for the new.",
        "meaning_ko": "시간은 당신을 영원히 기다려주지 않습니다. 죽음이라는 절대적이고 피할 수 없는 끝이 존재함을 가슴 깊이 품을 때, 비로소 세상의 차가운 시선이나 실패에 대한 막연한 두려움 따위는 먼지처럼 허망하게 사라지는 법입니다. 남의 인생을 흉내 내느라, 당신에게 주어진 그 귀중하고 유한한 시간을 부디 낭비하지 마십시오.",
        "meaning_en": "Time will not wait for you forever. Only when you deeply embrace the absolute, unavoidable end called death do the cold judgments of the world and the vague fear of failure vainly vanish like dust. Please do not waste the precious, finite time given to you imitating someone else's life."
      },
      {
        "quote_ko": "계속 갈망하라, 늘 바보처럼 머물러라.",
        "quote_en": "Stay hungry, stay foolish.",
        "meaning_ko": "안락하고 따뜻한 성공의 방석에 주저앉아, 스스로 모든 것을 다 안다고 자만하는 순간 인간의 영혼은 부패하기 시작합니다. 늘 채워지지 않는 지독한 갈증으로 스스로를 벼랑 끝으로 매몰차게 몰아세우십시오. 세상 모두가 손가락질하는 바보 같은 짓일지라도, 당신의 심장이 미친 듯이 이끄는 그곳을 향해 거침없이 나아가길 바랍니다.",
        "meaning_en": "The moment you sit upon the comfortable, warm cushion of success and arrogantly believe you know everything, the human soul begins to rot. Relentlessly push yourself to the edge of the cliff with an unquenchable, fierce thirst. Even if it is a foolish act that the whole world points fingers at, I hope you boldly advance toward the place your heart madly leads."
      },
      {
        "quote_ko": "여정 자체가 보상이다.",
        "quote_en": "The journey is the reward.",
        "meaning_ko": "원하는 목표만 이루면 마침내 행복해질 것이라는 헛된 환상을 이제 그만 버리십시오. 목적지에 도달했을 때의 그 짧고 찰나적인 쾌락을 위해 당신의 눈부신 현재를 맹목적으로 희생해서는 안 됩니다. 피 튀기고 넘어지며 전진하는 이 처절하고 땀 냄새 나는 과정 그 자체에서 찌릿한 전율을 느끼는 자만이, 진정으로 세상을 온전히 제 손에 쥘 수 있을 것입니다.",
        "meaning_en": "Stop harboring the vain illusion that you will finally be happy once you achieve your desired goal. You must not blindly sacrifice your dazzling present for the brief, momentary pleasure of reaching a destination. Only the one who feels a thrilling shock in the desperate, sweat-soaked process of advancing, bleeding, and falling will truly be able to grasp the world entirely in their hands."
      }
    ]
  },
  "napoleon-bonaparte": {
    "era_ko": "18세기 후반 - 19세기 초 (1769~1821)",
    "era_en": "Late 18th - Early 19th Century (1769~1821)",
    "category": "leadership",
    "epic_ko": "프랑스 본토인들에게 멸시받고 차별당하던 지중해의 작은 변방 섬 코르시카. 그곳에서 태어난 비쩍 마른 촌뜨기 소년 나폴레옹 보나파르트에게 세상은 언제나 높고 차가운 벽이었습니다. 귀족 자제들이 가득한 프랑스 사관학교에서 그는 촌스러운 억양과 출신 성분 때문에 끝없는 조롱에 시달려야 했습니다. 그러나 그는 외로움에 굴복하며 눈물짓는 대신, 차가운 침묵 속에서 역사와 병법책을 씹어 먹을 듯 탐독하며 자신만의 거대한 칼날을 조용히 벼렸습니다. 프랑스 대혁명이라는 거대한 피바람이 불어닥치며 기존의 질서가 산산조각 났을 때, 아무도 거들떠보지 않던 이 보잘것없는 포병 장교는 툴롱 포위전에서 단 한 번의 눈부신 포격 전술로 자신의 이름을 역사의 한가운데로 폭발시키듯 각인시켰습니다.\n\n혼란의 늪에 빠져 국가를 구원할 절대적인 영웅을 갈망하던 프랑스 민중의 피 끓는 부름에, 그는 누구도 넘지 못할 것이라 믿었던 알프스의 만년설을 군화발로 짓밟으며 압도적이고 경이로운 전승 신화로 화답했습니다. 스스로 자신의 머리에 황제의 관을 쓴 그는 단지 무력으로 영토를 넓힌 단순한 정복자가 아니었습니다. 그는 '나폴레옹 법전'을 제정하여 수백 년을 이어온 부패한 봉건제의 사슬을 끊어버리고, 출신과 핏줄이 아닌 오직 '개인의 능력'에 따라 누구나 높은 자리에 오를 수 있다는 '자유와 평등'의 혁명적 불씨를 유럽 전역에 들불처럼 번지게 만들었습니다. 특히 아우스터리츠 전투에서 전 유럽의 거대한 연합군을 상대로 펼친 상상 초월의 기만전술과 번개 같은 속도전은, 전쟁이라는 야만적인 행위를 가장 고차원적인 예술의 경지로 끌어올린 천재적인 마스터피스였습니다.\n\n비록 혹독한 영하의 러시아 겨울과 워털루의 짙은 안개 속에서 그의 무적의 군대는 무너지고 거대한 제국은 산산조각 났으며, 종국에는 차갑고 외딴 세인트헬레나 섬에 유배되어 쓸쓸히 눈을 감아야 했습니다. 그러나 그가 몰고 온 폭풍이 유럽의 낡은 심장에 깊숙이 꽂아 넣은 '평등과 혁명'이라는 자유의 칼날은 영원히 뽑히지 않았습니다. 나폴레옹 보나파르트의 삶은, 불가능이라는 단어를 자신의 사전에서 찢어버리고 오직 한 인간의 미친듯한 의지와 압도적인 실력만으로 세상의 가장 높은 정점에 도달할 수 있음을 증명해 낸 가장 극적이고 장엄한 인간 승리의 대서사시입니다.",
    "epic_en": "A scrawny, provincial boy born on Corsica—a small, marginalized Mediterranean island despised and discriminated against by mainland Frenchmen. To Napoleon Bonaparte, the world was always a high, cold wall. In a French military academy filled with the children of nobility, he suffered endless mockery for his rustic accent and lowly origins. Yet, rather than succumbing to loneliness and weeping, he quietly forged his own massive blade in cold silence, devouring history and military strategy books as if chewing them raw. When the colossal bloodstorm of the French Revolution shattered the existing order, this insignificant artillery officer—whom no one had ever paid attention to—explosively etched his name into the center of history with a single, brilliant bombardment tactic at the Siege of Toulon.\n\nTo the blood-boiling call of the French people, who languished in the swamp of chaos yearning for an absolute hero to save the nation, he responded with an overwhelming, miraculous myth of unbroken victories, trampling the eternal snows of the Alps—which everyone believed impassable—beneath his military boots. Placing the emperor's crown upon his own head, he was not merely a simple conqueror expanding territory by force. By instituting the 'Napoleonic Code,' he severed the chains of a corrupt feudal system that had lasted for centuries, and spread the revolutionary embers of 'liberty and equality'—the idea that anyone could rise to high positions based solely on 'individual ability' rather than birth and bloodline—like wildfire across Europe. In particular, the unimaginable deception and lightning-fast warfare he deployed against the massive combined armies of all Europe at the Battle of Austerlitz was a genius masterpiece that elevated the barbaric act of war to the highest dimensional realm of art.\n\nAlthough his invincible army crumbled and his colossal empire shattered in the harsh, sub-zero Russian winter and the dense fog of Waterloo, leading to his lonely death in exile on the cold, isolated island of Saint Helena, the storm he brought forth drove the blade of liberty—'equality and revolution'—so deeply into Europe's old heart that it could never be extracted. Napoleon Bonaparte's life is the most dramatic and majestic epic of human triumph, proving that one can tear the word 'impossible' from one's dictionary and reach the highest summit of the world armed with nothing but a human being's mad will and overwhelming capability.",
    "trials_ko": "코르시카 출신의 촌뜨기라는 출신의 꼬리표와 사관학교 시절의 지독한 따돌림, 그리고 러시아 원정의 끔찍한 대실패로 모든 권력을 잃고 외딴섬에 유배된 처절한 몰락과 고독.",
    "trials_en": "The stigma of being a provincial boy from Corsica, the severe bullying during his military academy days, and the desperate downfall and solitude of losing all power and being exiled to an isolated island after the horrific catastrophe of the Russian campaign.",
    "overcoming_ko": "출신의 뼈저린 한계를 자신만의 압도적인 군사적 천재성과 속도전으로 가차 없이 짓밟았으며, 황제의 자리에 올라 나폴레옹 법전을 통해 유럽 전역에 평등이라는 혁명의 정신을 불멸의 유산으로 새겨 넣음.",
    "overcoming_en": "He ruthlessly trampled the bitter limitations of his origins with his own overwhelming military genius and blitz warfare, ascending to the throne of emperor to carve the revolutionary spirit of equality as an immortal legacy across Europe through the Napoleonic Code.",
    "wisdom": [
      {
        "quote_ko": "내 사전에는 불가능이란 단어가 없다.",
        "quote_en": "The word impossible is not in my dictionary.",
        "meaning_ko": "당신의 앞을 가로막아 선 거대하고 압도적인 장벽 앞에서 지레짐작으로 고개를 숙이거나 뒷걸음질 치지 마십시오. 불가능이란 단지 실패를 정당화하려는 겁쟁이들이 만들어낸 허황된 환상에 불과합니다. 당신의 강철 같은 맹렬한 의지와 모든 것을 부숴버릴 돌파력 앞에서, 이 세상에 뚫지 못할 벽은 결코 존재하지 않는 법입니다.",
        "meaning_en": "Do not preemptively bow your head or step back before the colossal, overwhelming barriers blocking your path. Impossible is merely an empty illusion created by cowards trying to justify their failures. Before your fierce, iron-willed resolve and breakthrough power that can smash everything, there is absolutely no wall in this world that cannot be pierced."
      },
      {
        "quote_ko": "상상력이 세상을 지배한다.",
        "quote_en": "Imagination rules the world.",
        "meaning_ko": "당장 눈앞에 보이는 초라한 현실의 조각들에 갇혀 깊은 한숨을 쉬며 주저앉지 마시길 바랍니다. 천하를 제패하고 세상을 뒤집는 진정한 힘은 날카로운 칼끝이 아니라, 바로 당신의 머릿속에서 한계 없이 뻗어나가는 위대한 상상력에서 시작됩니다. 먼저 머릿속에서 완벽하게 승리하십시오. 그리고 나서 현실에 그 승리를 깊게 각인시키면 됩니다.",
        "meaning_en": "I hope you will not sit down with a deep sigh, trapped by the shabby fragments of reality immediately visible before your eyes. The true power to conquer the world and overturn reality begins not at the tip of a sharp sword, but in the great, limitless imagination expanding within your mind. Achieve perfect victory in your mind first. Then, simply engrave that victory deeply onto reality."
      },
      {
        "quote_ko": "승리는 가장 끈기 있는 자의 것이다.",
        "quote_en": "Victory belongs to the most persevering.",
        "meaning_ko": "초반에 얻은 작은 승리에 도취하여 자만하거나, 단 한 번의 치명적인 패배에 엎어져서 모든 것을 포기하지 마십시오. 인생의 진정한 승부는 모두가 지쳐 나가떨어지는 그 참혹한 마지막 1초에서 결정되는 법입니다. 입술을 꽉 깨물고, 뼈가 부서지는 고통 속에서도 눈을 부릅뜨고 마지막 한 걸음을 내딛는 자만이 결국 모든 것을 손에 쥐게 될 것입니다.",
        "meaning_en": "Do not become arrogant, intoxicated by small early victories, nor give up everything by collapsing at a single fatal defeat. Life's true contests are decided in that horrific final second when everyone else is exhausted and drops out. Only the one who bites their lip tight and takes that last step with glaring eyes, even amidst bone-crushing pain, will ultimately grasp everything in their hands."
      }
    ]
  },
  "king-sejong": {
    "era_ko": "15세기의 거인 (1397~1450)",
    "era_en": "15th Century Giant (1397~1450)",
    "category": "leadership",
    "epic_ko": "수많은 형제와 공신들의 피를 뿌리는 잔혹한 숙청으로 왕좌를 찬탈했던 아버지 태종. 그 서늘하고 피비린내 나는 칼날 위에서 조선의 제4대 국왕으로 왕위를 이어받은 젊은 군주 세종의 앞에는, 권력의 단맛에 취해 오만해진 사대부들과 무지몽매함 속에 고통받는 헐벗은 백성들만이 위태롭게 놓여 있었습니다. 하지만 그는 아버지가 물려준 폭력의 칼 대신 수만 권의 책을 자신의 가장 강력한 무기로 삼았습니다. 지독하고 맹렬한 독서벽으로 두 눈이 짓무르고 끝내 시력을 잃어가는 칠흑 같은 고통 속에서도, 그는 오직 굶주리고 핍박받는 백성의 삶을 구제하겠다는 단 하나의 숭고한 집념으로 끝없는 밤을 하얗게 지새웠습니다.\n\n그가 만들어낸 세계 최고 수준의 천문 관측 기구들, 우리 땅에 맞는 농법을 집대성한 농사직설, 한양을 기준으로 하늘의 움직임을 계산한 칠정산은 그저 국가의 위신을 세우기 위한 정치적 과시물이 아니었습니다. 그것은 농사짓는 때를 몰라 흉년의 굶주림에 허덕이는 늙고 주름진 농부, 그리고 한자를 몰라 관청에서 억울하게 매를 맞고 목숨을 잃는 어리석은 백성들의 피눈물을 닦아주기 위한 군주의 눈물겨운 사랑의 발로였습니다. 기득권 사대부들이 한자를 버리는 것은 '짐승 같은 오랑캐가 되는 길'이라며 목숨을 걸고 맹렬히 반대할 때, 그는 홀로 어두운 편전에서 인간의 발음 기관을 해부하듯 치밀하게 분석하여 세상에서 가장 완벽하고 쉬운 28자의 마법, '훈민정음'을 기적처럼 창제해 냈습니다.\n\n살이 썩어 들어가는 등창의 끔찍한 고통과, 사랑하는 자식들과 아내를 연이어 먼저 떠나보내야 했던 피를 토하는 슬픔 속에서도 그는 결단코 백성을 묘휼하는 일을 포기하지 않았습니다. 세상의 모든 부조리와 계급적 무지를 '문자'라는 가장 강력한 빛으로 찢어발긴 그의 삶은, 군주라는 이름이 군림하는 권력이 아니라 가장 낮은 곳의 백성을 향해 짊어져야 할 가장 무겁고 처절한 헌신임을 완벽하게 증명해 낸 우리 역사상 가장 위대한 성군의 대서사시입니다.",
    "epic_en": "His father, Taejong, had usurped the throne through cruel purges that spilled the blood of countless brothers and loyal subjects. Upon inheriting the crown as the fourth king of Joseon atop that chilling, blood-stained blade, the young monarch Sejong faced only arrogant scholar-officials drunk on the sweetness of power and destitute commoners suffering perilously in ignorance. However, instead of the sword of violence passed down by his father, he made tens of thousands of books his most powerful weapon. Even in the pitch-black agony of festering eyes and ultimate blindness caused by his fierce, obsessive reading habit, he stayed awake through endless nights with a single, sublime obsession: to save the lives of his starving and persecuted people.\n\nThe world's highest-level astronomical observation instruments he created, the 'Nongsa Jikseol' (Straight Talk on Farming) which compiled farming methods suited to their land, and the 'Chiljeongsan' which calculated celestial movements based on Hanyang, were not merely political displays to establish national prestige. They were the manifestation of a monarch's tearful love, meant to wipe away the tears of blood from old, wrinkled farmers struggling with famine because they didn't know the farming seasons, and foolish commoners unjustly beaten and executed at government offices because they could not read classical Chinese. When the establishment scholar-officials fiercely opposed him with their lives, claiming that abandoning Chinese characters was 'the path to becoming beastly barbarians,' he sat alone in the dark royal chamber, meticulously analyzing human vocal organs as if dissecting them, to miraculously invent the world's most perfect and simple magic of 28 letters: 'Hunminjeongeum' (Hangul).\n\nDespite the horrific agony of rotting back ulcers and the blood-vomiting sorrow of consecutively outliving his beloved children and wife, he categorically never abandoned his duty to care for his people. Tearing through all the absurdities and class-based ignorance of the world with the most powerful light called 'letters,' his life is the grandest epic of the greatest sage king in history, perfectly proving that the title of monarch is not about reigning power, but the heaviest, most desperate dedication one must bear for the people at the very bottom.",
    "trials_ko": "과도한 정무와 지독한 독서로 인한 치명적인 시력 상실과 육체의 질병(등창), 기득권을 지키려는 양반층 사대부들의 맹렬하고 거센 정치적 저항, 그리고 가족을 잃는 인간적인 슬픔.",
    "trials_en": "Fatal loss of vision and physical illnesses (back ulcers) from excessive state affairs and obsessive reading, fierce and violent political resistance from the aristocratic scholar-officials protecting their establishment, and the human sorrow of losing his family.",
    "overcoming_ko": "자신의 육체가 썩어 부서지는 끔찍한 고통 속에서도 백성을 향한 지극한 연민과 애민정신으로 한글(훈민정음)을 창제하여, 지식의 기득권 독점을 깨고 만백성에게 문자의 빛을 선사함.",
    "overcoming_en": "Even as his own body rotted and crumbled in horrific agony, his profound compassion and love for his people drove him to invent Hangul (Hunminjeongeum), breaking the establishment's monopoly on knowledge and gifting the light of letters to all commoners.",
    "wisdom": [
      {
        "quote_ko": "백성은 나라의 근본이요, 밥은 백성의 하늘이다.",
        "quote_en": "The people are the root of the state, and food is the heaven of the people.",
        "meaning_ko": "거창하고 뜬구름 잡는 이념이나 화려한 말잔치만으로 사람의 마음을 온전히 움직이려 하지 마십시오. 거대한 조직이든 작은 가정이든, 타인의 진심을 얻으려면 그들의 가장 절박하고 현실적인 고통, 즉 배고픔부터 따뜻하게 어루만져 주어야 하는 법입니다. 진정한 리더십은 높은 단상이 아니라, 기꺼이 발을 진흙탕에 담그고 밥을 챙겨주는 밑바닥에서부터 시작됨을 명심하십시오.",
        "meaning_en": "Do not attempt to fully move people's hearts with grandiose, lofty ideologies or flashy rhetoric alone. Whether in a massive organization or a small family, to win the true hearts of others, you must first warmly soothe their most desperate, practical suffering: their hunger. Keep in mind that true leadership begins not on a high podium, but at the rock bottom where you willingly plunge your feet into the mud to ensure they are fed."
      },
      {
        "quote_ko": "꽃이 지는 것을 슬퍼하지 마라. 바람이 불면 또 다른 씨앗이 흩날릴 것이니.",
        "quote_en": "Do not grieve the falling of flowers. When the wind blows, other seeds will scatter.",
        "meaning_ko": "당신이 밤낮으로 피땀 흘려 공들인 프로젝트나 소중한 인간관계가 허무하게 무너졌다고 해서, 마치 인생의 모든 것이 끝난 양 주저앉아 절망하지 마십시오. 시련이라는 이름의 거친 바람은 결코 당신을 죽이려는 것이 아닙니다. 썩은 가지를 꺾어버림과 동시에 당신 내면에 깊이 잠들어 있던 새로운 기회의 씨앗을 더 넓고 눈부신 세상으로 퍼뜨려 주는 위대한 자연의 섭리임을 믿으시길 바랍니다.",
        "meaning_en": "Even if a project you poured your blood, sweat, and tears into day and night, or a precious relationship, collapses vainly, do not sit down in despair as if everything in your life is over. The harsh wind named 'trial' is never meant to kill you. Please believe it is the great providence of nature, snapping rotten branches while simultaneously scattering the seeds of new opportunities deeply dormant within you to a wider, dazzling world."
      },
      {
        "quote_ko": "내가 꿈꾸는 태평성대는 백성들이 하고 싶은 일을 하며 살게 하는 것이다.",
        "quote_en": "The peaceful reign I dream of is one where the people can live doing the work they desire.",
        "meaning_ko": "타인을 억지로 통제하고 숨 막히는 규율로 채찍질한다고 해서 사람이 위대하게 성장하는 것은 결코 아닙니다. 당신 곁의 사람들이 각자의 무대에서 가슴 뛰는 일을 찾고, 자신이 가진 가장 빛나는 재능을 마음껏 폭발시킬 수 있도록 든든한 판을 깔아주십시오. 그것이야말로 세상을 품는 가장 위대한 포용이자, 시대를 진일보시키는 가장 강력한 방식임을 잊지 마시길 바랍니다.",
        "meaning_en": "People absolutely do not grow to greatness by being forcibly controlled and whipped with suffocating rules. Lay a solid foundation so that the people around you can find heart-pounding work on their respective stages and freely explode their most brilliant talents. I hope you never forget that this is the greatest inclusion to embrace the world and the most powerful method to advance an era."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected Platinum rewritten giants (1-3) into final-narratives.json');
