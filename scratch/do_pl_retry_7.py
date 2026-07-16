import json
from deep_translator import GoogleTranslator
import time

input_path = "c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task3_pl_retry_chunk_7.json"
output_path = "c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task3_pl_retry_out_7.json"

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translator = GoogleTranslator(source='en', target='pl')

def translate_text(text):
    if not text:
        return text
    try:
        return translator.translate(text)
    except Exception as e:
        print(f"Error translating: {text[:30]}... - {e}")
        time.sleep(1)
        try:
            return translator.translate(text)
        except:
            return text

for person, content in data.items():
    print(f"Translating {person}...")
    if "timeline" in content:
        for item in content["timeline"]:
            if "event" in item:
                item["event"] = translate_text(item["event"])
    if "keyAchievements" in content:
        for item in content["keyAchievements"]:
            if "title" in item:
                item["title"] = translate_text(item["title"])
            if "description" in item:
                item["description"] = translate_text(item["description"])
    if "faq" in content:
        for item in content["faq"]:
            if "question" in item:
                item["question"] = translate_text(item["question"])
            if "answer" in item:
                item["answer"] = translate_text(item["answer"])

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation completed successfully.")
