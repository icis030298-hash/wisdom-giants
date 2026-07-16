import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

def translate_to_pl(text):
    if not text:
        return text
    try:
        translator = GoogleTranslator(source='auto', target='pl')
        return translator.translate(text)
    except Exception as e:
        print(f"Error translating: {text[:30]}... {e}")
        time.sleep(1)
        return text

def translate_item(item, key):
    if key in item:
        item[key] = translate_to_pl(item[key])

with open("scratch/task3_pl_chunk_3.json", "r", encoding="utf-8") as f:
    data = json.load(f)

tasks = []

with ThreadPoolExecutor(max_workers=20) as executor:
    for person, person_data in data.items():
        if "timeline" in person_data:
            for item in person_data["timeline"]:
                tasks.append(executor.submit(translate_item, item, "event"))
        if "keyAchievements" in person_data:
            for item in person_data["keyAchievements"]:
                tasks.append(executor.submit(translate_item, item, "title"))
                tasks.append(executor.submit(translate_item, item, "description"))
        if "faq" in person_data:
            for item in person_data["faq"]:
                tasks.append(executor.submit(translate_item, item, "question"))
                tasks.append(executor.submit(translate_item, item, "answer"))
    
    for i, future in enumerate(as_completed(tasks)):
        future.result()
        if (i+1) % 50 == 0:
            print(f"Translated {i+1} items")

with open("scratch/task3_pl_out_3.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Translation completed.")
