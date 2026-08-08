import json, os, sys

for name, p in [('b2', 'scratch/batches/out_fa_b2.json'), ('b3', 'scratch/batches/out_fa_b3.json')]:
    assert os.path.exists(p), f'{p} does not exist'
    with open(p, 'r', encoding='utf-8') as f:
        data = json.load(f)
    assert isinstance(data, list), f'{p} is not a list'
    assert len(data) == 10, f'{p} count is {len(data)}, expected 10'
    for idx, item in enumerate(data):
        expected_keys = {'slug', 'locale', 'title', 'description', 'content'}
        actual_keys = set(item.keys())
        assert actual_keys == expected_keys, f'Keys mismatch in {name}[{idx}]: {actual_keys}'
        assert item['locale'] == 'fa', f'Locale mismatch in {name}[{idx}]: {item["locale"]}'
        assert len(item['slug']) > 0 and len(item['title']) > 0 and len(item['description']) > 0 and len(item['content']) > 0, f'Empty field in {name}[{idx}]'
    print(f'VALIDATION SUCCESS: {p} has 10 valid Persian items.')
