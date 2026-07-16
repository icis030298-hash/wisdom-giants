import json
from deep_translator import GoogleTranslator
import time

translator = GoogleTranslator(source='auto', target='id')

def translate_text(text):
    if not text:
        return text
    try:
        time.sleep(0.1)
        return translator.translate(text)
    except Exception as e:
        print(f"Error translating: {text[:30]}... - {e}")
        return text

with open('scratch/task3_id_retry_chunk_0.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for person, person_data in data.items():
    print(f"Translating {person}...")
    if 'timeline' in person_data:
        for item in person_data['timeline']:
            if 'event' in item:
                item['event'] = translate_text(item['event'])
    if 'keyAchievements' in person_data:
        for item in person_data['keyAchievements']:
            if 'title' in item:
                item['title'] = translate_text(item['title'])
            if 'description' in item:
                item['description'] = translate_text(item['description'])
    if 'faq' in person_data:
        for item in person_data['faq']:
            if 'question' in item:
                item['question'] = translate_text(item['question'])
            if 'answer' in item:
                item['answer'] = translate_text(item['answer'])

with open('scratch/task3_id_retry_out_0.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done")
