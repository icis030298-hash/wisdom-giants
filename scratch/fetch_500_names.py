import json
import urllib.request
import urllib.parse
import time
import sys
import os

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

input_file = r'C:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\candidates_500_roster.json'
output_file = r'C:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\candidates_500_names.json'

LOCALES = ['en', 'ko', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi']

# Standardize zh to zh, we might get zh-hans, zh-hant, zh-tw, etc. But standard wikipedia langlinks for chinese is usually 'zh'.

with open(input_file, 'r', encoding='utf-8') as f:
    candidates = json.load(f)

HEADERS = {'User-Agent': 'NameFetcherBot/1.0 (antigravity@test.com) Python-urllib/3.0'}

def get_langlinks(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&titles={urllib.parse.quote(title)}&lllimit=500&format=json"
    
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=10) as response:
                res = json.loads(response.read())
                pages = res.get('query', {}).get('pages', {})
                if not pages:
                    return {}
                page = list(pages.values())[0]
                if 'langlinks' not in page:
                    return {}
                
                lang_dict = {}
                for ll in page['langlinks']:
                    lang_dict[ll['lang']] = ll['*']
                return lang_dict
        except Exception as e:
            if '429' in str(e):
                print(f"429 Too Many Requests for {title}, sleeping {attempt*2 + 2}s...", flush=True)
                time.sleep(attempt*2 + 2)
            else:
                print(f"Error fetching langlinks for {title}: {e}", flush=True)
                return {}
    return {}

results = []

for i, giant in enumerate(candidates):
    name_en = giant['nameEn']
    name_ko = giant['nameKo']
    print(f"[{i+1}/{len(candidates)}] Fetching {name_en}...", flush=True)
    langlinks = get_langlinks(name_en)
    
    localized_names = {}
    for loc in LOCALES:
        if loc == 'en':
            localized_names[loc] = name_en
        elif loc == 'ko':
            localized_names[loc] = name_ko
        else:
            if loc in langlinks:
                localized_names[loc] = langlinks[loc]
            else:
                # Special handling for Chinese
                if loc == 'zh' and ('zh-hans' in langlinks or 'zh-hant' in langlinks):
                    localized_names[loc] = langlinks.get('zh-hans', langlinks.get('zh-hant'))
                else:
                    # Fallback to English
                    localized_names[loc] = name_en
                    
    giant['names'] = localized_names
    results.append(giant)
    
    # Save incrementally to avoid data loss
    if (i + 1) % 50 == 0:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
            
    time.sleep(0.05)

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done! All names fetched and saved.", flush=True)
