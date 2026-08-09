import json
import time
import requests
import urllib.parse

corrections = {
    "Yi Hwang (Toegye)": "Yi Hwang",
    "Yi I (Yulgok)": "Yi I",
    "Sol Geo": "Solgeo",
    "Seok Ga-mo-ni (Park Eun-sik)": "Park Eun-sik",
    "Su Shi (Su Dongpo)": "Su Shi",
    "Rani of Jhansi (Lakshmibai)": "Rani of Jhansi",
    "Queen Nandi": "Nandi (mother of Shaka)",
    "King Sobhuza I": "Sobhuza I",
    "Queen Majaji": "Rain Queen",
    "Seoae Ryu Seong-ryong": "Ryu Seong-ryong",
    "Atatürk (Mustafa Kemal)": "Mustafa Kemal Atatürk",
    "J.A. Macdonald": "John A. Macdonald",
    "L. v. Beethoven": "Ludwig van Beethoven",
    "Tz'u-hsi (Cixi)": "Empress Dowager Cixi",
    "Nzinga of Ndongo": "Nzinga of Ndongo and Matamba"
}

session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0'})

print("=== Re-verifying 15 Manually Mapped Names ===")
results = []

for raw_name, fixed_name in corrections.items():
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=info|pageprops&redirects=1&titles={urllib.parse.quote(fixed_name)}&format=json"
    resp = session.get(url, timeout=10)
    data = resp.json()
    
    pages = data.get('query', {}).get('pages', {})
    redirects = data.get('query', {}).get('redirects', [])
    
    redirect_to = redirects[0]['to'] if redirects else None
    
    page_id = list(pages.keys())[0]
    page_data = pages[page_id]
    
    qid = page_data.get('pageprops', {}).get('wikibase_item', 'N/A')
    title = page_data.get('title', fixed_name)
    exists = page_id != "-1"
    
    # Check Wikidata P31 (instance of) if qid exists
    instance_of = "Unknown"
    if qid != 'N/A':
        wd_url = f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"
        wd_resp = session.get(wd_url, timeout=10)
        wd_data = wd_resp.json()
        claims = wd_data.get('entities', {}).get(qid, {}).get('claims', {})
        p31_claims = claims.get('P31', [])
        p31_ids = [c['mainsnak']['datavalue']['value']['id'] for c in p31_claims if 'datavalue' in c['mainsnak']]
        if 'Q5' in p31_ids:
            instance_of = "human (Q5)"
        else:
            instance_of = f"NON-HUMAN ({', '.join(p31_ids)})"
            
    results.append({
        "raw_name": raw_name,
        "fixed_name": fixed_name,
        "exists": exists,
        "redirect_to": redirect_to,
        "final_wiki_title": title,
        "qid": qid,
        "instance_of": instance_of
    })
    time.sleep(0.1)

print(json.dumps(results, indent=2, ensure_ascii=False))

with open('scratch/verify_15_mapped_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
