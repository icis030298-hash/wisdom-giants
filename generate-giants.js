const fs = require('fs');
const path = require('path');

const destDir = "C:\\Users\\user\\.gemini\\antigravity\\brain\\1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4\\scratch";

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const giants = [
  {
    slug: "li-bai",
    name: "Li Bai",
    category: "창의",
    messages: {
      en: { name: "Li Bai", title: "The Immortal Poet", headline: "Finding infinite freedom through poetry and wine", shortDescription: "One of the greatest poets of the Tang dynasty.", quote: "If heaven did not love wine, there would be no Wine Star in heaven.", chatGreeting: "Greetings, my friend! Come, share a cup of wine with me.", suggestedQuestions: ["How did you find inspiration?", "What is the true meaning of freedom?", "How did you cope with exile?"], era: "Tang Dynasty (701–762)", pain: "Political exile and wandering.", recovery: "Found solace in nature, wine, and poetry." },
      ko: { name: "이백", title: "시선(詩仙)", headline: "시와 술을 통해 무한한 자유를 찾다", shortDescription: "당나라 최고의 천재 시인", quote: "하늘이 술을 사랑하지 않았다면, 하늘에 주성이 없었을 것이다.", chatGreeting: "반갑소! 자, 나와 술잔을 나누며 달과 산에 대해 이야기해 보지 않겠소?", suggestedQuestions: ["영감은 어디서 얻으시나요?", "진정한 자유란 무엇입니까?", "유배 생활의 고통을 어떻게 이겨내셨나요?"], era: "당나라 (701–762)", pain: "정치적 좌절과 끝없는 유랑 생활.", recovery: "자연과 술을 벗 삼아 시를 지음." },
      de: { name: "Li Bai", title: "Der unsterbliche Dichter", headline: "Unendliche Freiheit durch Poesie", shortDescription: "Einer der größten Dichter der Tang-Dynastie.", quote: "Wenn der Himmel keinen Wein liebte...", chatGreeting: "Sei gegrüßt, mein Freund! Komm, teile einen Becher Wein mit mir.", suggestedQuestions: ["Wie hast du Inspiration gefunden?", "Was ist wahre Freiheit?", "Wie bist du mit dem Exil umgegangen?"], era: "Tang-Dynastie (701–762)", pain: "Politisches Exil.", recovery: "Trost in der Natur." },
      ja: { name: "李白", title: "詩仙", headline: "詩と酒による無限の自由", shortDescription: "唐代最高の天才詩人", quote: "天が酒を愛さなければ、天に酒星はないはずだ。", chatGreeting: "やあ友よ！さあ、私と杯を交わし、月と山について語ろうではないか。", suggestedQuestions: ["インスピレーションはどこから？", "真の自由とは？", "流刑の苦しみをどう乗り越えた？"], era: "唐代 (701–762)", pain: "政治的挫折と終わりのない放浪生活。", recovery: "自然と酒を友として詩を詠んだ。" },
      es: { name: "Li Bai", title: "El Poeta Inmortal", headline: "Libertad infinita a través de la poesía y el vino", shortDescription: "Uno de los grandes poetas de la dinastía Tang.", quote: "Si al cielo no le gustara el vino...", chatGreeting: "¡Saludos, amigo mío! Ven, comparte una copa de vino conmigo.", suggestedQuestions: ["¿Cómo encontraste inspiración?", "¿Qué es la verdadera libertad?", "¿Cómo lidiaste con el exilio?"], era: "Dinastía Tang (701–762)", pain: "Exilio político.", recovery: "Consuelo en la naturaleza." },
      fr: { name: "Li Bai", title: "Le Poète Immortel", headline: "La liberté infinie par la poésie et le vin", shortDescription: "L'un des plus grands poètes de la dynastie Tang.", quote: "Si le ciel n'aimait pas le vin...", chatGreeting: "Salutations, mon ami ! Viens, partage une coupe de vin avec moi.", suggestedQuestions: ["Comment as-tu trouvé l'inspiration?", "Qu'est-ce que la vraie liberté?", "Comment as-tu géré l'exil?"], era: "Dynastie Tang (701–762)", pain: "Exil politique.", recovery: "Réconfort dans la nature." },
      it: { name: "Li Bai", title: "Il Poeta Immortale", headline: "Trovare la libertà infinita attraverso la poesia e il vino", shortDescription: "Uno dei più grandi poeti della dinastia Tang.", quote: "Se il cielo non amasse il vino...", chatGreeting: "Saluti, amico mio! Vieni, condividi una coppa di vino con me.", suggestedQuestions: ["Come hai trovato l'ispirazione?", "Qual è il vero significato della libertà?", "Come hai affrontato l'esilio?"], era: "Dinastia Tang (701–762)", pain: "Esilio politico.", recovery: "Conforto nella natura." },
      pt: { name: "Li Bai", title: "O Poeta Imortal", headline: "Encontrando liberdade infinita através da poesia e do vinho", shortDescription: "Um dos maiores poetas da dinastia Tang.", quote: "Se o céu não amasse o vinho...", chatGreeting: "Saudações, meu amigo! Venha, compartilhe uma taça de vinho comigo.", suggestedQuestions: ["Como você encontrou inspiração?", "Qual é o verdadeiro significado da liberdade?", "Como você lidou com o exílio?"], era: "Dinastia Tang (701–762)", pain: "Exílio político.", recovery: "Consolo na natureza." }
    },
    epic: {
      epic_ko: "이백은 당나라 최고의 천재 시인으로, 세상의 얽매임을 벗어나 자연과 우주를 노래했습니다. 그의 삶은 결코 평탄치 않았으며, 정치적 이상을 품고 조정에 나아갔으나 참소로 인해 유배와 방랑을 겪어야 했습니다. 하지만 그는 고난 속에서도 붓을 꺾지 않았고, 오히려 그 고통을 예술로 승화시켜 불멸의 시들을 남겼습니다. 그가 달빛 아래서 술잔을 기울이며 쓴 시들은 천 년이 지난 지금도 우리의 가슴을 울립니다.",
      epic_en: "Li Bai was one of the greatest poets of the Tang dynasty. He is celebrated for his brilliant, romantic, and visionary poetry. However, his life was not a simple journey. Despite his talent, he faced political exile and wandering, experiencing deep setbacks. Yet, he never gave up on his art. Instead, he channeled his despair and longing for freedom into timeless masterpieces. Through wine, moonlight, and unyielding spirit, he transcended his worldly suffering. His legacy continues to inspire generations, proving that true freedom lies within the boundless realms of creativity and nature.",
      epic_de: "Li Bai war einer der größten Dichter der Tang-Dynastie...",
      epic_ja: "李白は唐代最高の天才詩人であり、世のしがらみを抜け出し、自然と宇宙を詠いました。彼の人生は決して平坦なものではなく、政治的理想を抱いて朝廷に出仕したものの、讒言によって流刑と放浪を余儀なくされました。しかし、彼は苦難の中でも筆を折ることなく、むしろその苦しみを芸術へと昇華させ、不滅の詩を残しました。彼が月明かりの下で盃を傾けながら書いた詩は、千年経った今でも私たちの心を打ちます。",
      epic_es: "Li Bai fue uno de los más grandes poetas de la dinastía Tang...",
      epic_fr: "Li Bai était l'un des plus grands poètes de la dynastie Tang...",
      epic_it: "Li Bai fu uno dei più grandi poeti della dinastia Tang...",
      epic_pt: "Li Bai foi um dos maiores poetas da dinastia Tang...",
      trials_ko: "정치적 모함과 유배, 그리고 끝없는 방랑.",
      trials_en: "Political false accusations, exile, and endless wandering.",
      overcoming_ko: "자연과 술을 벗 삼아 고통을 시로 승화시킴.",
      overcoming_en: "Sublimating pain into poetry with nature and wine as companions."
    }
  },
  {
    slug: "sun-yat-sen",
    name: "Sun Yat-sen",
    category: "성취",
    messages: {
      en: { name: "Sun Yat-sen", title: "Pioneer of the Revolution", headline: "Dedicating life to modern China", shortDescription: "First president of the ROC", quote: "The revolution is not yet successful.", chatGreeting: "I am Sun Yat-sen. We must keep striving for the people.", suggestedQuestions: ["Why start a revolution?", "How to handle failure?", "What are the Three Principles?"], era: "1866-1925", pain: "Repeated failures", recovery: "Unwavering persistence" },
      ko: { name: "쑨원", title: "혁명의 선구자", headline: "현대 중국을 위해 일생을 바치다", shortDescription: "중화민국 임시 대총통", quote: "혁명은 아직 성공하지 못했다.", chatGreeting: "쑨원입니다. 우리는 백성을 위해 계속 나아가야 합니다.", suggestedQuestions: ["혁명을 시작한 이유는?", "실패를 어떻게 극복했나요?", "삼민주의란?"], era: "1866-1925", pain: "거듭된 실패", recovery: "불굴의 의지" },
      de: { name: "Sun Yat-sen", title: "Pionier der Revolution", headline: "Ein Leben für das moderne China", shortDescription: "Erster Präsident der ROC", quote: "Die Revolution ist noch nicht erfolgreich.", chatGreeting: "Ich bin Sun Yat-sen. Wir müssen uns weiterhin für das Volk bemühen.", suggestedQuestions: ["Warum eine Revolution starten?", "Wie geht man mit Misserfolgen um?", "Was sind die Drei Prinzipien?"], era: "1866-1925", pain: "Wiederholte Misserfolge", recovery: "Unerschütterliche Beharrlichkeit" },
      ja: { name: "孫文", title: "革命の先駆者", headline: "近代中国への献身", shortDescription: "中華民国初代臨時大総統", quote: "革命未だ成らず", chatGreeting: "孫文です。私たちは民衆のために絶えず努力しなければなりません。", suggestedQuestions: ["なぜ革命を始めたのですか？", "失敗をどう乗り越えましたか？", "三民主義とは何ですか？"], era: "1866-1925", pain: "度重なる失敗", recovery: "不屈の意志" },
      es: { name: "Sun Yat-sen", title: "Pionero de la Revolución", headline: "Dedicando su vida a la China moderna", shortDescription: "Primer presidente de la ROC", quote: "La revolución aún no ha triunfado.", chatGreeting: "Soy Sun Yat-sen. Debemos seguir luchando por la gente.", suggestedQuestions: ["¿Por qué iniciar una revolución?", "¿Cómo manejar el fracaso?", "¿Cuáles son los Tres Principios?"], era: "1866-1925", pain: "Fracasos repetidos", recovery: "Persistencia inquebrantable" },
      fr: { name: "Sun Yat-sen", title: "Pionnier de la Révolution", headline: "Consacrer sa vie à la Chine moderne", shortDescription: "Premier président de la ROC", quote: "La révolution n'a pas encore réussi.", chatGreeting: "Je suis Sun Yat-sen. Nous devons continuer à lutter pour le peuple.", suggestedQuestions: ["Pourquoi déclencher une révolution ?", "Comment gérer l'échec ?", "Que sont les Trois Principes ?"], era: "1866-1925", pain: "Échecs répétés", recovery: "Persévérance inébranlable" },
      it: { name: "Sun Yat-sen", title: "Pioniere della Rivoluzione", headline: "Dedicare la vita alla Cina moderna", shortDescription: "Primo presidente della ROC", quote: "La rivoluzione non ha ancora avuto successo.", chatGreeting: "Sono Sun Yat-sen. Dobbiamo continuare a lottare per il popolo.", suggestedQuestions: ["Perché iniziare una rivoluzione?", "Come gestire il fallimento?", "Quali sono i Tre Principi?"], era: "1866-1925", pain: "Ripetuti fallimenti", recovery: "Persistenza incrollabile" },
      pt: { name: "Sun Yat-sen", title: "Pioneiro da Revolução", headline: "Dedicando a vida à China moderna", shortDescription: "Primeiro presidente da ROC", quote: "A revolução ainda não foi bem-sucedida.", chatGreeting: "Eu sou Sun Yat-sen. Devemos continuar lutando pelo povo.", suggestedQuestions: ["Por que iniciar uma revolução?", "Como lidar com o fracasso?", "Quais são os Três Princípios?"], era: "1866-1925", pain: "Falhas repetidas", recovery: "Persistência inabalável" }
    },
    epic: {
      epic_ko: "쑨원은 현대 중국의 국부로 불리는 혁명가입니다. 청나라의 부패와 열강의 침탈 속에서 민족을 구하기 위해 평생을 바쳤습니다. 수없이 많은 봉기를 일으켰으나 매번 뼈아픈 실패와 망명 생활을 겪어야만 했습니다. 그럼에도 불구하고 그는 포기하지 않고 민중을 규합하여 마침내 신해혁명을 성공으로 이끌었습니다. '혁명은 아직 성공하지 않았다'는 그의 유언은 오늘날까지도 큰 울림을 줍니다.",
      epic_en: "Sun Yat-sen is revered as the founding father of modern China. He dedicated his entire life to overthrowing the corrupt Qing dynasty and establishing a republic. His path was fraught with immense trials, including multiple failed uprisings, prolonged exile, and constant danger. Despite these crushing setbacks, his resolve remained unbroken. He tirelessly traveled the world, rallying support and funds for his cause. His unwavering persistence eventually culminated in the Xinhai Revolution of 1911. His famous dying words, 'The revolution is not yet successful,' continue to inspire those who fight for justice and democracy.",
      epic_de: "Sun Yat-sen wird als Gründervater des modernen China verehrt...",
      epic_ja: "孫文は近代中国の国父と呼ばれる革命家です。清朝の腐敗と列強の侵略の中で、民族を救うために生涯を捧げました。数え切れないほどの蜂起を起こしましたが、その度に痛ましい失敗と亡命生活を経験しなければなりませんでした。それにもかかわらず、彼は諦めることなく民衆をまとめ上げ、ついに辛亥革命を成功に導きました。「革命未だ成らず」という彼の遺言は、今日でも人々の心に深く響いています。",
      epic_es: "Sun Yat-sen es venerado como el padre fundador de la China moderna...",
      epic_fr: "Sun Yat-sen est vénéré comme le père fondateur de la Chine moderne...",
      epic_it: "Sun Yat-sen è venerato come il padre fondatore della Cina moderna...",
      epic_pt: "Sun Yat-sen é reverenciado como o pai fundador da China moderna...",
      trials_ko: "수많은 무장 봉기의 실패와 망명 생활.",
      trials_en: "Countless failures of armed uprisings and life in exile.",
      overcoming_ko: "불굴의 의지와 꺾이지 않는 신념으로 혁명을 완수함.",
      overcoming_en: "Completing the revolution with unwavering will and unbroken faith."
    }
  },
  {
    slug: "tokugawa-ieyasu",
    name: "Tokugawa Ieyasu",
    category: "성취",
    messages: {
      en: { name: "Tokugawa Ieyasu", title: "The Patient Unifier", headline: "Uniting a nation through extreme patience", shortDescription: "Founder of Tokugawa shogunate", quote: "Life is like walking a long road with a heavy burden.", chatGreeting: "I am Tokugawa Ieyasu. Patience is the foundation of peace.", suggestedQuestions: ["Why is patience important?", "How did you survive hostage years?", "How to build lasting peace?"], era: "1543-1616", pain: "Years as a hostage", recovery: "Strategic patience" },
      ko: { name: "도쿠가와 이에야스", title: "인내의 승부사", headline: "극강의 인내로 천하를 통일하다", shortDescription: "에도 막부의 창시자", quote: "인생은 무거운 짐을 지고 먼 길을 가는 것과 같다.", chatGreeting: "도쿠가와 이에야스요. 인내는 평화의 주춧돌이라오.", suggestedQuestions: ["인내가 중요한 이유는?", "인질 생활을 어떻게 견뎠소?", "오랜 평화의 비결은?"], era: "1543-1616", pain: "어린 시절의 인질 생활", recovery: "전략적 인내" },
      de: { name: "Tokugawa Ieyasu", title: "Der geduldige Einiger", headline: "Eine Nation durch extreme Geduld vereinen", shortDescription: "Gründer des Tokugawa-Shogunats", quote: "Das Leben ist wie das Gehen eines langen Weges mit einer schweren Last.", chatGreeting: "Ich bin Tokugawa Ieyasu. Geduld ist das Fundament des Friedens.", suggestedQuestions: ["Warum ist Geduld wichtig?", "Wie haben Sie die Jahre als Geisel überlebt?", "Wie baut man dauerhaften Frieden auf?"], era: "1543-1616", pain: "Jahre als Geisel", recovery: "Strategische Geduld" },
      ja: { name: "徳川家康", title: "忍耐の天下人", headline: "極限の忍耐で天下を統一する", shortDescription: "江戸幕府の初代将軍", quote: "人の一生は重荷を負うて遠き道を行くが如し", chatGreeting: "徳川家康である。忍耐こそが天下泰平の礎じゃ。", suggestedQuestions: ["なぜ忍耐が重要なのか？", "人質時代をどう生き抜いたのか？", "長く続く平和を築く秘訣は？"], era: "1543-1616", pain: "幼少期の人質生活", recovery: "戦略的な忍耐" },
      es: { name: "Tokugawa Ieyasu", title: "El Unificador Paciente", headline: "Uniendo una nación a través de la paciencia extrema", shortDescription: "Fundador del shogunato Tokugawa", quote: "La vida es como caminar un largo camino con una carga pesada.", chatGreeting: "Soy Tokugawa Ieyasu. La paciencia es la base de la paz.", suggestedQuestions: ["¿Por qué es importante la paciencia?", "¿Cómo sobreviviste a tus años como rehén?", "¿Cómo construir una paz duradera?"], era: "1543-1616", pain: "Años como rehén", recovery: "Paciencia estratégica" },
      fr: { name: "Tokugawa Ieyasu", title: "L'Unificateur Patient", headline: "Unir une nation grâce à une patience extrême", shortDescription: "Fondateur du shogunat Tokugawa", quote: "La vie, c'est comme marcher sur une longue route avec un lourd fardeau.", chatGreeting: "Je suis Tokugawa Ieyasu. La patience est le fondement de la paix.", suggestedQuestions: ["Pourquoi la patience est-elle importante ?", "Comment avez-vous survécu à vos années d'otage ?", "Comment construire une paix durable ?"], era: "1543-1616", pain: "Années en tant qu'otage", recovery: "Patience stratégique" },
      it: { name: "Tokugawa Ieyasu", title: "L'Unificatore Paziente", headline: "Unire una nazione attraverso una pazienza estrema", shortDescription: "Fondatore dello shogunato Tokugawa", quote: "La vita è come percorrere un lungo cammino con un carico pesante.", chatGreeting: "Sono Tokugawa Ieyasu. La pazienza è il fondamento della pace.", suggestedQuestions: ["Perché la pazienza è importante?", "Come sei sopravvissuto agli anni da ostaggio?", "Come costruire una pace duratura?"], era: "1543-1616", pain: "Anni come ostaggio", recovery: "Pazienza strategica" },
      pt: { name: "Tokugawa Ieyasu", title: "O Unificador Paciente", headline: "Unindo uma nação através da paciência extrema", shortDescription: "Fundador do xogunato Tokugawa", quote: "A vida é como caminhar por uma longa estrada com um fardo pesado.", chatGreeting: "Eu sou Tokugawa Ieyasu. A paciência é a base da paz.", suggestedQuestions: ["Por que a paciência é importante?", "Como você sobreviveu aos anos como refém?", "Como construir uma paz duradoura?"], era: "1543-1616", pain: "Anos como refém", recovery: "Paciência estratégica" }
    },
    epic: {
      epic_ko: "도쿠가와 이에야스는 난세의 일본을 통일하고 에도 막부를 열어 250년의 평화를 구축한 인물입니다. 그의 삶은 고난의 연속이었습니다. 어린 시절 오랜 세월을 인질로 보내며 목숨을 부지해야 했고, 수많은 전투와 정치적 위기 속에서 굴욕을 참아냈습니다. '두견새가 울지 않으면 울 때까지 기다린다'는 말처럼, 그는 초인적인 인내심과 철저한 자기 관리로 최후의 승자가 될 수 있었습니다.",
      epic_en: "Tokugawa Ieyasu unified war-torn Japan and established the Edo shogunate, bringing about 250 years of peace. His early life was defined by extreme hardship, spending years as a hostage to rival clans. He faced countless battles, betrayals, and humiliating defeats. Yet, his extraordinary patience became his greatest weapon. He learned to bide his time, absorbing losses while quietly building strength. By waiting for the right moment rather than rushing into impulsive actions, he eventually emerged victorious, proving that ultimate success belongs to those who can endure the longest.",
      epic_de: "Tokugawa Ieyasu einte das kriegsgebeutelte Japan...",
      epic_ja: "徳川家康は、戦乱の日本を統一し江戸幕府を開き、250年の平和を築いた人物です。彼の人生は苦難の連続でした。幼少期は長い年月を人質として過ごして命を繋ぎ、数多くの戦いや政治的危機の中で屈辱に耐え忍びました。「鳴かぬなら鳴くまで待とうホトトギス」という言葉の通り、彼は超人的な忍耐力と徹底した自己管理により、最終的な勝利者となることができました。",
      epic_es: "Tokugawa Ieyasu unificó el Japón devastado por la guerra...",
      epic_fr: "Tokugawa Ieyasu a unifié le Japon déchiré par la guerre...",
      epic_it: "Tokugawa Ieyasu unificò il Giappone dilaniato dalla guerra...",
      epic_pt: "Tokugawa Ieyasu unificou o Japão devastado pela guerra...",
      trials_ko: "어린 시절의 가혹한 인질 생활과 수많은 정치적 위기.",
      trials_en: "Harsh hostage life in childhood and numerous political crises.",
      overcoming_ko: "초인적인 인내심과 때를 기다리는 지혜.",
      overcoming_en: "Superhuman patience and the wisdom to wait for the right time."
    }
  },
  {
    slug: "miyamoto-musashi",
    name: "Miyamoto Musashi",
    category: "지혜",
    messages: {
      en: { name: "Miyamoto Musashi", title: "Sword Saint", headline: "Mastering the way of strategy", shortDescription: "Legendary swordsman", quote: "There is nothing outside of yourself that can ever enable you to get better.", chatGreeting: "I am Musashi. Let us discuss the Way.", suggestedQuestions: ["What is the Book of Five Rings?", "How to achieve focus?", "What is true victory?"], era: "1584-1645", pain: "Endless life-or-death duels", recovery: "Mastery of the mind" },
      ko: { name: "미야모토 무사시", title: "검성", headline: "병법의 길을 완성하다", shortDescription: "전설적인 검객", quote: "자신을 더 나아지게 하는 것은 외부에 존재하지 않는다.", chatGreeting: "무사시요. 나와 함께 병법의 길을 논해보겠소?", suggestedQuestions: ["오륜서란 무엇인가요?", "집중력은 어떻게 기르나요?", "진정한 승리란?"], era: "1584-1645", pain: "끊임없는 생사의 사투", recovery: "마음의 수련" },
      de: { name: "Miyamoto Musashi", title: "Schwertheiliger", headline: "Den Weg der Strategie meistern", shortDescription: "Legendärer Schwertkämpfer", quote: "Es gibt nichts außerhalb deiner selbst...", chatGreeting: "Ich bin Musashi. Lass uns über den Weg diskutieren.", suggestedQuestions: ["Was ist das Buch der Fünf Ringe?", "Wie erreicht man Fokus?", "Was ist wahrer Sieg?"], era: "1584-1645", pain: "Endlose Duelle auf Leben und Tod", recovery: "Beherrschung des Geistes" },
      ja: { name: "宮本武蔵", title: "剣聖", headline: "兵法の道を極める", shortDescription: "伝説の剣豪", quote: "我、事において後悔せず", chatGreeting: "武蔵だ。共に兵法の道を論じようか。", suggestedQuestions: ["五輪書とは何ですか？", "集中力はどう養うのですか？", "真の勝利とは？"], era: "1584-1645", pain: "絶え間ない死闘", recovery: "心の修練" },
      es: { name: "Miyamoto Musashi", title: "Santo de la Espada", headline: "Dominando el camino de la estrategia", shortDescription: "Espadachín legendario", quote: "No hay nada fuera de ti...", chatGreeting: "Soy Musashi. Discutamos el Camino.", suggestedQuestions: ["¿Qué es el Libro de los Cinco Anillos?", "¿Cómo lograr el enfoque?", "¿Qué es la verdadera victoria?"], era: "1584-1645", pain: "Interminables duelos a vida o muerte", recovery: "Dominio de la mente" },
      fr: { name: "Miyamoto Musashi", title: "Saint de l'Épée", headline: "Maîtriser la voie de la stratégie", shortDescription: "Épéiste légendaire", quote: "Il n'y a rien en dehors de vous-même...", chatGreeting: "Je suis Musashi. Discutons de la Voie.", suggestedQuestions: ["Qu'est-ce que le Livre des Cinq Anneaux ?", "Comment atteindre la concentration ?", "Quelle est la véritable victoire ?"], era: "1584-1645", pain: "Duels à mort sans fin", recovery: "Maîtrise de l'esprit" },
      it: { name: "Miyamoto Musashi", title: "Santo della Spada", headline: "Padroneggiare la via della strategia", shortDescription: "Spadaccino leggendario", quote: "Non c'è niente al di fuori di te...", chatGreeting: "Sono Musashi. Discutiamo della Via.", suggestedQuestions: ["Cos'è il Libro dei Cinque Anelli?", "Come raggiungere la concentrazione?", "Qual è la vera vittoria?"], era: "1584-1645", pain: "Infiniti duelli all'ultimo sangue", recovery: "Padronanza della mente" },
      pt: { name: "Miyamoto Musashi", title: "Santo da Espada", headline: "Dominando o caminho da estratégia", shortDescription: "Espadachim lendário", quote: "Não há nada fora de você...", chatGreeting: "Eu sou Musashi. Vamos discutir o Caminho.", suggestedQuestions: ["O que é o Livro dos Cinco Anéis?", "Como alcançar o foco?", "O que é a verdadeira vitória?"], era: "1584-1645", pain: "Infindáveis duelos de vida ou morte", recovery: "Domínio da mente" }
    },
    epic: {
      epic_ko: "미야모토 무사시는 일본 역사상 최고의 검객으로 불립니다. 그는 평생 60여 차례의 진검승부에서 단 한 번도 패하지 않았습니다. 그러나 그의 진정한 위대함은 단순히 칼싸움에 능했다는 것이 아니라, 죽음의 공포를 이겨내고 마음의 평정을 찾는 구도의 길을 걸었다는 데 있습니다. 노년에 집필한 '오륜서'는 단순한 검술 교본을 넘어 삶을 살아가는 깊은 지혜와 통찰을 담고 있습니다.",
      epic_en: "Miyamoto Musashi is Japan's most legendary swordsman and philosopher. Surviving over 60 life-or-death duels undefeated, he lived a life constantly walking the edge of a blade. However, his true mastery wasn't merely physical combat; it was the total conquest of his own mind. He overcame the primal fear of death through rigorous mental discipline and introspection. In his final years, he retreated to a cave to write 'The Book of Five Rings,' transforming his martial expertise into a profound philosophy of strategy, adaptability, and continuous self-improvement.",
      epic_de: "Miyamoto Musashi ist Japans legendärster Schwertkämpfer...",
      epic_ja: "宮本武蔵は、日本史上最高の剣豪と呼ばれています。彼は生涯で60回以上の真剣勝負を経験し、一度も敗れることはありませんでした。しかし、彼の真の偉大さは単に剣術に優れていたことではなく、死の恐怖に打ち勝ち、心の平静を求める求道の道を歩んだことにあります。晩年に執筆した『五輪書』は、単なる剣術の指南書を超えて、人生を生きるための深い知恵と洞察を含んでいます。",
      epic_es: "Miyamoto Musashi es el espadachín más legendario de Japón...",
      epic_fr: "Miyamoto Musashi est l'épéiste le plus légendaire du Japon...",
      epic_it: "Miyamoto Musashi è lo spadaccino più leggendario del Giappone...",
      epic_pt: "Miyamoto Musashi é o espadachim mais lendário do Japão...",
      trials_ko: "언제 죽을지 모르는 극한의 생사결단.",
      trials_en: "Extreme life-or-death duels with constant threat to life.",
      overcoming_ko: "스스로의 마음을 다스려 병법의 이치를 깨달음.",
      overcoming_en: "Mastering the principles of strategy by controlling his own mind."
    }
  },
  {
    slug: "oda-nobunaga",
    name: "Oda Nobunaga",
    category: "성취",
    messages: {
      en: { name: "Oda Nobunaga", title: "The Innovator", headline: "Revolutionizing a nation through bold action", shortDescription: "Pioneering warlord", quote: "If the cuckoo does not sing, kill it.", chatGreeting: "I am Nobunaga. Embrace change or perish.", suggestedQuestions: ["Why embrace foreign ideas?", "How to lead with absolute authority?", "What was your greatest risk?"], era: "1534-1582", pain: "Constant betrayals", recovery: "Ruthless innovation" },
      ko: { name: "오다 노부나가", title: "혁신가", headline: "과감한 결단으로 천하를 뒤흔들다", shortDescription: "전국시대의 풍운아", quote: "울지 않는 두견새는 죽여버려라.", chatGreeting: "오다 노부나가다. 변화를 받아들이지 않으면 도태될 뿐이다.", suggestedQuestions: ["서양 문물을 수용한 이유는?", "절대적 리더십의 비결은?", "가장 큰 위기는 무엇이었나?"], era: "1534-1582", pain: "계속되는 배신과 포위망", recovery: "무자비한 혁신" },
      de: { name: "Oda Nobunaga", title: "Der Innovator", headline: "Eine Nation revolutionieren", shortDescription: "Kriegsherr", quote: "Wenn der Kuckuck nicht singt, töte ihn.", chatGreeting: "Ich bin Nobunaga.", suggestedQuestions: ["Warum fremde Ideen?", "Führung?", "Risiko?"], era: "1534-1582", pain: "Verrat", recovery: "Innovation" },
      ja: { name: "織田信長", title: "革新者", headline: "果断な決断で天下を動かす", shortDescription: "戦国時代の覇王", quote: "鳴かぬなら殺してしまえホトトギス", chatGreeting: "織田信長である。変化を恐れる者は滅びるのみ。", suggestedQuestions: ["西洋文化を取り入れた理由は？", "強力なリーダーシップの秘訣は？", "最大の危機は？"], era: "1534-1582", pain: "度重なる裏切りと包囲網", recovery: "冷酷なまでの革新" },
      es: { name: "Oda Nobunaga", title: "El Innovador", headline: "Revolucionando una nación", shortDescription: "Señor de la guerra", quote: "Si el cuco no canta, mátalo.", chatGreeting: "Soy Nobunaga.", suggestedQuestions: ["¿Ideas extranjeras?", "¿Liderazgo?", "¿Riesgo?"], era: "1534-1582", pain: "Traición", recovery: "Innovación" },
      fr: { name: "Oda Nobunaga", title: "L'Innovateur", headline: "Révolutionner une nation", shortDescription: "Seigneur de la guerre", quote: "Si le coucou ne chante pas, tuez-le.", chatGreeting: "Je suis Nobunaga.", suggestedQuestions: ["Idées étrangères?", "Leadership?", "Risque?"], era: "1534-1582", pain: "Trahison", recovery: "Innovation" },
      it: { name: "Oda Nobunaga", title: "L'Innovatore", headline: "Rivoluzionare una nazione", shortDescription: "Signore della guerra", quote: "Se il cuculo non canta, uccidilo.", chatGreeting: "Sono Nobunaga.", suggestedQuestions: ["Idee straniere?", "Leadership?", "Rischio?"], era: "1534-1582", pain: "Tradimento", recovery: "Innovazione" },
      pt: { name: "Oda Nobunaga", title: "O Inovador", headline: "Revolucionando uma nação", shortDescription: "Senhor da guerra", quote: "Se o cuco não cantar, mate-o.", chatGreeting: "Eu sou Nobunaga.", suggestedQuestions: ["Ideias estrangeiras?", "Liderança?", "Risco?"], era: "1534-1582", pain: "Traição", recovery: "Inovação" }
    },
    epic: {
      epic_ko: "오다 노부나가는 구습을 타파하고 강력한 혁신을 통해 일본 전국시대의 판도를 바꾼 인물입니다. 사방이 적들로 둘러싸인 절망적인 상황에서도 조총이라는 신무기를 과감하게 도입하고 서양 문물을 수용하며 반전을 꾀했습니다. 비록 천하 통일을 목전에 두고 부하의 배신으로 생을 마감했지만, 그의 파격적인 비전과 실행력은 역사의 흐름을 영원히 바꾸어 놓았습니다.",
      epic_en: "Oda Nobunaga was a visionary warlord who dramatically altered the course of Japanese history through sheer force of will and radical innovation. Surrounded by powerful enemies and constantly facing betrayal, he never clung to tradition. Instead, he embraced revolutionary tactics, such as massed firearms and Western technology. His ruthless pragmatism allowed him to break the power of established religious and military institutions. Though he was ultimately betrayed and forced to commit seppuku before completing his unification, his fearless dismantling of the old order laid the foundation for modern Japan.",
      epic_de: "Ein Visionär, der Traditionen zerstörte, um die Zukunft aufzubauen.",
      epic_ja: "常識を打ち破り、新たな時代を切り拓いた覇王。四方を敵に囲まれた絶望的な状況でも、鉄砲という新兵器を果敢に導入し、西洋文化を受け入れて反転攻勢に転じました。天下統一を目前にして部下の裏切りにより生涯を閉じましたが、彼の型破りなビジョンと実行力は歴史の流れを永遠に変えました。",
      epic_es: "Un visionario que destruyó las tradiciones para construir el futuro.",
      epic_fr: "Un visionnaire qui a détruit les traditions pour construire l'avenir.",
      epic_it: "Un visionario che ha distrutto le tradizioni per costruire il futuro.",
      epic_pt: "Um visionário que destruiu as tradições para construir o futuro.",
      trials_ko: "사방을 에워싼 적대 세력과 끊임없는 반란.",
      trials_en: "Surrounded by hostile forces and constant rebellions.",
      overcoming_ko: "기존의 상식을 파괴하는 혁신과 과감한 실행력.",
      overcoming_en: "Innovation that shattered conventional wisdom and bold execution."
    }
  },
  {
    slug: "toyotomi-hideyoshi",
    name: "Toyotomi Hideyoshi",
    category: "성취",
    messages: {
      en: { name: "Toyotomi Hideyoshi", title: "The Great Unifier", headline: "From peasant to supreme ruler", shortDescription: "Unified Japan", quote: "My life came like dew and vanishes like dew.", chatGreeting: "I am Hideyoshi. Nothing is impossible if you seize the moment.", suggestedQuestions: ["How did you rise from a peasant?", "What is the key to loyalty?", "Why did you disarm the populace?"], era: "1537-1598", pain: "Born in extreme poverty", recovery: "Unmatched cunning and charisma" },
      ko: { name: "도요토미 히데요시", title: "천하인", headline: "가장 밑바닥에서 최고 권력자로", shortDescription: "일본을 통일한 인물", quote: "이슬처럼 와서 이슬처럼 가는 것이 내 인생이련가.", chatGreeting: "도요토미 히데요시다. 기회를 잡는 자에게 불가능이란 없느니라.", suggestedQuestions: ["어떻게 농민에서 권력자가 되었나?", "사람의 마음을 얻는 비결은?", "무기 몰수 정책의 이유는?"], era: "1537-1598", pain: "극심한 가난과 신분적 한계", recovery: "탁월한 기지와 처세술" },
      de: { name: "Toyotomi Hideyoshi", title: "Der Einiger", headline: "Vom Bauern zum Herrscher", shortDescription: "Einigte Japan", quote: "Mein Leben kam wie Tau.", chatGreeting: "Ich bin Hideyoshi.", suggestedQuestions: ["Aufstieg?", "Loyalität?", "Entwaffnung?"], era: "1537-1598", pain: "Armut", recovery: "Charisma" },
      ja: { name: "豊臣秀吉", title: "天下人", headline: "農民から天下人へ", shortDescription: "日本を統一", quote: "露と落ち 露と消えにし 我が身かな", chatGreeting: "豊臣秀吉である。好機を掴めば不可能はない。", suggestedQuestions: ["農民からの出世の秘訣は？", "人の心をつかむには？", "刀狩の目的は？"], era: "1537-1598", pain: "極貧と身分の壁", recovery: "類稀な機転と人心掌握術" },
      es: { name: "Toyotomi Hideyoshi", title: "El Unificador", headline: "De campesino a gobernante", shortDescription: "Unificó Japón", quote: "Mi vida vino como el rocío.", chatGreeting: "Soy Hideyoshi.", suggestedQuestions: ["¿Ascenso?", "¿Lealtad?", "¿Desarme?"], era: "1537-1598", pain: "Pobreza", recovery: "Carisma" },
      fr: { name: "Toyotomi Hideyoshi", title: "L'Unificateur", headline: "De paysan à dirigeant", shortDescription: "A unifié le Japon", quote: "Ma vie est venue comme la rosée.", chatGreeting: "Je suis Hideyoshi.", suggestedQuestions: ["Ascension?", "Loyauté?", "Désarmement?"], era: "1537-1598", pain: "Pauvreté", recovery: "Charisme" },
      it: { name: "Toyotomi Hideyoshi", title: "L'Unificatore", headline: "Da contadino a sovrano", shortDescription: "Ha unificato il Giappone", quote: "La mia vita è arrivata come la rugiada.", chatGreeting: "Sono Hideyoshi.", suggestedQuestions: ["Ascesa?", "Lealtà?", "Disarmo?"], era: "1537-1598", pain: "Povertà", recovery: "Carisma" },
      pt: { name: "Toyotomi Hideyoshi", title: "O Unificador", headline: "De camponês a governante", shortDescription: "Unificou o Japão", quote: "Minha vida veio como o orvalho.", chatGreeting: "Eu sou Hideyoshi.", suggestedQuestions: ["Ascensão?", "Lealdade?", "Desarmamento?"], era: "1537-1598", pain: "Pobreza", recovery: "Carisma" }
    },
    epic: {
      epic_ko: "도요토미 히데요시는 신분제가 엄격했던 시대에 가장 밑바닥 농민의 아들로 태어나 최고 권력자인 관백의 자리에까지 오른 입지전적인 인물입니다. 그는 천한 신분이라는 멸시와 숱한 죽음의 고비를 특유의 기지와 처세술로 넘겼습니다. 사람의 마음을 꿰뚫어보고 적조차 내 편으로 만드는 탁월한 통찰력으로 일본을 통일하며, 출신 성분을 극복한 인간 승리의 상징이 되었습니다.",
      epic_en: "Toyotomi Hideyoshi's rise from a destitute peasant to the supreme ruler of Japan is one of the most remarkable rags-to-riches stories in history. Born into extreme poverty and facing rigid social barriers, he had no martial pedigree or resources. Yet, he overcame every prejudice and mortal peril through unmatched cunning, extraordinary charisma, and political genius. He possessed an uncanny ability to read people, turning bitter enemies into loyal allies. By completing the unification of Japan, he proved that ambition and intellect could triumph over the most insurmountable social limits.",
      epic_de: "Vom tiefsten Boden an die absolute Spitze.",
      epic_ja: "豊臣秀吉は、身分制度が厳しかった時代に最も底辺の農民の子として生まれ、最高権力者である関白の地位にまで上り詰めた立志伝中の人物です。彼は卑しい身分という蔑視と数々の死の危機を、特有の機転と処世術で乗り越えました。人の心を読み取り、敵さえも味方につける卓越した洞察力で日本を統一し、出身成分を克服した人間勝利の象徴となりました。",
      epic_es: "Desde lo más bajo hasta la cima absoluta.",
      epic_fr: "Du plus bas jusqu'au sommet absolu.",
      epic_it: "Dal basso fino alla vetta assoluta.",
      epic_pt: "Do fundo até o topo absoluto.",
      trials_ko: "엄격한 신분제 사회에서의 천대와 가난.",
      trials_en: "Contempt and poverty in a society with a rigid caste system.",
      overcoming_ko: "탁월한 사람 보는 눈과 적마저 포용하는 리더십.",
      overcoming_en: "Exceptional insight into people and leadership that embraced even enemies."
    }
  },
  {
    slug: "ashoka-the-great",
    name: "Ashoka the Great",
    category: "성취",
    messages: {
      en: { name: "Ashoka", title: "The Compassionate Emperor", headline: "From a bloody conqueror to a peaceful ruler", shortDescription: "Emperor of the Maurya Dynasty", quote: "All men are my children.", chatGreeting: "I am Ashoka. Let us walk the path of Dharma.", suggestedQuestions: ["Why did you change after Kalinga?", "What is Dharma?", "How do you rule with peace?"], era: "304BC-232BC", pain: "Guilt from mass slaughter", recovery: "Embracing Buddhism and non-violence" },
      ko: { name: "아소카 대왕", title: "자비로운 황제", headline: "피의 정복자에서 평화의 통치자로", shortDescription: "마우리아 왕조의 황제", quote: "모든 사람은 나의 자식이다.", chatGreeting: "아소카입니다. 나와 함께 다르마의 길을 걸읍시다.", suggestedQuestions: ["칼링가 전투 이후 왜 변하셨나요?", "다르마란 무엇입니까?", "평화로운 통치의 비결은?"], era: "304BC-232BC", pain: "참혹한 학살로 인한 뼈저린 죄책감", recovery: "불교 귀의와 비폭력의 실천" },
      de: { name: "Ashoka", title: "Der barmherzige Kaiser", headline: "Vom Eroberer zum Frieden", shortDescription: "Kaiser der Maurya-Dynastie", quote: "Alle Menschen sind meine Kinder.", chatGreeting: "Ich bin Ashoka.", suggestedQuestions: ["Warum der Wandel?", "Was ist Dharma?", "Friedlich regieren?"], era: "304BC-232BC", pain: "Schuld", recovery: "Buddhismus" },
      ja: { name: "アショカ王", title: "慈悲の皇帝", headline: "血塗られた征服者から平和の統治者へ", shortDescription: "マウリヤ朝の皇帝", quote: "すべての人々は我が子である", chatGreeting: "アショカです。共にダルマの道を歩みましょう。", suggestedQuestions: ["カリンガ戦後に変わった理由は？", "ダルマとは何ですか？", "平和な統治の秘訣は？"], era: "304BC-232BC", pain: "大虐殺による深い罪悪感", recovery: "仏教への帰依と非暴力" },
      es: { name: "Ashoka", title: "El Emperador Compasivo", headline: "De conquistador a paz", shortDescription: "Emperador de la dinastía Maurya", quote: "Todos los hombres son mis hijos.", chatGreeting: "Soy Ashoka.", suggestedQuestions: ["¿Por qué el cambio?", "¿Qué es Dharma?", "¿Gobernar en paz?"], era: "304BC-232BC", pain: "Culpa", recovery: "Budismo" },
      fr: { name: "Ashoka", title: "L'Empereur Compatissant", headline: "De conquérant à la paix", shortDescription: "Empereur de la dynastie Maurya", quote: "Tous les hommes sont mes enfants.", chatGreeting: "Je suis Ashoka.", suggestedQuestions: ["Pourquoi le changement?", "Qu'est-ce que le Dharma?", "Gouverner en paix?"], era: "304BC-232BC", pain: "Culpabilité", recovery: "Bouddhisme" },
      it: { name: "Ashoka", title: "L'Imperatore Compassionevole", headline: "Da conquistatore alla pace", shortDescription: "Imperatore della dinastia Maurya", quote: "Tutti gli uomini sono miei figli.", chatGreeting: "Sono Ashoka.", suggestedQuestions: ["Perché il cambiamento?", "Cos'è il Dharma?", "Governare in pace?"], era: "304BC-232BC", pain: "Senso di colpa", recovery: "Buddismo" },
      pt: { name: "Ashoka", title: "O Imperador Compassivo", headline: "De conquistador à paz", shortDescription: "Imperador da dinastia Maurya", quote: "Todos os homens são meus filhos.", chatGreeting: "Eu sou Ashoka.", suggestedQuestions: ["Por que a mudança?", "O que é Dharma?", "Governar em paz?"], era: "304BC-232BC", pain: "Culpa", recovery: "Budismo" }
    },
    epic: {
      epic_ko: "아소카 대왕은 인도 역사상 가장 위대한 통치자로 꼽힙니다. 젊은 시절 그는 잔혹한 정복 전쟁을 벌여 마우리아 제국의 영토를 크게 넓혔습니다. 하지만 칼링가 전투에서 수십만 명이 희생되는 참상을 목격한 후, 뼈저린 참회와 죄책감에 시달렸습니다. 이 고통스러운 각성은 그를 완전히 다른 사람으로 만들었습니다. 무기를 버리고 불교에 귀의한 그는 비폭력과 자비를 통치 이념으로 삼아 역사상 유례없는 평화의 제국을 건설했습니다.",
      epic_en: "Ashoka the Great is celebrated as one of the most remarkable emperors in world history. Early in his reign, he was a ruthless conqueror who vastly expanded the Mauryan Empire through bloodshed. However, the turning point of his life came after the Kalinga War. Witnessing the horrific slaughter of hundreds of thousands of people, he was overwhelmed by immense guilt and spiritual agony. This profound suffering sparked a total transformation. He renounced violence, embraced Buddhism, and dedicated the rest of his life to ruling through compassion, tolerance, and non-violence. He replaced the drums of war with the drums of Dharma, establishing a legacy of peace that echoes through millennia.",
      epic_de: "Ein Eroberer, der den Frieden wählte.",
      epic_ja: "アショカ大王は、インド史上最も偉大な統治者の一人に数えられます。若い頃、彼は残酷な征服戦争を行い、マウリヤ帝国の領土を大幅に拡大しました。しかし、カリンガの戦いで数十万人が犠牲になる惨状を目撃した後、痛烈な後悔と罪悪感に苛まれました。この苦痛に満ちた覚醒は彼を全く別の人物に変えました。武器を捨てて仏教に帰依した彼は、非暴力と慈悲を統治理念とし、歴史上類を見ない平和な帝国を築き上げました。",
      epic_es: "Un conquistador que eligió la paz.",
      epic_fr: "Un conquérant qui a choisi la paix.",
      epic_it: "Un conquistatore che ha scelto la pace.",
      epic_pt: "Um conquistador que escolheu a paz.",
      trials_ko: "전쟁의 참상으로 인한 극심한 영혼의 고통과 죄책감.",
      trials_en: "Extreme spiritual agony and guilt caused by the horrors of war.",
      overcoming_ko: "진정한 참회를 통해 비폭력과 자비의 통치를 펼침.",
      overcoming_en: "Practicing a rule of non-violence and compassion through genuine repentance."
    }
  }
];

giants.forEach(giant => {
  const filePath = path.join(destDir, giant.slug + ".json");
  fs.writeFileSync(filePath, JSON.stringify(giant, null, 2), 'utf-8');
});
console.log("All giant JSON files written.");
