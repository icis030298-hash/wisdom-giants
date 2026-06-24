const fs = require('fs');

const dataToInject = {
  "viktor-frankl": {
    "era_ko": "20세기의 거인 (1905~1997)",
    "era_en": "20th Century Giant (1905~1997)",
    "category": "arts",
    "epic_ko": "인간성이 철저히 말살되고 잿빛 죽음의 연기만이 피어오르던 아우슈비츠 강제 수용소. 촉망받던 정신과 의사였던 빅터 프랭클은 어느 날 갑자기 이름 대신 팔뚝에 새겨진 죄수 번호 '119104'로 불리게 되었습니다. 사랑하는 아내와 부모님, 형제들은 모두 가스실의 참혹한 이슬로 사라졌고, 그가 필생의 역작으로 집필하던 소중한 원고마저 나치 친위대의 구둣발에 무참히 찢겨 불태워졌습니다. 얼어붙은 흙바닥에서 강제 노역에 시달리며 매일 아침 옆자리의 동료들이 싸늘한 주검으로 실려 나가는 지옥 한가운데서, 인간이 품을 수 있는 유일한 감정은 짐승 같은 생존 본능과 깊은 절망뿐인 것처럼 보였습니다. 그러나 그는 그 끔찍한 절망의 심연 속에서, 오히려 육체의 한계를 아득히 뛰어넘는 위대한 인간 정신의 불멸성을 발견해 냈습니다.\n\n수용소의 가혹한 굶주림과 구타 속에서도 어떤 이들은 남의 빵을 훔치며 짐승으로 전락했지만, 어떤 이들은 자신의 마지막 남은 빵 한 조각을 죽어가는 동료의 입에 넣어주며 성자처럼 행동했습니다. 프랭클은 이 극단적인 두 인간상을 예리하게 관찰하며, \"나치가 나의 모든 것을 빼앗아 갈지라도, 주어진 끔찍한 환경에 어떻게 반응할 것인지 선택할 수 있는 '인간의 마지막 자유'만큼은 결단코 빼앗을 수 없다\"는 숭고하고 위대한 철학적 깨달음에 도달했습니다. 그는 동료들에게 살아야 할 '단 하나의 이유와 의미'를 찾아주기 위해 끊임없이 대화하며 그들의 차가운 영혼을 어루만졌습니다.\n\n기적적으로 수용소에서 살아남아 해방된 그는, 잿더미가 된 자신의 삶 위에서 '로고테라피(의미 치료)'라는 완전히 새로운 정신의학의 지평을 열어젖혔습니다. 그가 피눈물로 써 내려간 명저 '죽음의 수용소에서'는 전 세계 수천만 명의 길을 잃고 방황하는 영혼들에게 벼락같은 깨달음을 안겨주었습니다. 빅터 프랭클의 삶은 인간이 떨어질 수 있는 가장 참혹하고 밑바닥인 지옥에서도, 스스로 삶의 '의미'를 찾아내는 자는 그 어떤 절망과 가스실의 공포조차 완벽하게 이겨낼 수 있음을 증명한 가장 숭고하고 눈부신 인간 승리의 대서사시입니다.",
    "epic_en": "Auschwitz concentration camp, where humanity was utterly annihilated and only the gray smoke of death rose. Viktor Frankl, a promising psychiatrist, suddenly found himself stripped of his name, known only by the prisoner number '119104' tattooed on his forearm. His beloved wife, parents, and brother all vanished into the horrific dew of the gas chambers, and the precious manuscript he had been writing as his life's masterwork was ruthlessly torn and burned beneath the jackboots of the SS. Amidst forced labor on the frozen dirt, in the middle of a hell where colleagues beside him were carried out as cold corpses every morning, the only emotions a human could harbor seemed to be beast-like survival instincts and profound despair. Yet, from the very abyss of that horrific despair, he instead discovered the immortality of the great human spirit that leaps far beyond physical limitations.\n\nAmidst the camp's harsh starvation and beatings, some devolved into beasts stealing others' bread, while others acted like saints, placing their last piece of bread into the mouths of dying comrades. Keenly observing these two extreme human archetypes, Frankl reached a sublime and great philosophical realization: \"Even if the Nazis strip me of everything, they can absolutely never take away the 'last human freedom'—the ability to choose how I respond to a given horrific environment.\" He constantly conversed with his fellow prisoners, soothing their cold souls to help them find 'one single reason and meaning' to live.\n\nMiraculously surviving and liberated from the camp, he threw open the horizon of an entirely new branch of psychiatry called 'Logotherapy' atop the ashes of his own life. His masterpiece, 'Man's Search for Meaning,' written in tears of blood, delivered a lightning-like realization to tens of millions of lost and wandering souls worldwide. Viktor Frankl's life is the most sublime and dazzling epic of human triumph, proving that even in the most horrific rock-bottom hell a human can fall into, one who finds the 'meaning' of their own life can perfectly overcome any despair and even the terror of the gas chambers.",
    "trials_ko": "가족 모두가 가스실에서 학살당하는 끔찍한 비극, 아우슈비츠 수용소에서의 짐승만도 못한 강제 노역과 굶주림, 그리고 매일 턱밑까지 다가오는 죽음의 극한 공포.",
    "trials_en": "The horrific tragedy of his entire family being massacred in gas chambers, the subhuman forced labor and starvation in the Auschwitz concentration camp, and the extreme terror of death closing in on his throat every single day.",
    "overcoming_ko": "모든 것을 빼앗긴 죽음의 수용소 한가운데서 주어진 고통의 환경을 어떻게 받아들일 것인지 선택하는 '마지막 자유'를 깨닫고, 삶의 의미(로고테라피)를 찾아냄으로써 육체적 절망을 초월함.",
    "overcoming_en": "In the midst of a death camp where everything was stripped away, he realized the 'last freedom' to choose how to accept his given environment of suffering, and transcended physical despair by finding the meaning of life (Logotherapy).",
    "wisdom": [
      {
        "quote_ko": "어떤 상황에서도 잃지 않을 수 있는 인간의 마지막 자유는, 주어진 환경에 어떻게 반응할지 자신의 태도를 결정하는 것이다.",
        "quote_en": "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.",
        "meaning_ko": "세상이 당신의 재산, 직위, 심지어 건강과 사랑하는 이들까지 모든 것을 잔인하게 빼앗아 갈 수는 있습니다. 그러나 그 끔찍하고 숨 막히는 절망 속에서도, 짐승처럼 울부짖을 것인지 아니면 성자처럼 존엄을 지킬 것인지 결정하는 '태도의 자유'만큼은 그 누구도 감히 건드릴 수 없음을 명심하십시오. 가장 어두운 지옥조차 당신의 정신을 지배할 수는 없습니다.",
        "meaning_en": "The world may cruelly strip away everything you have—your wealth, position, and even your health and loved ones. However, please keep in mind that even in that horrific, suffocating despair, no one dare touch your 'freedom of attitude' to decide whether you will howl like a beast or maintain your dignity like a saint. Not even the darkest hell can dominate your spirit."
      },
      {
        "quote_ko": "살아야 할 '이유(Why)'를 아는 사람은 어떤 '방법(How)'도 견뎌낼 수 있다.",
        "quote_en": "Those who have a 'why' to live, can bear with almost any 'how'.",
        "meaning_ko": "끝이 보이지 않는 가혹한 시련 앞을 마주했을 때, 당장 눈앞의 고통을 피할 얄팍한 방법만 찾으려 몸부림치지 마십시오. 당신의 삶을 지탱하는 본질적인 '이유'와 '의미'를 가슴 깊은 곳에서 끌어올리는 것이 먼저입니다. 당신이 숨 쉬어야 할 단 하나의 확고한 의미를 찾아낸다면, 당신의 육체는 그 어떤 지옥의 불길조차 너끈히 견뎌낼 수 있을 것입니다.",
        "meaning_en": "When facing a harsh trial with no end in sight, do not struggle merely to find shallow ways to avoid the immediate pain. You must first draw up the fundamental 'reason' and 'meaning' that supports your life from deep within your heart. If you find that single, firm meaning for why you must breathe, your physical body will easily endure even the flames of any hell."
      },
      {
        "quote_ko": "성공이나 행복을 목표로 삼지 마라. 그것은 의미 있는 삶에 헌신할 때 자연스럽게 따라오는 부산물일 뿐이다.",
        "quote_en": "Don't aim at success. The more you aim at it and make it a target, the more you are going to miss it. For success, like happiness, cannot be pursued; it must ensue.",
        "meaning_ko": "수치화된 성공이나 쾌락적인 행복 자체를 삶의 유일한 과녁으로 삼고 맹목적으로 쫓아다니지 마시길 바랍니다. 진정한 행복과 존경받는 성공은 당신 자신보다 더 크고 위대한 의미에 묵묵히 헌신하고 땀 흘릴 때, 마치 밤하늘의 그림자처럼 당신의 등 뒤에 조용하고도 확실하게 내려앉는 위대한 부산물임을 잊지 마십시오.",
        "meaning_en": "I hope you do not make quantified success or hedonistic happiness itself the sole target of your life and chase them blindly. Please do not forget that true happiness and respected success are great byproducts that settle quietly and surely behind your back, like shadows in the night sky, when you silently dedicate yourself and sweat for a meaning larger and greater than yourself."
      }
    ]
  },
  "oprah-winfrey": {
    "era_ko": "20세기의 거인 (1954~ )",
    "era_en": "20th Century Giant (1954~ )",
    "category": "arts",
    "epic_ko": "미국 남부 미시시피주의 가난한 미혼모 밑에서 사생아로 태어나, 감자 포대로 만든 옷을 입고 이웃의 조롱을 받으며 자라야 했던 흑인 소녀. 오프라 윈프리의 유년 시절은 차마 눈 뜨고 볼 수 없는 잔혹한 학대와 지옥 같은 상처로 얼룩져 있었습니다. 불과 9살이라는 어린 나이에 사촌 오빠와 친척들에게 참혹한 성폭행을 당하고, 14살에 원치 않는 미혼모가 되어 낳은 아이를 2주 만에 잃는 끔찍한 비극을 겪었습니다. 세상의 모든 불행을 온몸으로 두들겨 맞은 듯한 그녀의 삶은 벼랑 끝의 비행 청소년으로 추락하고 있었지만, 아버지의 엄격한 교육과 독서를 통해 그녀는 자신의 영혼을 구원할 한 줄기 빛을 찾아냈습니다.\n\n지방 방송국의 말단 앵커로 시작한 그녀의 방송 경력 역시 결코 순탄치 않았습니다. '흑인 여성'이라는 꼬리표와 '뉴스 앵커로는 너무 감정적이다'라는 비난을 받으며 메인 뉴스에서 쫓겨나는 수모를 겪었습니다. 그러나 그녀는 이 치명적인 약점을 자신만의 가장 강력한 무기로 완벽하게 뒤집어버렸습니다. 차갑고 권위적인 기존 앵커들의 껍데기를 가차 없이 벗어 던지고, 게스트의 아픔에 진심으로 공감하며 스튜디오 한복판에서 함께 부둥켜안고 펑펑 눈물을 쏟아내는 파격적인 토크쇼를 선보인 것입니다. 그녀의 토크쇼는 단순한 예능이 아니었습니다. 자신의 끔찍했던 성폭행 피해 사실마저 카메라 앞에서 적나라하게 고백하며, 수천만 시청자들의 숨겨진 상처를 어루만지고 치유하는 거대한 영적 구원의 집회가 되었습니다.\n\n이 압도적인 공감의 힘은 그녀를 25년간 미국 낮 시간대 TV 시청률 1위를 지키는 역사상 가장 위대한 토크쇼의 여왕이자, 세계에서 가장 영향력 있는 억만장자 여성으로 끌어올렸습니다. 세상의 시선으로는 도저히 재기할 수 없을 것 같았던 밑바닥 흑인 소녀가 이룩한 이 거대한 제국. 오프라 윈프리의 삶은 자신을 갈기갈기 찢어 놓았던 과거의 참혹한 상처를 타인과 세상을 치유하는 가장 따뜻하고 눈부신 빛으로 찬란하게 승화시킨, 인류 역사상 가장 아름답고 기적적인 인간 승리의 대서사시입니다.",
    "epic_en": "Born an illegitimate child to a poor single mother in Mississippi in the American South, a Black girl who had to grow up wearing dresses made of potato sacks amidst the mockery of her neighbors. Oprah Winfrey's childhood was stained with horrific abuse and hellish wounds too painful to look at. At the tender age of nine, she suffered gruesome sexual abuse by a cousin and other relatives, and at 14, she experienced the horrific tragedy of becoming an unwanted single mother and losing her baby just two weeks later. Her life, seemingly battered by all the misfortunes of the world, was plummeting into juvenile delinquency at the edge of a cliff. Yet, through her father's strict discipline and reading, she found a ray of light to salvage her soul.\n\nHer broadcasting career, starting as a low-level anchor at a local station, was by no means smooth. Enduring the stigma of being a 'Black woman' and criticized as 'too emotional for a news anchor,' she suffered the humiliation of being demoted from the main news. However, she perfectly flipped this fatal weakness into her most powerful weapon. Ruthlessly shedding the cold, authoritative shell of traditional anchors, she debuted an unconventional talk show where she genuinely empathized with her guests' pain, embracing them in the middle of the studio and shedding buckets of tears together. Her talk show was not mere entertainment. Even explicitly confessing her own horrific past as a victim of sexual abuse in front of the cameras, it became a massive assembly of spiritual salvation that soothed and healed the hidden wounds of tens of millions of viewers.\n\nThis overwhelming power of empathy elevated her to the undisputed queen of the greatest talk show in history, maintaining the #1 daytime TV ratings in America for 25 years, and becoming one of the most influential billionaire women in the world. This massive empire was built by a bottom-rung Black girl whom the world thought could never recover. Oprah Winfrey's life is the most beautiful and miraculous epic of human triumph in history, brilliantly sublimating the horrific wounds of a past that tore her to shreds into the warmest and most dazzling light that heals others and the world.",
    "trials_ko": "사생아로 태어난 지독한 가난, 어린 시절 겪은 친척들의 참혹한 성폭행과 14살 미혼모로서 아이를 잃은 끔찍한 절망, 그리고 흑인 여성이라는 인종차별의 벽.",
    "trials_en": "The severe poverty of being born an illegitimate child, the horrific sexual abuse by relatives experienced in childhood, the terrifying despair of losing a child as a 14-year-old single mother, and the wall of racial discrimination as a Black woman.",
    "overcoming_ko": "자신의 끔찍한 상처와 감정적 연약함을 숨기지 않고 100% 드러내는 압도적인 '공감의 힘'으로 승화시켜, 수천만 명의 아픔을 치유하는 세계 최고의 토크쇼 여왕이자 억만장자로 우뚝 섬.",
    "overcoming_en": "Sublimating her horrific wounds and emotional vulnerabilities into an overwhelming 'power of empathy' by exposing them 100% without hiding, she stood tall as the world's top talk show queen and a billionaire who healed the pain of tens of millions.",
    "wisdom": [
      {
        "quote_ko": "당신의 상처를 지혜로 바꾸어라.",
        "quote_en": "Turn your wounds into wisdom.",
        "meaning_ko": "과거에 겪은 참혹한 학대와 배신, 그리고 수치스러운 실패의 상처를 가슴속에 꼭꼭 숨겨둔 채 어둠 속에서 홀로 신음하지 마십시오. 당신의 그 피 흘리는 상처를 세상 밖으로 꺼내어 당당하게 직면할 때, 그것은 타인의 아픔을 진심으로 이해하고 세상을 치유할 수 있는 가장 위대하고 따뜻한 지혜의 마법으로 완전히 탈바꿈할 것입니다.",
        "meaning_en": "Do not moan alone in the darkness, hiding the horrific abuse, betrayal, and shameful wounds of failure from your past deep inside your heart. When you bring those bleeding wounds out into the world and face them proudly, they will completely transform into the greatest, warmest magic of wisdom that can genuinely understand the pain of others and heal the world."
      },
      {
        "quote_ko": "우리가 무슨 일을 겪었느냐보다 중요한 것은, 그 일을 겪고 난 후 우리가 어떤 사람이 되기로 선택하느냐이다.",
        "quote_en": "It doesn't matter who you are, where you come from. The ability to triumph begins with you. Always.",
        "meaning_ko": "태어난 환경이 끔찍하게 불우했다고, 부모나 세상이 당신에게 가혹한 상처를 주었다고 평생을 원망하며 피해자로 남으려 하지 마시길 바랍니다. 당신에게 닥친 비극은 당신의 잘못이 아닐지라도, 그 비극을 딛고 일어나 남을 돕는 영웅이 될 것인지, 평생 상처만 핥는 패배자가 될 것인지는 오직 당신의 맹렬한 선택에 달려있음을 절대 잊지 마십시오.",
        "meaning_en": "I hope you do not seek to remain a victim, spending your entire life resenting that you were born into a horrifically unfortunate environment or that your parents or the world inflicted harsh wounds upon you. Even if the tragedy that befell you is not your fault, never forget that whether you rise above that tragedy to become a hero who helps others or a loser who licks their wounds forever depends solely on your fierce choice."
      },
      {
        "quote_ko": "인생의 가장 큰 비밀은 큰 비밀 같은 것은 없다는 것이다. 당신의 목표가 무엇이든, 땀 흘려 일할 의지만 있다면 달성할 수 있다.",
        "quote_en": "The big secret in life is that there is no big secret. Whatever your goal, you can get there if you're willing to work.",
        "meaning_ko": "세상을 단숨에 뒤집어줄 기적 같은 비법이나 지름길이 있을 거라는 헛된 환상에 속아 당신의 소중한 땀과 시간을 낭비하지 마십시오. 가장 위대한 마법은 화려한 요행이 아니라, 매일 아침 눈을 뜨고 이를 악문 채 어제보다 한 걸음 더 내딛는 그 우직하고 지독한 노동의 땀방울 속에 명백하게 숨겨져 있습니다.",
        "meaning_en": "Do not waste your precious sweat and time deceived by the vain illusion that there is some miraculous secret or shortcut that will instantly overturn the world. The greatest magic is not flashy luck, but is clearly hidden within the sweat drops of that honest, stubborn labor where you open your eyes every morning, grit your teeth, and take one more step than yesterday."
      }
    ]
  },
  "nelson-mandela": {
    "era_ko": "20세기의 거인 (1918~2013)",
    "era_en": "20th Century Giant (1918~2013)",
    "category": "leadership",
    "epic_ko": "인간의 피부색이 그 사람의 존엄과 운명을 완벽하게 결정짓던 참혹한 야만의 시대, 남아프리카공화국. 극단적인 백인 우월주의 정권(아파르트헤이트)의 잔혹한 폭압 아래서, 엘리트 흑인 변호사였던 넬슨 만델라는 안락한 기득권의 삶을 가차 없이 내던졌습니다. 평화로운 시위마저 기관총과 군화발로 피투성이가 되어 짓밟히는 참상을 목격한 그는, 어쩔 수 없이 창을 들고 아프리카 민족회의(ANC)의 무장 투쟁을 이끌었습니다. 결국 반역죄로 체포된 그는 햇빛조차 제대로 들지 않는 로벤섬의 비좁고 차가운 독방에 갇혀, 무려 27년이라는 상상할 수조차 없는 영겁의 세월 동안 짐승만도 못한 취급을 받으며 철저히 고립되었습니다.\n\n강제 노역으로 눈이 멀고 폐가 망가지는 끔찍한 육체적 고통 속에서도, 그리고 어머니와 아들의 장례식조차 참석하지 못하는 뼈를 깎는 비통함 속에서도 그의 숭고한 영혼은 결코 무너지지 않았습니다. 백인 교도관들의 잔혹한 학대와 모욕 앞에서도 그는 결단코 분노의 노예가 되지 않았습니다. 오히려 그는 차가운 감방 안에서 백인들의 언어인 아프리칸스어를 묵묵히 공부하며, 언젠가 다가올 자유의 날에 자신의 적들을 완벽하게 이해하고 포용하기 위한 거대한 용서의 칼날을 조용히 벼렸습니다. 폭압적인 정권이 그에게 자유를 미끼로 투쟁을 포기할 것을 수차례 회유했지만, 그는 \"자유민만이 협상할 수 있다\"며 맹렬하게 거부하고 자신의 신념을 강철처럼 지켰습니다.\n\n마침내 72세의 백발노인이 되어 전 세계의 환호 속에 감옥 문을 나섰을 때, 흑인 민중들은 그가 27년간 쌓아온 분노를 폭발시켜 백인들을 향한 피의 복수극을 벌여주기를 갈망했습니다. 그러나 흑인 최초로 대통령에 당선된 그는 단호하게 복수의 칼을 부러뜨렸습니다. 자신을 고문했던 백인 지도자들을 끌어안고 '진실화해위원회'를 통해 피의 보복 대신 용서와 통합이라는 기적적인 길을 선택한 것입니다. 넬슨 만델라의 삶은, 27년의 차가운 철창과 지옥 같은 학대로도 결코 한 인간의 존엄을 꺾을 수 없었으며, 끓어오르는 복수심을 초인적인 포용으로 승화시킨 자만이 진정으로 분열된 국가와 세상을 구원할 수 있음을 입증한 인류 역사상 가장 위대한 자유와 평화의 대서사시입니다.",
    "epic_en": "South Africa, a horrifically barbaric era where the color of one's skin perfectly determined their dignity and destiny. Under the brutal oppression of the extreme white supremacist regime (Apartheid), Nelson Mandela, an elite Black lawyer, ruthlessly threw away his comfortable life of privilege. Witnessing the atrocity of even peaceful protests being stomped into bloodbaths by machine guns and jackboots, he was left with no choice but to take up arms and lead the armed struggle of the African National Congress (ANC). Ultimately arrested for treason, he was thrown into a cramped, cold solitary cell on Robben Island barely touched by sunlight, thoroughly isolated and treated worse than a beast for an unimaginable eternity of 27 years.\n\nEven in the horrific physical agony of going blind and damaging his lungs from forced labor, and the bone-grinding sorrow of being denied attendance at his mother's and son's funerals, his sublime soul never crumbled. In the face of brutal abuse and insults from white guards, he absolutely refused to become a slave to anger. Rather, inside the cold cell, he silently studied Afrikaans, the language of the whites, quietly forging a colossal blade of forgiveness to perfectly understand and embrace his enemies on the day of freedom that would someday come. Though the oppressive regime repeatedly attempted to appease him, offering freedom as bait if he renounced his struggle, he fiercely rejected them, stating, \"Only free men can negotiate,\" and guarded his convictions like steel.\n\nWhen he finally walked out of the prison doors to the cheers of the whole world as a 72-year-old white-haired man, the Black masses yearned for him to explode the anger he had built up over 27 years and unleash a bloody revenge against the whites. However, upon being elected the first Black president, he decisively snapped the sword of vengeance. Embracing the white leaders who had tortured him and establishing the 'Truth and Reconciliation Commission,' he chose the miraculous path of forgiveness and integration instead of bloody retribution. Nelson Mandela's life is the grandest epic of freedom and peace in human history, proving that 27 years behind cold iron bars and hellish abuse could never break a human's dignity, and that only one who sublimates boiling vengeance into superhuman inclusion can truly save a divided nation and world.",
    "trials_ko": "백인 우월주의 정권의 야만적인 폭압, 무장 투쟁 중 체포되어 로벤섬의 비좁은 독방에서 짐승처럼 갇혀 지내야 했던 27년간의 처절하고 기나긴 옥살이, 그리고 가족의 죽음조차 지켜볼 수 없었던 극한의 고독.",
    "trials_en": "The barbaric oppression of the white supremacist regime, the desperate, grueling 27-year imprisonment locked like a beast in a cramped solitary cell on Robben Island after being arrested during armed struggle, and the extreme solitude of not even being able to witness the deaths of his family.",
    "overcoming_ko": "27년의 지옥 같은 옥살이 속에서도 결코 복수심에 잡아먹히지 않는 강철 같은 정신력을 유지했으며, 대통령 당선 후 피의 보복 대신 압도적인 용서와 포용(진실화해위원회)으로 피로 물들 뻔한 국가를 하나로 통합해 냄.",
    "overcoming_en": "Maintaining an iron-like mentality that was never consumed by a thirst for revenge even amidst 27 years of hellish imprisonment, upon election as president, he chose overwhelming forgiveness and inclusion (Truth and Reconciliation Commission) over bloody retribution, uniting a nation that was on the brink of a bloodbath.",
    "wisdom": [
      {
        "quote_ko": "용서는 내 영혼을 해방시킨다. 그것이 두려움을 없애기 때문에 용서는 강력한 무기이다.",
        "quote_en": "Forgiveness liberates the soul. It removes fear. That is why it is such a powerful weapon.",
        "meaning_ko": "당신에게 끔찍한 상처와 씻을 수 없는 모욕을 준 자들을 향해 가슴속에 날 선 분노와 복수심의 칼을 갈고 계십니까? 그 끓어오르는 맹렬한 증오는 결국 적이 아니라 당신 자신의 고귀한 영혼을 가장 먼저 파괴하고 갉아먹는 치명적인 독약임을 깨달으십시오. 진정한 승리는 적을 발밑에 짓밟는 것이 아니라, 초인적인 용서를 통해 과거의 감옥에서 당신 스스로를 영원히 해방시키는 것임을 명심하시길 바랍니다.",
        "meaning_en": "Are you grinding a sharp sword of anger and revenge in your heart against those who inflicted horrific wounds and indelible insults upon you? Realize that this boiling, fierce hatred is a fatal poison that ultimately destroys and gnaws away at your own noble soul first, not the enemy's. Please keep in mind that true victory is not trampling the enemy underfoot, but eternally liberating yourself from the prison of the past through superhuman forgiveness."
      },
      {
        "quote_ko": "가장 위대한 영광은 한 번도 실패하지 않는 것이 아니라, 넘어질 때마다 다시 일어나는 데 있다.",
        "quote_en": "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "meaning_ko": "단 한 번의 상처도 없이 온실 속의 화초처럼 순탄하고 화려하게만 성공한 삶을 위대하다고 착각하지 마십시오. 진정으로 경외감을 자아내는 눈부신 영광은, 뼈가 부서지도록 넘어지고 진흙탕에 처박히는 참담한 절망 속에서도 이를 꽉 다물고 기어이 다시 일어서는 그 피투성이의 처절한 몸부림 속에만 깃들어 있는 법입니다.",
        "meaning_en": "Do not mistakenly believe that a life of smooth and glamorous success, without a single wound like a greenhouse flower, is great. Truly awe-inspiring, dazzling glory resides solely in that desperate, bloodied struggle of gritting your teeth and rising once again, even amidst the miserable despair of falling until your bones break and being shoved into the mud."
      },
      {
        "quote_ko": "어떤 일이든 완성되기 전까지는 항상 불가능해 보인다.",
        "quote_en": "It always seems impossible until it's done.",
        "meaning_ko": "당신이 품은 거대한 목표가 현실의 장벽 앞에서 도저히 넘을 수 없는 태산처럼 까득하게 느껴져 두려움에 떨고 계십니까? 인류 역사를 바꾼 모든 위대한 기적들은, 그것이 완벽하게 이루어지기 바로 직전 1초 전까지는 세상 모든 이들이 '미친 짓'이자 '불가능'이라고 비웃었던 것들임을 절대 잊지 마십시오. 흔들리지 말고 묵묵히 당신의 길을 걸어가십시오.",
        "meaning_en": "Are you trembling in fear because the colossal goal you harbor feels like an impossibly distant, insurmountable mountain before the barriers of reality? Please never forget that all the great miracles that changed human history were ridiculed by everyone in the world as 'madness' and 'impossible' until the very second before they were perfectly accomplished. Do not waver; silently walk your path."
      }
    ]
  }
};

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (const [slug, data] of Object.entries(dataToInject)) {
  finalNarratives[slug] = data;
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2), 'utf8');
console.log('Successfully injected Platinum rewritten giants (11-13) into final-narratives.json');
