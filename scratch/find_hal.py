import json

data_path = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/name_audit_final_batch_8.json'
with open(data_path, 'r', encoding='utf-8') as f:
    giants = json.load(f)

discrepancies = []
for g in giants:
    for k, v in g['names'].items():
        if 'ne adam wata' in v or v in ("C'est exact", "Haka ne", "Hiyo ni kweli", "Đúng rồi", "Thêm"):
            # Also fetch Wikipedia correct name manually if needed, but for now we just mark correctName as empty and we'll fix it.
            discrepancies.append({
                'slug': g['slug'],
                'locale': k,
                'localName': v,
                'correctName': 'TODO'
            })

out_path = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/name_discrepancies_final_batch_8.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(discrepancies, f, ensure_ascii=False, indent=2)

print("Done")
