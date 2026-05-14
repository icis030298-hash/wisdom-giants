const fs = require('fs');

function updateLocale(path, chatLabels) {
  const content = JSON.parse(fs.readFileSync(path, 'utf8'));
  content.Chat = chatLabels;
  fs.writeFileSync(path, JSON.stringify(content, null, 2), 'utf8');
}

const enChat = {
  "famousQuote": "Famous Quote",
  "description": "Description",
  "suggestedQuestions": "Suggested Questions",
  "inputPlaceholder": "Ask {name} anything...",
  "contemplating": "{name} is contemplating...",
  "wisdomActive": "Wisdom Active",
  "historyEra": "History & Era",
  "fieldOfWisdom": "Field of Wisdom",
  "error": "I am sorry, I encountered an error while retrieving my wisdom. Could you try again in a moment?"
};

const koChat = {
  "famousQuote": "명언",
  "description": "설명",
  "suggestedQuestions": "추천 질문",
  "inputPlaceholder": "{name}에게 무엇이든 물어보세요...",
  "contemplating": "{name}이(가) 생각 중입니다...",
  "wisdomActive": "지혜 활성화됨",
  "historyEra": "역사와 시대",
  "fieldOfWisdom": "지혜의 분야",
  "error": "죄송하네, 나의 지혜를 불러오는 도중 오류가 발생했구만. 잠시 후 다시 시도해주겠나?"
};

updateLocale('messages/en.json', enChat);
updateLocale('messages/ko.json', koChat);
console.log('Chat labels updated in en.json and ko.json');
