import json
import time
from deep_translator import GoogleTranslator

# Exclude keys from translation
EXCLUDE_KEYS = {"id", "slug", "sourceVerified"}

translator = GoogleTranslator(source='auto', target='vi')

def translate_text(text):
    if not isinstance(text, str) or not text.strip():
        return text
    # The translator might fail or hit limits, handle retries
    for attempt in range(5):
        try:
            res = translator.translate(text)
            if res is not None:
                return res
        except Exception as e:
            time.sleep(2)
    return text

def translate_json(data, current_key=None):
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            if k in EXCLUDE_KEYS:
                new_dict[k] = v
            else:
                new_dict[k] = translate_json(v, k)
        return new_dict
    elif isinstance(data, list):
        return [translate_json(item, current_key) for item in data]
    elif isinstance(data, str):
        return translate_text(data)
    else:
        return data

def main():
    in_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_in_4.json"
    out_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_out_4.json"
    
    print("Loading JSON...")
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print("Translating...")
    translated_data = translate_json(data)
    
    print("Saving JSON...")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print("Done!")

if __name__ == "__main__":
    main()
