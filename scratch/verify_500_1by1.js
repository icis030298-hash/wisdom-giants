const fs = require('fs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkWikipedia(title) {
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&prop=info&titles=${encodeURIComponent(title)}&format=json`;
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0' } });
            if (!res.ok) {
                if (res.status === 429 || res.status >= 500) {
                    await sleep(2000);
                    continue;
                }
                return false;
            }
            const data = await res.json();
            const pages = data.query?.pages || {};
            for (const key in pages) {
                if (key === "-1") return false;
                return true;
            }
        } catch (e) {
            await sleep(1000);
        }
    }
    return false;
}

async function getRedirect(title) {
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&redirects=1&titles=${encodeURIComponent(title)}&format=json`;
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0' } });
            if (!res.ok) {
                if (res.status === 429 || res.status >= 500) {
                    await sleep(2000);
                    continue;
                }
                return null;
            }
            const data = await res.json();
            const redirects = data.query?.redirects || [];
            if (redirects.length > 0) {
                return redirects[0].to;
            }
            return null;
        } catch (e) {
            await sleep(1000);
        }
    }
    return null;
}

async function main() {
    const candidates = JSON.parse(fs.readFileSync('scratch/candidates_500_roster.json', 'utf8'));
    
    let missing = [];
    let redirected = [];
    let valid = [];
    
    console.log("Verifying 500 names against Wikipedia 1-by-1...");
    
    for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        let name_en = c.nameEn;
        
        if (i % 50 === 0) {
            console.log(`Checking ${i}/500...`);
        }
        
        let exists = await checkWikipedia(name_en);
        if (!exists) {
            let redirect = await getRedirect(name_en);
            if (redirect) {
                c.nameEn = redirect;
                redirected.push(`${name_en} -> ${redirect}`);
                valid.push(c);
            } else {
                missing.push(c);
            }
        } else {
            valid.push(c);
        }
        
        await sleep(50);
    }
    
    console.log("\n--- Name Verification Report ---");
    console.log(`Total checked: ${candidates.length}`);
    console.log(`Valid direct matches: ${valid.length - redirected.length}`);
    console.log(`Redirects found & updated: ${redirected.length}`);
    console.log(`Missing / Not Found: ${missing.length}`);
    
    fs.writeFileSync('scratch/candidates_500_roster_verified.json', JSON.stringify(valid, null, 2), 'utf8');
    
    if (redirected.length > 0) {
        fs.writeFileSync('scratch/candidates_500_redirects.txt', redirected.join('\n'), 'utf8');
    }
    
    if (missing.length > 0) {
        fs.writeFileSync('scratch/candidates_500_missing.json', JSON.stringify(missing, null, 2), 'utf8');
    }
}

main().catch(console.error);
