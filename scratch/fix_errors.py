import json
import time
from deep_translator import GoogleTranslator

def translate_safe(text):
    for _ in range(5):
        try:
            res = GoogleTranslator(source='auto', target='vi').translate(text)
            if res and "Error 500 (Server Error)" not in res:
                return res
        except Exception:
            pass
        time.sleep(2)
    return text

def fix_dict(in_d, out_d):
    if isinstance(in_d, dict) and isinstance(out_d, dict):
        for k, v in in_d.items():
            if k in out_d:
                if isinstance(v, str) and isinstance(out_d[k], str) and "Error 500 (Server Error)" in out_d[k]:
                    print(f"Fixing string: {v[:30]}")
                    out_d[k] = translate_safe(v)
                else:
                    fix_dict(v, out_d[k])
    elif isinstance(in_d, list) and isinstance(out_d, list) and len(in_d) == len(out_d):
        for iv, ov in zip(in_d, out_d):
            fix_dict(iv, ov)

in_file = r'c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_in_6.json'
out_file = r'c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task_vi_out_6.json'

with open(in_file, 'r', encoding='utf-8') as f:
    in_data = json.load(f)

with open(out_file, 'r', encoding='utf-8') as f:
    out_data = json.load(f)

fix_dict(in_data, out_data)

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("Fix completed.")
