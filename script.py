import os
import json
import glob
import sys

task_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/uk/tasks/'
result_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/uk/results/'

slugs = ['quotes-creative-block', 'quotes-time-management', 'quotes-perfectionism', 'quotes-grief-loss', 'quotes-success-definition', 'quotes-courage-fear', 'quotes-study-learning', 'quotes-money-wealth', 'quotes-health-body', 'quotes-change-growth']

os.makedirs(result_dir, exist_ok=True)

all_tasks = []
for slug in slugs:
    all_tasks.extend(glob.glob(os.path.join(task_dir, f"{slug}*.json")))

pending = []
for task_path in all_tasks:
    filename = os.path.basename(task_path)
    res_path = os.path.join(result_dir, filename)
    if not os.path.exists(res_path):
        pending.append(task_path)

pending.sort()

batch = pending[:40]
output = []
for path in batch:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        output.append({
            "file": os.path.basename(path),
            "text": data.get("text", "")
        })

print(f"Pending: {len(pending)}")
if batch:
    with open('current_batch.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print("Batch saved to current_batch.json")
