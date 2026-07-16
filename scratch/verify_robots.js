const https = require('https');

const timestamp = Date.now();
const urls = [
    `https://www.giantswisdom.com/he/giant/king-sejong?v=${timestamp}`,
    `https://www.giantswisdom.com/tr/giant/king-sejong?v=${timestamp}`
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
            const metaMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                              html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["'][^>]*>/i);
            
            if (metaMatch) {
                console.log(`Robots tag found: content="${metaMatch[1]}"`);
            } else {
                console.log(`Robots tag not explicitly found (defaults to index, follow).`);
            }
        } catch (e) {
            console.error(`Error fetching ${url}:`, e);
        }
    }
}
verify();
