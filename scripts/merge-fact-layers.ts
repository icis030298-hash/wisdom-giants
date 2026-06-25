import fs from 'fs';
import path from 'path';

function mergeFactLayers() {
  const finalFacts: Record<string, any> = {};

  // 1. 파일럿 10명 데이터 로드
  const pilotPath = 'src/data/fact-layer-pilot.json';
  if (fs.existsSync(pilotPath)) {
    const pilotData = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    for (const [slug, data] of Object.entries(pilotData)) {
      finalFacts[slug] = data;
    }
  }

  // 2. 각 배치의 검증된 결과(valid) 로드
  const batchDir = 'scripts/batch-results';
  let invalidCount = 0;

  if (fs.existsSync(batchDir)) {
    const files = fs.readdirSync(batchDir);
    
    // valid 파일 병합
    for (const file of files) {
      if (file.endsWith('-valid.json')) {
        const batchData = JSON.parse(fs.readFileSync(path.join(batchDir, file), 'utf8'));
        for (const [slug, data] of Object.entries(batchData)) {
          finalFacts[slug] = data;
        }
      }
      
      // invalid 통계 수집
      if (file.endsWith('-invalid.json')) {
        const invalidData = JSON.parse(fs.readFileSync(path.join(batchDir, file), 'utf8'));
        invalidCount += Object.keys(invalidData).length;
      }
    }
  }

  // 3. 통합 결과 저장
  fs.writeFileSync('src/data/fact-layer.json', JSON.stringify(finalFacts, null, 2));

  const totalSlugs = Object.keys(finalFacts).length;
  console.log(`
  전체 위인 중:
  - Fact Layer 적용 완료: ${totalSlugs}명
  - 수동 검토 대기 (INVALID): ${invalidCount}명
  - 적용률: ${((totalSlugs / 300) * 100).toFixed(1)}%
  
  ✅ 병합 완료: src/data/fact-layer.json 생성됨
  `);
}

mergeFactLayers();
