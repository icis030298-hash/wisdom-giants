import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

in_file = 'task_tr_in_5.json'
out_file = 'task_tr_out_5.json'
current_file = 'current.json'
translated_file = 'translated.json'

def main():
    if not os.path.exists(in_file):
        print(f"Error: {in_file} not found")
        return

    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if os.path.exists(out_file):
        with open(out_file, 'r', encoding='utf-8') as f:
            out_data = json.load(f)
    else:
        out_data = {}

    keys = list(data.keys())
    untranslated = [k for k in keys if k not in out_data]

    if sys.argv[1] in ['commit', 'commit_and_get']:
        if not os.path.exists(translated_file):
            print("Error: translated.json not found")
            return
        with open(translated_file, 'r', encoding='utf-8') as f:
            t_data = json.load(f)
        
        k = list(t_data.keys())[0]
        out_data.update(t_data)
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(out_data, f, ensure_ascii=False, indent=2)
        print(f"COMMITTED: {k}")
        
        # update untranslated
        untranslated = [k for k in keys if k not in out_data]
        print(f"REMAINING: {len(untranslated)}")

    if sys.argv[1] in ['get', 'commit_and_get']:
        if not untranslated:
            print("DONE")
        else:
            k = untranslated[0]
            with open(current_file, 'w', encoding='utf-8') as f:
                json.dump({k: data[k]}, f, ensure_ascii=False, indent=2)
            print(f"READY: {k}")
            with open(current_file, 'r', encoding='utf-8') as f:
                print(f.read())

if __name__ == '__main__':
    main()
