import json
import time
import requests
import urllib.parse
import re

# 1. Parse Live 493 slugs from src/data/giants.ts
with open('src/data/giants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

live_slugs = re.findall(r'slug:\s*["\']([^"\']+)["\']', content)
print(f"Total Live Giant Slugs Extracted: {len(live_slugs)}", flush=True)

# Load English names from messages/en.json
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_msg = json.load(f)

giants_en = en_msg.get('Giants', {})

live_giants = []
for slug in live_slugs:
    name = giants_en.get(slug, {}).get('name')
    if not name:
        # Fallback: convert slug to Title Case
        name = slug.replace('-', ' ').title()
    live_giants.append({"slug": slug, "name": name})

print(f"Sample Live Giant: {live_giants[0]}", flush=True)

session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) STAGE1/1.0'})

def fetch_qids_batch(titles):
    results = {}
    chunk_size = 50
    for i in range(0, len(titles), chunk_size):
        chunk = titles[i:i+chunk_size]
        titles_str = "|".join([urllib.parse.quote(t) for t in chunk])
        url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&redirects=1&titles={titles_str}&format=json"
        
        for attempt in range(5):
            try:
                resp = session.get(url, timeout=10)
                if resp.status_code == 429:
                    time.sleep(2)
                    continue
                resp.raise_for_status()
                data = resp.json()
                
                pages = data.get('query', {}).get('pages', {})
                redirects = data.get('query', {}).get('redirects', [])
                
                redirect_map = {r['from']: r['to'] for r in redirects}
                
                for page_id, page in pages.items():
                    if page_id != "-1":
                        title = page.get('title')
                        qid = page.get('pageprops', {}).get('wikibase_item')
                        if qid:
                            results[title] = qid
                            
                for page_id, page in pages.items():
                    if page_id != "-1":
                        title = page.get('title')
                        qid = page.get('pageprops', {}).get('wikibase_item')
                        if qid:
                            for orig, target in redirect_map.items():
                                if target == title:
                                    results[orig] = qid
                break
            except Exception as e:
                time.sleep(1)
        time.sleep(0.05)
    return results

print("Fetching Q-IDs for Live 493 giants...", flush=True)
live_names = [g['name'] for g in live_giants]
live_qids_map = fetch_qids_batch(live_names)

live_slug_by_qid = {}
for g in live_giants:
    name = g['name']
    qid = live_qids_map.get(name)
    g['qid'] = qid
    if qid:
        live_slug_by_qid[qid] = g['slug']

print(f"Live Q-IDs Resolved: {len(live_slug_by_qid)} / {len(live_giants)}", flush=True)

# 2. Load candidate 500 giants
with open('scratch/candidates_500_roster_verified_final.json', 'r', encoding='utf-8') as f:
    candidates = json.load(f)

print("Fetching Q-IDs for 500 Candidates...", flush=True)
cand_names = [c['nameEn'] for c in candidates]
cand_qids_map = fetch_qids_batch(cand_names)

# 3. Perform Q-ID crosscheck
matches = []
seen_cand_qids = {}

for c in candidates:
    no = c.get('no')
    name_en = c.get('nameEn')
    qid = cand_qids_map.get(name_en, 'UNKNOWN')
    c['qid'] = qid
    
    match_reasons = []
    matched_slug = ""
    
    # Check internal duplicate
    if qid != 'UNKNOWN' and qid in seen_cand_qids:
        prev_no = seen_cand_qids[qid]
        match_reasons.append(f"Internal Duplicate of Candidate #{prev_no}")
    elif qid != 'UNKNOWN':
        seen_cand_qids[qid] = no
        
    # Check live 493 duplicate
    if qid != 'UNKNOWN' and qid in live_slug_by_qid:
        matched_slug = live_slug_by_qid[qid]
        match_reasons.append(f"Live 493 Duplicate ({matched_slug})")
        
    if match_reasons:
        matches.append({
            "no": no,
            "nameEn": name_en,
            "qid": qid,
            "matched_slug": matched_slug,
            "reason": " / ".join(match_reasons)
        })

# Check specific aliases requested in 1-3
specific_checks = [
    ("Wang Geon", "Taejo of Goryeo", "wang-geon"),
    ("Yi Seong-gye", "Taejo of Joseon", "yi-seong-gye"),
    ("Liu Bang", "Emperor Gaozu of Han", "liu-bang")
]

print("\n--- Specific Alias Check (1-3) ---")
for raw, target, slug_check in specific_checks:
    live_has_slug = slug_check in live_slugs
    print(f"Alias Check: '{raw}' -> '{target}' | Live has slug '{slug_check}': {live_has_slug}")

# Write CSV
csv_lines = ["번호,영문명,Q-ID,매칭된 라이브 slug,매칭 근거"]
for m in matches:
    csv_lines.append(f"{m['no']},\"{m['nameEn']}\",{m['qid']},{m['matched_slug']},\"{m['reason']}\"")

with open('scratch/stage1_qid_matches.csv', 'w', encoding='utf-8') as f:
    f.write("\n".join(csv_lines))

print(f"\n=== STAGE 1 Q-ID Crosscheck Complete ===")
print(f"Total Duplicate Matches Found: {len(matches)}")
print("Results written to scratch/stage1_qid_matches.csv")
