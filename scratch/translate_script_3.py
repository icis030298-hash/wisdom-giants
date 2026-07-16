import json
import time
import urllib.request
import urllib.parse
import os

def translate_text(text, target_lang='iw'):
    if not text or not text.strip(): return text
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        'client': 'gtx',
        'sl': 'ko',
        'tl': target_lang,
        'dt': 't',
        'q': text
    }
    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"
    
    req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode('utf-8'))
            return "".join([x[0] for x in result[0]])
    except Exception as e:
        print(f"Error translating '{text}': {e}", flush=True)
        return None

def translate_json(file_path, out_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    skip_keys = {'slug', 'id', 'sourceVerified'}
    
    # Load existing to resume
    translated_data = {}
    if os.path.exists(out_path):
        with open(out_path, 'r', encoding='utf-8') as f:
            try:
                translated_data = json.load(f)
            except:
                pass

    total = len(data)
    for i, (giant_key, giant_data) in enumerate(data.items(), 1):
        if giant_key in translated_data:
            print(f"Skipping {i}/{total}: {giant_key} (already done)", flush=True)
            continue
            
        print(f"Translating {i}/{total}: {giant_key}", flush=True)
        
        def translate_value(val, key_context):
            if isinstance(val, str):
                if key_context in skip_keys:
                    return val
                if not val.strip():
                    return val
                
                # Retry loop
                for attempt in range(5):
                    res = translate_text(val)
                    if res is not None:
                        time.sleep(0.05)
                        return res
                    time.sleep(1 + attempt * 2)
                print(f"Failed to translate completely: {val}", flush=True)
                return val
            elif isinstance(val, dict):
                return {k: translate_value(v, k) for k, v in val.items()}
            elif isinstance(val, list):
                return [translate_value(item, key_context) for item in val]
            else:
                return val

        translated_data[giant_key] = translate_value(giant_data, '')
        
        # Save progress incrementally
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_in_0.json'
    out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_out_0.json'
    translate_json(in_file, out_file)
    print("Translation completed.", flush=True)
