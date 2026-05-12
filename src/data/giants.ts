export interface Giant {
  id: string;
  name: string;
  category: '성취' | '역경' | '지혜' | '창의';
  shortDescription: string;
  slug: string;
}

export const giantsData: Giant[] = [
  // 성취 (Achievement)
  { id: '1', name: '스티브 잡스', category: '성취', shortDescription: '세상을 바꾼 혁신의 아이콘', slug: 'steve-jobs' },
  { id: '2', name: '나폴레옹 보나파르트', category: '성취', shortDescription: '불가능을 모르는 정복자', slug: 'napoleon' },
  
  // 역경 (Recovery)
  { id: '3', name: '프리다 칼로', category: '역경', shortDescription: '고통을 예술로 승화시킨 불꽃', slug: 'frida-kahlo' },
  { id: '4', name: '빅터 프랑클', category: '역경', shortDescription: '수용소에서도 잃지 않은 삶의 의미', slug: 'viktor-frankl' },
  
  // 지혜 (Wisdom)
  { id: '5', name: '마르쿠스 아우렐리우스', category: '지혜', shortDescription: '철학자가 된 로마의 황제', slug: 'marcus-aurelius' },
  { id: '6', name: '세네카', category: '지혜', shortDescription: '인생의 짧음에 대해 답하다', slug: 'seneca' },
  { id: '7', name: '공자', category: '지혜', shortDescription: '시대를 관통하는 동양의 성인', slug: 'confucius' },
  
  // 창의 (Creativity)
  { id: '8', name: '레오나르도 다 빈치', category: '창의', shortDescription: '모든 것을 관찰한 천재적 호기심', slug: 'da-vinci' },
  { id: '9', name: '살바도르 달리', category: '창의', shortDescription: '초현실적인 상상력의 마술사', slug: 'salvador-dali' },
  { id: '10', name: '코코 샤넬', category: '창의', shortDescription: '여성의 삶에 자유를 입힌 혁명가', slug: 'coco-chanel' },
];
