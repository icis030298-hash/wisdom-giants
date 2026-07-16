import json
import time
import sys
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor, as_completed

def translate_text(text):
    if not isinstance(text, str):
        return text
    if not text.strip():
        return text
    for _ in range(3):
        try:
            return GoogleTranslator(source='auto', target='vi').translate(text)
        except Exception as e:
            time.sleep(1)
    return text

def collect_strings(d, strings_set):
    if isinstance(d, dict):
        for k, v in d.items():
            if k not in ['slug', 'id', 'sourceVerified']:
                collect_strings(v, strings_set)
    elif isinstance(d, list):
        for item in d:
            collect_strings(item, strings_set)
    elif isinstance(d, str) and d.strip():
        strings_set.add(d)

def apply_translations(d, trans_map):
    if isinstance(d, dict):
        new_d = {}
        for k, v in d.items():
            if k in ['slug', 'id', 'sourceVerified']:
                new_d[k] = v
            else:
                new_d[k] = apply_translations(v, trans_map)
        return new_d
    elif isinstance(d, list):
        return [apply_translations(item, trans_map) for item in d]
    elif isinstance(d, str):
        if d.strip() in trans_map:
            return trans_map[d.strip()]
        return d
    else:
        return d

if __name__ == '__main__':
    in_file = r'c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_in_6.json'
    out_file = r'c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_out_6.json'
    
    print("Loading data...", flush=True)
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    strings_set = set()
    collect_strings(data, strings_set)
    
    unique_strings = list(strings_set)
    total = len(unique_strings)
    print(f"Found {total} unique strings to translate.", flush=True)
    
    trans_map = {}
    completed = 0
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_str = {executor.submit(translate_text, s): s for s in unique_strings}
        for future in as_completed(future_to_str):
            s = future_to_str[future]
            try:
                res = future.result()
                trans_map[s] = res
            except Exception as exc:
                print(f"{s!r} generated an exception: {exc}", flush=True)
                trans_map[s] = s
            completed += 1
            if completed % 10 == 0:
                print(f"Progress: {completed}/{total}", flush=True)
                
    print("Applying translations...", flush=True)
    translated_data = apply_translations(data, trans_map)
    
    print("Saving...", flush=True)
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print('Translation complete.', flush=True)
