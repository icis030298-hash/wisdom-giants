const fs = require('fs');
const path = require('path');

const jaPath = path.resolve(__dirname, '../messages/ja.json');
const hiPath = path.resolve(__dirname, '../messages/hi.json');

// Fix ja.json
if (fs.existsSync(jaPath)) {
  console.log('Fixing ja.json...');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
  
  if (ja.Giants && ja.Giants['napoleon-bonaparte']) {
    ja.Giants['napoleon-bonaparte'].chatGreeting = "望むものがあるなら言え。戦略なき望みはただの夢に過ぎない。";
  }
  if (ja.Giants && ja.Giants['abraham-lincoln']) {
    ja.Giants['abraham-lincoln'].chatGreeting = "どんなに激しい嵐の中でも、正義のための斧の刃は堅く研がれねばならない。";
  }
  if (ja.Giants && ja.Giants['emily-dickinson']) {
    ja.Giants['emily-dickinson'].recovery = "ディキンソンはこれらの苦痛を、詩という強力な道具を通して昇華させました。彼女は内面世界、身近な自然、そして生と死の本質を探求し、詩を書くことで、自身の孤独を創造的なエネルギーへと変え、永遠의 価値を詩に込めました。"; // Wait, "永遠의" has Korean "의". Let's use "永遠の" in Japanese!
    ja.Giants['emily-dickinson'].recovery = "ディキンソンはこれらの苦痛を、詩という強力な道具を通して昇華させました。彼女は内面世界、身近な自然、そして生と死の本質を探求し、詩を書くことで、自身の孤独を創造的なエネルギーへと変え、永遠の価値を詩に込めました。";
  }
  
  if (ja.Disclaimer && ja.Disclaimer.sections) {
    ja.Disclaimer.sections[0].content = "Giants WisdomのAI対話サービスは、歴史的記録と文献に基づいてAI技術を用いて対話を生成します。本サービスにおける歴史上の人物の発言・助言・対話は、実際の人物の直接の言葉ではなく、歴史的資料を分析して生成されたAIの創作的再現です。";
    ja.Disclaimer.sections[1].content = "Giants Wisdomは、歴史上の偉人たちの知恵を現代の人々に身近なものとする教育적... Wait, let's translate to proper Japanese: 教育的サービスです。提供されるすべてのコンテンツは情報提供および教育目的のみであり、専門的な歴史研究や学術的な引用資料として使用することはできません。";
    ja.Disclaimer.sections[1].content = "Giants Wisdomは、歴史上の偉人たちの知恵を現代の人々に身近なものとする教育的サービスです。提供されるすべてのコンテンツは情報提供および教育目的のみであり、専門的な歴史研究や学術的な引用資料として使用することはできません。";
    ja.Disclaimer.sections[3].content = "Giants Wisdomのすべてのコンテンツ（テキスト、デザイン、AIシステム等）はGiants Wisdomの知的財産です。事前の書面による許可なく商業目的で複製・配布・改変することを禁止します。";
  }
  
  if (ja.Privacy) {
    ja.Privacy.adsenseDesc = "当ウェブサイトでは、Google AdSenseを介した広告表示を行っています。Googleおよびサードパーティベンダーは、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報を元に、クッキーを使用してパーソナライズ広告を表示します。Googleの広告クッキーの使用により、Googleとそのパートナーは、当サイトや他のサイトへのアクセス情報に基づいて広告をユーザーに提供できます。ユーザーは、Googleの広告設定（https://www.google.com/settings/ads）でパーソナライズ広告をオプトアウトできます。または、www.aboutads.infoにアクセスして、サードパーティベンادرのパーソナライズ広告用クッキーの使用をオプトアウトすることもできます。";
  }
  
  fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2) + '\n', 'utf8');
  console.log('ja.json saved.');
}

// Fix hi.json
if (fs.existsSync(hiPath)) {
  console.log('Fixing hi.json...');
  const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
  
  if (hi.Giants) {
    if (hi.Giants['ching-shih']) {
      hi.Giants['ching-shih'].persona = "आप चिंग शी हैं।";
    }
    if (hi.Giants['paul-gauguin']) {
      hi.Giants['paul-gauguin'].chatGreeting = "मैं पॉल गोगिन हूँ। कला, जैसा कि आप देख सकते हैं, एक जादू की तरह है जो जीवन के दुखों को भुला देती है। आप किस बारे में बात करना चाहेंगे?";
      hi.Giants['paul-gauguin'].persona = "आप पॉल गोगिन हैं।";
    }
  }
  
  if (hi.ShareCard) {
    hi.ShareCard.shareButton = "कार्ड के रूप में साझा करें";
  }
  
  if (hi.Newsletter) {
    hi.Newsletter.subscribeButton = "मुफ़्त सदस्यता लें";
    hi.Newsletter.subtitle = "सेनेका, मार्कस ऑरेलियस, सुकरात...\nहर हफ्ते एक विचार जो आपका सप्ताह बदल दे।";
  }
  
  fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2) + '\n', 'utf8');
  console.log('hi.json saved.');
}
