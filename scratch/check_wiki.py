import json
import urllib.request
import urllib.parse
import time

def fetch_langlinks(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllimit=500&titles={urllib.parse.quote(title)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Bot/1.0'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        pages = data['query']['pages']
        for page_id in pages:
            if 'langlinks' in pages[page_id]:
                return {ll['lang']: ll['*'] for ll in pages[page_id]['langlinks']}
    except Exception as e:
        print(f"Error fetching {title}: {e}")
    return {}

data_path = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/name_audit_final_batch_8.json'
with open(data_path, 'r', encoding='utf-8') as f:
    giants = json.load(f)

discrepancies = []

for giant in giants:
    en_title = giant['nameEn']
    langlinks = fetch_langlinks(en_title)
    time.sleep(1.0)
    
    for lang, local_name in giant['names'].items():
        if lang == 'en':
            continue
        if lang in langlinks:
            correct_name = langlinks[lang]
            # Some leniency for dashes, spaces, etc
            if correct_name != local_name:
                # Let's verify it's a hallucination or completely wrong
                # (e.g. Taytu Betul -> C'est exact)
                # Just output everything that doesn't match the wikipedia title exactly.
                discrepancies.append({
                    "slug": giant['slug'],
                    "locale": lang,
                    "localName": local_name,
                    "correctName": correct_name
                })

out_path = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/name_discrepancies_final_batch_8.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(discrepancies, f, ensure_ascii=False, indent=2)

print(f"Found {len(discrepancies)} discrepancies. Saved to {out_path}.")
