import json
import time
import re
from googletrans import Translator

translator = Translator()

def has_korean(text):
    if not isinstance(text, str): return False
    return bool(re.search(r'[\uac00-\ud7a3]', text))

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    if text.strip() == "":
        return text
    try:
        translated = translator.translate(text, src='ko', dest='zh-cn')
        return translated.text
    except Exception as e:
        time.sleep(2)
        try:
            translated = translator.translate(text, src='ko', dest='zh-cn')
            return translated.text
        except Exception as e2:
            print(f"Error translating {text}: {e2}")
            return text

with open("scratch/zh_agent_1_out.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for giant, content in data.items():
    if "timeline" in content:
        for item in content["timeline"]:
            if "year" in item and has_korean(item["year"]):
                item["year"] = translate_text(item["year"])
            if "event" in item and has_korean(item["event"]):
                item["event"] = translate_text(item["event"])
    if "keyAchievements" in content:
        for item in content["keyAchievements"]:
            if "title" in item and has_korean(item["title"]):
                item["title"] = translate_text(item["title"])
            if "description" in item and has_korean(item["description"]):
                item["description"] = translate_text(item["description"])
    if "faq" in content:
        for item in content["faq"]:
            if "question" in item and has_korean(item["question"]):
                item["question"] = translate_text(item["question"])
            if "answer" in item and has_korean(item["answer"]):
                item["answer"] = translate_text(item["answer"])
    if "missingDataNote" in content:
        item_val = content["missingDataNote"]
        if isinstance(item_val, str) and has_korean(item_val):
            content["missingDataNote"] = translate_text(item_val)
    if "fact_box" in content:
        for key in ["one_line_summary", "legacy_statement"]:
            if key in content["fact_box"] and has_korean(content["fact_box"][key]):
                content["fact_box"][key] = translate_text(content["fact_box"][key])
        if "key_achievements" in content["fact_box"]:
            for item in content["fact_box"]["key_achievements"]:
                if "title" in item and has_korean(item["title"]):
                    item["title"] = translate_text(item["title"])
                if "description" in item and has_korean(item["description"]):
                    item["description"] = translate_text(item["description"])

with open("scratch/zh_agent_1_out.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Retry translation completed successfully!", flush=True)
