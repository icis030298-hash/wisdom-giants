import json
from concurrent.futures import ThreadPoolExecutor
from deep_translator import GoogleTranslator

def translate_text(text):
    if not text: return text
    try:
        return GoogleTranslator(source='en', target='id').translate(text)
    except Exception as e:
        print(f"Error translating: {text[:20]}... : {e}")
        try:
            return GoogleTranslator(source='en', target='id').translate(text)
        except:
            return text

with open("scratch/task3_id_retry_chunk_1.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Collect all texts to translate
to_translate = []
for person, content in data.items():
    for item in content.get("timeline", []):
        if "event" in item:
            to_translate.append((item, "event"))
    for item in content.get("keyAchievements", []):
        if "title" in item:
            to_translate.append((item, "title"))
        if "description" in item:
            to_translate.append((item, "description"))
    for item in content.get("faq", []):
        if "question" in item:
            to_translate.append((item, "question"))
        if "answer" in item:
            to_translate.append((item, "answer"))

print(f"Found {len(to_translate)} items to translate.")

def worker(task):
    item, key = task
    item[key] = translate_text(item[key])

with ThreadPoolExecutor(max_workers=20) as executor:
    executor.map(worker, to_translate)

with open("scratch/task3_id_retry_out_1.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done fast")
