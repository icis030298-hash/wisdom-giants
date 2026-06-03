const fs = require('fs');
const path = require('path');

const greetings = {
  socrates: {
    ko: "당신은 왜 나를 찾아왔소? 내가 답을 줄 거라 생각한다면, 당신은 이미 틀린 것이오.",
    en: "Why have you come to me? If you think I will give you answers, you are already wrong."
  },
  seneca: {
    ko: "오늘 하루 중 얼마나 많은 시간을 진정으로 당신 것으로 만들었소? 그 시간이 죽어서도 기억할 것들이오?",
    en: "How much of today did you truly make your own? Will those hours be worth remembering at the end?"
  },
  'marcus-aurelius': {
    ko: "나도 매일 아침 이 자리가 두렵소. 황제의 자리가 아니라, 오늘 하루를 잘 살아야 한다는 그 무게가.",
    en: "Each morning I too am afraid. Not of the throne, but of the weight of needing to live this one day well."
  },
  'napoleon-bonaparte': {
    ko: "자네가 두려워하는 것은 실패인가, 아니면 실패한 뒤 타인의 시선인가? 불가능은 바보들의 사전에나 있는 법이네.",
    en: "Is it failure you fear, or the gaze of others after you fail? Impossible is a word found only in the dictionary of fools."
  },
  'abraham-lincoln': {
    ko: "나는 평생 우울증이라는 깊은 골짜기를 걸어왔소. 하지만 천천히 걸을지언정 결코 뒤로 물러서진 않았지.",
    en: "I have walked through the deep valley of melancholy my entire life. But while I may walk slowly, I never walk backward."
  },
  'king-sejong': {
    ko: "그대의 고단함을 내 모르는 바 아니오. 허나 그대가 무너지면 그대 주변의 세상 또한 무너짐을 어찌 잊으셨소?",
    en: "I am not ignorant of your weariness. But how could you forget that if you collapse, the world around you collapses as well?"
  },
  'leonardo-da-vinci': {
    ko: "세상은 놀라운 신비로 가득 차 있네. 오늘 자네는 무엇을 관찰했고, 그것에서 어떤 규칙을 발견했는가?",
    en: "The world is full of wondrous mysteries. What have you observed today, and what patterns have you discovered within it?"
  },
  'albert-einstein': {
    ko: "권위에 짓눌려 질문하기를 멈추지 말게. 자네가 가진 가장 아이 같은 호기심은 무엇인가?",
    en: "Do not stop questioning under the weight of authority. What is the most child-like curiosity you still possess?"
  },
  'mahatma-gandhi': {
    ko: "세상을 향해 분노하기 전에, 오늘 하루 당신 스스로 어떤 평화의 씨앗을 심었는지 묻고 싶소.",
    en: "Before you direct your anger at the world, I ask you: what seed of peace have you planted yourself today?"
  },
  'isaac-newton': {
    ko: "모든 감정과 혼란에도 인과율이 존재하네. 자네의 그 흔들림은 대체 어떤 작용에 대한 반작용인가?",
    en: "Causality exists even in all emotion and chaos. Your current turbulence is an equal and opposite reaction to what exactly?"
  }
};

const updateLocale = (locale) => {
  const filePath = path.join(__dirname, '..', 'messages', `${locale}.json`);
  let data;
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(txt);
  } catch (e) {
    console.log(`Failed to read ${locale}.json:`, e.message);
    return;
  }

  let updated = 0;
  for (const [slug, trans] of Object.entries(greetings)) {
    if (data.Giants && data.Giants[slug]) {
      data.Giants[slug].chatGreeting = trans[locale];
      updated++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updated} greetings in ${locale}.json`);
};

updateLocale('ko');
updateLocale('en');
