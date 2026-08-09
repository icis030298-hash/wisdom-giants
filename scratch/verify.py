import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import urllib.request
import urllib.parse
import time

def get_wikidata_id(en_title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles={urllib.parse.quote(en_title)}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id, page_info in pages.items():
                if 'pageprops' in page_info and 'wikibase_item' in page_info['pageprops']:
                    return page_info['pageprops']['wikibase_item']
    except Exception as e:
        print(f"Error fetching Wikidata ID for {en_title}: {e}")
    return None

def get_wikipedia_titles(qid):
    url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={qid}&props=sitelinks&format=json"
    titles = {}
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            sitelinks = data['entities'][qid].get('sitelinks', {})
            for site, info in sitelinks.items():
                if site.endswith('wiki'):
                    lang = site[:-4]
                    if lang == 'zh_classical': continue
                    titles[lang] = info['title']
    except Exception as e:
        print(f"Error fetching sitelinks for {qid}: {e}")
    return titles

def main():
    with open('name_audit_final_batch_10.json', 'r', encoding='utf-8') as f:
        giants = json.load(f)
    
    discrepancies = []
    
    # Custom mapping for Wikipedia EN titles
    en_title_map = {
        "Bediüzzaman Said Nursi": "Said Nursî",
        "Baybars": "Baibars",
        "Saadi Shirazi": "Saadi Shirazi",
        "Sargon of Akkad": "Sargon of Akkad",
        "Shapur I": "Shapur I",
        "Selim III": "Selim III",
        "Abbas I of Persia": "Abbas the Great",
        "Ashurbanipal": "Ashurbanipal",
        "Ahmed Shawqi": "Ahmed Shawqi",
        "Ahmed Cevdet Pasha": "Ahmed Cevdet Pasha",
        "Rhazes (Al-Razi)": "Abu Bakr al-Razi",
        "Al-Ma'mun": "Al-Ma'mun",
        "Al-Masudi": "Al-Masudi",
        "Al-Battani": "Al-Battani",
        "Al-Jahiz": "Al-Jahiz",
        "Al-Kindi": "Al-Kindi",
        "Al-Tabari": "Al-Tabari",
        "Alp Arslan": "Alp Arslan",
        "Evliya Çelebi": "Evliya Çelebi",
        "Ibrahim Muteferrika": "Ibrahim Muteferrika",
        "Ibrahim Pasha of Egypt": "Ibrahim Pasha of Egypt",
        "Averroes (Ibn Rushd)": "Averroes",
        "Avicenna (Ibn Sina)": "Avicenna",
        "Ibn Arabi": "Ibn Arabi",
        "Ismail I": "Ismail I",
        "Zarathushtra": "Zoroaster",
        "Jamal al-Din al-Afghani": "Jamāl al-Dīn al-Afghānī",
        "Jabir ibn Hayyan": "Jabir ibn Hayyan",
        "Ziya Gökalp": "Ziya Gökalp",
        "Karim Khan Zand": "Karim Khan Zand",
        "Katip Çelebi": "Kâtip Çelebi",
        "Xerxes I": "Xerxes I",
        "Thabit ibn Qurra": "Thābit ibn Qurra",
        "Tahirih": "Tahirih",
        "Fuzûlî": "Fuzuli (poet)",
        "Ferdowsi": "Ferdowsi",
        "Piri Reis": "Piri Reis",
        "Harun al-Rashid": "Harun al-Rashid",
        "Hafez": "Hafez",
        "Halide Edib Adıvar": "Halide Edib Adıvar",
        "Hammurabi": "Hammurabi",
        "Hurrem Sultan (Roxelana)": "Roxelana",
        "T. E. Lawrence": "T. E. Lawrence"
    }
    
    for giant in giants:
        en_name = giant['nameEn']
        print(f"Processing {en_name}...")
        
        search_title = en_title_map.get(en_name, en_name)
        
        qid = get_wikidata_id(search_title)
            
        if not qid:
            print(f"Could not find Wikidata ID for {en_name} (search: {search_title})")
            continue
            
        wiki_titles = get_wikipedia_titles(qid)
        
        for lang, local_name in giant['names'].items():
            wiki_lang = lang
            if wiki_lang == 'zh':
                # Chinese Wikipedia might use 'zh', 'zh-hans', 'zh-hant', etc.
                pass
            
            wiki_title = wiki_titles.get(wiki_lang)
            if not wiki_title and wiki_lang == 'zh':
                wiki_title = wiki_titles.get('zh-hans') or wiki_titles.get('zh-hant') or wiki_titles.get('zh-cn')
                
            if wiki_title:
                # sometimes wikipedia has (poet) or similar disambiguation, we don't always need exact match if it's identical before parentheses, but let's record it and we can filter.
                if local_name != wiki_title:
                    discrepancies.append({
                        "slug": giant['slug'],
                        "locale": lang,
                        "localName": local_name,
                        "correctName": wiki_title
                    })
        time.sleep(0.1)
        
    with open('name_discrepancies_final_batch_10.json', 'w', encoding='utf-8') as f:
        json.dump(discrepancies, f, ensure_ascii=False, indent=2)
    print("Done")

if __name__ == '__main__':
    main()
