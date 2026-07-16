import json
import sys
import os

in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_vi_in_5.json'
out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_vi_out_5.json'
current_in = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/current_in.json'
current_out = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/current_out.json'

def step(index):
    d_in = json.load(open(in_file, encoding='utf-8'))
    keys = list(d_in.keys())
    
    # If index > 0, merge previous output
    if index > 0:
        prev_k = keys[index-1]
        try:
            d_out_current = json.load(open(current_out, encoding='utf-8'))
            if os.path.exists(out_file):
                d_out = json.load(open(out_file, encoding='utf-8'))
            else:
                d_out = {}
            d_out[prev_k] = d_out_current
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(d_out, f, ensure_ascii=False, indent=2)
            print(f"--- Merged {prev_k} ---")
        except Exception as e:
            print(f"Error merging {prev_k}: {e}")
            return
            
    if index >= len(keys):
        print("ALL DONE")
        return
        
    k = keys[index]
    with open(current_in, 'w', encoding='utf-8') as f:
        json.dump(d_in[k], f, ensure_ascii=False, indent=2)
    print(f"--- PREPARED GIANT: {k} (Index: {index}) ---")

if __name__ == '__main__':
    step(int(sys.argv[1]))
