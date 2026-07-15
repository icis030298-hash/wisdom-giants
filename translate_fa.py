import json
import time
import os
import re
from deep_translator import GoogleTranslator

def convert_digits_to_persian(text):
    if not isinstance(text, str):
        return text
    persian_digits = {'0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', 
                      '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'}
    for eng, per in persian_digits.items():
        text = text.replace(eng, per)
    return text

translator = GoogleTranslator(source='ko', target='fa')

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    if text.strip() == "":
        return text
    
    retries = 5
    for i in range(retries):
        try:
            translated = translator.translate(text)
            if translated:
                return convert_digits_to_persian(translated)
        except Exception as e:
            print(f"Error translating: {e}", flush=True)
            time.sleep(3)
    return convert_digits_to_persian(text)

print("Loading data...", flush=True)
with open("scratch/fa_agent_1.json", "r", encoding="utf-8") as f:
    data = json.load(f)

if os.path.exists("scratch/fa_agent_1_out.json"):
    try:
        with open("scratch/fa_agent_1_out.json", "r", encoding="utf-8") as f:
            out_data = json.load(f)
    except:
        out_data = {}
else:
    out_data = {}

for giant, content in data.items():
    if giant in out_data and out_data[giant].get("translated"):
        print(f"Skipping {giant}, already translated.", flush=True)
        continue
        
    print(f"Translating {giant}...", flush=True)
    out_content = json.loads(json.dumps(content))
    
    if "timeline" in out_content:
        for item in out_content["timeline"]:
            if "year" in item:
                item["year"] = translate_text(item["year"])
            if "event" in item:
                item["event"] = translate_text(item["event"])
    if "keyAchievements" in out_content:
        for item in out_content["keyAchievements"]:
            if "title" in item:
                item["title"] = translate_text(item["title"])
            if "description" in item:
                item["description"] = translate_text(item["description"])
    if "faq" in out_content:
        for item in out_content["faq"]:
            if "question" in item:
                item["question"] = translate_text(item["question"])
            if "answer" in item:
                item["answer"] = translate_text(item["answer"])
    if "missingDataNote" in out_content:
        item_val = out_content["missingDataNote"]
        if isinstance(item_val, str) and item_val.strip():
            out_content["missingDataNote"] = translate_text(item_val)
    if "fact_box" in out_content:
        for key in ["one_line_summary", "legacy_statement"]:
            if key in out_content["fact_box"]:
                out_content["fact_box"][key] = translate_text(out_content["fact_box"][key])
        if "key_achievements" in out_content["fact_box"]:
            for item in out_content["fact_box"]["key_achievements"]:
                if "title" in item:
                    item["title"] = translate_text(item["title"])
                if "description" in item:
                    item["description"] = translate_text(item["description"])
    
    out_content["translated"] = True
    out_data[giant] = out_content
    
    with open("scratch/fa_agent_1_out.json", "w", encoding="utf-8") as f:
        json.dump(out_data, f, ensure_ascii=False, indent=2)

for giant in out_data:
    out_data[giant].pop("translated", None)

with open("scratch/fa_agent_1_out.json", "w", encoding="utf-8") as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("Translation completed successfully!", flush=True)
