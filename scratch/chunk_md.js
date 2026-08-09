const fs = require('fs');

const roster = JSON.parse(fs.readFileSync('scratch/candidates_500_roster.json', 'utf8'));
roster.sort((a, b) => parseInt(a.no || 0) - parseInt(b.no || 0));

function generateChunk(start, end) {
    let out = `### 명단 출력 (${start+1} ~ ${end})\n\n`;
    out += "| 번호 | 영문명 | 한국어명 | 생몰연도 | 지역 | 분야 | 성별 |\n";
    out += "|---|---|---|---|---|---|---|\n";
    
    for (let i = start; i < end; i++) {
        const c = roster[i];
        out += `| ${c.no} | ${c.nameEn} | ${c.nameKo} | ${c.era} | ${c.region} | ${c.category} | ${c.gender} |\n`;
    }
    return out;
}

for (let i = 0; i < 5; i++) {
    const chunk = generateChunk(i * 100, (i + 1) * 100);
    fs.writeFileSync(`scratch/roster_part${i+1}.md`, chunk, 'utf8');
}
console.log("Chunks generated.");
