import json
import time
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

with open("scratch/task3_pl_chunk_3.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for person, person_data in data.items():
    if "timeline" in person_data:
        for item in person_data["timeline"]:
            if "event" in item:
                item["event"] = translate_to_pl(item["event"])
    if "keyAchievements" in person_data:
        for item in person_data["keyAchievements"]:
            if "title" in item:
                item["title"] = translate_to_pl(item["title"])
            if "description" in item:
                item["description"] = translate_to_pl(item["description"])
    if "faq" in person_data:
        for item in person_data["faq"]:
            if "question" in item:
                item["question"] = translate_to_pl(item["question"])
            if "answer" in item:
                item["answer"] = translate_to_pl(item["answer"])

with open("scratch/task3_pl_out_3.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Translation completed.")
