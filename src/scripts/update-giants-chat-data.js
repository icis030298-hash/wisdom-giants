const fs = require('fs');

function updateGiantsChat(path, locale) {
  const content = JSON.parse(fs.readFileSync(path, 'utf8'));
  const giants = content.Giants;

  Object.keys(giants).forEach(slug => {
    const giant = giants[slug];
    if (locale === 'en') {
      giant.chatGreeting = `Greetings, traveler from the future. I am ${giant.name}. As a ${giant.shortDescription}, I am ready to lend an ear to your troubles. What wisdom do you seek?`;
      giant.suggestedQuestions = [
        `What was your greatest achievement?`,
        `What advice do you have for people today?`,
        `How did you overcome your hardest moments?`,
        `What is the secret to a successful life?`
      ];
    } else {
      giant.chatGreeting = `반갑네, 미래에서 온 친구여. 나는 ${giant.name}이라네. ${giant.shortDescription}로서 자네의 고민에 귀를 기울일 준비가 되었네. 어떤 지혜를 찾고 있는가?`;
      giant.suggestedQuestions = [
        "당신의 가장 위대한 발견은 무엇인가요?",
        "현대인들에게 해주고 싶은 조언이 있나요?",
        "가장 힘들었던 순간을 어떻게 극복했나요?",
        "성공적인 삶을 위한 태도는 무엇일까요?"
      ];
    }
  });

  // Specific override for Napoleon in English
  if (locale === 'en' && giants['napoleon']) {
    giants['napoleon'].chatGreeting = "Greetings, traveler from the future. I am Napoleon Bonaparte. They say 'impossible' is not in my dictionary. I am ready to lend an ear to your troubles. What wisdom do you seek?";
  }

  fs.writeFileSync(path, JSON.stringify(content, null, 2), 'utf8');
}

updateGiantsChat('messages/en.json', 'en');
updateGiantsChat('messages/ko.json', 'ko');
console.log('Giants chat data updated in en.json and ko.json');
