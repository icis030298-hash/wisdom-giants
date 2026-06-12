const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const messagesDir = path.join(projectRoot, 'messages');

const dataToInject = {
  ko: {
    debateRoomCTA: "거인들의 끝장 토론방 입장",
    DebateCTA: {
      badge: "실시간 토론",
      titlePre: "세기의 명저들이 맞붙는",
      titlePost: "'거인들의 끝장 토론방'",
      desc: "“돈으로 행복을 살 수 있을까?” 아리스토텔레스와 니체가 벌이는 격렬한 사상 논쟁을 실시간으로 직관하고 참여해보세요.",
      button: "토론 관전 및 참여하기"
    },
    Consult: {
      or: "또는",
      title: "지금 고민이 있으신가요?",
      desc: "당신의 고통은 혼자가 아닙니다.\n역사상 가장 위대한 사람들도 똑같이 겪었고, 이겨냈습니다.",
      button: "고민 상담하기"
    }
  },
  en: {
    debateRoomCTA: "Enter Giants Debate Room",
    DebateCTA: {
      badge: "LIVE DEBATE",
      titlePre: "Clash of the Greatest Minds",
      titlePost: "'Giants' Ultimate Debate Room'",
      desc: "\"Can money buy happiness?\" Spectate and join the intense intellectual debate between Aristotle and Nietzsche in real-time.",
      button: "Spectate & Participate"
    },
    Consult: {
      or: "OR",
      title: "Are you facing struggles today?",
      desc: "Your pain is not lonely.\nThe greatest minds in history faced the exact same struggles and overcame them.",
      button: "Get Advice"
    }
  },
  de: {
    debateRoomCTA: "Debattenkammer der Riesen betreten",
    DebateCTA: {
      badge: "LIVE-DEBATTE",
      titlePre: "Aufeinandertreffen der größten Köpfe",
      titlePost: "'Die ultimative Debattenkammer der Riesen'",
      desc: "„Kann man mit Geld Glück kaufen?“ Verfolgen Sie und nehmen Sie teil an der intensiven intellektuellen Debatte zwischen Aristoteles und Nietzsche in Echtzeit.",
      button: "Zuschauen & Teilnehmen"
    },
    Consult: {
      or: "ODER",
      title: "Haben Sie heute Sorgen?",
      desc: "Ihr Schmerz ist nicht allein.\nDie größten Denker der Geschichte standen vor denselben Ängsten und haben sie überwindet.",
      button: "Beratung erhalten"
    }
  },
  ja: {
    debateRoomCTA: "偉人たちの討論室に入場",
    DebateCTA: {
      badge: "リアルタイム討論",
      titlePre: "世紀の名著がぶつかり合う",
      titlePost: "「偉人たちの究極の討論室」",
      desc: "「お金で幸せは買えるか？」アリストテレスとニーチェが繰り広げる白熱した思想論争をリアルタイムで観戦・参加しましょう。",
      button: "討論を観戦・参加する"
    },
    Consult: {
      or: "または",
      title: "今、何かお悩みはありますか？",
      desc: "あなたの苦しみは一人だけのものではありません。\n歴史上の偉人たちも同じように悩み、そして乗り越えてきました。",
      button: "お悩み相談をする"
    }
  },
  es: {
    debateRoomCTA: "Entrar a la Sala de Debate",
    DebateCTA: {
      badge: "DEBATE EN VIVO",
      titlePre: "El Choque de las Grandes Mentes",
      titlePost: "'La Sala de Debate Definitiva de los Gigantes'",
      desc: "¿Puede el dinero comprar la felicidad? Presencie y únase al intenso debate intelectual entre Aristóteles y Nietzsche en tiempo real.",
      button: "Ver y Participar"
    },
    Consult: {
      or: "O BIEN",
      title: "¿Tiene alguna preocupación hoy?",
      desc: "Su sufrimiento no es único.\nLas mentes más grandes de la historia pasaron por lo mismo y lo superaron.",
      button: "Consultar"
    }
  },
  fr: {
    debateRoomCTA: "Entrer dans la Salle de Débat",
    DebateCTA: {
      badge: "DÉBAT EN DIRECT",
      titlePre: "Le Choc des Plus Grands Esprits",
      titlePost: "'La Salle de Débat Ultime des Géants'",
      desc: "« L'argent peut-il acheter le bonheur ? » Observez et rejoignez le débat intellectuel intense entre Aristote et Nietzsche en temps réel.",
      button: "Observer et Participer"
    },
    Consult: {
      or: "OU BIEN",
      title: "Rencontrez-vous des difficultés aujourd'hui ?",
      desc: "Votre souffrance n'est pas solitaire.\nLes plus grands esprits de l'histoire ont connu les mêmes épreuves et les ont surmontées.",
      button: "Demander conseil"
    }
  },
  it: {
    debateRoomCTA: "Entra nella Stanza del Dibattito",
    DebateCTA: {
      badge: "DIBATTITO IN DIRETTA",
      titlePre: "Scontro tra le Grandi Menti",
      titlePost: "'La Stanza di Dibattito Ultimo dei Giganti'",
      desc: "\"I soldi possono comprare la felicità?\" Assisti e partecipa all'intenso dibattito intellettuale tra Aristotele e Nietzsche in tempo reale.",
      button: "Assisti e Partecipa"
    },
    Consult: {
      or: "OPPURE",
      title: "Hai qualche preoccupazione oggi?",
      desc: "Il tuo dolore non é isolato.\nLe più grandi menti della storia hanno affrontato le stesse difficoltà e le hanno superate.",
      button: "Consulta un Gigante"
    }
  },
  pt: {
    debateRoomCTA: "Entrar na Sala de Debate",
    DebateCTA: {
      badge: "DEBATE AO VIVO",
      titlePre: "O Confronto de Grandes Mentes",
      titlePost: "'A Sala de Debate Suprema dos Gigantes'",
      desc: "\"O dinheiro pode comprar felicidade?\" Assista e participe do intenso debate intelectual entre Aristóteles e Nietzsche em tempo real.",
      button: "Assistir e Participar"
    },
    Consult: {
      or: "OU",
      title: "Você está passando por alguma dificuldade hoje?",
      desc: "Sua ao dor não é solitária.\nAs maiores mentes da história enfrentaram exatamente os mesmos problemas e os superaram.",
      button: "Consultar"
    }
  },
  hi: {
    debateRoomCTA: "महापुरुषों के वाद-विवाद कक्ष में प्रवेश करें",
    DebateCTA: {
      badge: "सजीव बहस",
      titlePre: "महानतम बुद्धिजीवियों की टक्कर",
      titlePost: "'महापुरुषों का अंतिम वाद-विवाद कक्ष'",
      desc: "\"क्या पैसा खुशी खरीद सकता है?\" वास्तविक समय में अरस्तू और नीत्शे के बीच गहन बौद्धिक बहस को देखें और उसमें शामिल हों।",
      button: "देखें और भाग लें"
    },
    Consult: {
      or: "या",
      title: "क्या आज आप कठिनाइयों का सामना कर रहे हैं?",
      desc: "आपका दर्द अकेला नहीं है।\nइतिहास के सबसे महान दिमागों ने भी इन्हीं संघर्षों का सामना किया और उन्हें पार किया।",
      button: "सलाह लें"
    }
  },
  ru: {
    debateRoomCTA: "Войти в зал дебатов гигантов",
    DebateCTA: {
      badge: "ЖИВЫЕ ДЕБАТЫ",
      titlePre: "Столкновение величайших умов",
      titlePost: "'Зал дебатов великих гигантов'",
      desc: "\"Могут ли деньги купить счастье?\" Наблюдайте и присоединяйтесь к напряженным интеллектуальным дебатам между Аристотелем и Ницше в реальном времени.",
      button: "Наблюдать и участвовать"
    },
    Consult: {
      or: "ИЛИ",
      title: "Вы сталкиваетесь с трудностями сегодня?",
      desc: "Ваша боль не одинока.\nВеличайшие умы в истории сталкивались с теми же трудностями и преодолевали их.",
      button: "Получить совет"
    }
  },
  zh: {
    debateRoomCTA: "进入巨匠辩论室",
    DebateCTA: {
      badge: "实时辩论",
      titlePre: "最伟大的思想碰撞",
      titlePost: "“巨匠终极辩论室”",
      desc: "“金钱能买到幸福吗？”实时观看并加入亚里士多德与尼采之间的激烈思想交锋。",
      button: "观看并参与"
    },
    Consult: {
      or: "或者",
      title: "今天您面临困难吗？",
      desc: "您的痛苦并不孤单。\n历史上的伟人也面临过同样的挣扎并克服了它们。",
      button: "寻求建议"
    }
  },
  ar: {
    debateRoomCTA: "دخول غرفة مناظرة العمالقة",
    DebateCTA: {
      badge: "مناظرة مباشرة",
      titlePre: "صدام أعظم العقول",
      titlePost: "'غرفة مناظرة العمالقة الكبرى'",
      desc: "\"هل يمكن للمال شراء السعادة؟\" شاهد وشارك في النقاش الفكري الحاد بين أرسطو ونيتشه في الوقت الفعلي.",
      button: "المشاهدة والمشاركة"
    },
    Consult: {
      or: "أو",
      title: "هل تواجه صعوبات اليوم؟",
      desc: "ألمك ليس وحيداً.\nأعظم العقول في التاريخ واجهت نفس الصعوبات وتغلبت عليها.",
      button: "احصل على نصيحة"
    }
  }
};

console.log('=== messages/*.json 에 홈 화면 번역 주입 시작 ===');

Object.entries(dataToInject).forEach(([lang, data]) => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 1. Hero.debateRoomCTA 추가
    if (!fileContent.Hero) fileContent.Hero = {};
    fileContent.Hero.debateRoomCTA = data.debateRoomCTA;
    
    // 2. DebateCTA 추가
    fileContent.DebateCTA = data.DebateCTA;
    
    // 3. Consult 추가
    fileContent.Consult = data.Consult;
    
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
    console.log(`✓ messages/${lang}.json 에 번역 데이터 주입 완료.`);
  } else {
    console.error(`❌ messages/${lang}.json 파일을 찾을 수 없습니다.`);
  }
});

console.log('=== 주입 완료 ===');
