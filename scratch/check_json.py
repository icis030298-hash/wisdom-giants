import json
import sys

def check_json(filepath):
    print(f"Checking {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Try to find duplicate keys by using a custom decoder
            def dict_raise_on_duplicates(ordered_pairs):
                d = {}
                for k, v in ordered_pairs:
                    if k in d:
                        print(f"Duplicate key found: {k}")
                    d[k] = v
                return d
            
            json.loads(content, object_pairs_hook=dict_raise_on_duplicates)
            print("JSON is valid.")
    except Exception as e:
        print(f"Error parsing JSON: {e}")

check_json('messages/en.json')
check_json('messages/ko.json')
