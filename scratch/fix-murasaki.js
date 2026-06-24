const fs = require('fs');
const file = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newMurasaki = {
  "era_ko": "11세기의 거인 (973?~1014?)",
  "era_en": "11th Century Giant (973?~1014?)",
  "category": "arts",
  "epic_ko": "천년의 세월을 거슬러 올라간 일본 헤이안 시대, 벚꽃이 흩날리는 궁정의 화려함 이면에는 숨 막히는 권력 투쟁과 여인들의 소리 없는 눈물이 흐르고 있었습니다. 무라사키 시키부는 중급 귀족 가문에서 태어나 당대 여성들에게는 금기시되었던 한문과 깊은 학문을 아버지를 곁눈질하며 몰래 스펀지처럼 흡수했습니다. 남편과의 짧고도 애틋했던 결혼 생활이 사별이라는 비극으로 끝났을 때, 그녀는 깊은 슬픔에 빠져 무너지지 않고 붓을 들었습니다. 덧없이 바스러지는 벚꽃처럼 허무한 인간의 삶과 애수(모노노아레)를 종이 위에 토해내기 시작한 것입니다.\n\n그렇게 탄생한 인류 최초의 장편 소설 '겐지모노가타리'는 궁정 사회를 발칵 뒤집어 놓았습니다. 빛나는 황자 겐지를 둘러싼 400여 명의 얽히고설킨 사랑과 질투, 권력의 덧없음은 단순한 연애소설이 아니라 인간 내면의 어두운 심연을 완벽하게 해부한 심리극이었습니다. 이 압도적인 재능 덕분에 그녀는 최고 권력자 후지와라노 미치나가의 딸을 모시는 궁녀로 발탁되었으나, 화려한 궁정의 가식과 음모 속에서도 그녀는 결코 자신을 잃지 않았습니다.\n\n오히려 그녀는 차갑고 예리한 관찰자의 눈으로 화려함 속에 감춰진 권력의 부패와 여인들의 비애를 '무라사키 시키부 일기'에 낱낱이 기록했습니다. 시기와 질투가 난무하는 궁정에서 스스로를 멍청한 척 위장하며 묵묵히 붓을 놀렸던 그녀의 삶은, 슬픔이라는 감정을 가장 높은 차원의 예술로 승화시킨 기적입니다. 권력자들은 모두 재가 되어 사라졌지만, 무라사키 시키부가 흘린 슬픔의 먹물은 천년의 세월을 버텨내며 세계 문학사의 가장 찬란하고 지워지지 않는 별빛으로 남았습니다.",
  "epic_en": "A thousand years ago, during Japan's Heian period, beneath the brilliant facade of the imperial court where cherry blossoms scattered, flowed a silent undercurrent of suffocating power struggles and the unshed tears of women. Born into a mid-ranking noble family, Murasaki Shikibu secretly absorbed classical Chinese literature and profound scholarship—subjects forbidden to women of her time—like a sponge by glancing over her father's shoulder. When her brief but deeply affectionate marriage ended in the tragedy of bereavement, she did not crumble into her profound sorrow; instead, she picked up her brush. She began to pour onto paper the fleeting sorrow of human existence (mono no aware), as ephemeral as falling cherry blossoms.\n\nThe result was 'The Tale of Genji,' the world's first psychological novel, which turned the court society upside down. The tangled web of love, jealousy, and the transience of power surrounding the shining Prince Genji, featuring over 400 characters, was not a mere romance but a perfect dissection of the dark abyss of the human soul. Thanks to her overwhelming talent, she was selected as a lady-in-waiting to the daughter of the supreme power holder, Fujiwara no Michinaga. Yet, amidst the hypocrisy and conspiracies of the dazzling court, she never lost herself.\n\nRather, with the cold, sharp eyes of an observer, she meticulously recorded the corruption of power and the sorrow of women hidden behind the glamour in 'The Diary of Murasaki Shikibu.' Feigning dullness to survive a court rife with envy and jealousy while silently wielding her brush, her life is a miracle of sublimating the emotion of sorrow into the highest tier of art. While the powerful have all turned to ash and vanished, the ink of sorrow spilled by Murasaki Shikibu has withstood a thousand years, remaining the most radiant, indelible starlight in the history of world literature.",
  "trials_ko": "사랑하는 남편과의 갑작스러운 사별이 안겨준 지독한 슬픔, 그리고 여성의 학문을 억압하고 시기와 질투가 난무하던 헤이안 시대 궁정의 억압적인 환경.",
  "trials_en": "The bitter sorrow inflicted by the sudden bereavement of her beloved husband, and the oppressive environment of the Heian court, which suppressed women's scholarship and was rife with envy and jealousy.",
  "overcoming_ko": "비극적인 슬픔을 문학적 창작욕으로 승화시켜 세계 최초의 장편 소설 '겐지모노가타리'를 집필했으며, 권력의 암투 속에서도 예리한 관찰력을 잃지 않고 인간 심리의 본질을 꿰뚫어 봄.",
  "overcoming_en": "She sublimated her tragic sorrow into literary creativity, writing the world's first novel, 'The Tale of Genji.' Even amidst power struggles, she never lost her sharp observational skills, piercing through to the essence of human psychology.",
  "wisdom": [
    {
      "quote_ko": "봄이 오면 꽃이 피고 가을이 오면 잎이 지듯, 인간의 마음도 이처럼 덧없는 것임을 알라.",
      "quote_en": "Just as flowers bloom in spring and leaves fall in autumn, know that the human heart is equally ephemeral.",
      "meaning_ko": "덧없이 흘러가는 세상의 풍경에 마음을 빼앗겨, 정작 자네 영혼이 갈구하는 진정한 아름다움을 잊고 살진 않았는가 돌아보게. 눈에 보이는 겉모습과 영광은 바래지기 마련이나, 시련 속에서 건져 올린 깨달음은 천년의 세월을 버텨내는 법이라네.",
      "meaning_en": "Look back and ask yourself if you have been so captivated by the fleeting scenery of the world that you forgot the true beauty your soul craves. Outward appearances and glory are bound to fade, but the enlightenment salvaged from trials withstands the passage of a thousand years."
    },
    {
      "quote_ko": "슬픔을 깊이 품어본 자만이 타인의 눈물을 닦아줄 수 있다.",
      "quote_en": "Only one who has deeply harbored sorrow can wipe away the tears of another.",
      "meaning_ko": "자네가 겪은 상실과 눈물을 부끄러워하거나 서둘러 지우려 하지 말게. 가슴을 찢는 듯한 그 깊은 절망이야말로 타인의 아픔을 진정으로 품어 안을 수 있는 가장 아름답고 고귀한 예술의 씨앗이 되는 법이라네.",
      "meaning_en": "Do not be ashamed of the loss and tears you have experienced, nor rush to erase them. That deep, heart-rending despair is the very seed of the most beautiful and noble art, enabling you to truly embrace the pain of others."
    },
    {
      "quote_ko": "세상의 시기 질투에 흔들리지 마라. 가장 예리한 칼날은 침묵 속에서 갈아지는 것이다.",
      "quote_en": "Do not be swayed by the world's envy and jealousy. The sharpest blade is sharpened in silence.",
      "meaning_ko": "사람들의 어리석은 입방아와 질투심에 일일이 변명하느라 소중한 에너지를 낭비하지 말게. 때로는 어리석은 척 고개를 숙이고, 자네만의 밀실에서 조용히 자네의 검(재능)을 벼리게나. 훗날 그 침묵의 결과물이 세상을 베어버릴 테니.",
      "meaning_en": "Do not waste your precious energy making excuses to the foolish gossip and jealousy of people. Sometimes, bow your head feigning ignorance, and quietly forge your sword (talent) in your own secret chamber. Someday, the result of that silence will cleave the world."
    }
  ]
};

data['murasaki-shikibu'] = newMurasaki;
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log(JSON.stringify(newMurasaki, null, 2));
