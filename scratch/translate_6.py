import json
import time
from deep_translator import GoogleTranslator

def translate_text(text, translator, retries=3):
    if not isinstance(text, str):
        return text
    if not text.strip():
        return text
    for i in range(retries):
        try:
            return translator.translate(text)
        except Exception as e:
            time.sleep(1)
    return text

def process_dict(d, translator):
    if isinstance(d, dict):
        new_d = {}
        for k, v in d.items():
            if k in ['slug', 'id', 'sourceVerified']:
                new_d[k] = v
            else:
                new_d[k] = process_dict(v, translator)
        return new_d
    elif isinstance(d, list):
        return [process_dict(item, translator) for item in d]
    elif isinstance(d, str):
        return translate_text(d, translator)
    else:
        return d

if __name__ == '__main__':
    in_file = r'c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_in_6.json'
    out_file = r'c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_out_6.json'
    
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    translator = GoogleTranslator(source='auto', target='vi')
    translated_data = process_dict(data, translator)
    
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print('Translation complete.')
