import json
import time
import os
from deep_translator import GoogleTranslator

input_path = os.path.join("scratch", "task3_id_chunk_2.json")
output_path = os.path.join("scratch", "task3_id_out_2.json")

print(f"Reading from {input_path}")
with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

keys_to_translate = {'event', 'title', 'description', 'question', 'answer'}
strings_to_translate = set()

def extract_strings(node):
    if isinstance(node, dict):
        for k, v in node.items():
            if k in keys_to_translate and isinstance(v, str):
                strings_to_translate.add(v)
            else:
                extract_strings(v)
    elif isinstance(node, list):
        for item in node:
            extract_strings(item)

extract_strings(data)
strings_to_translate = list(strings_to_translate)
print(f"Found {len(strings_to_translate)} unique strings to translate.")

translator = GoogleTranslator(source='en', target='id')
translated_map = {}

batch_size = 20
for i in range(0, len(strings_to_translate), batch_size):
    batch = strings_to_translate[i:i+batch_size]
    print(f"Translating batch {i//batch_size + 1}/{len(strings_to_translate)//batch_size + 1}...")
    try:
        res = translator.translate_batch(batch)
        for original, translated in zip(batch, res):
            translated_map[original] = translated
        time.sleep(1)
    except Exception as e:
        print(f"Batch error: {e}. Trying individually...")
        for s in batch:
            for attempt in range(3):
                try:
                    res = translator.translate(s)
                    translated_map[s] = res
                    time.sleep(0.5)
                    break
                except Exception as ex:
                    if attempt == 2:
                        print(f"Failed completely on '{s}'")
                        translated_map[s] = s
                    else:
                        print(f"Error on '{s}': {ex}. Retrying...")
                        time.sleep(1)

def apply_translations(node):
    if isinstance(node, dict):
        new_node = {}
        for k, v in node.items():
            if k in keys_to_translate and isinstance(v, str):
                new_node[k] = translated_map.get(v, v)
            else:
                new_node[k] = apply_translations(v)
        return new_node
    elif isinstance(node, list):
        return [apply_translations(item) for item in node]
    else:
        return node

translated_data = apply_translations(data)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(translated_data, f, ensure_ascii=False, indent=2)

print("Done writing to", output_path)
