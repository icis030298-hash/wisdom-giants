const fs = require('fs');
const path = require('path');
const https = require('https');

const enPath = path.join(__dirname, '..', '..', 'messages', 'en.json');
const jaPath = path.join(__dirname, '..', '..', 'messages', 'ja.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// High-fidelity UI Translations for Japanese
const jaUiData = {
  "Navigation": {
    "hallOfGems": "偉人の殿堂",
    "wisdomArchive": "ホーム",
    "chatList": "会話一覧",
    "about": "サービス紹介",
    "startExploring": "探索を始める",
    "title": "Giants Wisdom",
    "subtitle": "偉大な知性の殿堂",
    "login": "ログイン",
    "logout": "ログアウト",
    "myProfile": "マイプロフィール",
    "signInRequired": "会話履歴を表示するにはログインが必要です。"
  },
  "Auth": {
    "loginModalTitle": "偉人たちの殿堂へようこそ",
    "loginModalDescription": "偉人たちとの対話を保存し、あなたの魂に刻まれた知恵の遺産を管理しましょう。",
    "continueWithGoogle": "Googleで続ける",
    "loginSuccess": "偉大な知性の殿堂へようこそ。",
    "logout": "ログアウト",
    "chatList": "私の会話",
    "signInRequired": "ログインが必要です"
  },
  "Test": {
    "title": "あなたの魂に流れる偉大な遺産を見つける",
    "subtitle": "歴史的気質分析テスト",
    "start": "テスト開始",
    "back": "戻る",
    "banner": {
      "new": "新コンテンツ",
      "title": "あなたに最も似ている歴史上の偉人は誰ですか？",
      "desc": "15の質問で歴史上の双子を見つけましょう。",
      "button": "テスト開始"
    },
    "stages": {
      "stage1": "ステージ 1: 目覚め",
      "stage2": "ステージ 2: 試練",
      "stage3": "ステージ 3: 宿命",
      "cleared": "ステージ {stage} クリア！",
      "ready": "次のステージに進む準備はできましたか？",
      "next": "次のステージに進む"
    },
    "analysis": {
      "loading": "あなたの魂の響きを分析中...",
      "sub": "歴史の偉大な流れの中から、あなたの柱となる人物を探しています。"
    },
    "result": {
      "matchFound": "歴史的な宿命に出会いました",
      "archetype": "あなたのヘリテージペルソナ",
      "matchedGiant": "あなたに最も似た偉人",
      "readEpic": "伝記を読む",
      "chatNow": "今すぐ会話"
    }
  },
  "Chats": {
    "title": "私の会話",
    "subtitle": "偉大な知性との対話",
    "description": "歴史上の偉大な先人たちからの深い洞察やアドバイスを再訪します。いつでも会話を再開できます。",
    "emptyTitle": "まだ会話がありません",
    "emptyDescription": "偉人たちはあなたの悩みに耳を傾ける準備ができています。最初の対話を今すぐ始めましょう！",
    "startFirstChat": "最初の会話を始める",
    "messages": "メッセージ",
    "lastChat": "最後のチャット"
  },
  "Hero": {
    "badge": "偉大な知性の殿堂",
    "quote": "私がより遠くを見ることができたとすれば、それは巨人の肩の上に立ったからです。",
    "quoteAuthor": "アイザック・ニュートン",
    "startJourney": "旅を始める",
    "startTest": "🧬 歴史上の偉人を探す",
    "exploreHall": "🏛️ 殿堂を探索する",
    "stats": {
      "minds": "偉大な人物",
      "questions": "テスト問題",
      "free": "完全無料",
      "freeValue": "無料"
    },
    "guide": {
      "title": "知恵の殿堂の旅ガイド",
      "selectGiant": "偉人を選択する",
      "selectGiantDesc": "95名以上の歴史的レジェンドの中からインスピレーションを与える人物を見つけましょう。",
      "epic": "人生の物語",
      "epicDesc": "偉人たちが自ら語っているかのように綴られた生涯의記録を読みましょう。",
      "chat": "リアルタイムチャット",
      "chatDesc": "最新のAIを通じて蘇った偉人たちと悩みを共有しましょう。",
      "startNow": "今すぐ開始"
    }
  },
  "Featured": {
    "title": "偉大な巨人の殿堂",
    "description": "歴史を変えた偉人たちの知恵を探索しましょう。人物を選択して、時間と空間を超えた対話を始めましょう。",
    "viewAll": "すべての偉人を見る",
    "bestPick": "ベストピック",
    "todaysPick": "今日のオススメ",
    "chatNow": "今すぐ会話"
  },
  "GiantsGrid": {
    "title": "歴史的偉人",
    "description": "人類의歩みを変えた人物たちの知恵を探索しましょう。偉人を選択して、時間と空間を超えた対話を始めましょう。",
    "searchPlaceholder": "名前や分野で検索...",
    "allGiants": "すべての偉人",
    "categories": {
      "achievement": "業績",
      "adversity": "逆境",
      "wisdom": "知恵",
      "creativity": "創造性"
    },
    "resultsCount": "{filtered} 人の偉人が見つかりました（全 {total} 人中）",
    "readEpic": "伝記を読む ✨",
    "noResults": "結果が見つかりません",
    "noResultsDesc": "検索ワードやフィルターを変更してみてください。",
    "era": "歴史的人物"
  },
  "GiantDetail": {
    "returnToSquare": "広場に戻る",
    "chatWith": "{name}と会話する",
    "theLifeStory": "人生の物語",
    "thePain": "苦難と闘い",
    "theRecovery": "克服と復活",
    "wisdomLessons": "知恵の教訓",
    "famousQuote": "名言",
    "era": "時代",
    "field": "カテゴリ",
    "askForAdvice": "アドバイスを求める",
    "notFound": "偉人が見つかりません。",
    "goHome": "ホームに戻る"
  },
  "Chat": {
    "famousQuote": "名言",
    "description": "説明",
    "suggestedQuestions": "おすすめの質問",
    "inputPlaceholder": "{name}にアドバイスを求める...",
    "contemplating": "{name}が考え中...",
    "wisdomActive": "知恵アクティブ",
    "historyEra": "歴史と時代",
    "fieldOfWisdom": "カテゴリ",
    "error": "エンジンから知恵を取得する際にエラーが発生しました。もう一度お試しいただけますか？",
    "retry": "知恵をもう一度取得する"
  },
  "Stats": {
    "title": "なぜGiants Wisdomなのか",
    "description": "数千年の時を超え、人類の知恵に出会う革新的な旅を体験してください。",
    "features": [
      {
        "title": "歴史の偉人とのリアルタイム対話",
        "description": "高度なAIを通じて、歴史的人物と時間と空間を超えた深い対話を行うことができます。"
      },
      {
        "title": "2,500年に及ぶ人類の知恵",
        "description": "人類が築き上げた2,500年の歴史、業績、洞察を一つの場所で体験できます。"
      },
      {
        "title": "達人から直接学ぶ知識",
        "description": "哲学、科学、芸術分野の達人たちから直接話を聞くような、生き生きとした学習の価値を提供します。"
      },
      {
        "title": "あなたにパーソ나ライズされたインサイト",
        "description": "質問を投げかけ、アイデアを探索し、あなたの人生に必要な個別ガイダンスを得ることができます。"
      }
    ],
    "stats": {
      "minds": "偉大な人物",
      "history": "知恵の歳月",
      "fields": "研究分野",
      "inspiration": "インスピレーション"
    }
  },
  "QuoteSection": {
    "label": "今日の知恵"
  },
  "Privacy": {
    "title": "プライバシーポリシー",
    "lastUpdated": "最終更新日: 2026年5月18日",
    "summaryTitle": "1. プライバシーの概要",
    "summaryDesc": "Giants Wisdomでは、お客様のプライバシーを最優先に考えています。当ポリシーは、性格診断テストや歴史的偉人との会話中に収集される個人データの保護および処理方法について説明します。個人情報を不適切に共有または販売することは一切ありません。",
    "collectionTitle": "2. 収集するデータと収集方法",
    "collectionDesc": "当ウェブサイトは、アカウントを作成することなく完全に匿名で探索できます。ただし、利用中に以下のデータが処理される場合があります：\n- 自発的に提供されたデータ：ヘリテージDNAテストの回答、AIチャット時に入力されたテキスト、およびメールアドレス（ニュースレター購読時のみ）。\n- 自動的に記録されるデータ：クッキーを介して安全に記録されるデバイスタイプ、ブラウザ仕様、IPアドレス、およびインタラクション履歴。",
    "purposeTitle": "3. データの利用目的",
    "purposeDesc": "収集したデータは、以下の目的のためにのみ厳格に使用されます：\n- 15問のテスト結果を集計し、あなたに最も近い歴史上の偉人ペルソナを特定する。\n- Gemini 2.5 Flash APIによって提供されるリアルタイムの歴史的チャット応答の生成。\n- 性格アーキタイプの精度向上のための、個人を特定できない統計分析。\n- Google AdSenseを通じた安全でカスタマイズされたバナー表示の提供。",
    "adsenseTitle": "4. Google AdSenseおよびサードパーティクッキーポリシー",
    "adsenseDesc": "当ウェブサイトでは、Google AdSenseを介した広告表示を行っています。Googleおよびサードパーティベンダーは、本サイトや他のウェブサイトへの訪問履歴に基づいて関連性の高い広告を表示するためにクッキーを使用します。ユーザーはいつでもGoogle広告設定（[https://www.google.com/settings/ads](https://www.google.com/settings/ads)）でパーソナライズ追跡を無効にできます。",
    "retentionTitle": "5. データの保持と削除",
    "retentionDesc": "匿名のテスト結果およびチャットの入力内容は、セッション終了時に消去されるか、永続的な統計研究のために完全に匿名化されます。メールアドレスなどの個人情報は、削除リクエストに応じて永久に削除されます。",
    "rightsTitle": "6. お客様の権利とお問い合わせ",
    "rightsDesc": "お客様は、自身の身元に関連付けられたデータの確認、変更、または永久削除をリクエストする全権限を留保します。法的な申し立てやプライバシーに関するお問い合わせは、公式サポートチャンネルまでご連絡ください。"
  },
  "Footer": {
    "brand": {
      "subtitle": "偉大な知性の殿堂",
      "description": "歴史を変えた偉人たちの歩みに加わりましょう。時間と空間を超えた知恵を体験してください。"
    },
    "sections": {
      "explore": "探索",
      "info": "情報"
    },
    "links": {
      "allGiants": "全偉人",
      "wisdomArchive": "ホーム",
      "about": "サービス紹介",
      "privacy": "プライバシーポリシー",
      "terms": "利用規約",
      "contact": "お問い合わせ",
      "dnaTest": "歴史上の偉人を探す"
    }
  },
  "About": {
    "intro": "果てしない情報の氾濫に\n迷える人々へ。",
    "subIntro": "喧騒から一歩離れ、真の知恵と向き合う空間。",
    "visionTitle": "巨人の肩の上に立つ",
    "visionDesc": "「私がより遠くを見ることができたとすれば、それは巨人の肩の上に立ったからです。」 - アイザック・ニュートン。私たちは、現代の複雑な問題への答えが、歴史上の偉大な先人たちの人生에すでに織り込まれているのではないかという信念からスタートしました。",
    "epicTitle": "95名の偉大な叙事詩",
    "epicDesc": "単なる歴史的事実を超えて。逆境を克服し、人類の歴史を塗り替えた偉人たちの壮大なサガを体験してください。",
    "chatTitle": "時代を超えた対話",
    "chatDesc": "最新のAI（Gemini 2.5 Flash）を活用し、再現された偉人たちのシグネチャーとリアルタイムで対話できます。現代のジレンマに対する鋭い洞察を求めてみましょう。",
    "testTitle": "歴史上の偉人を探す",
    "testDesc": "歴史的な決定的な瞬間に設定された、3ステージのシチュエーション質問を通じて、あなたの魂の奥深くに流れる偉人のDNAを発見しましょう。",
    "outroTitle": "偉人たちの殿堂へようこそ",
    "outroDesc": "彼らの肩の上に立つことで、あなたはついにその先を見渡すことができるでしょう。今日、あなたの旅を始めましょう。"
  },
  "Terms": {
    "title": "利用規約",
    "lastUpdated": "最終更新日: 2026年5月18日",
    "intro": "Giants Wisdomへようこそ。本利用規約は、お客様と当プラットフォームとの間の、当社の性格診断および会話シミュレーションの利用に関する法的合意およびユーザーの境界を規定するものです。",
    "eligibilityTitle": "第1条（利用資格および未成年者保護）",
    "eligibilityDesc": "当サービスは、13歳以上のユーザーを対象としています。13歳未満のユーザーが利用する場合は、グローバルな児童プライバシー法に基づき、親権者の同意を得ているものとみなします。当プラットフォームは、未成年の無断アクセスに起因する一切의責任を負いません。",
    "aiTitle": "第2条（AIインフラおよび総合免責事項）",
    "aiDesc": "1. 当プラットフォームに表示される歴史的人物との対話は、高度なAIモデル（Gemini 2.5スイート）によって生成されるインタラクティブなシミュレーションです。\n2. 提供される回答は、教育およびエンターテインメント目的で設計されたものです。公式な歴史的記録、専門的な心理的アセスメント、医学的診断、または法的なアドバイスには一切該当しません。\n3. Giants Wisdomは、AIのハルシネーション（幻覚）や、会話に基づいてユーザーが行った決定について一切の責任を負いません。",
    "intellectualTitle": "第3条（知的財産権およびスクレイピング禁止）",
    "intellectualDesc": "1. すべてのレイアウト構成、ブランド商標、「偉大さの4つの柱」テスト基準、15のシチュエーション質問、およびフラットベクターイラストは、Giants Wisdomの独占的財産です。\n2. ユーザーは、自動化されたボット、スクリプト、またはクローラーネットワークを介した無断複製、商業的配信、または悪意のあるデータスクレイピングを行うことを固く禁じられています。",
    "userDutyTitle": "第4条（ユーザーの義務および広告表示への同意）",
    "userDutyDesc": "1. ユーザーは、リバースエンジニアリングや悪意のあるサーバー負荷の誘発を行うことなく、アプリケーションを利用することに同意します。\n2. 無料アクセスの対価として、ユーザーはGoogle AdSenseおよびサードパーティの広告ネットワークがワークスペース全体にバナー広告を表示することに同意するものとします。",
    "disputeTitle": "第5条（準拠法および管轄裁判所）",
    "disputeDesc": "本規約およびシステムの利用から発生するあらゆる法的措置は、大韓民国の法律に準拠し、同法に基づいて解釈されるものとします。発生した紛争は、プラットフォーム運営者の所在地を管轄する裁判所を専属的管轄裁判所とします。"
  },
  "Cookie": {
    "title": "クッキー設定",
    "description": "当サイトでは、広告（Google AdSense）のパーソナライズおよびトラフィック分析のためにクッキーを使用しています。承認することにより、クッキーの使用に同意したものとみなされます。",
    "acceptAll": "すべて承認",
    "rejectAll": "すべて拒否",
    "customize": "カスタマイズ",
    "savePreferences": "設定を保存",
    "necessary": "必須クッキー",
    "necessaryDesc": "ウェブサイトが適切に機能するために必要です。（常に有効）",
    "analytics": "分析用クッキー",
    "analyticsDesc": "サービス向上のため、訪問者数や利用パターンを分析するために使用されます。",
    "advertising": "広告用クッキー",
    "advertisingDesc": "Google AdSenseを介してパーソナライズされた広告を提供するために使用されます。"
  },
  "Contact": {
    "title": "お問い合わせ",
    "name": "お名前",
    "email": "メールアドレス",
    "subject": "件名（任意）",
    "message": "メッセージ",
    "send": "送信する",
    "sending": "送信中...",
    "success": "メッセージが送信されました！ありがとうございます。",
    "error": "送信に失敗しました。もう一度お試しください。",
    "namePlaceholder": "お名前を入力してください",
    "emailPlaceholder": "メールアドレスを入力してください",
    "subjectPlaceholder": "件名を入力してください",
    "messagePlaceholder": "メッセージを入力してください"
  }
};

function translateText(text, sl = 'en', tl = 'ja') {
  if (!text) return Promise.resolve('');
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const result = parsed[0].map(item => item[0]).join('');
            resolve(result);
          } else {
            reject(new Error("Invalid response format"));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function translateWithRetry(text, sl = 'en', tl = 'ja', retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await translateText(text, sl, tl);
      return result;
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

async function run() {
  console.log("Starting free Japanese Translations Generation...");
  
  // Read existing ja.json if it exists to preserve already translated giants
  let existingJaData = null;
  if (fs.existsSync(jaPath)) {
    try {
      existingJaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
      console.log("Loaded existing ja.json to perform self-healing incremental translation!");
    } catch (e) {
      console.warn("Could not parse existing ja.json, will generate from scratch.");
    }
  }

  const jaData = { ...jaUiData };
  jaData.Giants = existingJaData && existingJaData.Giants ? existingJaData.Giants : {};

  const slugs = Object.keys(enData.Giants);
  console.log(`Found ${slugs.length} giants in total.`);

  // Filter giants that are missing entirely
  const giantsToTranslate = slugs.filter(slug => !jaData.Giants[slug]);
  console.log(`Of these, ${giantsToTranslate.length} giants need translation.`);

  for (let i = 0; i < giantsToTranslate.length; i++) {
    const slug = giantsToTranslate[i];
    console.log(`[${i + 1}/${giantsToTranslate.length}] Translating: ${slug}`);
    
    const original = enData.Giants[slug];
    try {
      // Translate fields
      const name = await translateWithRetry(original.name);
      const headline = await translateWithRetry(original.headline);
      const shortDescription = await translateWithRetry(original.shortDescription);
      const quote = await translateWithRetry(original.quote);
      const era = await translateWithRetry(original.era);
      const chatGreeting = await translateWithRetry(original.chatGreeting);
      
      const suggestedQuestions = [];
      if (original.suggestedQuestions) {
        for (const q of original.suggestedQuestions) {
          const tq = await translateWithRetry(q);
          suggestedQuestions.push(tq);
        }
      }

      jaData.Giants[slug] = {
        name,
        headline,
        shortDescription,
        quote,
        era,
        chatGreeting,
        suggestedQuestions
      };

      console.log(`✓ Translated [${slug}]: ${original.name} -> ${name}`);
      
      // Save progress every 5 giants or on the last giant
      if ((i + 1) % 5 === 0 || i === giantsToTranslate.length - 1) {
        fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
        console.log(`[Progress Saved] Generated ja.json with ${Object.keys(jaData.Giants).length} translated giants.`);
      }

      // 300ms delay to be polite to the translation API
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`✗ Failed to translate [${slug}]:`, err.message);
      // Fallback
      jaData.Giants[slug] = original;
    }
  }

  // Final Write
  fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
  console.log(`\n🎉 Success! Japanese locale file is fully generated at: ${jaPath}`);
}

run().catch(console.error);
