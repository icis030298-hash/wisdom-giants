
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
  // SCOPE (Macro 'L' vs Micro 'S') - 8 Questions
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
      ko: "당신이 책을 쓴다면, 어떤 주제를 선택하시겠습니까?",
      en: "If you were to write a book, what topic would you choose?"
    },
    options: {
      A: { text: { ko: "인류 역사의 흐름과 미래의 방향에 대한 거대 담론", en: "A grand discourse on the flow of human history and the direction of the future." }, value: 'L' },
      B: { text: { ko: "일상 속에서 발견하는 작은 행복과 삶의 지혜", en: "Small happiness and wisdom of life discovered in everyday life." }, value: 'S' },
      C: { text: { ko: "우주와 생명의 기원에 관한 과학적 고찰", en: "Scientific considerations on the origin of the universe and life." }, value: 'L' },
      D: { text: { ko: "가족과 친구들 사이의 깊은 유대와 사랑의 기록", en: "A record of deep bonds and love among family and friends." }, value: 'S' }
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
      A: { text: { ko: "세상이 우리를 어떻게 기억할지 결정짓는 거대한 상징적 업적", en: "A massive symbolic achievement that defines how the world remembers us." }, value: 'L' },
      B: { text: { ko: "구성원 한 명 한 명의 삶이 실질적으로 개선되는 결과", en: "Results that practically improve the life of every single member." }, value: 'S' },
      C: { text: { ko: "조직의 비전이 역사에 남을 혁명적인 패러다임을 만드는 것", en: "Making the organization's vision a revolutionary paradigm that stays in history." }, value: 'L' },
      D: { text: { ko: "현재 팀원들이 느끼는 성취감과 행복의 밀도를 높이는 것", en: "Increasing the density of achievement and happiness felt by current team members." }, value: 'S' }
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
      A: { text: { ko: "전체 시스템의 구조를 바꿔 근본적인 해결책을 찾는다.", en: "Change the structure of the entire system to find a fundamental solution." }, value: 'L' },
      B: { text: { ko: "당장 앞에 놓인 구체적인 문제부터 하나씩 해결해 나간다.", en: "Solve specific problems right in front of you one by one." }, value: 'S' },
      C: { text: { ko: "이 문제가 발생하게 된 역사적 맥락과 철학적 배경을 먼저 탐구한다.", en: "First explore the historical context and philosophical background that led to this problem." }, value: 'L' },
      D: { text: { ko: "관련된 사람들의 불편함을 먼저 해소하는 임시 조치를 취한다.", en: "Take temporary measures to first alleviate the discomfort of the people involved." }, value: 'S' }
    }
  },
  {
    id: 6,
    pillar: 'Scope',
    text: {
      ko: "당신은 도시를 건설한다면 어떤 부분에 가장 힘을 쏟겠습니까?",
      en: "If you were to build a city, which part would you focus on most?"
    },
    options: {
      A: { text: { ko: "수백 년 뒤에도 영감을 줄 웅장한 기념물과 도시 설계", en: "Grand monuments and urban designs that will inspire hundreds of years later." }, value: 'L' },
      B: { text: { ko: "주민들이 매일 이용하는 편리한 교통과 생활 편의 시설", en: "Convenient transportation and living facilities that residents use every day." }, value: 'S' },
      C: { text: { ko: "지성인들이 모여 토론하고 연구할 수 있는 거대 도서관과 광장", en: "A massive library and plaza where intellectuals can gather, discuss, and research." }, value: 'L' },
      D: { text: { ko: "아이들이 안전하게 뛰어놀 수 있는 공원과 교육 환경", en: "Parks and educational environments where children can play safely." }, value: 'S' }
    }
  },
  {
    id: 7,
    pillar: 'Scope',
    text: {
      ko: "과학 기술의 발전이 인류에게 주는 가장 큰 혜택은?",
      en: "What is the greatest benefit of scientific and technological progress for humanity?"
    },
    options: {
      A: { text: { ko: "지구라는 한계를 넘어 우주로 나아갈 수 있는 가능성", en: "The possibility of going beyond the limits of Earth into space." }, value: 'L' },
      B: { text: { ko: "질병을 정복하고 인간의 고통을 획기적으로 줄여주는 것", en: "Conquering diseases and significantly reducing human suffering." }, value: 'S' },
      C: { text: { ko: "에너지 문제를 해결하여 인류 문명의 지속 가능성을 확보하는 것", en: "Securing the sustainability of human civilization by solving energy problems." }, value: 'L' },
      D: { text: { ko: "노동 시간을 단축하여 사람들에게 더 많은 자유 시간을 주는 것", en: "Providing more free time to people by shortening labor hours." }, value: 'S' }
    }
  },
  {
    id: 8,
    pillar: 'Scope',
    text: {
      ko: "당신은 예술가로서 어떤 작품을 남기고 싶습니까?",
      en: "As an artist, what kind of work do you want to leave behind?"
    },
    options: {
      A: { text: { ko: "시대의 정신을 관통하고 인류의 가치관을 뒤흔드는 대작", en: "A masterpiece that pierces the spirit of the age and shakes human values." }, value: 'L' },
      B: { text: { ko: "지친 영혼을 달래주고 위로해주는 작고 따뜻한 소품", en: "A small, warm piece that soothes and comforts tired souls." }, value: 'S' },
      C: { text: { ko: "미지의 세계에 대한 경외심을 불러일으키는 거대한 조형물", en: "A massive sculpture that inspires awe for the unknown world." }, value: 'L' },
      D: { text: { ko: "일상의 아름다움을 세밀하게 포착한 사실적인 그림", en: "A realistic painting that finely captures the beauty of everyday life." }, value: 'S' }
    }
  },

  // DRIVE (Reason 'R' vs Passion 'P') - 8 Questions
  {
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
  {
    id: 13,
    pillar: 'Drive',
    text: {
      ko: "갈등 상황에서 당신은 어떻게 행동합니까?",
      en: "How do you act in a conflict situation?"
    },
    options: {
      A: { text: { ko: "감정을 배제하고 상황의 시시비비를 명확히 가린다.", en: "Exclude emotions and clearly judge the rights and wrongs of the situation." }, value: 'R' },
      B: { text: { ko: "서로의 마음을 어루만지고 진정성을 확인하려 노력한다.", en: "Try to comfort each other's hearts and verify sincerity." }, value: 'P' },
      C: { text: { ko: "제3자의 입장에서 객관적인 중재안을 도출한다.", en: "Derive an objective mediation plan from a third party perspective." }, value: 'R' },
      D: { text: { ko: "자신의 잘못을 먼저 인정하고 솔직하게 감정을 표현한다.", en: "Acknowledge one's own faults first and express emotions honestly." }, value: 'P' }
    }
  },
  {
    id: 14,
    pillar: 'Drive',
    text: {
      ko: "지식 습득을 위해 당신이 더 선호하는 방법은?",
      en: "Which method do you prefer for acquiring knowledge?"
    },
    options: {
      A: { text: { ko: "검증된 논문과 서적을 통한 체계적인 공부", en: "Systematic study through verified papers and books." }, value: 'R' },
      B: { text: { ko: "직접 현장을 발로 뛰며 몸으로 느끼는 체험", en: "Experiencing it personally by running to the field." }, value: 'P' },
      C: { text: { ko: "다양한 전문가들의 토론을 듣고 비판적으로 수용", en: "Listening to discussions of various experts and accepting them critically." }, value: 'R' },
      D: { text: { ko: "자신의 영감이 닿는 대로 다양한 분야를 탐험", en: "Exploring various fields as your inspiration leads." }, value: 'P' }
    }
  },
  {
    id: 15,
    pillar: 'Drive',
    text: {
      ko: "인간관계에서 당신이 더 중요하게 생각하는 가치는?",
      en: "In relationships, which value do you consider more important?"
    },
    options: {
      A: { text: { ko: "서로의 경계를 존중하고 합리적으로 행동하는 것", en: "Respecting each other's boundaries and acting rationally." }, value: 'R' },
      B: { text: { ko: "조건 없는 신뢰와 뜨거운 의리를 지키는 것", en: "Keeping unconditional trust and burning loyalty." }, value: 'P' },
      C: { text: { ko: "공통의 지적인 관심사를 공유하고 대화하는 것", en: "Sharing and talking about common intellectual interests." }, value: 'R' },
      D: { text: { ko: "기쁠 때나 슬플 때나 언제나 곁을 지켜주는 것", en: "Always being by the side in happy or sad times." }, value: 'P' }
    }
  },
  {
    id: 16,
    pillar: 'Drive',
    text: {
      ko: "당신을 가장 행동하게 만드는 동기는?",
      en: "What motivation drives you most to action?"
    },
    options: {
      A: { text: { ko: "세상의 원리를 이해하고 문제를 해결하려는 호기심", en: "Curiosity to understand the principles of the world and solve problems." }, value: 'R' },
      B: { text: { ko: "나의 한계를 시험하고 꿈을 이루려는 뜨거운 야망", en: "Burning ambition to test my limits and achieve my dreams." }, value: 'P' },
      C: { text: { ko: "더 효율적이고 질서 있는 세상을 만들고 싶은 의지", en: "Will to make a more efficient and orderly world." }, value: 'R' },
      D: { text: { ko: "사람들을 돕고 세상에 선한 영향력을 끼치고 싶은 마음", en: "Heart that wants to help people and exert good influence on the world." }, value: 'P' }
    }
  },

  // METHOD (Disruption 'D' vs Harmony 'H') - 7 Questions
  {
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
  {
    id: 21,
    pillar: 'Method',
    text: {
      ko: "사회 문제를 해결할 때 필요한 것은?",
      en: "What is needed when solving social problems?"
    },
    options: {
      A: { text: { ko: "기득권을 타파할 수 있는 강력한 개혁 의지", en: "Strong will for reform to break down the establishment." }, value: 'D' },
      B: { text: { ko: "서로 다른 계층 간의 이해와 사회적 대타협", en: "Understanding and social grand compromise between different classes." }, value: 'H' },
      C: { text: { ko: "기술적인 혁신을 통해 문제의 근본 구조를 제거", en: "Eliminating the root structure of the problem through technological innovation." }, value: 'D' },
      D: { text: { ko: "공동체 정신을 회복하고 도덕적인 연대를 강화", en: "Restoring community spirit and strengthening moral solidarity." }, value: 'H' }
    }
  },
  {
    id: 22,
    pillar: 'Method',
    text: {
      ko: "당신의 업무 스타일을 가장 잘 설명하는 단어는?",
      en: "Which word best describes your work style?"
    },
    options: {
      A: { text: { ko: "도전적인, 파격적인, 주도적인", en: "Challenging, unconventional, proactive." }, value: 'D' },
      B: { text: { ko: "안정적인, 협력적인, 세심한", en: "Stable, cooperative, meticulous." }, value: 'H' },
      C: { text: { ko: "직설적인, 효율적인, 결과 중심의", en: "Straightforward, efficient, result-oriented." }, value: 'D' },
      D: { text: { ko: "포용적인, 중재하는, 관계 중심의", en: "Inclusive, mediating, relationship-oriented." }, value: 'H' }
    }
  },
  {
    id: 23,
    pillar: 'Method',
    text: {
      ko: "새로운 기술을 도입할 때 당신의 입장은?",
      en: "What is your position when introducing new technology?"
    },
    options: {
      A: { text: { ko: "리스크가 있더라도 업계에서 가장 먼저 도입한다.", en: "Be the first in the industry to introduce it even if there are risks." }, value: 'D' },
      B: { text: { ko: "기술의 안정성이 완벽히 검증된 후에 도입한다.", en: "Introduce it after the stability of the technology is perfectly verified." }, value: 'H' },
      C: { text: { ko: "기존 방식을 완전히 대체할 수 있는 기술만 선호한다.", en: "Prefer only technology that can completely replace the existing method." }, value: 'D' },
      D: { text: { ko: "기존 시스템과 잘 융합될 수 있는 보조적 기술을 찾는다.", en: "Find auxiliary technology that can blend well with existing systems." }, value: 'H' }
    }
  },

  // ORIGIN (Innovation 'I' vs Tradition 'T') - 7 Questions
  {
    id: 24,
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
    id: 25,
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
    id: 26,
    pillar: 'Origin',
    text: {
      ko: "새로운 제품을 살 때 당신의 기준은?",
      en: "What is your criteria when buying a new product?"
    },
    options: {
      A: { text: { ko: "이전에 없던 혁신적인 기능과 세련된 디자인", en: "Innovative features and sophisticated design that never existed before." }, value: 'I' },
      B: { text: { ko: "오랜 시간 검증된 내구성과 클래식한 가치", en: "Durability verified over a long time and classic value." }, value: 'T' },
      C: { text: { ko: "가장 트렌디하고 화제가 되는 '얼리어답터' 제품", en: "The trendiest and most talked about 'early adopter' product." }, value: 'I' },
      D: { text: { ko: "명성이 높고 시간이 흘러도 가치가 변치 않는 명품", en: "Luxury goods with high reputation whose value does not change over time." }, value: 'T' }
    }
  },
  {
    id: 27,
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
  },
  {
    id: 28,
    pillar: 'Origin',
    text: {
      ko: "당신에게 '지혜'란 무엇입니까?",
      en: "What is 'wisdom' to you?"
    },
    options: {
      A: { text: { ko: "기존의 한계를 뛰어넘는 새로운 통찰", en: "New insights that transcend existing limitations." }, value: 'I' },
      B: { text: { ko: "시간의 풍파를 견뎌낸 변하지 않는 진리", en: "Unchanging truth that has endured the storms of time." }, value: 'T' },
      C: { text: { ko: "복잡한 세상을 단순하게 꿰뚫는 직관", en: "Intuition that pierces through a complex world simply." }, value: 'I' },
      D: { text: { ko: "조상들의 삶에서 배우는 지혜의 정수", en: "The essence of wisdom learned from the lives of ancestors." }, value: 'T' }
    }
  },
  {
    id: 29,
    pillar: 'Origin',
    text: {
      ko: "교육에서 가장 중요한 가치는 무엇이라고 생각합니까?",
      en: "What do you think is the most important value in education?"
    },
    options: {
      A: { text: { ko: "비판적 사고와 창의적인 문제 해결 능력 배양", en: "Cultivating critical thinking and creative problem solving skills." }, value: 'I' },
      B: { text: { ko: "올바른 인성과 전통적인 가치관의 계승", en: "Inheritance of correct personality and traditional values." }, value: 'T' },
      C: { text: { ko: "스스로 자신의 길을 개척하는 독립심 기르기", en: "Cultivating independence to pioneer one's own path." }, value: 'I' },
      D: { text: { ko: "공동체의 규범을 익히고 예의를 갖추는 법", en: "Learning community norms and how to be polite." }, value: 'T' }
    }
  },
  {
    id: 30,
    pillar: 'Origin',
    text: {
      ko: "당신은 어떤 휴식을 선호합니까?",
      en: "What kind of rest do you prefer?"
    },
    options: {
      A: { text: { ko: "낯선 도심에서 즐기는 힙하고 트렌디한 스테이", en: "Hip and trendy stay enjoyed in an unfamiliar city." }, value: 'I' },
      B: { text: { ko: "자연 속 오래된 사찰이나 고택에서의 명상", en: "Meditation in an old temple or traditional house in nature." }, value: 'T' },
      C: { text: { ko: "디지털 기기를 활용한 가상 현실 속의 새로운 경험", en: "New experiences in virtual reality using digital devices." }, value: 'I' },
      D: { text: { ko: "가문 대대로 내려오는 별장에서의 가족 모임", en: "Family gathering at a villa passed down through generations." }, value: 'T' }
    }
  }
];

export const archetypes: Record<string, { name: { ko: string; en: string; de: string }; description: { ko: string; en: string; de: string } }> = {
  'LRDI': {
    name: { ko: "대륙을 재설계하는 설계자", en: "The Universal Architect", de: "Der universelle Architekt" },
    description: { ko: "당신은 거대한 시야와 차가운 이성을 바탕으로 세상을 혁명적으로 바꾸는 전략가입니다.", en: "You are a strategist who revolutionizes the world based on a grand vision and cool reason.", de: "Sie sind ein Stratege, der die Welt auf der Grundlage einer großen Vision und kühler Vernunft revolutioniert." }
  },
  'LPDI': {
    name: { ko: "멈추지 않는 시대의 개척자", en: "The Eternal Pioneer", de: "Der ewige Pionier" },
    description: { ko: "당신은 불가능에 도전하는 뜨거운 심장과 혁신적인 아이디어로 인류의 한계를 넓힙니다.", en: "You expand the limits of humanity with a burning heart that challenges the impossible and innovative ideas.", de: "Sie erweitern die Grenzen der Menschheit mit einem brennenden Herzen, das das Unmögliche herausfordert, und innovativen Ideen." }
  },
  'LRHI': {
    name: { ko: "깨어있는 지혜의 개혁가", en: "The Enlightened Reformer", de: "Der aufgeklärte Reformer" },
    description: { ko: "당신은 전체 시스템의 안정을 유지하면서도 더 나은 미래를 위해 지혜롭게 변화를 이끕니다.", en: "You wisely lead change for a better future while maintaining the stability of the entire system.", de: "Sie führen klug Veränderungen für eine bessere Zukunft herbei, während Sie die Stabilität des Gesamtsystems wahren." }
  },
  'LPHI': {
    name: { ko: "영감을 불어넣는 시대의 리더", en: "The Inspirational Leader", de: "Der inspirierende Anführer" },
    description: { ko: "당신은 원대한 꿈을 향해 모두의 마음을 하나로 모으고 큰 변화를 일구어내는 리더입니다.", en: "You are a leader who gathers everyone's hearts toward a grand dream and achieves great change.", de: "Sie sind eine Führungspersönlichkeit, die die Herzen aller für einen großen Traum gewinnt und bedeutende Veränderungen bewirkt." }
  },
  'LRDT': {
    name: { ko: "질서를 수호하는 결단가", en: "The Traditional Decider", de: "Der traditionelle Entscheider" },
    description: { ko: "당신은 고전적인 가치와 이성적인 판단을 바탕으로 혼란 속에서 질서를 바로잡는 힘이 있습니다.", en: "You have the power to restore order amidst chaos based on classic values and rational judgment.", de: "Sie haben die Macht, inmitten des Chaos Ordnung auf der Grundlage klassischer Werte und rationaler Urteile wiederherzustellen." }
  },
  'LPDT': {
    name: { ko: "신념을 지키는 강철의 혁명가", en: "The Charismatic Rebel", de: "Der charismatische Rebell" },
    description: { ko: "당신은 자신이 옳다고 믿는 전통적 가치를 위해 뜨겁게 투쟁하고 세상을 움직입니다.", en: "You fight passionately for the traditional values you believe are right and move the world.", de: "Sie kämpfen leidenschaftlich für die traditionellen Werte, an die Sie glauben, und bewegen die Welt." }
  },
  'LRHT': {
    name: { ko: "품격 있는 시대의 중재자", en: "The Gracious Sovereign", de: "Der gnädige Souverän" },
    description: { ko: "당신은 거시적인 안목과 조화로운 소통으로 역사적인 평화와 합의를 이끌어냅니다.", en: "You lead historical peace and consensus through a macro perspective and harmonious communication.", de: "Sie führen historischen Frieden und Konsens durch eine Makroperspektive und harmonische Kommunikation herbei." }
  },
  'LPHT': {
    name: { ko: "모두를 품는 역사의 수호자", en: "The Devoted Unifier", de: "Der hingebungsvolle Vereiner" },
    description: { ko: "당신은 따뜻한 인류애와 헌신적인 자세로 공동체의 전통을 지키고 화합을 이룹니다.", en: "You preserve community traditions and achieve harmony through warm humanity and a devoted attitude.", de: "Sie bewahren Gemeinschaftstraditionen und erreichen Harmonie durch herzliche Menschlichkeit und eine hingebungsvolle Haltung." }
  },
  'SRDI': {
    name: { ko: "정교한 미래의 발명가", en: "The Precise Inventor", de: "Der präzise Erfinder" },
    description: { ko: "당신은 날카로운 논리와 창의적인 발상으로 우리 삶의 구체적인 부분을 혁신적으로 바꿉니다.", en: "You innovatively change specific parts of our lives with sharp logic and creative ideas.", de: "Sie verändern bestimmte Bereiche unseres Lebens innovativ mit scharfer Logik und kreativen Ideen." }
  },
  'SPDI': {
    name: { ko: "불꽃 같은 영혼의 예술가", en: "The Radical Creator", de: "Der radikale Schöpfer" },
    description: { ko: "당신은 타협하지 않는 열정과 파격적인 감각으로 세상에 유일무이한 작품을 남깁니다.", en: "You leave unique works in the world with uncompromising passion and unconventional sense.", de: "Sie hinterlassen einzigartige Werke in der Welt mit kompromissloser Leidenschaft und unkonventionellem Gespür." }
  },
  'SRHI': {
    name: { ko: "실천하는 지혜의 현자", en: "The Practical Sage", de: "Der praktische Weise" },
    description: { ko: "당신은 조용하지만 명확한 지혜로 일상의 문제를 해결하고 조화로운 발전을 꾀합니다.", en: "You solve everyday problems and seek harmonious development with quiet but clear wisdom.", de: "Sie lösen alltägliche Probleme und streben nach einer harmonischen Entwicklung mit stiller, aber klarer Weisheit." }
  },
  'SPHI': {
    name: { ko: "아름다움을 빚는 조화의 거장", en: "The Compassionate Artist", de: "Der mitfühlende Künstler" },
    description: { ko: "당신은 인간에 대한 깊은 이해와 따뜻한 시선으로 세상의 상처를 치유하고 변화시킵니다.", en: "You heal and change the world's wounds with deep understanding and a warm perspective on humans.", de: "Sie heilen und verändern die Wunden der Welt mit tiefem Verständnis und einer warmen Perspektive auf den Menschen." }
  },
  'SRDT': {
    name: { ko: "냉철한 일상의 수호자", en: "The Stoic Guardian", de: "Der stoische Wächter" },
    description: { ko: "당신은 현실적인 판단과 전통적인 원칙을 고수하며 묵묵히 자신의 소임을 완수합니다.", en: "You silently fulfill your duties while adhering to realistic judgments and traditional principles.", de: "Sie erfüllen schweigend Ihre Pflichten, während Sie sich an realistische Urteile und traditionelle Prinzipien halten." }
  },
  'SPDT': {
    name: { ko: "행동하는 양심의 투사", en: "The Passionate Activist", de: "Der leidenschaftliche Aktivist" },
    description: { ko: "당신은 불의를 참지 못하는 열정으로 우리 주변의 소중한 가치들을 끝까지 지켜냅니다.", en: "You protect the precious values around us to the end with a passion that cannot tolerate injustice.", de: "Sie schützen die kostbaren Werte um uns herum bis zum Ende mit einer Leidenschaft, die Ungerechtigkeit nicht dulden kann." }
  },
  'SRHT': {
    name: { ko: "겸손한 삶의 관찰자", en: "The Humble Protector", de: "Der bescheidene Beschützer" },
    description: { ko: "당신은 전통과 질서를 존중하며 조화로운 삶을 통해 주변에 안정과 평화를 전파합니다.", en: "You spread stability and peace around you through a harmonious life while respecting tradition and order.", de: "Sie verbreiten Stabilität und Frieden um sich herum durch ein harmonisches Leben, während Sie Tradition und Ordnung respektieren." }
  },
  'SPHT': {
    name: { ko: "평화를 사랑하는 영혼", en: "The Gentle Soul", de: "Die sanfte Seele" },
    description: { ko: "당신은 따뜻한 감성과 조화로운 태도로 사람들의 마음을 하나로 묶는 특별한 힘이 있습니다.", en: "You have a special power to tie people's hearts together with warm sensitivity and a harmonious attitude.", de: "Sie haben eine besondere Kraft, die Herzen der Menschen mit warmer Sensibilität und einer harmonischen Haltung zu verbinden." }
  }
};
