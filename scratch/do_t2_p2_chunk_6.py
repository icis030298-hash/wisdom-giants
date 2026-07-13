import json
import time
from deep_translator import GoogleTranslator

with open('scratch/t2-p2-chunk-6-small.json', 'r', encoding='utf-8') as f:
    tasks = json.load(f)

# Use dict to store a translator per locale
translators = {}

def get_translator(loc):
    if loc not in translators:
        translators[loc] = GoogleTranslator(source='en', target=loc)
    return translators[loc]

def translate_text(text, loc):
    if not text: return text
    try:
        return get_translator(loc).translate(text)
    except Exception as e:
        print(f"Error translating text: {e}")
        time.sleep(2)
        try:
            return get_translator(loc).translate(text)
        except:
            return text

count = 0
for t in tasks:
    loc = t['loc']
    if t['type'] == 'fact-layer':
        arr = t.get('originalEn', [])
        t['translated'] = []
        for item in arr:
            year = item.get('year', '')
            event = item.get('event', '')
            trans_year = translate_text(year, loc) if year else ''
            trans_event = translate_text(event, loc) if event else ''
            t['translated'].append({'year': trans_year, 'event': trans_event})
    
    elif t['type'] == 'narrative':
        original = t.get('originalEn')
        if isinstance(original, str):
            t['translated'] = translate_text(original, loc)
        elif isinstance(original, list):
            # It's an array of wisdom quotes
            translated_arr = []
            for item in original:
                quote = item.get('quote_en', '')
                meaning = item.get('meaning_en', '')
                t_quote = translate_text(quote, loc) if quote else ''
                t_meaning = translate_text(meaning, loc) if meaning else ''
                translated_arr.append({
                    'quote_en': quote,
                    'meaning_en': meaning,
                    f'quote_{loc}': t_quote,
                    f'meaning_{loc}': t_meaning
                })
            t['translated'] = translated_arr

    count += 1
    if count % 20 == 0:
        print(f"Processed {count} / {len(tasks)}")
        with open('scratch/t2-p2-out-6.json', 'w', encoding='utf-8') as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)

with open('scratch/t2-p2-out-6.json', 'w', encoding='utf-8') as f:
    json.dump(tasks, f, indent=2, ensure_ascii=False)

print("Done")
