import json
import time
from deep_translator import GoogleTranslator

def translate_fast(texts, target='pl'):
    translator = GoogleTranslator(source='auto', target=target)
    results = []
    
    current_chunk = []
    current_len = 0
    chunks = []
    
    for text in texts:
        text_clean = text.replace('|||', '') 
        added_len = len(text_clean) + 5
        if current_len + added_len > 2500:
            chunks.append(current_chunk)
            current_chunk = [text_clean]
            current_len = added_len
        else:
            current_chunk.append(text_clean)
            current_len += added_len
            
    if current_chunk:
        chunks.append(current_chunk)
        
    print(f"Divided into {len(chunks)} chunks.", flush=True)
    
    for i, chunk in enumerate(chunks):
        print(f"Translating chunk {i+1}/{len(chunks)}...", flush=True)
        combined = " ||| ".join(chunk)
        try:
            res = translator.translate(combined)
            parts = res.split("|||")
            parts = [p.strip() for p in parts]
            if len(parts) == len(chunk):
                results.extend(parts)
            else:
                print(f"Mismatch in split: expected {len(chunk)}, got {len(parts)}. Falling back to one-by-one...", flush=True)
                for t in chunk:
                    try:
                        results.append(translator.translate(t))
                    except:
                        results.append(t)
        except Exception as e:
            print(f"Error, falling back... {e}", flush=True)
            for t in chunk:
                try:
                    results.append(translator.translate(t))
                except Exception:
                    results.append(t)
        time.sleep(1)
        
    return results

def main():
    with open('scratch/task3_pl_chunk_0.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    texts_to_translate = []
    pointers = []
    
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
                    
    print(f"Total texts to translate: {len(texts_to_translate)}", flush=True)
    translated_texts = translate_fast(texts_to_translate, target='pl')
    
    for ptr, translated in zip(pointers, translated_texts):
        giant_key, section, idx, field = ptr
        data[giant_key][section][idx][field] = translated
        
    with open('scratch/task3_pl_out_0.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Done", flush=True)

if __name__ == '__main__':
    main()
