import json
import os
import sys
import time
from deep_translator import GoogleTranslator

def translate_text(text, target_lang):
    if not text or not text.strip(): return text
    try:
        translator = GoogleTranslator(source='auto', target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Error translating: {e}")
        time.sleep(2) # Backoff
        try:
            translator = GoogleTranslator(source='auto', target=target_lang)
            return translator.translate(text)
        except Exception as e2:
            print(f"Failed again: {e2}")
            return text

def main():
    print("Loading t2-p2-chunk-8.json...")
    with open('t2-p2-chunk-8.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    total = len(data)
    print(f"Total items: {total}")

    for idx, d in enumerate(data):
        if idx % 10 == 0:
            print(f"Processing {idx}/{total}...")
            
        loc = d.get('loc')
        type_ = d.get('type')
        original = d.get('originalEn')
        
        if type_ == 'narrative' and isinstance(original, list):
            translated_list = []
            for o in original:
                q = o.get(f'quote_{loc}', o.get('quote_en', ''))
                m = o.get(f'meaning_{loc}', o.get('meaning_en', ''))
                translated_list.append({"quote": q, "meaning": m})
            d['translated'] = translated_list
        elif type_ == 'narrative' and isinstance(original, str):
            d['translated'] = translate_text(original, loc)
            time.sleep(0.05)
        elif type_ == 'fact-layer' and isinstance(original, list):
            translated_list = []
            for o in original:
                y = str(o.get('year', ''))
                e = str(o.get('event', ''))
                ty = translate_text(y, loc)
                time.sleep(0.05)
                te = translate_text(e, loc)
                time.sleep(0.05)
                translated_list.append({"year": ty, "event": te})
            d['translated'] = translated_list
        else:
            d['translated'] = original

    out_file = 't2-p2-out-8.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Done. Saved to {out_file}.")

if __name__ == '__main__':
    main()
