const fs = require('fs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bulkCheck(titles) {
    const url = `https://en.wikipedia.org/w/api.php`;
    const params = new URLSearchParams({
        action: 'query',
        prop: 'info',
        redirects: '1',
        titles: titles.join('|'),
        format: 'json'
    });
    
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(url, { 
                method: 'POST',
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Node.js)',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });
            if (res.status === 429) {
                await sleep(2000);
                continue;
            }
            if (!res.ok) {
                console.error(`HTTP ${res.status}`);
                continue;
            }
            const data = await res.json();
            
            const normalized = data.query?.normalized || [];
            const redirects = data.query?.redirects || [];
            const pages = data.query?.pages || {};
            
            const results = {};
            
            for (const t of titles) {
                results[t] = { exists: false, redirect: null };
                
                let current = t;
                const normMatch = normalized.find(n => n.from === current);
                if (normMatch) current = normMatch.to;
                
                const redMatch = redirects.find(r => r.from === current);
                if (redMatch) {
                    results[t].redirect = redMatch.to;
                    current = redMatch.to;
                } else if (normMatch) {
                    results[t].redirect = current;
                }
                
                for (const key in pages) {
                    if (pages[key].title === current && key !== "-1") {
                        results[t].exists = true;
                        break;
                    }
                }
            }
            
            return results;
        } catch (e) {
            console.error(`Error in bulk check: ${e.message}`);
        }
    }
    return null;
}

async function main() {
    const candidates = JSON.parse(fs.readFileSync('scratch/candidates_500_roster.json', 'utf8'));
    
    let missing = [];
    let redirected = [];
    let valid = [];
    
    console.log("Verifying 500 names against Wikipedia in bulk (POST)...");
    
    const BATCH_SIZE = 50; // POST can handle 50 easily
    
    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
        console.log(`Checking batch ${Math.floor(i/BATCH_SIZE) + 1} / ${Math.ceil(candidates.length/BATCH_SIZE)}...`);
        const batch = candidates.slice(i, i + BATCH_SIZE);
        const titles = batch.map(c => c.nameEn);
        
        const results = await bulkCheck(titles);
        if (!results) {
            console.error("Batch failed completely!");
            continue;
        }
        
        for (const c of batch) {
            const res = results[c.nameEn];
            if (res && res.exists) {
                if (res.redirect) {
                    redirected.push(`${c.nameEn} -> ${res.redirect}`);
                    c.nameEn = res.redirect;
                    valid.push(c);
                } else {
                    valid.push(c);
                }
            } else {
                missing.push(c);
            }
        }
        
        await sleep(100);
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
