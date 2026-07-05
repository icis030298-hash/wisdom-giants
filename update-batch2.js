const fs = require('fs');

let code = fs.readFileSync('scripts/generate-batch2-epics.ts', 'utf8');

code = code.replace(/const batch1Giants = \[.*?\];/s, `const batch2Giants = [ 'ivan-mazepa','chulalongkorn','giuseppe-garibaldi','yaa-asantewaa','khufu', 'rosa-luxemburg','gungunhana','saad-zaghloul','robert-koch','tariq-ibn-ziyad', 'ferdowsi','mehmed-the-conqueror','piri-reis','queen-nzinga','michelangelo', 'james-cook','meister-eckhart','huda-shaarawi','joan-of-arc','william-james', 'tonyukuk','zhang-qian','rene-descartes','abai-qunanbaiuly','qin-shi-huang' ];`);

code = code.replace('- **[숫자 반전 방지 가드레일]**:', `- **[시점 분리 가드레일]**: 인물의 사망 시점과 그 이후에 발생한 사건(후계자 시대의 사건, 사후 평가, 유산 형성 과정)을 명확히 구분해서 서술할 것. '그의 죽음 이후', '그의 후계자는', '사후' 같은 시점 표지어를 사용해 인물 생전 사건과 사후 사건이 뒤섞이지 않도록 할 것. 특히 인물이 죽거나 실각한 후 벌어진 전투/사건을 본인이 직접 겪은 것처럼 서술하지 않도록 주의.\n- **[숫자 반전 방지 가드레일]**:`);

code = code.replace(/batch1Giants/g, 'batch2Giants');
code = code.replace('scratch/batch1-narratives-draft.json', 'scratch/batch2-part1-narratives-draft.json');
code = code.replace('배치 1 - 30명', '배치 2 part1 - 25명');

fs.writeFileSync('scripts/generate-batch2-epics.ts', code);
