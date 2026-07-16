import json
import re

with open("sw_year_fix_in_2.json", "r", encoding="utf-8") as f:
    data = json.load(f)

korean_strings = set()
for slug, events in data.items():
    for idx, year_str in events.items():
        if re.search(r'[\u3131-\uD79D]', year_str):
            korean_strings.add(year_str)

with open("korean_strings.json", "w", encoding="utf-8") as f:
    json.dump(sorted(list(korean_strings)), f, ensure_ascii=False, indent=2)
