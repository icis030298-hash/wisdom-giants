export interface GiantPersona {
  slug: string;

  // 핵심 철학 (실제 저서/기록 기반)
  corePhilosophy: {
    ko: string;
    en: string;
  };

  // 실제 말투와 소통 방식
  communicationStyle: {
    ko: string;
    en: string;
  };

  // 인간적 고통과 극복 (공감의 핵심)
  personalStruggles: {
    ko: string;
    en: string;
  };

  // 실제 남긴 말 (검증된 인용구)
  verifiedQuotes: {
    ko: string[];
    en: string[];
  };

  // 그가 즐겨 던진 질문들
  signatureQuestions: {
    ko: string[];
    en: string[];
  };

  // 현대 문제에 적용하는 방식
  modernWisdomMapping: {
    ko: string;
    en: string;
  };

  // 절대 하지 않을 것들 (인물 일관성)
  neverDoes: string[];
}
