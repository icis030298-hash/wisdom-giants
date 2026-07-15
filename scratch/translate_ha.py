import json
import time
import re
from deep_translator import GoogleTranslator

translator = GoogleTranslator(source='ko', target='ha')

def translate(text):
    if not text:
        return text
    try:
        res = translator.translate(text)
        time.sleep(0.05)
        return res
    except Exception as e:
        print("Error translating:", text, e)
        return text

def translate_year(text):
    m = re.match(r'^(\d+)년\s*(\d+)월\s*(\d+)일$', text)
    if m:
        months = ["Janairu", "Fabrairu", "Maris", "Afrilu", "Mayu", "Yuni", "Yuli", "Agusta", "Satumba", "Oktoba", "Nuwamba", "Disamba"]
        y, mo, d = m.groups()
        return f"{d} ga {months[int(mo)-1]}, {y}"
    
    m = re.match(r'^(\d+)년\s*(\d+)월$', text)
    if m:
        months = ["Janairu", "Fabrairu", "Maris", "Afrilu", "Mayu", "Yuni", "Yuli", "Agusta", "Satumba", "Oktoba", "Nuwamba", "Disamba"]
        y, mo = m.groups()
        return f"{months[int(mo)-1]} {y}"
        
    m = re.match(r'^(\d+)년$', text)
    if m:
        return f"Shekarar {m.group(1)}"
        
    m = re.match(r'^기원전\s*(\d+)년경$', text)
    if m:
        return f"Kusan shekarar {m.group(1)} K.Z."
        
    m = re.match(r'^기원전\s*(\d+)년$', text)
    if m:
        return f"Shekarar {m.group(1)} K.Z."
        
    return translate(text)

with open('scratch/ha_agent_3.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for key, giant in data.items():
    print(f"Translating {key}...")
    if 'timeline' in giant:
        for item in giant['timeline']:
            if 'year' in item:
                item['year'] = translate_year(item['year'])
            if 'event' in item:
                item['event'] = translate(item['event'])
    if 'keyAchievements' in giant:
        for item in giant['keyAchievements']:
            if 'title' in item:
                item['title'] = translate(item['title'])
            if 'description' in item:
                item['description'] = translate(item['description'])
    if 'fact_box' in giant:
        if 'one_line_summary' in giant['fact_box']:
            giant['fact_box']['one_line_summary'] = translate(giant['fact_box']['one_line_summary'])
        if 'key_achievements' in giant['fact_box']:
            ka = giant['fact_box']['key_achievements']
            if isinstance(ka, list):
                if len(ka) > 0 and isinstance(ka[0], dict):
                    for item in ka:
                        if 'title' in item: item['title'] = translate(item['title'])
                        if 'description' in item: item['description'] = translate(item['description'])
                else:
                    giant['fact_box']['key_achievements'] = [translate(x) for x in ka]
            else:
                giant['fact_box']['key_achievements'] = translate(ka)
        if 'legacy_statement' in giant['fact_box']:
            giant['fact_box']['legacy_statement'] = translate(giant['fact_box']['legacy_statement'])

with open('scratch/ha_agent_3_out.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done")
