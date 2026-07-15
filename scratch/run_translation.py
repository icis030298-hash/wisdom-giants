import json
import time
import sys
import os
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

    for giant_id, giant in data.items():
        if giant.get('translated', False):
            continue
            
        print(f"Translating {giant_id}...", flush=True)
        
        if 'timeline' in giant:
            for t in giant['timeline']:
                if 'year_ha' not in t:
                    t['year'] = trans(t.get('year', ''))
                    t['event'] = trans(t.get('event', ''))
                    t['year_ha'] = True
                
        if 'keyAchievements' in giant:
            for a in giant['keyAchievements']:
                if 'title_ha' not in a:
                    a['title'] = trans(a.get('title', ''))
                    a['description'] = trans(a.get('description', ''))
                    a['title_ha'] = True
                
        if 'fact_box' in giant:
            fb = giant['fact_box']
            if 'one_line_summary_ha' not in fb:
                if 'one_line_summary' in fb:
                    fb['one_line_summary'] = trans(fb['one_line_summary'])
                if 'key_achievements' in fb:
                    for idx, ka in enumerate(fb['key_achievements']):
                        if isinstance(ka, dict):
                            if 'title' in ka: ka['title'] = trans(ka['title'])
                            if 'description' in ka: ka['description'] = trans(ka['description'])
                        elif isinstance(ka, str):
                            fb['key_achievements'][idx] = trans(ka)
                if 'legacy_statement' in fb:
                    fb['legacy_statement'] = trans(fb['legacy_statement'])
                fb['one_line_summary_ha'] = True
        
        giant['translated'] = True
        
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    print("Done", flush=True)

if __name__ == '__main__':
    main()
