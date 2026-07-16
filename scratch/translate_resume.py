import json
import time
import sys
from deep_translator import GoogleTranslator

def has_korean(text):
    return any("\uAC00" <= c <= "\uD7A3" for c in text)

def get_translatable_strings(data, strings_list, ref_list):
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, str):
                if k not in ['id', 'slug', 'sourceVerified'] and v.strip() != "":
                    if has_korean(v):
                        strings_list.append(v)
                        ref_list.append((data, k))
            else:
                get_translatable_strings(v, strings_list, ref_list)
    elif isinstance(data, list):
        for i in range(len(data)):
            v = data[i]
            if isinstance(v, str):
                if v.strip() != "":
                    if has_korean(v):
                        strings_list.append(v)
                        ref_list.append((data, i))
            else:
                get_translatable_strings(v, strings_list, ref_list)

def main():
    file_path = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_he_out_6.json"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    strings_list = []
    ref_list = []
    
    get_translatable_strings(data, strings_list, ref_list)
    
    print(f"Total strings left to translate: {len(strings_list)}")
    sys.stdout.flush()
    
    if len(strings_list) == 0:
        print("Nothing to translate!")
        return
        
    translator = GoogleTranslator(source='ko', target='iw')
    
    batch_size = 20
    for i in range(0, len(strings_list), batch_size):
        batch = strings_list[i:i+batch_size]
        print(f"Translating batch {i} to {i+len(batch)}...", flush=True)
        
        translated_strings = []
        try:
            res = translator.translate_batch(batch)
            translated_strings.extend(res)
        except Exception as e:
            msg = str(e).replace('?', '')
            print(f"Error in batch: {msg}", flush=True)
            # Try one by one
            for text in batch:
                try:
                    time.sleep(0.5)
                    res = translator.translate(text)
                    translated_strings.append(res)
                except Exception as e2:
                    msg2 = str(e2).replace('?', '')
                    print(f"Error single: {msg2}", flush=True)
                    translated_strings.append(text) # fallback
        
        # Incremental save
        for idx in range(len(batch)):
            parent, key = ref_list[i + idx]
            if len(translated_strings) > idx and translated_strings[idx] is not None:
                parent[key] = translated_strings[idx]
                
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        time.sleep(0.5)
        
    print("Done!", flush=True)

if __name__ == "__main__":
    main()
