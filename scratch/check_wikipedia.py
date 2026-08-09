import json
import urllib.request
import urllib.parse
import time

def get_langlinks(en_title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllimit=max&titles={urllib.parse.quote(en_title)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data.get('query', {}).get('pages', {})
            for page_id in pages:
                if 'langlinks' in pages[page_id]:
                    return {link['lang']: link['*'] for link in pages[page_id]['langlinks']}
    except Exception as e:
        print(f"Error fetching langlinks for {en_title}: {e}")
    return {}

def main():
    with open('C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/name_audit_final_batch_3.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    discrepancies = []
    
    for item in data:
        slug = item['slug']
        name_en = item['nameEn']
        names = item['names']
        
        print(f"Processing {name_en}...")
        langlinks = get_langlinks(name_en)
        
        for lang, local_name in names.items():
            wiki_title = langlinks.get(lang)
            if not wiki_title:
                continue
                
            norm_local = local_name.lower().strip()
            norm_wiki = wiki_title.lower().strip()
            
            if norm_local != norm_wiki:
                # Filter out minor differences or format issues like comma in Russian (Last, First)
                if lang == 'ru' and ',' in wiki_title:
                    continue
                # Also filter out if it's just missing a diacritic or minor punctuation
                
                # Check for "Toyota" in Hideyoshi
                if "toyota" in norm_local and "toyotomi" in norm_wiki:
                    pass
                elif "ne adam" in norm_local or "thêm" in norm_local or "more" in norm_local or "america" in norm_local or "أمريكا" in norm_local:
                    pass
                elif len(norm_local) > 0 and len(norm_wiki) > 0:
                    # check if completely different
                    pass
                
                # Actually let's just collect them all and then filter them down to genuine ones
                # "genuine discrepancies where the current name is factually incorrect or poorly localized"
                discrepancies.append({
                    "slug": slug,
                    "locale": lang,
                    "localName": local_name,
                    "correctName": wiki_title
                })
        
        time.sleep(1.0)

    # Output discrepancies
    # We will refine them later
    with open('C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/name_discrepancies_final_batch_3.json', 'w', encoding='utf-8') as f:
        json.dump(discrepancies, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
