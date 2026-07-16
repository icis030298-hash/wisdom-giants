const https = require('https');

const urls = [
    'https://www.giantswisdom.com/en/giant/king-sejong',
    'https://www.giantswisdom.com/en/giant/gautama-buddha',
    'https://www.giantswisdom.com/en/giant/marie-curie',
    'https://www.giantswisdom.com/en/giant/nelson-mandela'
];

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function verify() {
    for (const url of urls) {
        console.log(`\n======================================`);
        console.log(`🔍 Fetching ${url}...`);
        try {
            const html = await fetchHTML(url);
            
            // App Router RSC Payload typically contains the props as strings.
            // Let's just look for specific keys that we translated in fact-layer.
            // E.g. "Junsu-bang" or "Creation of Hunminjeongeum"
            
            // Alternatively, let's extract the raw Korean text to see WHERE it's coming from.
            const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
            const koreanMatch = textOnly.match(/[가-힣\s]+/g);
            
            if (koreanMatch) {
                const longKoreanText = koreanMatch.filter(m => m.trim().length > 10)[0];
                console.log(`⚠️ Korean text is present in the HTML (likely from __NEXT_DATA__, blog-posts.ts, or App Router payload).`);
                console.log(`Sample of Korean found: "${longKoreanText ? longKoreanText.trim().substring(0, 50) : ''}..."`);
                
                // Let's check if the FACT LAYER English text is present!
                if (url.includes('king-sejong')) {
                    const hasEnFact = html.includes('Junsu-bang, Hanseong') || html.includes('Creation of Hunminjeongeum');
                    console.log(`✅ Is Fact-Layer English text present in HTML? ${hasEnFact}`);
                } else if (url.includes('marie-curie')) {
                    const hasEnFact = html.includes('Maria Salomea Skłodowska') || html.includes('Nobel Prize');
                    console.log(`✅ Is Fact-Layer English text present in HTML? ${hasEnFact}`);
                } else if (url.includes('gautama-buddha')) {
                    const hasEnFact = html.includes('Lumbini') || html.includes('Enlightenment');
                    console.log(`✅ Is Fact-Layer English text present in HTML? ${hasEnFact}`);
                }
            } else {
                console.log(`✅ PASSED: 0 Korean characters found in ${url}`);
            }
        } catch (e) {
            console.error(`Error fetching ${url}:`, e);
        }
    }
}

verify();
