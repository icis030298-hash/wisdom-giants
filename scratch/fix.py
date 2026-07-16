import json
import re

def has_korean(text):
    if not isinstance(text, str): return False
    return bool(re.search(r'[\uac00-\ud7a3]', text))

def find_korean(data, path, results):
    if isinstance(data, dict):
        for k, v in data.items():
            find_korean(v, path + [k], results)
    elif isinstance(data, list):
        for i, v in enumerate(data):
            find_korean(v, path + [str(i)], results)
    elif isinstance(data, str):
        if has_korean(data):
            results.append((path, data))

def main():
    with open('c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_tr_out_0.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    results = []
    find_korean(data, [], results)
    
    with open('c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/fix.txt', 'w', encoding='utf-8') as f:
        for path, text in results:
            f.write(f"{'.'.join(path)}:\n{text}\n\n")

if __name__ == '__main__':
    main()
