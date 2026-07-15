import json
import time
from deep_translator import GoogleTranslator

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    if text.strip() == "":
        return text
    try:
        translated = GoogleTranslator(source='ko', target='ha').translate(text)
        return translated
    except Exception as e:
        print(f"Error translating {text}: {e}")
        time.sleep(1) # wait and retry once
        try:
            return GoogleTranslator(source='ko', target='ha').translate(text)
        except:
            return text

with open("scratch/ha_agent_4.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for giant, content in data.items():
    print(f"Translating {giant}...")
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
    if "fact_box" in content:
        for key in ["one_line_summary", "legacy_statement"]:
            if key in content["fact_box"]:
                content["fact_box"][key] = translate_text(content["fact_box"][key])
        if "key_achievements" in content["fact_box"]:
            for item in content["fact_box"]["key_achievements"]:
                if "title" in item:
                    item["title"] = translate_text(item["title"])
                if "description" in item:
                    item["description"] = translate_text(item["description"])

with open("scratch/ha_agent_4_out.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation completed successfully!")
