import sys
import json
import os

def save_item(batch_num, item_dict):
    out_path = f"scratch/batches/out_fa_b{batch_num}.json"
    data = []
    if os.path.exists(out_path):
        try:
            with open(out_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            data = []
    
    slug = item_dict.get("slug")
    updated = False
    for i, item in enumerate(data):
        if item.get("slug") == slug:
            data[i] = item_dict
            updated = True
            break
    if not updated:
        data.append(item_dict)
        
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved {slug} to out_fa_b{batch_num}.json. Total items now: {len(data)}")

if __name__ == "__main__":
    batch_num = sys.argv[1]
    json_file = sys.argv[2]
    with open(json_file, 'r', encoding='utf-8') as f:
        item_dict = json.load(f)
    save_item(batch_num, item_dict)
