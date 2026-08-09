import json
import urllib.request
import urllib.parse
import time

def check_wikipedia(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=info&titles={urllib.parse.quote(title)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                pages = data.get('query', {}).get('pages', {})
                for page_id in pages:
                    if page_id == "-1":
                        return False
                    return True
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(2)
                continue
            print(f"Error checking {title.encode('ascii', 'ignore').decode()}: {e}")
            return False
        except Exception as e:
            print(f"Error checking {title.encode('ascii', 'ignore').decode()}: {e}")
            return False
    return False

def get_redirect(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&redirects=1&titles={urllib.parse.quote(title)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                redirects = data.get('query', {}).get('redirects', [])
                if redirects:
                    return redirects[0]['to']
                return None
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(2)
                continue
            return None
        except Exception:
            return None
    return None

def main():
    with open('scratch/candidates_500_roster.json', 'r', encoding='utf-8') as f:
        candidates = json.load(f)

    missing = []
    redirected = []
    valid = []
    
    print("Verifying 500 names against Wikipedia...")
    
    for i, c in enumerate(candidates):
        name_en = c['nameEn']
        if i % 50 == 0:
            print(f"Checking {i}/500...")
        
        # Check if exists
        exists = check_wikipedia(name_en)
        if not exists:
            # Try to see if it redirects
            redirect = get_redirect(name_en)
            if redirect:
                c['nameEn'] = redirect
                redirected.append((name_en, redirect))
                valid.append(c)
            else:
                missing.append(c)
        else:
            valid.append(c)
            
        time.sleep(0.1)
        
    print("\n--- Name Verification Report ---")
    print(f"Total checked: {len(candidates)}")
    print(f"Valid direct matches: {len(valid) - len(redirected)}")
    print(f"Redirects found & updated: {len(redirected)}")
    print(f"Missing / Not Found: {len(missing)}")
    
    with open('scratch/candidates_500_roster_verified.json', 'w', encoding='utf-8') as f:
        json.dump(valid, f, ensure_ascii=False, indent=2)
        
    if redirected:
        with open('scratch/candidates_500_redirects.txt', 'w', encoding='utf-8') as f:
            for old, new in redirected:
                f.write(f"{old} -> {new}\n")
                
    if missing:
        with open('scratch/candidates_500_missing.json', 'w', encoding='utf-8') as f:
            json.dump(missing, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
