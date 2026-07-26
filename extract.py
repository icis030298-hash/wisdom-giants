import json
import os
import glob

slugs = ["rockefeller-monopoly-guide", "carnegie-gospel-wealth", "disney-imagination-market", "sun-tzu-alexander-conquest", "caesar-caocao-pragmatism", "elizabeth-wu-zetian-iron-queens", "oppenheimer-genius-regret", "lincoln-leadership-depression", "feynman-technique-learning", "poe-obsession-psychology"]
tasks_dir = "C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/"

res = {}
for slug in slugs:
    for f in glob.glob(tasks_dir + slug + "*.json"):
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            res[os.path.basename(f)] = data['text']

with open('C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/all_texts.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=2)

print(f'Total extracted: {len(res)}')
