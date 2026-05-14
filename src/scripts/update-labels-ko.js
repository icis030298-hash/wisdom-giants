const fs = require('fs');
const path = 'messages/ko.json';
const ko = JSON.parse(fs.readFileSync(path, 'utf8'));

// UI Labels update
ko.GiantsGrid.era = "역사의 거인";
ko.GiantsGrid.readEpic = "대서사시 읽기 ✨";

// Fix specific names if needed (usually they are correct but let's be sure)
if (ko.Giants["da-vinci"]) ko.Giants["da-vinci"].name = "레오나르도 다 빈치";
if (ko.Giants["seneca"]) ko.Giants["seneca"].name = "세네카";

fs.writeFileSync(path, JSON.stringify(ko, null, 2), 'utf8');
console.log('ko.json updated successfully');
