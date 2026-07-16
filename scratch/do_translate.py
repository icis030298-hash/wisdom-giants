import json
import time
from deep_translator import GoogleTranslator

def translate_text(text):
    if not text: return text
    try:
        time.sleep(0.05)
        return GoogleTranslator(source='en', target='id').translate(text)
    except Exception as e:
        print(f"Error translating: {text[:20]}... : {e}")
        # Try once more
        try:
            time.sleep(1)
            return GoogleTranslator(source='en', target='id').translate(text)
        except Exception as e2:
            return text

with open("scratch/task3_id_retry_chunk_1.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for person, content in data.items():
    print(f"Translating {person}...")
    for item in content.get("timeline", []):
        if "event" in item:
            item["event"] = translate_text(item["event"])
    for item in content.get("keyAchievements", []):
        if "title" in item:
            item["title"] = translate_text(item["title"])
        if "description" in item:
            item["description"] = translate_text(item["description"])
    for item in content.get("faq", []):
        if "question" in item:
            item["question"] = translate_text(item["question"])
        if "answer" in item:
            item["answer"] = translate_text(item["answer"])

with open("scratch/task3_id_retry_out_1.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done")
