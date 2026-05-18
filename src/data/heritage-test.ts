export type Pillar = 'Scope' | 'Drive' | 'Method' | 'Origin';
export type Dimension = 'L' | 'S' | 'R' | 'P' | 'D' | 'H' | 'I' | 'T';

export interface Question {
  id: number;
  pillar: Pillar;
  text: {
    ko: string;
    en: string;
  };
  options: {
    A: {
      text: { ko: string; en: string };
      value: Dimension;
    };
    B: {
      text: { ko: string; en: string };
      value: Dimension;
    };
    C: {
      text: { ko: string; en: string };
      value: Dimension;
    };
    D: {
      text: { ko: string; en: string };
      value: Dimension;
    };
  };
}

export const questions: Question[] = [
  // SCOPE (Macro 'L' vs Micro 'S') - 4 Questions
  {
    id: 1,
    pillar: 'Scope',
    text: {
      ko: "당신은 새로운 영토를 발견한 탐험가입니다. 가장 먼저 무엇을 하시겠습니까?",
      en: "You are an explorer who discovered a new territory. What do you do first?"
    },
    options: {
      A: { text: { ko: "영토 전체의 지도를 그려 인류에게 이 땅의 가치를 알린다.", en: "Draw a map of the entire territory and announce its value to humanity." }, value: 'L' },
      B: { text: { ko: "당장 배고픈 대원들을 위해 비옥한 땅을 찾아 정착지를 세운다.", en: "Find fertile land and build a settlement for your hungry crew." }, value: 'S' },
      C: { text: { ko: "이 땅의 자원이 미래 문명에 미칠 영향을 분석하는 보고서를 쓴다.", en: "Write a report analyzing how the resources here will affect future civilizations." }, value: 'L' },
      D: { text: { ko: "이곳의 식생과 환경이 대원들의 건강에 미칠 영향을 조사한다.", en: "Investigate how the local vegetation and environment will affect the crew's health." }, value: 'S' }
    }
  },
  {
    id: 2,
    pillar: 'Scope',
    text: {
      ko: "큰 자금이 생겼을 때, 당신의 투자 성향은?",
      en: "When you have a large amount of capital, what is your investment style?"
    },
    options: {
      A: { text: { ko: "미래 산업 전체를 바꿀 수 있는 거대한 프로젝트에 투자한다.", en: "Invest in a massive project that can change the future of an entire industry." }, value: 'L' },
      B: { text: { ko: "내 주변 사람들과 지역 사회를 실질적으로 돕는 곳에 쓴다.", en: "Use it to practically help the people around me and the local community." }, value: 'S' },
      C: { text: { ko: "인류의 다음 세대를 위한 교육 시스템 혁신에 쏟아붓는다.", en: "Pour it into innovating education systems for the next generation of humanity." }, value: 'L' },
      D: { text: { ko: "가장 고통받는 이웃들을 위한 즉각적인 구호 활동에 지원한다.", en: "Support immediate relief efforts for the most suffering neighbors." }, value: 'S' }
    }
  },
  {
    id: 3,
    pillar: 'Scope',
    text: {
      ko: "당신은 리더로서 어떤 성과를 더 중요하게 생각합니까?",
      en: "As a leader, which outcome do you value more?"
    },
    options: {
      A: { text: { ko: "세상이 우리를 어떻게 기억할지 결정짓는 거대한 상징적 업적", en: "A massive symbolic achievement that defines how the world remembers us." }, value: 'L' },
      B: { text: { ko: "구성원 한 명 한 명의 삶이 실질적으로 개선되는 결과", en: "Results that practically improve the life of every single member." }, value: 'S' },
      C: { text: { ko: "조직의 비전이 역사에 남을 혁명적인 패러다임을 만드는 것", en: "Making the organization's vision a revolutionary paradigm that stays in history." }, value: 'L' },
      D: { text: { ko: "현재 팀원들이 느끼는 성취감과 행복의 밀도를 높이는 것", en: "Increasing the density of achievement and happiness felt by current team members." }, value: 'S' }
    }
  },
  {
    id: 4,
    pillar: 'Scope',
    text: {
      ko: "문제를 해결할 때 당신의 접근 방식은?",
      en: "What is your approach to solving problems?"
    },
    options: {
      A: { text: { ko: "전체 시스템의 구조를 바꿔 근본적인 해결책을 찾는다.", en: "Change the structure of the entire system to find a fundamental solution." }, value: 'L' },
      B: { text: { ko: "당장 앞에 놓인 구체적인 문제부터 하나씩 해결해 나간다.", en: "Solve specific problems right in front of you one by one." }, value: 'S' },
      C: { text: { ko: "이 문제가 발생하게 된 역사적 맥락과 철학적 배경을 먼저 탐구한다.", en: "First explore the historical context and philosophical background that led to this problem." }, value: 'L' },
      D: { text: { ko: "관련된 사람들의 불편함을 먼저 해소하는 임시 조치를 취한다.", en: "Take temporary measures to first alleviate the discomfort of the people involved." }, value: 'S' }
    }
  },

  // DRIVE (Reason 'R' vs Passion 'P') - 4 Questions
  {
    id: 5,
    pillar: 'Drive',
    text: {
      ko: "중요한 결정을 내려야 할 때, 당신은 무엇에 더 의지합니까?",
      en: "When making an important decision, what do you rely on more?"
    },
    options: {
      A: { text: { ko: "객관적인 데이터와 논리적인 추론", en: "Objective data and logical reasoning." }, value: 'R' },
      B: { text: { ko: "나의 직관과 뜨거운 열정, 그리고 신념", en: "My intuition, burning passion, and convictions." }, value: 'P' },
      C: { text: { ko: "역사적인 사례들을 철저히 분석한 결과", en: "Results of thoroughly analyzing historical cases." }, value: 'R' },
      D: { text: { ko: "주변 사람들의 간절한 소망과 정서적 유대", en: "Fervent wishes and emotional bonds of people around me." }, value: 'P' }
    }
  },
  {
    id: 6,
    pillar: 'Drive',
    text: {
      ko: "실패했을 때 당신의 반응은?",
      en: "What is your reaction when you fail?"
    },
    options: {
      A: { text: { ko: "실패의 원인을 분석하고 다음 전략을 치밀하게 수정한다.", en: "Analyze the cause of failure and meticulously revise the next strategy." }, value: 'R' },
      B: { text: { ko: "좌절을 딛고 다시 일어설 수 있는 뜨거운 에너지를 얻는다.", en: "Gain burning energy to overcome frustration and stand up again." }, value: 'P' },
      C: { text: { ko: "이 실패가 가져올 수 있는 리스크를 논리적으로 계산한다.", en: "Logically calculate the risks this failure could bring." }, value: 'R' },
      D: { text: { ko: "이 아픔을 예술이나 새로운 창작의 원동력으로 승화시킨다.", en: "Sublimate this pain as a driving force for art or new creation." }, value: 'P' }
    }
  },
  {
    id: 7,
    pillar: 'Drive',
    text: {
      ko: "사람들을 설득할 때 당신이 주로 사용하는 방법은?",
      en: "What is your primary method when persuading people?"
    },
    options: {
      A: { text: { ko: "빈틈없는 논리와 명확한 근거 제시", en: "Flawless logic and presenting clear evidence." }, value: 'R' },
      B: { text: { ko: "마음을 울리는 감동적인 스토리와 진심", en: "A touching story and sincerity that resonates with the heart." }, value: 'P' },
      C: { text: { ko: "예상되는 이익과 손실에 대한 정확한 시뮬레이션", en: "Accurate simulation of expected profits and losses." }, value: 'R' },
      D: { text: { ko: "강력한 카리스마로 사람들의 행동을 직접 이끌어냄", en: "Directly leading people's actions with strong charisma." }, value: 'P' }
    }
  },
  {
    id: 8,
    pillar: 'Drive',
    text: {
      ko: "당신이 생각하는 이상적인 리더의 모습은?",
      en: "What is your ideal vision of a leader?"
    },
    options: {
      A: { text: { ko: "냉철한 판단력으로 최선의 길을 제시하는 조타수", en: "A helmsman who suggests the best path with cool judgment." }, value: 'R' },
      B: { text: { ko: "모두의 가슴에 불을 지피고 행동하게 만드는 혁명가", en: "A revolutionary who ignites everyone's heart and makes them take action." }, value: 'P' },
      C: { text: { ko: "방대한 지식을 바탕으로 현명한 대안을 내놓는 고문", en: "An advisor who offers wise alternatives based on vast knowledge." }, value: 'R' },
      D: { text: { ko: "팀원들을 위해 기꺼이 자신을 희생하는 헌신적인 리더", en: "A devoted leader who is willing to sacrifice themselves for team members." }, value: 'P' }
    }
  },

  // METHOD (Disruption 'D' vs Harmony 'H') - 4 Questions
  {
    id: 9,
    pillar: 'Method',
    text: {
      ko: "오래된 관습이 비효율적일 때, 당신은 어떻게 하시겠습니까?",
      en: "When an old custom is inefficient, what do you do?"
    },
    options: {
      A: { text: { ko: "과감하게 관습을 타파하고 새로운 규칙을 세운다.", en: "Boldly break the custom and establish new rules." }, value: 'D' },
      B: { text: { ko: "기존의 틀을 유지하며 천천히 개선할 점을 찾는다.", en: "Maintain the existing framework and slowly find points to improve." }, value: 'H' },
      C: { text: { ko: "기득권의 반대를 무릅쓰고 즉각적인 혁명을 단행한다.", en: "Carry out an immediate revolution despite the opposition of the establishment." }, value: 'D' },
      D: { text: { ko: "다양한 이해관계자들을 설득하여 점진적인 합의를 이끈다.", en: "Persuade various stakeholders to lead a gradual consensus." }, value: 'H' }
    }
  },
  {
    id: 10,
    pillar: 'Method',
    text: {
      ko: "새로운 팀에 합류했을 때 당신의 스타일은?",
      en: "What is your style when joining a new team?"
    },
    options: {
      A: { text: { ko: "기존의 비효율적인 방식을 지적하고 혁신을 요구한다.", en: "Point out existing inefficient ways and demand innovation." }, value: 'D' },
      B: { text: { ko: "팀의 분위기에 녹아들며 화합을 먼저 도모한다.", en: "Blend into the team's atmosphere and promote harmony first." }, value: 'H' },
      C: { text: { ko: "자신만의 독자적인 방식을 증명해 보이며 판을 흔든다.", en: "Shake the board by proving your own unique way." }, value: 'D' },
      D: { text: { ko: "팀원들의 고충을 먼저 들어주고 신뢰 관계를 쌓는다.", en: "First listen to the team members' grievances and build a relationship of trust." }, value: 'H' }
    }
  },
  {
    id: 11,
    pillar: 'Method',
    text: {
      ko: "어떤 변화가 더 가치 있다고 생각합니까?",
      en: "Which change do you think is more valuable?"
    },
    options: {
      A: { text: { ko: "낡은 것을 완전히 무너뜨리고 다시 세우는 창조적 파괴", en: "Creative destruction that completely tears down the old and builds it again." }, value: 'D' },
      B: { text: { ko: "다양한 의견을 조율하여 모두가 동의하는 합의점 도출", en: "Coordinating diverse opinions to reach a consensus everyone agrees on." }, value: 'H' },
      C: { text: { ko: "금기시되던 새로운 영역을 개척하여 시장을 파괴", en: "Destroying the market by pioneering a new field that was considered taboo." }, value: 'D' },
      D: { text: { ko: "전통을 현대적으로 재해석하여 대중적인 공감을 얻음", en: "Obtaining public sympathy by interpreting tradition in a modern way." }, value: 'H' }
    }
  },
  {
    id: 12,
    pillar: 'Method',
    text: {
      ko: "당신은 경쟁 상황에서 어떤 태도를 취합니까?",
      en: "What attitude do you take in a competitive situation?"
    },
    options: {
      A: { text: { ko: "압도적인 실력으로 판을 흔들어 승리를 쟁취한다.", en: "Shake the board with overwhelming skill to achieve victory." }, value: 'D' },
      B: { text: { ko: "선의의 경쟁을 통해 함께 성장하는 길을 택한다.", en: "Choose a path of growing together through fair competition." }, value: 'H' },
      C: { text: { ko: "기존 경쟁자들이 예상치 못한 변칙적인 전술을 쓴다.", en: "Use unconventional tactics that existing competitors did not expect." }, value: 'D' },
      D: { text: { ko: "경쟁보다는 상생할 수 있는 파트너십을 제안한다.", en: "Suggest a partnership that can coexist rather than compete." }, value: 'H' }
    }
  },

  // ORIGIN (Innovation 'I' vs Tradition 'T') - 3 Questions
  {
    id: 13,
    pillar: 'Origin',
    text: {
      ko: "당신은 새로운 아이디어를 어디서 주로 얻습니까?",
      en: "Where do you primarily get new ideas?"
    },
    options: {
      A: { text: { ko: "아무도 시도하지 않은 미래 지향적 상상", en: "Future-oriented imagination that no one has tried." }, value: 'I' },
      B: { text: { ko: "과거의 기록과 고전, 그리고 역사의 교훈", en: "Past records, classics, and lessons of history." }, value: 'T' },
      C: { text: { ko: "공상과학 영화나 먼 미래를 다룬 소설", en: "Sci-fi movies or novels dealing with the distant future." }, value: 'I' },
      D: { text: { ko: "오랜 시간 전해 내려오는 민담이나 종교 서적", en: "Folktales or religious books that have been passed down for a long time." }, value: 'T' }
    }
  },
  {
    id: 14,
    pillar: 'Origin',
    text: {
      ko: "당신이 선호하는 작업 환경은?",
      en: "What is your preferred working environment?"
    },
    options: {
      A: { text: { ko: "최첨단 기술과 새로운 시도가 가득한 실험적인 공간", en: "An experimental space full of state-of-the-art technology and new attempts." }, value: 'I' },
      B: { text: { ko: "시간의 흔적이 묻어있고 질서가 잡힌 안정적인 공간", en: "A stable space with traces of time and established order." }, value: 'T' },
      C: { text: { ko: "자유로운 분위기의 실리콘밸리식 오피스", en: "Silicon Valley-style office with a free atmosphere." }, value: 'I' },
      D: { text: { ko: "고풍스러운 가구와 서재가 있는 정적인 공간", en: "A static space with antique furniture and a study." }, value: 'T' }
    }
  },
  {
    id: 15,
    pillar: 'Origin',
    text: {
      ko: "후세에 어떤 사람으로 기억되고 싶습니까?",
      en: "How do you want to be remembered by posterity?"
    },
    options: {
      A: { text: { ko: "시대를 앞서간 혁명적인 천재이자 개척자", en: "A revolutionary genius and pioneer ahead of their time." }, value: 'I' },
      B: { text: { ko: "고결한 정신과 전통을 지켜낸 존경받는 스승", en: "A respected mentor who preserved noble spirit and traditions." }, value: 'T' },
      C: { text: { ko: "인류 문명의 도약을 이끈 위대한 발명가", en: "A great inventor who led the leap of human civilization." }, value: 'I' },
      D: { text: { ko: "한 나라의 기틀을 다지고 질서를 세운 통치자", en: "A ruler who laid the foundation and established the order of a nation." }, value: 'T' }
    }
  }
];

export const archetypes: Record<string, { name: { ko: string; en: string; de: string; ja: string }; description: { ko: string; en: string; de: string; ja: string } }> = {
  'LRDI': {
    name: { ko: "대륙을 재설계하는 설계자", en: "The Universal Architect", de: "Der universelle Architekt", ja: "世界を再設計する設計者" },
    description: { ko: "당신은 거대한 시야와 차가운 이성을 바탕으로 세상을 혁명적으로 바꾸는 전략가입니다.", en: "You are a strategist who revolutionizes the world based on a grand vision and cool reason.", de: "Sie sind ein Stratege, der die Welt auf der Grundlage einer großen Vision und kühler Vernunft revolutioniert.", ja: "あなたは壮大な視野と冷静な理性に基づいて世界に革命をもたらす戦略家です。" }
  },
  'LPDI': {
    name: { ko: "멈추지 않는 시대의 개척자", en: "The Eternal Pioneer", de: "Der ewige Pionier", ja: "立ち止まらない時代の開拓者" },
    description: { ko: "당신은 불가능에 도전하는 뜨거운 심장과 혁신적인 아이디어로 인류의 한계를 넓힙니다.", en: "You expand the limits of humanity with a burning heart that challenges the impossible and innovative ideas.", de: "Sie erweitern die Grenzen der Menschheit mit einem brennenden Herzen, das das Unmögliche herausfordert, und innovativen Ideen.", ja: "あなたは不可能に挑戦する熱き心と革新的なアイデアで、人類の限界を広げる人物です。" }
  },
  'LRHI': {
    name: { ko: "깨어있는 지혜의 개혁가", en: "The Enlightened Reformer", de: "Der aufgeklärte Reformer", ja: "目覚めた知恵の改革者" },
    description: { ko: "당신은 전체 시스템의 안정을 유지하면서도 더 나은 미래를 위해 지혜롭게 변화를 이끕니다.", en: "You wisely lead change for a better future while maintaining the stability of the entire system.", de: "Sie führen klug Veränderungen für eine bessere Zukunft herbei, während Sie die Stabilität des Gesamtsystems wahren.", ja: "あなたは全体のシステムの安定を維持しながらも、より良い未来のために賢明に変化を導きます。" }
  },
  'LPHI': {
    name: { ko: "영감을 불어넣는 시대의 리더", en: "The Inspirational Leader", de: "Der inspirierende Anführer", ja: "インスピレーションを与える時代のリーダー" },
    description: { ko: "당신은 원대한 꿈을 향해 모두의 마음을 하나로 모으고 큰 변화를 일구어내는 리더입니다.", en: "You are a leader who gathers everyone's hearts toward a grand dream and achieves great change.", de: "Sie sind eine Führungspersönlichkeit, die die Herzen aller für einen großen Traum gewinnt und bedeutende Veränderungen bewirkt.", ja: "あなたは壮大な夢に向かって皆の心を一つに集め、大きな変化を成し遂げるリーダーです。" }
  },
  'LRDT': {
    name: { ko: "질서를 수호하는 결단가", en: "The Traditional Decider", de: "Der traditionelle Entscheider", ja: "秩序を守護する決断家" },
    description: { ko: "당신은 고전적인 가치와 이성적인 판단을 바탕으로 혼란 속에서 질서를 바로잡는 힘이 있습니다.", en: "You have the power to restore order amidst chaos based on classic values and rational judgment.", de: "Sie haben die Macht, inmitten des Chaos Ordnung auf der Grundlage klassischer Werte und rationaler Urteile wiederherzustellen.", ja: "あなたは古典的な価値観と理性的な判断に基づき、混乱の中で秩序を正す力を持っています。" }
  },
  'LPDT': {
    name: { ko: "신념을 지키는 강철의 혁명가", en: "The Charismatic Rebel", de: "Der charismatische Rebell", ja: "信念を貫く鋼の革命家" },
    description: { ko: "당신은 자신이 옳다고 믿는 전통적 가치를 위해 뜨겁게 투쟁하고 세상을 움직입니다.", en: "You fight passionately for the traditional values you believe are right and move the world.", de: "Sie kämpfen leidenschaftlich für die traditionellen Werte, an die Sie glauben, und bewegen die Welt.", ja: "あなたは自分が正しいと信じる伝統的な価値観のために熱く闘い、世界を動かします。" }
  },
  'LRHT': {
    name: { ko: "품격 있는 시대의 중재자", en: "The Gracious Sovereign", de: "Der gnädige Souverän", ja: "品格ある時代の調停者" },
    description: { ko: "당신은 거시적인 안목과 조화로운 소통으로 역사적인 평화와 합의를 이끌어냅니다.", en: "You lead historical peace and consensus through a macro perspective and harmonious communication.", de: "Sie führen historischen Frieden und Konsens durch eine Makroperspektive und harmonische Kommunikation herbei.", ja: "あなたはマクロな視野と調和のとれた対話によって、歴史的な平和と合意を導き出します。" }
  },
  'LPHT': {
    name: { ko: "모두를 품는 역사의 수호자", en: "The Devoted Unifier", de: "Der hingebungsvolle Vereiner", ja: "すべてを包み込む歴史の守護者" },
    description: { ko: "당신은 따뜻한 인류애와 헌신적인 자세로 공동체의 전통을 지키고 화합을 이룹니다.", en: "You preserve community traditions and achieve harmony through warm humanity and a devoted attitude.", de: "Sie bewahren Gemeinschaftstraditionen und erreichen Harmonie durch herzliche Menschlichkeit und eine hingebungsvolle Haltung.", ja: "あなたは温かい人間愛と献身的な姿勢で共同体の伝統を守り、調和をもたらします。" }
  },
  'SRDI': {
    name: { ko: "정교한 미래의 발명가", en: "The Precise Inventor", de: "Der präzise Erfinder", ja: "精巧な未来の発明家" },
    description: { ko: "당신은 날카로운 논리와 창의적인 발상으로 우리 삶의 구체적인 부분을 혁신적으로 바꿉니다.", en: "You innovatively change specific parts of our lives with sharp logic and creative ideas.", de: "Sie verändern bestimmte Bereiche unseres Lebens innovativ mit scharfer Logik und kreativen Ideen.", ja: "あなたは鋭い論理とクリエイティブな発想で、私たちの生活の具体的な部分を革新的に変えます。" }
  },
  'SPDI': {
    name: { ko: "불꽃 같은 영혼의 예술가", en: "The Radical Creator", de: "Der radikale Schöpfer", ja: "炎のような魂の芸術家" },
    description: { ko: "당신은 타협하지 않는 열정과 파격적인 감각으로 세상에 유일무이한 작품을 남깁니다.", en: "You leave unique works in the world with uncompromising passion and unconventional sense.", de: "Sie hinterlassen einzigartige Werke in der Welt mit kompromissloser Leidenschaft und unkonventionellem Gespür.", ja: "あなたは妥協のない情熱と型破りなセンスで、世界に唯一無二作品を残します。" }
  },
  'SRHI': {
    name: { ko: "실천하는 지혜의 현자", en: "The Practical Sage", de: "Der praktische Weise", ja: "実践する知恵の賢者" },
    description: { ko: "당신은 조용하지만 명확한 지혜로 일상의 문제를 해결하고 조화로운 발전을 꾀합니다.", en: "You solve everyday problems and seek harmonious development with quiet but clear wisdom.", de: "Sie lösen alltägliche Probleme und streben nach einer harmonischen Entwicklung mit stiller, aber klarer Weisheit.", ja: "あなたは静かですが明確な知恵で日常の課題を解決し、調和のとれた発展を図ります。" }
  },
  'SPHI': {
    name: { ko: "아름다움을 빚는 조화의 거장", en: "The Compassionate Artist", de: "Der mitfühlende Künstler", ja: "美を紡ぐ調和の巨匠" },
    description: { ko: "당신은 인간에 대한 깊은 이해와 따뜻한 시선으로 세상의 상처를 치유하고 변화시킵니다.", en: "You heal and change the world's wounds with deep understanding and a warm perspective on humans.", de: "Sie heilen und verändern die Wunden der Welt mit tiefem Verständnis und einer warmen Perspektive auf den Menschen.", ja: "あなたは人間に対する深い理解と温かい眼差しで、世界の傷を癒し、変化をもたらします。" }
  },
  'SRDT': {
    name: { ko: "냉철한 일상의 수호자", en: "The Stoic Guardian", de: "Der stoische Wächter", ja: "冷静沈着な日常の守護者" },
    description: { ko: "당신은 현실적인 판단과 전통적인 원칙을 고수하며 묵묵히 자신의 소임을 완수합니다.", en: "You silently fulfill your duties while adhering to realistic judgments and traditional principles.", de: "Sie erfüllen schweigend Ihre Pflichten, während Sie sich an realistische Urteile und traditionelle Prinzipien halten.", ja: "あなたは現実的な判断と伝統的な原則を堅持し、黙々と自らの任務を果たします。" }
  },
  'SPDT': {
    name: { ko: "행동하는 양심의 투사", en: "The Passionate Activist", de: "Der leidenschaftliche Aktivist", ja: "行動する良心の闘士" },
    description: { ko: "당신은 불의를 참지 못하는 열정으로 우리 주변의 소중한 가치들을 끝까지 지켜냅니다.", en: "You protect the precious values around us to the end with a passion that cannot tolerate injustice.", de: "Sie schützen die kostbaren Werte um uns herum bis zum Ende mit einer Leidenschaft, die Ungerechtigkeit nicht jodeln kann.", ja: "あなたは不正を許さない情熱で、私たちの周りの大切な価値観を最後まで守り抜きます。" }
  },
  'SRHT': {
    name: { ko: "겸손한 삶의 관찰자", en: "The Humble Protector", de: "Der bescheidene Beschützer", ja: "謙虚な生活の観察者" },
    description: { ko: "당신은 전통과 질서를 존중하며 조화로운 삶을 통해 주변에 안정과 평화를 전파합니다.", en: "You spread stability and peace around you through a harmonious life while respecting tradition and order.", de: "Sie verbreiten Stabilität und Frieden um sich herum durch ein harmonisches Leben, während Sie Tradition und Ordnung respektieren.", ja: "あなたは伝統と秩序を尊重し、調和のとれた生活を通じて周囲に安定と平和を広めます。" }
  },
  'SPHT': {
    name: { ko: "평화를 사랑하는 영혼", en: "The Gentle Soul", de: "Die sanfte Seele", ja: "平和を愛する温和な魂" },
    description: { ko: "당신은 따뜻한 감성과 조화로운 태도로 사람들의 마음을 하나로 묶는 특별한 힘이 있습니다.", en: "You have a special power to tie people's hearts together with warm sensitivity and a harmonious attitude.", de: "Sie haben eine besondere Kraft, die Herzen der Menschen mit warmer Sensibilität und einer harmonischen Haltung zu verbinden.", ja: "あなたは温かい感性と調和のとれた態度で、人々の心を一つに結びつける特別な力を持っています。" }
  }
};
