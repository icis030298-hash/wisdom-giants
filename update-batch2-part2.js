const fs = require('fs');
let code = fs.readFileSync('scripts/generate-batch2-epics.ts', 'utf8');
code = code.replace(/const batch2Giants = \[.*?\];/s, `const batch2Giants = ["kimpa-vita","seneca","augustus","imhotep","rabban-bar-sauma","selim-iii","thomas-edison","xuanzang","louis-pasteur","alan-turing","emmeline-pankhurst","james-clerk-maxwell","cetshwayo-kampande","homer","sergei-korolev","friedrich-schiller","john-f-kennedy","olympe-de-gouges","simone-weil","mustafa-kemal-ataturk","franklin-d-roosevelt","pachacuti","ahmad-yasawi","john-locke","johannes-gutenberg"];`);
code = code.replace('scratch/batch2-part1-narratives-draft.json', 'scratch/batch2-part2-narratives-draft.json');
code = code.replace('배치 2 part1 - 25명', '배치 2 part2 - 25명');
fs.writeFileSync('scripts/generate-batch2-epics.ts', code);
