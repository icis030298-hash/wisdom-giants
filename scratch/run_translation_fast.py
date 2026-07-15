import json
import time
import sys
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

def trans(text):
    if not text:
        return text
    try:
        res = GoogleTranslator(source='ko', target='ha').translate(text)
        return res
    except Exception as e:
        print(f"Error translating: {text} - {e}", flush=True)
        return text

def main():
    print("Loading JSON...", flush=True)
    in_file = 'c:/Users/natey/Desktop/wisdom-giants/scratch/ha_agent_2.json'
    out_file = 'c:/Users/natey/Desktop/wisdom-giants/scratch/ha_agent_2_out.json'
    
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if os.path.exists(out_file):
        with open(out_file, 'r', encoding='utf-8') as f:
            out_data = json.load(f)
            data.update(out_data)

    def process_giant(giant_id, giant):
        if giant.get('translated', False):
            return giant_id, giant
            
        print(f"Translating {giant_id}...", flush=True)
        
        def trans_dict(d, k):
            d[k] = trans(d.get(k, ''))
            
        futures = []
        with ThreadPoolExecutor(max_workers=20) as executor:
            if 'timeline' in giant:
                for t in giant['timeline']:
                    if 'year_ha' not in t:
                        futures.append(executor.submit(trans_dict, t, 'year'))
                        futures.append(executor.submit(trans_dict, t, 'event'))
                        t['year_ha'] = True
                    
            if 'keyAchievements' in giant:
                for a in giant['keyAchievements']:
                    if 'title_ha' not in a:
                        futures.append(executor.submit(trans_dict, a, 'title'))
                        futures.append(executor.submit(trans_dict, a, 'description'))
                        a['title_ha'] = True
                    
        for future in as_completed(futures):
            future.result()
            
        giant['translated'] = True
        print(f"Finished {giant_id}", flush=True)
        return giant_id, giant

    for giant_id, giant in data.items():
        process_giant(giant_id, giant)
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    print("Done", flush=True)

if __name__ == '__main__':
    main()
