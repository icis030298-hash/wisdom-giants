const fs = require('fs');
const path = require('path');

const targetLocales = ['fr', 'it', 'nl', 'id', 'pt', 'sw', 'ha', 'pl'];
const factLayersDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');

// Common LLM refusal strings in Korean
const llmRefusalPatterns = [
    '원문에서 직접 확인된',
    '정보 부족으로',
    '생략',
    '알 수 없습니다',
    '제공되지 않',
    '작성되었습니다',
    '명시되어 있지 않',
    '확인할 수 없',
    '알려져 있지 않',
    '알려진 바 없',
    '기재되어 있지 않',
    '기록이 없',
    '기록되어 있지 않'
];

const results = {};

for (const loc of targetLocales) {
    const file = path.join(factLayersDir, `fact-layer-${loc}.json`);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    let contaminatedGiants = 0;
    let totalContaminatedFields = 0;
    let typeA = 0; // Pure Korean (Total omission)
    let typeB = 0; // Mixed (Partial failure)
    let typeC = 0; // LLM Refusal

    for (const slug in data) {
        const giant = data[slug];
        let giantIsContaminated = false;

        const checkField = (text) => {
            if (typeof text !== 'string') return;
            if (/[가-힣]/.test(text)) {
                giantIsContaminated = true;
                totalContaminatedFields++;
                
                // Classify
                let isRefusal = false;
                for (const pat of llmRefusalPatterns) {
                    if (text.includes(pat)) {
                        isRefusal = true;
                        break;
                    }
                }

                if (isRefusal) {
                    typeC++;
                } else {
                    // If it has Latin letters (a-z, diacritics etc.) and Korean -> Mixed
                    // We can just check for any basic Latin letters.
                    if (/[a-zA-ZÀ-ÿ]/.test(text)) {
                        typeB++;
                    } else {
                        // Probably pure Korean
                        typeA++;
                    }
                }
            }
        };

        if (giant.timeline) giant.timeline.forEach(t => checkField(t.event));
        if (giant.keyAchievements) giant.keyAchievements.forEach(a => { checkField(a.title); checkField(a.description); });
        if (giant.faq) giant.faq.forEach(f => { checkField(f.question); checkField(f.answer); });

        if (giantIsContaminated) {
            contaminatedGiants++;
        }
    }

    results[loc] = {
        contaminatedGiants,
        totalContaminatedFields,
        typeA,
        typeB,
        typeC
    };
}

// Sort locales by number of contaminated giants (ascending)
const sortedLocales = Object.keys(results).sort((a, b) => results[a].contaminatedGiants - results[b].contaminatedGiants);

console.log("=== Fact-Layer Contamination Report ===");
for (const loc of sortedLocales) {
    const r = results[loc];
    console.log(`\nLocale: [${loc.toUpperCase()}]`);
    console.log(`  - 오염된 인물 수: ${r.contaminatedGiants}명 (총 494명 중)`);
    console.log(`  - 오염된 필드 수: ${r.totalContaminatedFields}개`);
    console.log(`  - 오염 유형 분류:`);
    console.log(`      (a) 완전 누락 (순수 한국어): ${r.typeA}건`);
    console.log(`      (b) 부분 실패 (혼재됨): ${r.typeB}건`);
    console.log(`      (c) AI 변명 메시지: ${r.typeC}건`);
}
