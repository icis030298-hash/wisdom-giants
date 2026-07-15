import json
import os

out = {}
for i in range(1, 6):
    with open(f"scratch/zh_{i}.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        out.update(data)

with open("scratch/zh_agent_10_out.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("Merged successfully.")
