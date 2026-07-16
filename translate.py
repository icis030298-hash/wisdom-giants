import json
import time
from deep_translator import GoogleTranslator

def translate_texts(texts, target='pl'):
    translator = GoogleTranslator(source='auto', target=target)
    batch_size = 30
    results = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        translated = translator.translate_batch(batch)
        results.extend(translated)
        time.sleep(1)
    return results

def main():
    with open('scratch/task3_pl_chunk_0.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    texts_to_translate = []
    pointers = []
    
    # Collect texts
    for giant_key, giant_data in data.items():
        if 'timeline' in giant_data:
            for idx, item in enumerate(giant_data['timeline']):
                if 'event' in item:
                    texts_to_translate.append(item['event'])
                    pointers.append((giant_key, 'timeline', idx, 'event'))
        if 'keyAchievements' in giant_data:
            for idx, item in enumerate(giant_data['keyAchievements']):
                if 'title' in item:
                    texts_to_translate.append(item['title'])
                    pointers.append((giant_key, 'keyAchievements', idx, 'title'))
                if 'description' in item:
                    texts_to_translate.append(item['description'])
                    pointers.append((giant_key, 'keyAchievements', idx, 'description'))
        if 'faq' in giant_data:
            for idx, item in enumerate(giant_data['faq']):
                if 'question' in item:
                    texts_to_translate.append(item['question'])
                    pointers.append((giant_key, 'faq', idx, 'question'))
                if 'answer' in item:
                    texts_to_translate.append(item['answer'])
                    pointers.append((giant_key, 'faq', idx, 'answer'))
                    
    print(f"Total texts to translate: {len(texts_to_translate)}")
    translated_texts = translate_texts(texts_to_translate, target='pl')
    
    # Put back
    for ptr, translated in zip(pointers, translated_texts):
        giant_key, section, idx, field = ptr
        data[giant_key][section][idx][field] = translated
        
    with open('scratch/task3_pl_out_0.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Done")

if __name__ == '__main__':
    main()
