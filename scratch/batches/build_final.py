# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

from items_part1 import item0, item1
from items_part2 import item2, item3
from items_part3 import item4, item5
from items_part4 import item6, item7, item8, item9

translated_items = [
    item0, item1, item2, item3, item4,
    item5, item6, item7, item8, item9
]

# Load original to verify slugs and count
with open('scratch/batches/in_th_b7.json', 'r', encoding='utf-8') as f:
    orig_data = json.load(f)

print(f"Original items count: {len(orig_data)}")
print(f"Translated items count: {len(translated_items)}")

assert len(orig_data) == len(translated_items), "Item counts do not match!"

for i in range(len(orig_data)):
    orig_slug = orig_data[i]['slug']
    trans_slug = translated_items[i]['slug']
    assert orig_slug == trans_slug, f"Slug mismatch at index {i}: {orig_slug} != {trans_slug}"
    assert translated_items[i]['locale'] == "th", f"Locale mismatch at index {i}"
    assert len(translated_items[i]['title']) > 0, f"Empty title at index {i}"
    assert len(translated_items[i]['description']) > 0, f"Empty description at index {i}"
    assert len(translated_items[i]['content']) > 0, f"Empty content at index {i}"

out_path = 'scratch/batches/out_th_b7.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(translated_items, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {out_path} with {len(translated_items)} translated items!")
