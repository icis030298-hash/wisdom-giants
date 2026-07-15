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

def translate_batch(texts):
    if not texts:
        return []
    
    # We use a unique separator.
    separator = " |^| "
    combined = separator.join(texts)
    
    retries = 3
    for i in range(retries):
        try:
            translated = translator.translate(combined)
            if translated:
                translated = convert_digits_to_persian(translated)
                parts = [p.strip() for p in translated.split('|^|')]
                if len(parts) == len(texts):
                    return parts
                else:
                    # Fallback to translate individual if separator is messed up
                    print("Separator mismatch, falling back to individual...", flush=True)
                    break
        except Exception as e:
            print(f"Error translating batch: {e}", flush=True)
            time.sleep(3)
            
    # Fallback individual
    results = []
    for t in texts:
        if not t or not t.strip():
            results.append(t)
            continue
        success = False
        for i in range(3):
            try:
                res = translator.translate(t)
                results.append(convert_digits_to_persian(res))
                success = True
                break
            except:
                time.sleep(2)
        if not success:
            results.append(convert_digits_to_persian(t))
    return results

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
    
    texts_to_translate = []
    
    # Collect all strings
    if "timeline" in out_content:
        for item in out_content["timeline"]:
            if "year" in item: texts_to_translate.append(item["year"])
            if "event" in item: texts_to_translate.append(item["event"])
    if "keyAchievements" in out_content:
        for item in out_content["keyAchievements"]:
            if "title" in item: texts_to_translate.append(item["title"])
            if "description" in item: texts_to_translate.append(item["description"])
    if "faq" in out_content:
        for item in out_content["faq"]:
            if "question" in item: texts_to_translate.append(item["question"])
            if "answer" in item: texts_to_translate.append(item["answer"])
    if "missingDataNote" in out_content:
        if isinstance(out_content["missingDataNote"], str) and out_content["missingDataNote"].strip():
            texts_to_translate.append(out_content["missingDataNote"])
    if "fact_box" in out_content:
        for key in ["one_line_summary", "legacy_statement"]:
            if key in out_content["fact_box"]:
                texts_to_translate.append(out_content["fact_box"][key])
        if "key_achievements" in out_content["fact_box"]:
            for item in out_content["fact_box"]["key_achievements"]:
                if "title" in item: texts_to_translate.append(item["title"])
                if "description" in item: texts_to_translate.append(item["description"])

    # Batch translate in chunks of 10
    translated_texts = []
    chunk_size = 10
    for i in range(0, len(texts_to_translate), chunk_size):
        chunk = texts_to_translate[i:i+chunk_size]
        translated_texts.extend(translate_batch(chunk))

    # Re-assign translated texts
    idx = 0
    if "timeline" in out_content:
        for item in out_content["timeline"]:
            if "year" in item: item["year"] = translated_texts[idx]; idx+=1
            if "event" in item: item["event"] = translated_texts[idx]; idx+=1
    if "keyAchievements" in out_content:
        for item in out_content["keyAchievements"]:
            if "title" in item: item["title"] = translated_texts[idx]; idx+=1
            if "description" in item: item["description"] = translated_texts[idx]; idx+=1
    if "faq" in out_content:
        for item in out_content["faq"]:
            if "question" in item: item["question"] = translated_texts[idx]; idx+=1
            if "answer" in item: item["answer"] = translated_texts[idx]; idx+=1
    if "missingDataNote" in out_content:
        if isinstance(out_content["missingDataNote"], str) and out_content["missingDataNote"].strip():
            out_content["missingDataNote"] = translated_texts[idx]; idx+=1
    if "fact_box" in out_content:
        for key in ["one_line_summary", "legacy_statement"]:
            if key in out_content["fact_box"]:
                out_content["fact_box"][key] = translated_texts[idx]; idx+=1
        if "key_achievements" in out_content["fact_box"]:
            for item in out_content["fact_box"]["key_achievements"]:
                if "title" in item: item["title"] = translated_texts[idx]; idx+=1
                if "description" in item: item["description"] = translated_texts[idx]; idx+=1

    out_content["translated"] = True
    out_data[giant] = out_content
    
    with open("scratch/fa_agent_1_out.json", "w", encoding="utf-8") as f:
        json.dump(out_data, f, ensure_ascii=False, indent=2)

for giant in out_data:
    out_data[giant].pop("translated", None)

with open("scratch/fa_agent_1_out.json", "w", encoding="utf-8") as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("Translation completed successfully!", flush=True)
