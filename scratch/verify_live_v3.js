const https = require('https');
const fs = require('fs');

const fetchHTML = (url) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
    }).on('error', reject);
});

// Helper to find the slug that contains a specific string in the timeline year
function findSlug(loc, searchString) {
    const data = JSON.parse(fs.readFileSync(`./src/data/fact-layers/fact-layer-${loc}.json`, 'utf8'));
    for (const slug in data) {
        if (data[slug].timeline) {
            for (const item of data[slug].timeline) {
                if (item.year && item.year.includes(searchString)) {
                    return slug;
                }
            }
        }
    }
    return null;
}

async function verify() {
    console.log("=== Vercel Live Verification ===\n");

    // 1. Confucius EN
    const urlEN = 'https://www.giantswisdom.com/en/giant/confucius';
    console.log(`[1] Fetching EN Confucius: ${urlEN}`);
    let html = await fetchHTML(urlEN);
    let text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    // The "30대" should be gone, and "In his 30s" should exist.
    const hasKorean30s = html.includes('30대');
    const hasEn30s = html.includes('In his 30s');
    const hasKoreanYuan = html.includes('원나라');
    const hasEnYuan = html.includes('Yuan Dynasty');
    console.log(`  -> "30대" present? ${hasKorean30s}`);
    console.log(`  -> "In his 30s" present? ${hasEn30s}`);
    console.log(`  -> "원나라" present? ${hasKoreanYuan}`);
    console.log(`  -> "Yuan Dynasty" present? ${hasEnYuan}`);

    // 2. Japanese Sample
    const jaSlug = findSlug('ja', '1848年10月末');
    if (jaSlug) {
        const urlJA = `https://www.giantswisdom.com/ja/giant/${jaSlug}`;
        console.log(`\n[2] Fetching JA Sample (${jaSlug}): ${urlJA}`);
        html = await fetchHTML(urlJA);
        const hasBadYear = html.includes('1848年10月 말');
        const hasGoodYear = html.includes('1848年10月末');
        console.log(`  -> "1848年10月 말" present? ${hasBadYear}`);
        console.log(`  -> "1848年10月末" present? ${hasGoodYear}`);
    } else {
        console.log("\n[2] JA Sample not found.");
    }

    // 3. Chinese Sample
    const zhSlug = findSlug('zh', '1848年10月末');
    if (zhSlug) {
        const urlZH = `https://www.giantswisdom.com/zh/giant/${zhSlug}`;
        console.log(`\n[3] Fetching ZH Sample (${zhSlug}): ${urlZH}`);
        html = await fetchHTML(urlZH);
        const hasBadYear = html.includes('1848年10月 말');
        const hasGoodYear = html.includes('1848年10月末');
        console.log(`  -> "1848年10月 말" present? ${hasBadYear}`);
        console.log(`  -> "1848年10月末" present? ${hasGoodYear}`);
    } else {
        console.log("\n[3] ZH Sample not found.");
    }
}

verify();
