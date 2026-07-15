import json
import time
from googletrans import Translator

translator = Translator()

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    if text.strip() == "":
        return text
    try:
        translated = translator.translate(text, src='ko', dest='ha')
        return translated.text
    except Exception as e:
        time.sleep(2)
        try:
            translated = translator.translate(text, src='ko', dest='ha')
            return translated.text
        except Exception as e2:
            print(f"Error translating {text}: {e2}")
            return text

with open("scratch/ha_agent_4.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for giant, content in data.items():
    print(f"Translating {giant}...", flush=True)
    if "timeline" in content:
        for item in content["timeline"]:
            if "year" in item:
                item["year"] = translate_text(item["year"])
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
    if "missingDataNote" in content:
        item_val = content["missingDataNote"]
        if isinstance(item_val, str) and item_val.strip():
            content["missingDataNote"] = translate_text(item_val)

with open("scratch/ha_agent_4_out.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation completed successfully!", flush=True)
