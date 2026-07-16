import json
import time
from deep_translator import GoogleTranslator
import os

input_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_chunk_0.json"
output_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_out_0.json"

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

translator = GoogleTranslator(source='en', target='id')

def translate_batch(texts):
    if not texts:
        return []
    # Join with a unique separator
    separator = " |@@| "
    joined = separator.join(texts)
    
    if len(joined) > 4000:
        # Split into smaller batches
        mid = len(texts) // 2
        return translate_batch(texts[:mid]) + translate_batch(texts[mid:])
        
    try:
        translated_joined = translator.translate(joined)
        # Deep translator might sometimes remove spaces around separator or alter it.
        # So it's better to translate one by one or be very careful.
        # Let's try one by one with a small sleep to avoid complexity of separator destruction by Google.
    except Exception as e:
        print(f"Error during translation: {e}")
        time.sleep(5)
        return translate_batch(texts)
    
    return [t.strip() for t in translated_joined.split("|@@|")]

def translate_safely(text):
    if not text:
        return text
    try:
        res = translator.translate(text)
        return res
    except Exception as e:
        print(f"Error translating '{text[:30]}...': {e}")
        time.sleep(2)
        try:
            return translator.translate(text)
        except Exception as e:
            print("Failed again.")
            return text

# We will collect all strings to translate, then translate them in batches, then put them back.
strings_to_translate = []
paths = []

for giant_id, giant_data in data.items():
    if "timeline" in giant_data:
        for i, item in enumerate(giant_data["timeline"]):
            if "event" in item:
                strings_to_translate.append(item["event"])
                paths.append((giant_id, "timeline", i, "event"))
                
    if "keyAchievements" in giant_data:
        for i, item in enumerate(giant_data["keyAchievements"]):
            if "title" in item:
                strings_to_translate.append(item["title"])
                paths.append((giant_id, "keyAchievements", i, "title"))
            if "description" in item:
                strings_to_translate.append(item["description"])
                paths.append((giant_id, "keyAchievements", i, "description"))
                
    if "faq" in giant_data:
        for i, item in enumerate(giant_data["faq"]):
            if "question" in item:
                strings_to_translate.append(item["question"])
                paths.append((giant_id, "faq", i, "question"))
            if "answer" in item:
                strings_to_translate.append(item["answer"])
                paths.append((giant_id, "faq", i, "answer"))

print(f"Total strings to translate: {len(strings_to_translate)}")

translated_strings = []
batch_size = 50
for i in range(0, len(strings_to_translate), batch_size):
    batch = strings_to_translate[i:i+batch_size]
    print(f"Translating batch {i} to {i+len(batch)}...")
    
    # Simple batching via deep_translator translate_batch
    try:
        res = translator.translate_batch(batch)
        translated_strings.extend(res)
    except Exception as e:
        print(f"Batch translation failed: {e}. Falling back to 1-by-1.")
        for text in batch:
            translated_strings.append(translate_safely(text))
            
    time.sleep(1)

# Put back translated strings
for path, translated_text in zip(paths, translated_strings):
    giant_id, section, idx, field = path
    data[giant_id][section][idx][field] = translated_text

# Write to output file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation completed and saved.")
