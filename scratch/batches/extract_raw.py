import json, os

os.makedirs('scratch/batches/temp_raw', exist_ok=True)

with open('scratch/batches/in_fa_b2.json', 'r', encoding='utf-8') as f:
    b2 = json.load(f)

with open('scratch/batches/in_fa_b3.json', 'r', encoding='utf-8') as f:
    b3 = json.load(f)

for i, x in enumerate(b2):
    with open(f'scratch/batches/temp_raw/b2_{i}_{x["slug"]}.json', 'w', encoding='utf-8') as out:
        json.dump(x, out, ensure_ascii=False, indent=2)

for i, x in enumerate(b3):
    with open(f'scratch/batches/temp_raw/b3_{i}_{x["slug"]}.json', 'w', encoding='utf-8') as out:
        json.dump(x, out, ensure_ascii=False, indent=2)

print('Unpacked all items to scratch/batches/temp_raw/')
