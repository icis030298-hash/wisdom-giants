import json, sys

sys.stdout.reconfigure(encoding='utf-8')

in_data = json.load(open('scratch/batches/in_hi_b8.json', encoding='utf-8'))
out_data = json.load(open('scratch/batches/out_hi_b8.json', encoding='utf-8'))

print('Input count:', len(in_data))
print('Output count:', len(out_data))

for idx, (in_item, out_item) in enumerate(zip(in_data, out_data)):
    assert in_item['slug'] == out_item['slug'], f"Slug mismatch at {idx}"
    assert out_item['locale'] == 'hi', f"Locale mismatch at {idx}"
    assert set(out_item.keys()) == {'slug', 'locale', 'title', 'description', 'content'}, f"Keys mismatch at {idx}"
    print(f"Item {idx}: OK | slug={out_item['slug']} | title={out_item['title'][:40]}")

print("ALL 10 ITEMS VERIFIED PERFECTLY!")
