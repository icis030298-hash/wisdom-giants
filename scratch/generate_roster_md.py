import json

with open('scratch/candidates_500_roster.json', 'r', encoding='utf-8') as f:
    roster = json.load(f)

# Sort by Category, then by Name
roster.sort(key=lambda x: (x.get('category', ''), x.get('nameEn', '')))

md_content = "# Verified 500 Giants Roster\n\n"
md_content += "This document contains the final, Wikipedia-verified list of 500 historical figures.\n\n"

current_category = ""

for giant in roster:
    cat = giant.get('category', 'Uncategorized').capitalize()
    if cat != current_category:
        current_category = cat
        md_content += f"## {current_category}\n\n"
        md_content += "| No | Name (English) | Name (Korean) | Era | Region | Gender |\n"
        md_content += "|---|---|---|---|---|---|\n"
    
    no = giant.get('no', '')
    name_en = giant.get('nameEn', '')
    name_ko = giant.get('nameKo', '')
    era = giant.get('era', '')
    region = giant.get('region', '')
    gender = giant.get('gender', '')
    
    md_content += f"| {no} | {name_en} | {name_ko} | {era} | {region} | {gender} |\n"

with open('verified_500_roster.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print("Markdown generated successfully.")
