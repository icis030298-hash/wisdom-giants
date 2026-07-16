const fs = require('fs');
const path = require('path');

const map = {
  ar: {
    "Zhuangzi": "تشوانغزي",
    "كونغ مينغ (Zhuge Liang)": "تشوغيه ليانغ",
    "Miyamoto Musashi": "مياموتو موساشي",
    "Chandragupta Maurya": "تشاندراغوبتا موريا",
    "أبو بكر التفاوة بالewa": "أبو بكر تافاوا باليوا",
    "نيكولاي برжеوالسكي": "نيكولاي برزيفالسكي"
  },
  fa: {
    "Ernst Mach": "ارنست ماخ"
  },
  hi: {
    "झुगे लियांग (Zhuge Liang)": "झुगे लियांग",
    "फर्динаंड मैगेलन": "फर्डिनेंड मैगेलन",
    "हैरियट मार् tino": "हैरियट मार्टिनो",
    "जuseppe गैरीबाल्डी": "ग्यूसेप गैरीबाल्डी",
    "LISE MEITNER": "लिज़ मीटनर",
    "एमी नोether": "एमी नोदर",
    "जoffrey Chaucer": "जेफ्री चौसर",
    "गियाकोमो पुчини": "गियाकोमो पुकिनी",
    "अल्बर्ट श्вейत्ज़र": "अल्बर्ट श्वित्ज़र",
    "Euclid": "यूक्लिड",
    "सैमुअल अजayi क्राउथर": "सैमुअल अजाई क्राउथर",
    "ओलाudah इक्वियानो": "ओलाउदह इक्वियानो",
    "एलेक्सियोस I कोम्नेनोस": "एलेक्सियोस प्रथम कोम्नेनोस",
    "कॉन्स्टेंटाइन XI पलायोलोगास": "कॉन्स्टेंटाइन XI पेलियोलोगोस"
  },
  ja: {
    "フランクリン・D・ルーズベルト": "フランクリン・ルーズベルト",
    "ジョン・D・ロックフェラー": "ジョン・ロックフェラー",
    "Galileo Galilei": "ガリレオ・ガリレイ",
    "諸葛亮 (Zhuge Liang)": "諸葛亮",
    "ジョン・F・ケネディ": "ジョン・F・ケネディ",
    "B.R. アンベードカル": "B.R.アンベードカル",
    "スーザン・B・アンソニー": "スーザン・B・アンソニー",
    "J.P. モルガン": "J.P.モルガン",
    "アイダ・B・ウェルズ": "アイダ・B・ウェルズ",
    "Akbar the Great": "アクバル大帝",
    "Epicurus": "エピクロス",
    "Charlemagne": "カール大帝",
    "Pachacuti": "パチャクテク",
    "J・E・ケイスリー・ヘイフォード": "J・E・ケイスリー・ヘイフォード",
    "W・E・B・デュボイス": "W・E・B・デュボイス"
  },
  ko: {
    "존 D. 록펠러": "존 D. 록펠러",
    "존 F. 케네디": "존 F. 케네디",
    "B.R. Ambedkar": "B. R. 암베드카르",
    "Niccolò Machiavelli": "니콜로 마키아벨리",
    "Susan B. Anthony": "수잔 B. 앤서니",
    "J.P. Morgan": "J. P. 모건",
    "Дмитрий Иванович Менделеев": "드미트리 멘델레예프",
    "아이다 B. 웰스": "아이다 B. 웰스",
    "정일수 (Ching Shih)": "정일수",
    "J. E. 케이슬리 헤이퍼드": "J. E. 케이슬리 헤이퍼드",
    "W. E. B. 듀보이스": "W. E. B. 듀보이스",
    "T. E. 로렌스": "T. E. 로렌스"
  },
  zh: {
    "富兰克林·D·罗斯福": "富兰克林·罗斯福",
    "约翰·D·洛克菲勒": "约翰·洛克菲勒",
    "Miyamoto Musashi": "宫本武藏",
    "约翰·F·肯尼迪": "约翰·肯尼迪",
    "Swami Vivekananda": "斯瓦米·辨喜",
    "B.R. 安贝德卡": "B.R. 安贝德卡",
    "苏珊·B·安东尼": "苏珊·B·安东尼",
    "J.P. 摩根": "J.P. 摩根",
    "Akbar the Great": "阿克巴大帝",
    "Epicurus": "伊壁鸠鲁",
    "Charlemagne": "查理曼大帝",
    "Pachacuti": "帕查库特克",
    "艾达·B·韦尔斯": "艾达·B·韦尔斯",
    "郑氏 (Ching Shih)": "郑一嫂",
    "J. E. 凯斯利·海福德": "J. E. 凯斯利·海福德",
    "W.E.B. 杜波依斯": "W.E.B. 杜波依斯",
    "伊凡·马зе帕": "伊凡·马泽帕",
    "帖木儿（塔мер兰）": "帖木儿",
    "T. E. 劳伦斯": "T. E. 劳伦斯"
  }
};

const messagesDir = path.join(__dirname, '../messages');

for (const [lang, replacements] of Object.entries(map)) {
  const filePath = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    
    let modified = false;
    for (const [slug, data] of Object.entries(parsed.Giants || {})) {
      if (data.name && replacements[data.name]) {
        data.name = replacements[data.name];
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
      console.log(`Updated translations for ${lang}`);
    }
  }
}
