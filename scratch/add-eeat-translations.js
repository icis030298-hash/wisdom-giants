const fs = require('fs');
const path = require('path');

const LOCALES = ["ko", "en", "de", "ja", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

// 1. Define all translations
const translations = {
  Disclaimer: {
    meta: {
      title: {
        ko: "면책고지 | Giants Wisdom",
        en: "Disclaimer | Giants Wisdom",
        de: "Haftungsausschluss | Giants Wisdom",
        ja: "免責事項 | Giants Wisdom",
        es: "Descargo de Responsabilidad | Giants Wisdom",
        fr: "Avertissement | Giants Wisdom",
        it: "Disclaimer | Giants Wisdom",
        pt: "Aviso Legal | Giants Wisdom",
        ar: "إخلاء المسؤولية | Giants Wisdom",
        hi: "अस्वीकरण | Giants Wisdom",
        ru: "Отказ от ответственности | Giants Wisdom",
        zh: "免责声明 | Giants Wisdom"
      },
      description: {
        ko: "Giants Wisdom 서비스 이용 전 반드시 확인하세요.",
        en: "Please read before using Giants Wisdom.",
        de: "Bitte lesen Sie vor der Nutzung von Giants Wisdom.",
        ja: "Giants Wisdomをご利用前にお読みください。",
        es: "Léalo antes de usar Giants Wisdom.",
        fr: "Veuillez lire avant d'utiliser Giants Wisdom.",
        it: "Si prega di leggere prima di utilizzare Giants Wisdom.",
        pt: "Por favor, leia antes de usar o Giants Wisdom.",
        ar: "يرجى القراءة قبل استخدام Giants Wisdom.",
        hi: "Giants Wisdom का उपयोग करने से पहले कृपया पढ़ें।",
        ru: "Пожалуйста, прочтите перед использованием Giants Wisdom.",
        zh: "使用Giants Wisdom前请阅读。"
      }
    },
    pageTitle: {
      ko: "면책고지",
      en: "Disclaimer",
      de: "Haftungsausschluss",
      ja: "免責事項",
      es: "Descargo de Responsabilidad",
      fr: "Avertissement",
      it: "Disclaimer",
      pt: "Aviso Legal",
      ar: "إخلاء المسؤولية",
      hi: "अस्वीकरण",
      ru: "Отказ от ответственности",
      zh: "免责声明"
    },
    lastUpdated: {
      ko: "최종 업데이트: 2026년 6월",
      en: "Last Updated: June 2026",
      de: "Zuletzt aktualisiert: Juni 2026",
      ja: "最終更新：2026年6月",
      es: "Última actualización: junio de 2026",
      fr: "Dernière mise à jour : juin 2026",
      it: "Ultimo aggiornamento: giugno 2026",
      pt: "Última atualização: junho de 2026",
      ar: "آخر تحديث: يونيو 2026",
      hi: "अंतिम अपडेट: जून 2026",
      ru: "Последнее обновление: июнь 2026",
      zh: "最后更新：2026年6月"
    },
    sections: [
      {
        title: {
          ko: "AI 생성 콘텐츠 안내",
          en: "AI-Generated Content Notice",
          de: "Hinweis zu KI-generierten Inhalten",
          ja: "AI生成コンテンツについて",
          es: "Aviso sobre Contenido Generated por IA",
          fr: "Avis sur le contenu généré par IA",
          it: "Avviso sui contenuti generati dall'IA",
          pt: "Aviso sobre Conteúdo Gerado por IA",
          ar: "إشعار المحتوى المُنشأ بالذكاء الاصطناعي",
          hi: "AI-जनित सामग्री सूचना",
          ru: "Уведомление о контенте, созданном ИИ",
          zh: "AI生成内容声明"
        },
        content: {
          ko: "Giants Wisdom의 역사 위인 AI 대화 서비스는 인공지능 기술을 활용하여 역사적 기록과 문헌을 기반으로 대화를 생성합니다. 이 서비스에서 제공되는 위인의 발언, 조언, 대화 내용은 실제 역사적 인물의 직접적인 발언이 아니며, AI가 역사적 자료를 분석하여 생성한 창작적 재현입니다. Giants Wisdom은 역사적 사실의 정확성을 위해 최선을 다하고 있으나, AI 생성 특성상 일부 내용이 실제 역사와 다를 수 있습니다.",
          en: "Giants Wisdom's AI conversation service with historical figures uses artificial intelligence technology to generate dialogues based on historical records and documents. The statements, advice, and conversations attributed to historical figures in this service are not direct quotes from actual historical persons, but are AI-generated creative representations based on analysis of historical materials. Giants Wisdom strives for historical accuracy, but AI-generated content may occasionally differ from actual historical records.",
          de: "Giants Wisdoms KI-Gesprächsdienst mit historischen Persönlichkeiten nutzt künstliche Intelligenz, um Dialoge auf Basis historischer Aufzeichnungen zu erstellen. Die Aussagen und Gespräche der historischen Persönlichkeiten sind keine direkten Zitate, sondern KI-generierte kreative Darstellungen.",
          ja: "Giants WisdomのAI対話サービスは、歴史的記録と文献に基づいてAI技術を用いて対화를生成します。本サービスにおける歴史上の人物の発言・助言・対話は、実際の人物의 직접적인 말이 아니라 역사적 자료를 분석하여 생성된 AI의 창작적 재현입니다.",
          es: "El servicio de conversación con IA de Giants Wisdom utiliza inteligencia artificial para generar diálogos basados en registros históricos. Las declaraciones de los personajes históricos no son citas directas de personas reales, sino representaciones creativas generadas por IA basadas en materiales históricos.",
          fr: "Le service de conversation IA de Giants Wisdom utilise l'intelligence artificielle pour générer des dialogues basés sur des documents historiques. Les déclarations des personnages historiques ne sont pas des citations directes, mais des représentations créatives générées par IA.",
          it: "Il servizio di conversazione AI di Giants Wisdom utilizza l'informazione artificiale per generare dialoghi basati su documenti storici. Le dichiarazioni dei personaggi storici non sono citazioni dirette, ma rappresentazioni creative generate dall'IA.",
          pt: "O serviço de conversação com IA do Giants Wisdom utiliza inteligência artificial para gerar diálogos com base em registros históricos. As declarações dos personagens históricos não são citações diretas, mas representações criativas geradas por IA.",
          ar: "تستخدم خدمة محادثة الذكاء الاصطناعي في Giants Wisdom تقنية الذكاء الاصطناعي لإنشاء حوارات بناءً على السجلات التاريخية. تصريحات الشخصيات التاريخية ليست اقتباسات مباشرة، بل تمثيلات إبداعية من إنشاء الذكاء الاصطناعي.",
          hi: "Giants Wisdom की AI बातचीत सेवा ऐतिहासिक अभिलेखों के आधार पर संवाद उत्पन्न करने के लिए AI का उपयोग करती है। ऐतिहासिक हस्तियों के बयान प्रत्यक्ष उद्धरण नहीं हैं, बल्कि AI द्वारा निर्मित रचनात्मक प्रस्तुतियाँ हैं।",
          ru: "Сервис ИИ-бесед Giants Wisdom использует искусственный интеллект для создания диалогов на основе исторических источников. Высказывания исторических личностей — это не прямые цитаты, а творческие интерпретации, созданные ИИ.",
          zh: "Giants Wisdom的AI对话服务利用人工智能技术，基于历史记录生成对话内容。历史人物的言论并非真实人物的直接引用，而是AI基于历史资料分析生成的创意再现。"
        }
      },
      {
        title: {
          ko: "교육적 목적",
          en: "Educational Purpose",
          de: "Bildungszweck",
          ja: "教育目的",
          es: "Propósito Educativo",
          fr: "But éducatif",
          it: "Scopo educativo",
          pt: "Propósito Educacional",
          ar: "الغرض التعليمي",
          hi: "शैक्षिक उद्देश्य",
          ru: "Образовательная цель",
          zh: "教育目的"
        },
        content: {
          ko: "Giants Wisdom은 역사적 위인들의 삶과 지혜를 현대인이 쉽게 접할 수 있도록 돕는 교육적 목적의 서비스입니다. 제공되는 모든 콘텐츠는 정보 제공 및 교육 목적으로만 사용되어야 하며, 전문적인 역사학 연구나 학술적 인용의 자료로 활용해서는 안 됩니다.",
          en: "Giants Wisdom is an educational service designed to make the lives and wisdom of historical figures accessible to modern audiences. All content provided is for informational and educational purposes only and should not be used as a source for professional historical research or academic citations.",
          de: "Giants Wisdom ist ein Bildungsdienst, der darauf ausgerichtet ist, die Weisheit historischer Persönlichkeiten für das moderne Publikum zugänglich zu machen. Alle Inhalte dienen ausschließlich zu Informations- und Bildungszwecken.",
          ja: "Giants Wisdomは、歴史上の偉人たちの知恵を現代の人々に身近なものとする教育的サービスです。提供されるすべてのコンテンツは情報提供および教育目的のみであり、専門的な歴史研究や学術적 인용의 자료로서 사용해서는 안 됩니다.",
          es: "Giants Wisdom es un servicio educativo diseñado para hacer accesible la sabiduría de figuras históricas al público moderno. Todo el contenido es solo para fines informativos y educativos.",
          fr: "Giants Wisdom est un service éducatif conçu pour rendre la sagesse des personnages historiques accessible au public moderne. Tout le contenu est fourni à des fins d'information et d'éducation uniquement.",
          it: "Giants Wisdom è un servizio educativo progettato per rendere accessibile la saggezza dei personaggi storici al pubblico moderno. Tutti i contenuti sono forniti solo a scopo informativo ed educativo.",
          pt: "Giants Wisdom é um serviço educacional projetado para tornar a sabedoria de figuras históricas acessível ao público moderno. Todo o conteúdo é fornecido apenas para fins informativos e educacionais.",
          ar: "Giants Wisdom خدمة تعليمية مصممة لجعل حكمة الشخصيات التاريخية في متناول الجمهور الحديث. جميع المحتويات مخصصة للأغراض المعلوماتية والتعليمية فقط.",
          hi: "Giants Wisdom एक शैक्षिक सेवा है जो ऐतिहासिक हस्तियों की बुद्धि को आधुनिक दर्शकों तक पहुँचाने के लिए बनाई गई है। सभी सामग्री केवल सूचना और शिक्षा के उद्देश्यों के लिए है।",
          ru: "Giants Wisdom — образовательный сервис, созданный для того, чтобы сделать мудрость исторических личностей доступной современной аудитории. Весь контент предназначен исключительно для информационных и образовательных целей.",
          zh: "Giants Wisdom是一项教育服务，旨在让现代受众轻松接触历史人物的智慧。所有内容仅供参考和教育目的，不应用于专业历史研究或学术引用。"
        }
      },
      {
        title: {
          ko: "정보의 정확성",
          en: "Accuracy of Information",
          de: "Genauigkeit der Informationen",
          ja: "情報の正確性",
          es: "Exactitud de la Información",
          fr: "Exactitude des informations",
          it: "Accuratezza delle informazioni",
          pt: "Precisão das Informações",
          ar: "دقة المعلومات",
          hi: "जानकारी की सटीकता",
          ru: "Точность информации",
          zh: "信息准确性"
        },
        content: {
          ko: "Giants Wisdom은 제공되는 콘텐츠의 정확성을 위해 노력하지만, 모든 정보의 완전한 정확성을 보장하지는 않습니다. 역사적 사실에 대한 중요한 결정을 내려야 할 경우, 반드시 신뢰할 수 있는 역사 자료와 전문가의 의견을 참조하시기 바랍니다.",
          en: "Giants Wisdom strives for accuracy in the content provided, but does not guarantee the complete accuracy of all information. For important decisions based on historical facts, please consult reliable historical sources and expert opinions.",
          de: "Giants Wisdom bemüht sich um die Genauigkeit der bereitgestellten Inhalte, garantiert jedoch nicht die vollständige Korrektheit aller Informationen. Für wichtige Entscheidungen konsultieren Sie bitte zuverlässige historische Quellen.",
          ja: "Giants Wisdomは提供するコンテンツの正確性に努めていますが、すべての情報の完全な正確性を保証するものではありません. 歴史的事実に基づく重要な判断は、信頼できる歴史資料や専門家の意見をご参照ください.",
          es: "Giants Wisdom se esfuerza por la precisión en el contenido, pero no garantiza la exactitud completa de toda la información. Para decisiones importantes basadas en hechos históricos, consulte fuentes históricas confiables.",
          fr: "Giants Wisdom s'efforce d'assurer l'exactitude du contenu, mais ne garantit pas l'exactitude complète de toutes les informations. Pour les décisions importantes, veuillez consulter des sources historiques fiables.",
          it: "Giants Wisdom si impegna per l'accuratezza dei contenuti, ma non garantisce la completa accuratezza di tutte le informazioni. Per decisioni importanti, consultare fonti storiche affidabili.",
          pt: "Giants Wisdom se esforça pela precisão no conteúdo, mas não garante a precisão completa de todas as informações. Para decisões importantes, consulte fontes históricas confiáveis.",
          ar: "تسعى Giants Wisdom إلى الدقة في المحتوى المقدم، لكنها لا تضمن الدقة الكاملة لجميع المعلومات. للقرارات المهمة، يرجى الرجوع إلى المصادر التاريخية الموثقة.",
          hi: "Giants Wisdom प्रदान की गई सामग्री में सटीकता के लिए प्रयासरत है, लेकिन सभी जानकारी की पूर्ण सटीकता की गारंटी नहीं देता। महत्वपूर्ण निर्णयों के लिए विश्वसनीय ऐतिहासिक स्रोतों से परामर्श करें।",
          ru: "Giants Wisdom стремится к точности предоставляемого контента, но не гарантирует полную точность всей информации. Для важных решений обращайтесь к надёжным историческим источникам.",
          zh: "Giants Wisdom致力于提供准确的内容，但不保证所有信息的完全准确性。对于基于历史事实的重要决策，请参考可靠的历史资料和专家意见。"
        }
      },
      {
        title: {
          ko: "저작권",
          en: "Copyright",
          de: "Urheberrecht",
          ja: "著作権",
          es: "Derechos de Autor",
          fr: "Droits d'auteur",
          it: "Copyright",
          pt: "Direitos Autorais",
          ar: "حقوق النشر",
          hi: "कॉपीराइट",
          ru: "Авторские права",
          zh: "版权"
        },
        content: {
          ko: "Giants Wisdom의 모든 콘텐츠(텍스트, 디자인, AI 대화 시스템 등)는 Giants Wisdom의 지적 재산입니다. 사전 서면 허가 없이 상업적 목적으로 복제, 배포, 수정하는 것을 금지합니다. 교육적 비상업적 목적으로 사용 시 출처를 명확히 표기해 주시기 바랍니다.",
          en: "All content on Giants Wisdom (text, design, AI conversation systems, etc.) is the intellectual property of Giants Wisdom. Reproduction, distribution, or modification for commercial purposes without prior written permission is prohibited. For educational, non-commercial use, please clearly attribute the source.",
          de: "Alle Inhalte auf Giants Wisdom sind geistiges Eigentum von Giants Wisdom. Vervielfältigung, Verbreitung oder Änderung für kommerzielle Zwecke ohne vorherige schriftliche Genehmigung ist untersagt.",
          ja: "Giants Wisdomのすべてのコンテンツ（テキスト、デザイン、AIシステム等）はGiants Wisdomの知的財産です。事前の書면による許可なく商業目的で複製・配布・改変することを禁止します。",
          es: "Todo el contenido de Giants Wisdom es propiedad intelectual de Giants Wisdom. La reproducción o distribución con fines comerciales sin permiso previo por escrito está prohibida.",
          fr: "Tout le contenu de Giants Wisdom est la propriété intellectuelle de Giants Wisdom. La reproduction ou distribution à des fins commerciales sans autorisation écrite préalable est interdite.",
          it: "Tutti i contenuti di Giants Wisdom sono proprietà intellettuale di Giants Wisdom. La riproduzione o distribuzione per scopi commerciali senza previa autorizzazione scritta è vietata.",
          pt: "Todo o conteúdo do Giants Wisdom é propriedade intelectual do Giants Wisdom. A reprodução ou distribuição para fins comerciais sem permissão prévia por escrito é proibida.",
          ar: "جميع محتويات Giants Wisdom هي ملكية فكرية لـ Giants Wisdom. يُحظر نسخها أو توزيعها لأغراض تجارية دون إذن كتابي مسبق.",
          hi: "Giants Wisdom की सभी सामग्री Giants Wisdom की बौद्धिक संपत्ति है। पूर्व लिखित अनुमति के बिना व्यावसायिक उद्देश्यों के लिए पुनरुत्पादन या वितरण प्रतिबंधित है।",
          ru: "Весь контент Giants Wisdom является интеллектуальной собственностью Giants Wisdom. Воспроизведение или распространение в коммерческих целях без предварительного письменного разрешения запрещено.",
          zh: "Giants Wisdom的所有内容（文字、设计、AI对话系统等）均为Giants Wisdom的知识产权。未经事先书面许可，禁止出于商业目的复制、分发 or 修改。"
        }
      }
    ],
    contact: {
      ko: "면책고지에 관한 문의는 contact@giantswisdom.com으로 연락주시기 바랍니다.",
      en: "For inquiries about this disclaimer, please contact contact@giantswisdom.com.",
      de: "Bei Fragen zu diesem Haftungsausschluss wenden Sie sich bitte an contact@giantswisdom.com.",
      ja: "免責事項に関するお問い合わせは contact@giantswisdom.com までご連絡ください。",
      es: "Para consultas sobre este descargo, contáctenos en contact@giantswisdom.com.",
      fr: "Pour toute question concernant cet avertissement, contactez contact@giantswisdom.com.",
      it: "Per domande su questo disclaimer, contattare contact@giantswisdom.com.",
      pt: "Para dúvidas sobre este aviso legal, entre em contato pelo contact@giantswisdom.com.",
      ar: "للاستفسار عن إخلاء المسؤولية، تواصل معنا على contact@giantswisdom.com.",
      hi: "इस अस्वीकरण के बारे में पूछताछ के लिए contact@giantswisdom.com से संपर्क करें।",
      ru: "По вопросам об отказе от ответственности пишите на contact@giantswisdom.com.",
      zh: "如有关于本免责声明的疑问，请联系 contact@giantswisdom.com。"
    }
  },
  Navigation: {
    disclaimer: {
      ko: "면책고지",
      en: "Disclaimer",
      de: "Haftungsausschluss",
      ja: "免責事項",
      es: "Descargo",
      fr: "Avertissement",
      it: "Disclaimer",
      pt: "Aviso Legal",
      ar: "إخلاء المسؤولية",
      hi: "अस्वीकरण",
      ru: "Отказ",
      zh: "免责声明"
    }
  },
  BlogAuthorBox: {
    authorLabel: {
      ko: "이 글 작성",
      en: "Written by",
      de: "Verfasst von",
      ja: "執筆",
      es: "Escrito por",
      fr: "Rédigé par",
      it: "Scritto da",
      pt: "Escrito por",
      ar: "كتبه",
      hi: "लिखा गया",
      ru: "Автор",
      zh: "撰写者"
    },
    authorName: {
      ko: "Giants Wisdom 편집팀",
      en: "Giants Wisdom Editorial Team",
      de: "Giants Wisdom Redaktion",
      ja: "Giants Wisdom 編集チーム",
      es: "Equipo Editorial de Giants Wisdom",
      fr: "Équipe éditoriale de Giants Wisdom",
      it: "Team Editoriale di Giants Wisdom",
      pt: "Equipe Editorial do Giants Wisdom",
      ar: "فريق تحرير Giants Wisdom",
      hi: "Giants Wisdom संपादकीय टीम",
      ru: "Редакция Giants Wisdom",
      zh: "Giants Wisdom编辑团队"
    },
    authorDescription: {
      ko: "역사적 기록과 문헌을 바탕으로 검증된 정보만을 전달합니다. AI 생성 콘텐츠는 반드시 편집 검토를 거칩니다.",
      en: "We deliver only verified information based on historical records and documents. All AI-generated content undergoes editorial review.",
      de: "Wir liefern nur verifizierte Informationen auf Basis historischer Quellen. KI-generierte Inhalte werden redaktionell überprüft.",
      ja: "歴史的記録と文献に基づき、検証済みの情報のみをお届けします。AI生成コンテンツは必ず編集審査を経ています。",
      es: "Entregamos solo información verificada basada en registros históricos. El contenido generado por IA pasa por revisión editorial.",
      fr: "Nous fournissons uniquement des informations vérifiées basées sur des documents historiques. Le contenu généré par IA fait l'objet d'une révision éditoriale.",
      it: "Forniamo solo informazioni verificate basate su documenti storici. I contenuti generati dall'IA sono sottoposti a revisione editoriale.",
      pt: "Fornecemos apenas informações verificadas com base em registros históricos. O conteúdo gerado por IA passa por revisão editorial.",
      ar: "نقدم فقط معلومات موثقة بناءً على السجلات التاريخية. يخضع المحتوى المُنشأ بالذكاء الاصطناعي للمراجعة التحريرية.",
      hi: "हम ऐतिहासिक अभिलेखों पर आधारित केवल सत्यापित जानकारी प्रदान करते हैं। AI-जनित सामग्री की संपादकीय समीक्षा की जाती है।",
      ru: "Мы публикуем только проверенную информацию на основе исторических источников. Контент, созданный ИИ, проходит редакционную проверку.",
      zh: "我们仅提供基于历史记录的经过核实的信息。AI生成的内容须经过编辑审核。"
    },
    publishedLabel: {
      ko: "발행",
      en: "Published",
      de: "Veröffentlicht",
      ja: "公開",
      es: "Publicado",
      fr: "Publié",
      it: "Pubblicato",
      pt: "Publicado",
      ar: "نُشر",
      hi: "प्रकाशित",
      ru: "Опубликовано",
      zh: "发布"
    },
    updatedLabel: {
      ko: "수정",
      en: "Updated",
      de: "Aktualisiert",
      ja: "更新",
      es: "Actualizado",
      fr: "Mis à jour",
      it: "Aggiornato",
      pt: "Atualizado",
      ar: "محدّث",
      hi: "अपडेट",
      ru: "Обновлено",
      zh: "更新"
    }
  },
  AboutEditorialPolicy: {
    sectionTitle: {
      ko: "편집 원칙",
      en: "Editorial Policy",
      de: "Redaktionelle Grundsätze",
      ja: "編集方針",
      es: "Política Editorial",
      fr: "Politique éditoriale",
      it: "Politica Editoriale",
      pt: "Política Editorial",
      ar: "السياسة التحريرية",
      hi: "संपादकीय नीति",
      ru: "Редакционная политика",
      zh: "编辑方针"
    },
    sectionSubtitle: {
      ko: "Giants Wisdom은 다음 원칙에 따라 콘텐츠를 제작합니다",
      en: "Giants Wisdom creates content according to these principles",
      de: "Giants Wisdom erstellt Inhalte nach folgenden Grundsätzen",
      ja: "Giants Wisdomは以下の方針でコンテンツを制作します",
      es: "Giants Wisdom crea contenido según estos principios",
      fr: "Giants Wisdom crée du contenu selon ces principes",
      it: "Giants Wisdom crea contenuti secondo questi principi",
      pt: "Giants Wisdom cria conteúdo de acordo com estes princípios",
      ar: "ينشئ Giants Wisdom محتوى وفقاً لهذه المبادئ",
      hi: "Giants Wisdom इन सिद्धांतों के अनुसार सामग्री बनाता है",
      ru: "Giants Wisdom создаёт контент в соответствии со следующими принципами",
      zh: "Giants Wisdom按以下原则创作内容"
    },
    principles: [
      {
        icon: "📚",
        title: {
          ko: "역사적 사실 기반",
          en: "Based on Historical Facts",
          de: "Historisch fundiert",
          ja: "역사적 사실에 기반",
          es: "Basado en hechos históricos",
          fr: "Basé sur des faits historiques",
          it: "Basato su fatti storici",
          pt: "Baseado em fatos históricos",
          ar: "مبني على الحقائق التاريخية",
          hi: "ऐतिहासिक तथ्यों पर आधारित",
          ru: "Основано на исторических фактах",
          zh: "基于历史事实"
        },
        description: {
          ko: "모든 위인 정보와 대화는 검증된 역사적 자료를 기반으로 제작됩니다.",
          en: "All historical figure information and conversations are based on verified historical sources.",
          de: "Alle Informationen über historische Persönlichkeiten basieren auf verifizierten Quellen.",
          ja: "すべての偉人情報と対話は、検証済みの歴史的資料に基づいています。",
          es: "Toda la información sobre personajes históricos se basa en fuentes históricas verificadas.",
          fr: "Toutes les informations sur les personnages historiques sont basées sur des sources vérifiées.",
          it: "Tutte le informazioni sui personaggi storici si basano su fonti storiche verificate.",
          pt: "Todas as informações sobre personagens históricos são baseadas em fontes históricas verificadas.",
          ar: "جميع المعلومات المتعلقة بالشخصيات التاريخية مستندة إلى مصادر تاريخية موثقة.",
          hi: "सभी ऐतिहासिक व्यक्तित्व की जानकारी सत्यापित ऐतिहासिक स्रोतों पर आधारित है।",
          ru: "Вся информация об исторических личностях основана на проверенных источниках.",
          zh: "所有历史人物信息均基于经过核实的历史资料。"
        }
      },
      {
        icon: "🤖",
        title: {
          ko: "AI 활용 투명성",
          en: "AI Transparency",
          de: "KI-Transparenz",
          ja: "AI活用の透明性",
          es: "Transparencia en el uso de IA",
          fr: "Transparence sur l'IA",
          it: "Trasparenza sull'IA",
          pt: "Transparência sobre IA",
          ar: "شفافية استخدام الذكاء الاصطناعي",
          hi: "AI उपयोग में पारदर्शिता",
          ru: "Прозрачность использования ИИ",
          zh: "AI使用透明度"
        },
        description: {
          ko: "AI 생성 대화임을 명확히 공개하며, 실제 역사 인물의 발언과 구분합니다.",
          en: "We clearly disclose AI-generated conversations and distinguish them from actual historical statements.",
          de: "Wir legen KI-generierte Inhalte offen und unterscheiden sie von tatsächlichen historischen Aussagen.",
          ja: "AI生成の対話であることを明確に公開し、実際の歴史的人物の発言と区별합니다.",
          es: "Divulgamos claramente las conversaciones generadas por IA y las distinguimos de las declaraciones históricas reales.",
          fr: "Nous divulguons clairement les conversations générées par IA et les distinguons des déclarations historiques réelles.",
          it: "Divulghiamo chiaramente le conversazioni generate dall'IA e le distinguiamo dalle dichiarazioni storiche reali.",
          pt: "Divulgamos claramente as conversas geradas por IA e as distinguimos das declarações históricas reais.",
          ar: "نفصح بوضوح عن المحادثات المُنشأة بالذكاء الاصطناعي ونميزها عن التصريحات التاريخية الفعلية.",
          hi: "हम AI-जनित वार्तालापों का स्पष्ट खुलासा करते हैं और उन्हें वास्तविक ऐतिहासिक बयानों से अलग करते हैं।",
          ru: "Мы открыто сообщаем о контенте, созданном ИИ, и отличаем его от реальных исторических высказываний.",
          zh: "我们清楚披露AI生成的对话内容，并将其与实际历史人物的言论区分开来。"
        }
      },
      {
        icon: "✅",
        title: {
          ko: "지속적 업데이트",
          en: "Continuous Updates",
          de: "Kontinuierliche Aktualisierung",
          ja: "継続的な更新",
          es: "Actualizaciones continuas",
          fr: "Mises à jour continues",
          it: "Aggiornamenti continui",
          pt: "Atualizações contínuas",
          ar: "تحديثات مستمرة",
          hi: "निरंतर अपडेट",
          ru: "Постоянные обновления",
          zh: "持续更新"
        },
        description: {
          ko: "콘텐츠는 주기적으로 검토되고 업데이트되어 최신 역사 연구를 반영합니다.",
          en: "Content is periodically reviewed and updated to reflect the latest historical research.",
          de: "Inhalte werden regelmäßig überprüft und aktualisiert, um aktuelle historische Forschungen widerzuspiegeln.",
          ja: "コンテンツは定期的にレビューおよび更新され、最新の歴史研究を反映します.",
          es: "El contenido se revisa y actualiza periódicamente para reflejar las últimas investigaciones históricas.",
          fr: "Le contenu est périodiquement examiné et mis à jour pour refléter les dernières recherches historiques.",
          it: "I contenuti vengono periodicamente revisionati e aggiornati per riflettere le ultime ricerche storiche.",
          pt: "O conteúdo é periodicamente revisado e atualizado para refletir as últimas pesquisas históricas.",
          ar: "يتم مراجعة المحتوى وتحديثه بشكل دوري ليعكس أحدث الأبحاث التاريخية.",
          hi: "सामग्री को नियमित रूप से समीक्षा और अपडेट किया जाता है ताकि नवीनतम ऐतिहासिक शोध को प्रतिबिंबित किया जा सके।",
          ru: "Контент периодически проверяется и обновляется с учётом последних исторических исследований.",
          zh: "内容会定期审查和更新，以反映最新的历史研究成果。"
        }
      },
      {
        icon: "🌍",
        title: {
          ko: "다양성과 포용성",
          en: "Diversity and Inclusion",
          de: "Vielfalt und Inklusion",
          ja: "多様性と包括性",
          es: "Diversidad e Inclusión",
          fr: "Diversité et inclusion",
          it: "Diversità e inclusione",
          pt: "Diversidade e Inclusão",
          ar: "التنوع والشمول",
          hi: "विविधता और समावेश",
          ru: "Разнообразие и инклюзивность",
          zh: "多元与包容"
        },
        description: {
          ko: "전 세계 다양한 문화와 시대의 위인들을 균형 있게 소개합니다.",
          en: "We present historical figures from diverse cultures and eras around the world in a balanced way.",
          de: "Wir stellen historische Persönlichkeiten aus verschiedenen Kulturen und Epochen weltweit ausgewogen vor.",
          ja: "世界中の多様な文化や時代の偉人たちをバランス良く紹介します.",
          es: "Presentamos figuras históricas de diversas culturas y épocas de todo el mundo de manera equilibrada.",
          fr: "Nous présentons des personnages historiques de diverses cultures et époques du monde entier de manière équilibrée.",
          it: "Presentiamo personaggi storici di diverse culture ed epoche in modo equilibrato.",
          pt: "Apresentamos figuras históricas de diversas culturas e épocas de todo o mundo de forma equilibrada.",
          ar: "نقدم شخصيات تاريخية من ثقافات وعصور متنوعة حول العالم بطريقة متوازنة.",
          hi: "हम दुनिया भर की विविध संस्कृतियों और युगों से ऐतिहासिक हस्तियों को संतुलित तरीके से प्रस्तुत करते हैं।",
          ru: "Мы сбалансированно представляем исторических деятелей из разных культур и эпох со всего мира.",
          zh: "我们以均衡的方式介绍来自世界各地不同文化和时代的历史人物。"
        }
      }
    ]
  },
  FooterLinksDisclaimer: {
    ko: "면책고지",
    en: "Disclaimer",
    de: "Haftungsausschluss",
    ja: "免責事項",
    es: "Descargo de Responsabilidad",
    fr: "Avertissement",
    it: "Disclaimer",
    pt: "Aviso Legal",
    ar: "إخلاء المسؤولية",
    hi: "अस्वीकरण",
    ru: "Отказ от ответственности",
    zh: "免责声明"
  }
};

// 2. Loop through locales and update JSON
LOCALES.forEach(locale => {
  const filePath = path.resolve(`messages/${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} not found, skipping.`);
    return;
  }
  
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Inject Disclaimer
  content.Disclaimer = {
    meta: {
      title: translations.Disclaimer.meta.title[locale],
      description: translations.Disclaimer.meta.description[locale]
    },
    pageTitle: translations.Disclaimer.pageTitle[locale],
    lastUpdated: translations.Disclaimer.lastUpdated[locale],
    sections: translations.Disclaimer.sections.map(sec => ({
      title: sec.title[locale],
      content: sec.content[locale]
    })),
    contact: translations.Disclaimer.contact[locale]
  };

  // Inject Navigation.disclaimer if it exists or create it
  if (!content.Navigation) content.Navigation = {};
  content.Navigation.disclaimer = translations.Navigation.disclaimer[locale];

  // Inject BlogAuthorBox
  content.BlogAuthorBox = {
    authorLabel: translations.BlogAuthorBox.authorLabel[locale],
    authorName: translations.BlogAuthorBox.authorName[locale],
    authorDescription: translations.BlogAuthorBox.authorDescription[locale],
    publishedLabel: translations.BlogAuthorBox.publishedLabel[locale],
    updatedLabel: translations.BlogAuthorBox.updatedLabel[locale]
  };

  // Inject AboutEditorialPolicy
  content.AboutEditorialPolicy = {
    sectionTitle: translations.AboutEditorialPolicy.sectionTitle[locale],
    sectionSubtitle: translations.AboutEditorialPolicy.sectionSubtitle[locale],
    principles: translations.AboutEditorialPolicy.principles.map(p => ({
      icon: p.icon,
      title: p.title[locale],
      description: p.description[locale]
    }))
  };

  // Inject Footer links disclaimer
  if (!content.Footer) content.Footer = {};
  if (!content.Footer.links) content.Footer.links = {};
  content.Footer.links.disclaimer = translations.FooterLinksDisclaimer[locale];

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Successfully updated ${filePath}`);
});

console.log('=== EEAT LOCALIZATION MERGING COMPLETED ===');
