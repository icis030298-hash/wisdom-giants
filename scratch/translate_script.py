import json
import time
from deep_translator import GoogleTranslator

translator = GoogleTranslator(source='auto', target='vi')

def translate_text(text):
    if not isinstance(text, str) or not text.strip():
        return text
    try:
        # sleep slightly to avoid rate limits if necessary, though deep_translator handles it decently
        time.sleep(0.1)
        res = translator.translate(text)
        return res
    except Exception as e:
        print(f"Error translating: {text[:20]}... Error: {e}")
        return text

def process_giant(data):
    if 'timeline' in data:
        for item in data['timeline']:
            if 'year' in item:
                item['year'] = translate_text(item['year'])
            if 'event' in item:
                item['event'] = translate_text(item['event'])
    
    if 'keyAchievements' in data:
        for item in data['keyAchievements']:
            if 'title' in item:
                item['title'] = translate_text(item['title'])
            if 'description' in item:
                item['description'] = translate_text(item['description'])
                
    if 'faq' in data:
        for item in data['faq']:
            if 'question' in item:
                item['question'] = translate_text(item['question'])
            if 'answer' in item:
                item['answer'] = translate_text(item['answer'])
                
    if 'missingDataNote' in data and isinstance(data['missingDataNote'], str):
        data['missingDataNote'] = translate_text(data['missingDataNote'])
        
    return data

def main():
    in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_vi_in_1.json'
    out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_vi_out_1.json'
    
    print("Loading data...")
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for k, v in data.items():
        print(f"Processing {k}...")
        data[k] = process_giant(v)

    print("Writing output...")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Translation completed successfully.")

if __name__ == '__main__':
    main()
