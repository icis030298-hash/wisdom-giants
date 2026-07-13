const fs = require('fs');

async function translate(text, targetLang) {
    if(!text) return text;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    let retries = 5;
    while (retries > 0) {
        try {
            const res = await fetch(url);
            if (res.status === 429) {
                console.log('429 Rate limited, waiting 5 seconds...');
                await new Promise(r => setTimeout(r, 5000));
                retries--;
                continue;
            }
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            return data[0].map(x => x[0]).join('');
        } catch(e) {
            console.error('Error translating:', text.substring(0, 20), e.message);
            await new Promise(r => setTimeout(r, 2000));
            retries--;
        }
    }
    return text;
}

async function main() {
    console.log('Reading data...');
    const data = JSON.parse(fs.readFileSync('./scratch/t2-p2-chunk-5.json', 'utf8'));
    const total = data.length;
    let current = 0;
    
    for (const item of data) {
        current++;
        if (current % 10 === 0) console.log(`Processing ${current}/${total}...`);
        
        if (item.type === 'narrative') {
            if (Array.isArray(item.originalEn)) {
                item.translated = item.originalEn.map(q => {
                    const res = {};
                    if (q['quote_' + item.loc]) res.quote = q['quote_' + item.loc];
                    else if (q['quote_en']) res.quote = q['quote_en'];
                    
                    if (q['meaning_' + item.loc]) res.meaning = q['meaning_' + item.loc];
                    else if (q['meaning_en']) res.meaning = q['meaning_en'];
                    
                    return res;
                });
            } else if (typeof item.originalEn === 'string') {
                item.translated = await translate(item.originalEn, item.loc);
                await new Promise(r => setTimeout(r, 200));
            }
        } else if (item.type === 'fact-layer' && Array.isArray(item.originalEn)) {
            const translatedArr = [];
            for (const fact of item.originalEn) {
                const transYear = await translate(fact.year, item.loc);
                await new Promise(r => setTimeout(r, 200));
                const transEvent = await translate(fact.event, item.loc);
                await new Promise(r => setTimeout(r, 200));
                translatedArr.push({ year: transYear, event: transEvent });
            }
            item.translated = translatedArr;
        }
    }
    
    console.log('Saving output...');
    fs.writeFileSync('./scratch/t2-p2-out-5.json', JSON.stringify(data, null, 2));
    console.log('Done!');
}

main().catch(console.error);
