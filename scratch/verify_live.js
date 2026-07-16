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
        console.log(`\nFetching ${url}...`);
        try {
            const html = await fetchHTML(url);
            
            // Extract the fact-layer section if possible, or check entire body text
            // The fact-layer is inside <section id="fact-layer">
            const sectionMatch = html.match(/<section[^>]*id="fact-layer"[^>]*>([\s\S]*?)<\/section>/);
            
            let targetHtml = html;
            if (sectionMatch) {
                targetHtml = sectionMatch[1];
                console.log(`Found fact-layer section (${targetHtml.length} bytes)`);
            } else {
                console.log(`Warning: fact-layer section not found. Checking entire HTML.`);
            }

            // Remove HTML tags for cleaner text check
            const textOnly = targetHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

            const koreanMatch = textOnly.match(/[가-힣]+/g);
            
            if (koreanMatch) {
                console.error(`❌ FAILED: Found ${koreanMatch.length} Korean words in ${url}`);
                console.error(`Samples:`, koreanMatch.slice(0, 5).join(', '));
            } else {
                console.log(`✅ PASSED: 0 Korean characters found in fact-layer text for ${url}`);
            }
            
            // Print a small raw sample to prove English
            const eventSample = textOnly.match(/1397.*?1450/i) || textOnly.substring(0, 100);
            console.log(`Raw Sample: "${textOnly.substring(0, 150).trim()}..."`);

        } catch (e) {
            console.error(`Error fetching ${url}:`, e);
        }
    }
}

verify();
