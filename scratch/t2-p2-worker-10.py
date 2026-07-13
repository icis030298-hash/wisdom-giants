import json
import os
import time
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from deep_translator import GoogleTranslator

def translate_item(item, max_retries=3):
    loc = item['loc']
    target_loc = loc
    # map any specific loc codes if deep_translator requires it
    # 'id' is standard, 'vi' is standard, etc.
    
    translator = GoogleTranslator(source='auto', target=target_loc)
    
    typ = item['type']
    orig = item['originalEn']
    
    for attempt in range(max_retries):
        try:
            if typ == 'fact-layer':
                translated = []
                for ev in orig:
                    if len(ev['year'].strip()) == 0:
                        y_trans = ev['year']
                    elif ev['year'].isdigit():
                        y_trans = ev['year']
                    else:
                        y_trans = translator.translate(ev['year'])
                    
                    e_trans = translator.translate(ev['event']) if ev['event'].strip() else ev['event']
                    translated.append({'year': y_trans, 'event': e_trans})
                
                return translated
            else:
                # narrative is a string, which might be long.
                # deep_translator limit is 5000 chars.
                if len(orig) <= 4900:
                    return translator.translate(orig)
                else:
                    # split by paragraph or sentences if needed.
                    # A simple approach: split by double newline.
                    parts = orig.split('\n\n')
                    translated_parts = []
                    for p in parts:
                        if not p.strip():
                            translated_parts.append(p)
                        else:
                            # if a single paragraph is > 4900 chars, split by sentences.
                            if len(p) > 4900:
                                subparts = [p[i:i+4900] for i in range(0, len(p), 4900)]
                                translated_parts.extend([translator.translate(sp) for sp in subparts])
                            else:
                                translated_parts.append(translator.translate(p))
                    return '\n\n'.join(translated_parts)
                    
        except Exception as e:
            print(f"Error on attempt {attempt+1}: {e}")
            time.sleep(2)
            
    print(f"Failed to translate task {item.get('taskId', 'unknown')}")
    return orig # fallback

def main():
    input_path = "scratch/t2-p2-chunk-10.json"
    output_path = "scratch/t2-p2-out-10.json"
    
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Total items: {len(data)}")
    
    out_data = []
    
    for i, item in enumerate(data):
        print(f"Translating item {i+1}/{len(data)} [loc: {item['loc']}, type: {item['type']}]")
        translated_content = translate_item(item)
        
        new_item = item.copy()
        new_item['translated'] = translated_content
        out_data.append(new_item)
        
        # Save every 20 items to not lose progress
        if (i + 1) % 20 == 0:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(out_data, f, ensure_ascii=False, indent=2)
            time.sleep(1) # throttle a bit to avoid ban
            
    # Final save
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(out_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully finished translating all items. Saved to {output_path}")

if __name__ == "__main__":
    main()
