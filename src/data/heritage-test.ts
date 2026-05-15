
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
  };
}

export const questions: Question[] = [
  // SCOPE (Micro vs Macro)
  {
    id: 1,
    pillar: 'Scope',
    text: {
      ko: "당신은 새로운 영토를 발견한 탐험가입니다. 가장 먼저 무엇을 하시겠습니까?",
      en: "You are an explorer who discovered a new territory. What do you do first?"
    },
    options: {
      A: {
        text: { ko: "영토 전체의 지도를 그려 인류에게 이 땅의 가치를 알린다.", en: "Draw a map of the entire territory and announce its value to humanity." },
        value: 'L'
      },
      B: {
        text: { ko: "당장 배고픈 대원들을 위해 비옥한 땅을 찾아 정착지를 세운다.", en: "Find fertile land and build a settlement for your hungry crew." },
        value: 'S'
      }
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
      A: {
        text: { ko: "미래 산업 전체를 바꿀 수 있는 거대한 프로젝트에 투자한다.", en: "Invest in a massive project that can change the future of an entire industry." },
        value: 'L'
      },
      B: {
        text: { ko: "내 주변 사람들과 지역 사회를 실질적으로 돕는 곳에 쓴다.", en: "Use it to practically help the people around me and the local community." },
        value: 'S'
      }
    }
  },
  {
    id: 3,
    pillar: 'Scope',
    text: {
      ko: "당신이 책을 쓴다면, 어떤 주제를 선택하시겠습니까?",
      en: "If you were to write a book, what topic would you choose?"
    },
    options: {
      A: {
        text: { ko: "인류 역사의 흐름과 미래의 방향에 대한 거대 담론", en: "A grand discourse on the flow of human history and the direction of the future." },
        value: 'L'
      },
      B: {
        text: { ko: "일상 속에서 발견하는 작은 행복과 삶의 지혜", en: "Small happiness and wisdom of life discovered in everyday life." },
        value: 'S'
      }
    }
  },
  {
    id: 4,
    pillar: 'Scope',
    text: {
      ko: "당신은 리더로서 어떤 성과를 더 중요하게 생각합니까?",
      en: "As a leader, which outcome do you value more?"
    },
    options: {
      A: {
        text: { ko: "세상이 우리를 어떻게 기억할지 결정짓는 거대한 상징적 업적", en: "A massive symbolic achievement that defines how the world remembers us." },
        value: 'L'
      },
      B: {
        text: { ko: "구성원 한 명 한 명의 삶이 실질적으로 개선되는 결과", en: "Results that practically improve the life of every single member." },
        value: 'S'
      }
    }
  },
  {
    id: 5,
    pillar: 'Scope',
    text: {
      ko: "문제를 해결할 때 당신의 접근 방식은?",
      en: "What is your approach to solving problems?"
    },
    options: {
      A: {
        text: { ko: "전체 시스템의 구조를 바꿔 근본적인 해결책을 찾는다.", en: "Change the structure of the entire system to find a fundamental solution." },
        value: 'L'
      },
      B: {
        text: { ko: "당장 앞에 놓인 구체적인 문제부터 하나씩 해결해 나간다.", en: "Solve specific problems right in front of you one by one." },
        value: 'S'
      }
    }
  },
  
  // DRIVE (Reason vs Passion)
  {
    id: 6,
    pillar: 'Drive',
    text: {
      ko: "중요한 결정을 내려야 할 때, 당신은 무엇에 더 의지합니까?",
      en: "When making an important decision, what do you rely on more?"
    },
    options: {
      A: {
        text: { ko: "객관적인 데이터와 논리적인 추론", en: "Objective data and logical reasoning." },
        value: 'R'
      },
      B: {
        text: { ko: "나의 직관과 뜨거운 열정, 그리고 신념", en: "My intuition, burning passion, and convictions." },
        value: 'P'
      }
    }
  },
  {
    id: 7,
    pillar: 'Drive',
    text: {
      ko: "실패했을 때 당신의 반응은?",
      en: "What is your reaction when you fail?"
    },
    options: {
      A: {
        text: { ko: "실패의 원인을 분석하고 다음 전략을 치밀하게 수정한다.", en: "Analyze the cause of failure and meticulously revise the next strategy." },
        value: 'R'
      },
      B: {
        text: { ko: "좌절을 딛고 다시 일어설 수 있는 뜨거운 에너지를 얻는다.", en: "Gain burning energy to overcome frustration and stand up again." },
        value: 'P'
      }
    }
  },
  {
    id: 8,
    pillar: 'Drive',
    text: {
      ko: "사람들을 설득할 때 당신이 주로 사용하는 방법은?",
      en: "What is your primary method when persuading people?"
    },
    options: {
      A: {
        text: { ko: "빈틈없는 논리와 명확한 근거 제시", en: "Flawless logic and presenting clear evidence." },
        value: 'R'
      },
      B: {
        text: { ko: "마음을 울리는 감동적인 스토리와 진심", en: "A touching story and sincerity that resonates with the heart." },
        value: 'P'
      }
    }
  },
  {
    id: 9,
    pillar: 'Drive',
    text: {
      ko: "당신이 생각하는 이상적인 리더의 모습은?",
      en: "What is your ideal vision of a leader?"
    },
    options: {
      A: {
        text: { ko: "냉철한 판단력으로 최선의 길을 제시하는 조타수", en: "A helmsman who suggests the best path with cool judgment." },
        value: 'R'
      },
      B: {
        text: { ko: "모두의 가슴에 불을 지피고 행동하게 만드는 혁명가", en: "A revolutionary who ignites everyone's heart and makes them take action." },
        value: 'P'
      }
    }
  },
  {
    id: 10,
    pillar: 'Drive',
    text: {
      ko: "갈등 상황에서 당신은 어떻게 행동합니까?",
      en: "How do you act in a conflict situation?"
    },
    options: {
      A: {
        text: { ko: "감정을 배제하고 상황의 시시비비를 명확히 가린다.", en: "Exclude emotions and clearly judge the rights and wrongs of the situation." },
        value: 'R'
      },
      B: {
        text: { ko: "서로의 마음을 어루만지고 진정성을 확인하려 노력한다.", en: "Try to comfort each other's hearts and verify sincerity." },
        value: 'P'
      }
    }
  },

  // METHOD (Disruption vs Harmony)
  {
    id: 11,
    pillar: 'Method',
    text: {
      ko: "오래된 관습이 비효율적일 때, 당신은 어떻게 하시겠습니까?",
      en: "When an old custom is inefficient, what do you do?"
    },
    options: {
      A: {
        text: { ko: "과감하게 관습을 타파하고 새로운 규칙을 세운다.", en: "Boldly break the custom and establish new rules." },
        value: 'D'
      },
      B: {
        text: { ko: "기존의 틀을 유지하며 천천히 개선할 점을 찾는다.", en: "Maintain the existing framework and slowly find points to improve." },
        value: 'H'
      }
    }
  },
  {
    id: 12,
    pillar: 'Method',
    text: {
      ko: "새로운 팀에 합류했을 때 당신의 스타일은?",
      en: "What is your style when joining a new team?"
    },
    options: {
      A: {
        text: { ko: "기존의 비효율적인 방식을 지적하고 혁신을 요구한다.", en: "Point out existing inefficient ways and demand innovation." },
        value: 'D'
      },
      B: {
        text: { ko: "팀의 분위기에 녹아들며 화합을 먼저 도모한다.", en: "Blend into the team's atmosphere and promote harmony first." },
        value: 'H'
      }
    }
  },
  {
    id: 13,
    pillar: 'Method',
    text: {
      ko: "어떤 변화가 더 가치 있다고 생각합니까?",
      en: "Which change do you think is more valuable?"
    },
    options: {
      A: {
        text: { ko: "낡은 것을 완전히 무너뜨리고 다시 세우는 창조적 파괴", en: "Creative destruction that completely tears down the old and builds it again." },
        value: 'D'
      },
      B: {
        text: { ko: "다양한 의견을 조율하여 모두가 동의하는 합의점 도출", en: "Coordinating diverse opinions to reach a consensus everyone agrees on." },
        value: 'H'
      }
    }
  },
  {
    id: 14,
    pillar: 'Method',
    text: {
      ko: "당신은 경쟁 상황에서 어떤 태도를 취합니까?",
      en: "What attitude do you take in a competitive situation?"
    },
    options: {
      A: {
        text: { ko: "압도적인 실력으로 판을 흔들어 승리를 쟁취한다.", en: "Shake the board with overwhelming skill to achieve victory." },
        value: 'D'
      },
      B: {
        text: { ko: "선의의 경쟁을 통해 함께 성장하는 길을 택한다.", en: "Choose a path of growing together through fair competition." },
        value: 'H'
      }
    }
  },
  {
    id: 15,
    pillar: 'Method',
    text: {
      ko: "사회 문제를 해결할 때 필요한 것은?",
      en: "What is needed when solving social problems?"
    },
    options: {
      A: {
        text: { ko: "기득권을 타파할 수 있는 강력한 개혁 의지", en: "Strong will for reform to break down the establishment." },
        value: 'D'
      },
      B: {
        text: { ko: "서로 다른 계층 간의 이해와 사회적 대타협", en: "Understanding and social grand compromise between different classes." },
        value: 'H'
      }
    }
  },

  // ORIGIN (Innovation vs Tradition)
  {
    id: 16,
    pillar: 'Origin',
    text: {
      ko: "당신은 새로운 아이디어를 어디서 주로 얻습니까?",
      en: "Where do you primarily get new ideas?"
    },
    options: {
      A: {
        text: { ko: "아무도 시도하지 않은 미래 지향적 상상", en: "Future-oriented imagination that no one has tried." },
        value: 'I'
      },
      B: {
        text: { ko: "과거의 기록과 고전, 그리고 역사의 교훈", en: "Past records, classics, and lessons of history." },
        value: 'T'
      }
    }
  },
  {
    id: 17,
    pillar: 'Origin',
    text: {
      ko: "당신이 선호하는 작업 환경은?",
      en: "What is your preferred working environment?"
    },
    options: {
      A: {
        text: { ko: "최첨단 기술과 새로운 시도가 가득한 실험적인 공간", en: "An experimental space full of state-of-the-art technology and new attempts." },
        value: 'I'
      },
      B: {
        text: { ko: "시간의 흔적이 묻어있고 질서가 잡힌 안정적인 공간", en: "A stable space with traces of time and established order." },
        value: 'T'
      }
    }
  },
  {
    id: 18,
    pillar: 'Origin',
    text: {
      ko: "새로운 제품을 살 때 당신의 기준은?",
      en: "What is your criteria when buying a new product?"
    },
    options: {
      A: {
        text: { ko: "이전에 없던 혁신적인 기능과 세련된 디자인", en: "Innovative features and sophisticated design that never existed before." },
        value: 'I'
      },
      B: {
        text: { ko: "오랜 시간 검증된 내구성과 클래식한 가치", en: "Durability verified over a long time and classic value." },
        value: 'T'
      }
    }
  },
  {
    id: 19,
    pillar: 'Origin',
    text: {
      ko: "후세에 어떤 사람으로 기억되고 싶습니까?",
      en: "How do you want to be remembered by posterity?"
    },
    options: {
      A: {
        text: { ko: "시대를 앞서간 혁명적인 천재이자 개척자", en: "A revolutionary genius and pioneer ahead of their time." },
        value: 'I'
      },
      B: {
        text: { ko: "고결한 정신과 전통을 지켜낸 존경받는 스승", en: "A respected mentor who preserved noble spirit and traditions." },
        value: 'T'
      }
    }
  },
  {
    id: 20,
    pillar: 'Origin',
    text: {
      ko: "당신에게 '지혜'란 무엇입니까?",
      en: "What is 'wisdom' to you?"
    },
    options: {
      A: {
        text: { ko: "기존의 한계를 뛰어넘는 새로운 통찰", en: "New insights that transcend existing limitations." },
        value: 'I'
      },
      B: {
        text: { ko: "시간의 풍파를 견뎌낸 변하지 않는 진리", en: "Unchanging truth that has endured the storms of time." },
        value: 'T'
      }
    }
  }
];

export const archetypes: Record<string, { name: { ko: string; en: string }; description: { ko: string; en: string } }> = {
  'LRDI': {
    name: { ko: "대륙을 재설계하는 설계자", en: "The Universal Architect" },
    description: { ko: "당신은 거대한 시야와 차가운 이성을 바탕으로 세상을 혁명적으로 바꾸는 전략가입니다.", en: "You are a strategist who revolutionizes the world based on a grand vision and cool reason." }
  },
  'LPDI': {
    name: { ko: "멈추지 않는 시대의 개척자", en: "The Eternal Pioneer" },
    description: { ko: "당신은 불가능에 도전하는 뜨거운 심장과 혁신적인 아이디어로 인류의 한계를 넓힙니다.", en: "You expand the limits of humanity with a burning heart that challenges the impossible and innovative ideas." }
  },
  'LRHI': {
    name: { ko: "깨어있는 지혜의 개혁가", en: "The Enlightened Reformer" },
    description: { ko: "당신은 전체 시스템의 안정을 유지하면서도 더 나은 미래를 위해 지혜롭게 변화를 이끕니다.", en: "You wisely lead change for a better future while maintaining the stability of the entire system." }
  },
  'LPHI': {
    name: { ko: "영감을 불어넣는 시대의 리더", en: "The Inspirational Leader" },
    description: { ko: "당신은 원대한 꿈을 향해 모두의 마음을 하나로 모으고 큰 변화를 일구어내는 리더입니다.", en: "You are a leader who gathers everyone's hearts toward a grand dream and achieves great change." }
  },
  'LRDT': {
    name: { ko: "질서를 수호하는 결단가", en: "The Traditional Decider" },
    description: { ko: "당신은 고전적인 가치와 이성적인 판단을 바탕으로 혼란 속에서 질서를 바로잡는 힘이 있습니다.", en: "You have the power to restore order amidst chaos based on classic values and rational judgment." }
  },
  'LPDT': {
    name: { ko: "신념을 지키는 강철의 혁명가", en: "The Charismatic Rebel" },
    description: { ko: "당신은 자신이 옳다고 믿는 전통적 가치를 위해 뜨겁게 투쟁하고 세상을 움직입니다.", en: "You fight passionately for the traditional values you believe are right and move the world." }
  },
  'LRHT': {
    name: { ko: "품격 있는 시대의 중재자", en: "The Gracious Sovereign" },
    description: { ko: "당신은 거시적인 안목과 조화로운 소통으로 역사적인 평화와 합의를 이끌어냅니다.", en: "You lead historical peace and consensus through a macro perspective and harmonious communication." }
  },
  'LPHT': {
    name: { ko: "모두를 품는 역사의 수호자", en: "The Devoted Unifier" },
    description: { ko: "당신은 따뜻한 인류애와 헌신적인 자세로 공동체의 전통을 지키고 화합을 이룹니다.", en: "You preserve community traditions and achieve harmony through warm humanity and a devoted attitude." }
  },
  'SRDI': {
    name: { ko: "정교한 미래의 발명가", en: "The Precise Inventor" },
    description: { ko: "당신은 날카로운 논리와 창의적인 발상으로 우리 삶의 구체적인 부분을 혁신적으로 바꿉니다.", en: "You innovatively change specific parts of our lives with sharp logic and creative ideas." }
  },
  'SPDI': {
    name: { ko: "불꽃 같은 영혼의 예술가", en: "The Radical Creator" },
    description: { ko: "당신은 타협하지 않는 열정과 파격적인 감각으로 세상에 유일무이한 작품을 남깁니다.", en: "You leave unique works in the world with uncompromising passion and unconventional sense." }
  },
  'SRHI': {
    name: { ko: "실천하는 지혜의 현자", en: "The Practical Sage" },
    description: { ko: "당신은 조용하지만 명확한 지혜로 일상의 문제를 해결하고 조화로운 발전을 꾀합니다.", en: "You solve everyday problems and seek harmonious development with quiet but clear wisdom." }
  },
  'SPHI': {
    name: { ko: "아름다움을 빚는 조화의 거장", en: "The Compassionate Artist" },
    description: { ko: "당신은 인간에 대한 깊은 이해와 따뜻한 시선으로 세상의 상처를 치유하고 변화시킵니다.", en: "You heal and change the world's wounds with deep understanding and a warm perspective on humans." }
  },
  'SRDT': {
    name: { ko: "냉철한 일상의 수호자", en: "The Stoic Guardian" },
    description: { ko: "당신은 현실적인 판단과 전통적인 원칙을 고수하며 묵묵히 자신의 소임을 완수합니다.", en: "You silently fulfill your duties while adhering to realistic judgments and traditional principles." }
  },
  'SPDT': {
    name: { ko: "행동하는 양심의 투사", en: "The Passionate Activist" },
    description: { ko: "당신은 불의를 참지 못하는 열정으로 우리 주변의 소중한 가치들을 끝까지 지켜냅니다.", en: "You protect the precious values around us to the end with a passion that cannot tolerate injustice." }
  },
  'SRHT': {
    name: { ko: "겸손한 삶의 관찰자", en: "The Humble Protector" },
    description: { ko: "당신은 전통과 질서를 존중하며 조화로운 삶을 통해 주변에 안정과 평화를 전파합니다.", en: "You spread stability and peace around you through a harmonious life while respecting tradition and order." }
  },
  'SPHT': {
    name: { ko: "평화를 사랑하는 영혼", en: "The Gentle Soul" },
    description: { ko: "당신은 따뜻한 감성과 조화로운 태도로 사람들의 마음을 하나로 묶는 특별한 힘이 있습니다.", en: "You have a special power to tie people's hearts together with warm sensitivity and a harmonious attitude." }
  }
};
