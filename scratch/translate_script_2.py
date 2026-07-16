import json
import time
from googletrans import Translator

def translate_json(file_path, out_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    translator = Translator()
    
    # Keys to skip translation
    skip_keys = {'slug', 'id', 'sourceVerified'}
    
    def translate_value(val, key_context):
        if isinstance(val, str):
            if key_context in skip_keys:
                return val
            if not val.strip():
                return val
            try:
                time.sleep(0.05)
                # Translate from ko to he (googletrans uses 'he' or 'iw')
                res = translator.translate(val, src='ko', dest='he')
                return res.text
            except Exception as e:
                print(f"Error translating '{val}': {e}", flush=True)
                time.sleep(1)
                try:
                    res = translator.translate(val, src='ko', dest='he')
                    return res.text
                except Exception as e2:
                    print(f"Failed retry: {e2}", flush=True)
                    return val
        elif isinstance(val, dict):
            return {k: translate_value(v, k) for k, v in val.items()}
        elif isinstance(val, list):
            return [translate_value(item, key_context) for item in val]
        else:
            return val

    translated_data = {}
    total = len(data)
    for i, (giant_key, giant_data) in enumerate(data.items(), 1):
        print(f"Translating {i}/{total}: {giant_key}", flush=True)
        translated_data[giant_key] = translate_value(giant_data, '')
        
        # Save progress
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_in_0.json'
    out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_out_0.json'
    translate_json(in_file, out_file)
    print("Translation completed.", flush=True)
