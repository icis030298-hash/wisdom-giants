const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const giantsPath = path.join(projectRoot, 'src/data/giants.ts');
const narrativesPath = path.join(projectRoot, 'src/data/final-narratives.json');
const messagesDir = path.join(projectRoot, 'messages');

const TARGETS = [
  'oskar-schindler',
  'desmond-tutu',
  'elie-wiesel',
  'terry-fox'
];

console.log('=== FIX 1: 1970년 이후 사망 위인 제거 시작 ===');

// 1. src/data/giants.ts 에서 삭제
if (fs.existsSync(giantsPath)) {
  let content = fs.readFileSync(giantsPath, 'utf8');
  let removedCount = 0;

  TARGETS.forEach(target => {
    let searchStrs = [`slug: "${target}"`, `slug: '${target}'`];
    searchStrs.forEach(searchStr => {
      while (true) {
        let targetIdx = content.indexOf(searchStr);
        if (targetIdx === -1) break;

        console.log(` giants.ts 매칭 타겟 발견: ${target}`);
        
        let startIdx = -1;
        for (let i = targetIdx; i >= 0; i--) {
          if (content[i] === '{') {
            const chunk = content.substring(i, targetIdx);
            if (/^{\s*(?:\r?\n)?\s*id:/.test(chunk)) {
              startIdx = i;
              break;
            }
          }
        }

        if (startIdx !== -1) {
          let braceCount = 0;
          let endIdx = -1;
          let inString = false;
          let escape = false;
          
          for (let i = startIdx; i < content.length; i++) {
            let char = content[i];
            if (escape) {
              escape = false;
              continue;
            }
            if (char === '\\') {
              escape = true;
              continue;
            }
            if (char === '"' || char === "'") {
              if (!inString) inString = char;
              else if (inString === char) inString = false;
            }
            if (!inString) {
              if (char === '{') braceCount++;
              if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                  endIdx = i;
                  break;
                }
              }
            }
          }

          if (endIdx !== -1) {
            let removeEnd = endIdx + 1;
            if (content[removeEnd] === ',') removeEnd++;
            while (content[removeEnd] === ' ' || content[removeEnd] === '\r' || content[removeEnd] === '\n') {
              removeEnd++;
            }
            content = content.slice(0, startIdx) + content.slice(removeEnd);
            removedCount++;
            console.log(`  -> giants.ts에서 ${target} 오브젝트 제거 성공.`);
          } else {
            console.error(`  [오류] ${target}의 닫는 괄호를 찾을 수 없습니다.`);
            break;
          }
        } else {
          console.error(`  [오류] ${target}의 시작 괄호(\\n  {)를 찾을 수 없습니다.`);
          break;
        }
      }
    });
  });

  fs.writeFileSync(giantsPath, content, 'utf8');
  console.log(`giants.ts에서 총 ${removedCount}개 항목 제거 완료.`);
} else {
  console.error('giants.ts 파일을 찾을 수 없습니다.');
}

// 2. src/data/final-narratives.json 에서 삭제
if (fs.existsSync(narrativesPath)) {
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  let count = 0;
  TARGETS.forEach(target => {
    if (narratives[target]) {
      delete narratives[target];
      count++;
      console.log(` final-narratives.json에서 ${target} 제거 완료.`);
    }
  });
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
  console.log(`final-narratives.json에서 총 ${count}개 항목 제거 완료.`);
} else {
  console.error('final-narratives.json 파일을 찾을 수 없습니다.');
}

// 3. messages/*.json 에서 삭제
const locales = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'];
locales.forEach(loc => {
  const filePath = path.join(messagesDir, `${loc}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.Giants) {
      let count = 0;
      TARGETS.forEach(target => {
        if (data.Giants[target]) {
          delete data.Giants[target];
          count++;
        }
      });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(` messages/${loc}.json에서 총 ${count}개 항목 제거 완료.`);
    }
  } else {
    console.warn(` messages/${loc}.json 파일이 없습니다.`);
  }
});

console.log('=== 제거 완료 ===');
