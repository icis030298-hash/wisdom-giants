import json
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

translator = GoogleTranslator(source='ko', target='ha')

def translate(text):
    if not text:
        return text
    try:
        res = translator.translate(text)
        return res
    except Exception as e:
        print("Error translating:", text, repr(e))
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

tasks = []

# Collect all tasks to be translated
for key, giant in data.items():
    if 'timeline' in giant:
        for item in giant['timeline']:
            if 'year' in item:
                tasks.append((item, 'year', translate_year, item['year']))
            if 'event' in item:
                tasks.append((item, 'event', translate, item['event']))
    if 'keyAchievements' in giant:
        for item in giant['keyAchievements']:
            if 'title' in item:
                tasks.append((item, 'title', translate, item['title']))
            if 'description' in item:
                tasks.append((item, 'description', translate, item['description']))
    if 'fact_box' in giant:
        if 'one_line_summary' in giant['fact_box']:
            tasks.append((giant['fact_box'], 'one_line_summary', translate, giant['fact_box']['one_line_summary']))
        if 'key_achievements' in giant['fact_box']:
            ka = giant['fact_box']['key_achievements']
            if isinstance(ka, list):
                if len(ka) > 0 and isinstance(ka[0], dict):
                    for item in ka:
                        if 'title' in item: tasks.append((item, 'title', translate, item['title']))
                        if 'description' in item: tasks.append((item, 'description', translate, item['description']))
                else:
                    # special case: we don't handle string lists concurrently in this simple structure
                    pass
            else:
                tasks.append((giant['fact_box'], 'key_achievements', translate, ka))
        if 'legacy_statement' in giant['fact_box']:
            tasks.append((giant['fact_box'], 'legacy_statement', translate, giant['fact_box']['legacy_statement']))

print(f"Total translation tasks: {len(tasks)}")

def run_task(task):
    obj, field, func, text = task
    res = func(text)
    return obj, field, res

with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(run_task, t) for t in tasks]
    for i, future in enumerate(as_completed(futures)):
        obj, field, res = future.result()
        obj[field] = res
        if (i+1) % 20 == 0:
            print(f"Completed {i+1}/{len(tasks)}")

with open('scratch/ha_agent_3_out.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done")
