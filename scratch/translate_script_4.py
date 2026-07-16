import json
import time
import urllib.request
import urllib.parse
import os

def translate_batch(texts, target_lang='iw'):
    if not texts: return []
    # Join with a delimiter that Google Translate preserves
    delimiter = "\n_^_^\n"
    combined_text = delimiter.join(texts)
    
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        'client': 'gtx',
        'sl': 'ko',
        'tl': target_lang,
        'dt': 't',
        'q': combined_text
    }
    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"
    
    req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
                translated_combined = "".join([x[0] for x in result[0] if x[0]])
                
                # Split back by delimiter. The API might add spaces around it, so strip.
                translated_texts = [t.strip() for t in translated_combined.split("_ ^ _ ^")]
                if len(translated_texts) != len(texts):
                    # Try another split if spacing is weird
                    translated_texts = [t.strip() for t in translated_combined.split("_^_^")]
                    
                if len(translated_texts) == len(texts):
                    return translated_texts
                else:
                    print(f"Batch mismatch! Expected {len(texts)}, got {len(translated_texts)}", flush=True)
                    # Fallback: translate one by one
                    return [translate_single(t, target_lang) for t in texts]
        except Exception as e:
            print(f"Batch error: {e}", flush=True)
            time.sleep(2 + attempt)
    return [translate_single(t, target_lang) for t in texts]

def translate_single(text, target_lang='iw'):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        'client': 'gtx',
        'sl': 'ko',
        'tl': target_lang,
        'dt': 't',
        'q': text
    }
    req = urllib.request.Request(f"{url}?{urllib.parse.urlencode(params)}", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode('utf-8'))
            return "".join([x[0] for x in result[0] if x[0]])
    except:
        return text

def translate_json(file_path, out_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    skip_keys = {'slug', 'id', 'sourceVerified'}
    
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
            continue
            
        print(f"Translating {i}/{total}: {giant_key}", flush=True)
        
        # Extract strings
        strings_to_translate = []
        
        def extract_strings(val, key_context):
            if isinstance(val, str):
                if key_context in skip_keys or not val.strip():
                    return
                strings_to_translate.append(val)
            elif isinstance(val, dict):
                for k, v in val.items():
                    extract_strings(v, k)
            elif isinstance(val, list):
                for item in val:
                    extract_strings(item, key_context)
                    
        extract_strings(giant_data, '')
        
        # Translate batch
        translated_strings = translate_batch(strings_to_translate)
        
        # Restore strings
        idx = [0]
        def restore_strings(val, key_context):
            if isinstance(val, str):
                if key_context in skip_keys or not val.strip():
                    return val
                res = translated_strings[idx[0]]
                idx[0] += 1
                return res
            elif isinstance(val, dict):
                return {k: restore_strings(v, k) for k, v in val.items()}
            elif isinstance(val, list):
                return [restore_strings(item, key_context) for item in val]
            else:
                return val

        translated_data[giant_key] = restore_strings(giant_data, '')
        
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_in_0.json'
    out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_out_0.json'
    translate_json(in_file, out_file)
    print("Translation completed.", flush=True)
