const fs = require('fs');

const salvaged = JSON.parse(fs.readFileSync('scratch/salvaged_valid_candidates.json', 'utf8'));

const matrixTarget = {
  '중남미': { arts: 15, science: 10, society: 15, business: 10, philosophy: 5, leadership: 5 },
  '동남아': { arts: 10, science: 10, society: 15, business: 15, philosophy: 5, leadership: 0 },
  '남아시아/인도': { arts: 15, science: 10, society: 15, business: 5, philosophy: 10, leadership: 0 },
  '일본': { arts: 10, science: 10, society: 5, business: 10, philosophy: 10, leadership: 0 },
  '중국': { arts: 10, science: 15, society: 5, business: 10, philosophy: 5, leadership: 0 },
  '아프리카': { arts: 10, science: 10, society: 10, business: 5, philosophy: 5, leadership: 5 },
  '북미': { arts: 10, science: 10, society: 10, business: 10, philosophy: 0, leadership: 0 },
  '한국': { arts: 10, science: 10, society: 5, business: 5, philosophy: 5, leadership: 0 },
  '유럽': { arts: 10, science: 15, society: 5, business: 5, philosophy: 0, leadership: 0 },
  '중동/페르시아': { arts: 5, science: 5, society: 5, business: 5, philosophy: 10, leadership: 0 },
  '러시아/동유럽': { arts: 5, science: 5, society: 5, business: 5, philosophy: 5, leadership: 5 },
  '중앙아시아': { arts: 0, science: 0, society: 5, business: 5, philosophy: 5, leadership: 10 }
};

const mapRegion = (r) => {
  if (r.includes('한국')) return '한국';
  if (r.includes('일본')) return '일본';
  if (r.includes('중국')) return '중국';
  if (r.includes('동남아')) return '동남아';
  if (r.includes('남아시아') || r.includes('인도')) return '남아시아/인도';
  if (r.includes('중동') || r.includes('페르시아') || r.includes('아랍')) return '중동/페르시아';
  if (r.includes('유럽')) {
    if (r.includes('동유럽') || r.includes('러시아')) return '러시아/동유럽';
    return '유럽';
  }
  if (r.includes('북미')) return '북미';
  if (r.includes('중남미') || r.includes('라틴')) return '중남미';
  if (r.includes('아프리카')) return '아프리카';
  if (r.includes('중앙아시아')) return '중앙아시아';
  
  // Default parsing for some of the salvaged candidates
  if (r === '아시아') return '동남아'; // Or whatever fallback
  return '유럽'; 
};

// Deduct salvaged from target
for (const c of salvaged) {
  const r = mapRegion(c.region);
  const cat = c.category;
  
  if (matrixTarget[r] && matrixTarget[r][cat] !== undefined) {
    matrixTarget[r][cat]--;
  }
}

// Print remaining targets
console.log('Remaining Targets for Wikidata Script:');
console.table(matrixTarget);

fs.writeFileSync('scratch/matrix_remaining.json', JSON.stringify(matrixTarget, null, 2), 'utf8');
