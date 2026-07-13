import json
import codecs

data_path = 'c:/Users/natey/Desktop/wisdom-giants/scratch/t2-p2-chunk-3.json'
out_path = 'c:/Users/natey/Desktop/wisdom-giants/scratch/t2-p2-out-3.json'
trans_path = 'c:/Users/natey/Desktop/wisdom-giants/scratch/translations.json'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(trans_path, 'r', encoding='utf-8') as f:
    translations = json.load(f)

out_data = []
for i, task in enumerate(data):
    if i < len(translations):
        new_task = dict(task)
        t_list = []
        for j, event_obj in enumerate(task['originalEn']):
            t_str = translations[i][j] if j < len(translations[i]) else event_obj['event']
            t_list.append({'year': event_obj['year'], 'event': t_str})
        new_task['translated'] = t_list
        out_data.append(new_task)

with codecs.open(out_path, 'w', 'utf-8') as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("Assembly complete.")
