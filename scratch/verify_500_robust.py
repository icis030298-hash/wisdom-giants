import json
import time
import requests
import urllib.parse

def check_wikipedia(session, title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=info&redirects=1&titles={urllib.parse.quote(title)}&format=json"
    
    for attempt in range(5):
        try:
            resp = session.get(url, timeout=5)
            if resp.status_code == 429:
                time.sleep(2)
                continue
            resp.raise_for_status()
            data = resp.json()
            
            pages = data.get('query', {}).get('pages', {})
            redirects = data.get('query', {}).get('redirects', [])
            
            redirect_target = None
            if redirects:
                redirect_target = redirects[0]['to']
            
            for page_id in pages:
                if page_id == "-1":
                    return False, None
                return True, redirect_target
        except Exception as e:
            time.sleep(1)
            
    return False, None

def main():
    print("Verifying 500 names using Python requests...")
    
    with open('scratch/candidates_500_roster.json', 'r', encoding='utf-8') as f:
        candidates = json.load(f)
        
    valid = []
    missing = []
    redirected = []
    
    session = requests.Session()
    session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0'})
    
    for i, c in enumerate(candidates):
        if i % 50 == 0:
            print(f"Checking {i}/500...")
            
        name_en = c['nameEn']
        exists, redirect = check_wikipedia(session, name_en)
        
        if exists:
            if redirect:
                c['nameEn'] = redirect
                redirected.append(f"{name_en} -> {redirect}")
            valid.append(c)
        else:
            missing.append(c)
            
        time.sleep(0.05) # 50ms delay
        
    print("\n--- Name Verification Report ---")
    print(f"Total checked: {len(candidates)}")
    print(f"Valid direct matches: {len(valid) - len(redirected)}")
    print(f"Redirects found & updated: {len(redirected)}")
    print(f"Missing / Not Found: {len(missing)}")
    
    with open('scratch/candidates_500_roster_verified.json', 'w', encoding='utf-8') as f:
        json.dump(valid, f, ensure_ascii=False, indent=2)
        
    if redirected:
        with open('scratch/candidates_500_redirects.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(redirected))
            
    if missing:
        with open('scratch/candidates_500_missing.json', 'w', encoding='utf-8') as f:
            json.dump(missing, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
