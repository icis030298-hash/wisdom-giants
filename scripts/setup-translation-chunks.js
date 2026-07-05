/**
 * 23개 언어별 번역을 위해 태스크를 분할하고 청크 파일을 생성합니다.
 * - 소스: scratch/translations/translation-coverage-audit-v2.json
 * - 대상 언어: 23개 언어 (ko 제외)
 * - 출력 경로: scratch/translations/{lang}-chunk-{N}.json
 */

const fs = require('fs');
const path = require('path');

const CHUNK_SIZE = 30; // 30명 단위 청크 생성

function main() {
  const auditPath = path.resolve('scratch/translations/translation-coverage-audit-v2.json');
  if (!fs.existsSync(auditPath)) {
    console.error('Audit V2 파일을 찾을 수 없습니다:', auditPath);
    process.exit(1);
  }

  const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const details = auditData.details;
  
  let totalChunks = 0;
  
  for (const lang of Object.keys(details)) {
    // overrideRequired(재번역) + newTranslationRequired(신규) 대상을 하나로 합침
    const tasks = [
      ...(details[lang].overrideRequired || []),
      ...(details[lang].newTranslationRequired || [])
    ];
    
    if (tasks.length === 0) continue;
    
    const numChunks = Math.ceil(tasks.length / CHUNK_SIZE);
    
    for (let i = 0; i < numChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, tasks.length);
      const chunk = tasks.slice(start, end);
      
      const chunkPath = path.resolve(`scratch/translations/${lang}-chunk-${i + 1}.json`);
      fs.writeFileSync(chunkPath, JSON.stringify(chunk, null, 2), 'utf8');
      totalChunks++;
    }
    console.log(`[${lang}] 총 ${tasks.length}명 -> ${numChunks}개 청크 분할 완료`);
  }
  
  console.log(`\n=== 분할 완료 ===`);
  console.log(`생성된 총 청크(Worker Task) 수: ${totalChunks}개`);
}

main();
