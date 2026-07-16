import json
from deep_translator import GoogleTranslator
import time

def translate_to_hebrew(text):
    if not text or not isinstance(text, str):
        return text
    try:
        translated = GoogleTranslator(source='ko', target='iw').translate(text)
        return translated
    except Exception as e:
        print(f"Error translating {text}: {e}")
        time.sleep(1)
        return GoogleTranslator(source='ko', target='iw').translate(text)

def process_data(data):
    fields_to_translate = {
        'year', 'event', 'title', 'description', 'question', 'answer',
        'missingDataNote', 'name', 'occupation', 'nationality', 'short_description'
    }
    
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k in fields_to_translate and isinstance(v, str):
                new_data[k] = translate_to_hebrew(v)
            else:
                new_data[k] = process_data(v)
        return new_data
    elif isinstance(data, list):
        return [process_data(item) for item in data]
    else:
        return data

def main():
    in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_in_5.json'
    out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_he_out_5.json'
    
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print("Translating data...")
    translated_data = {}
    total = len(data)
    count = 0
    for key, value in data.items():
        count += 1
        print(f"Processing {count}/{total}: {key}")
        translated_data[key] = process_data(value)
        
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    print("Done!")

if __name__ == '__main__':
    main()
