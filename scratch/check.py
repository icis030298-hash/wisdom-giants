import json
with open('scratch/name_audit_final_batch_6.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

discrepancies = []
for item in data:
    for loc, name in item['names'].items():
        if loc == 'ha' and 'ne adam' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": item['nameEn']})
        elif loc == 'fr' and name == 'ThomasPlus':
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Thomas More"})
        elif loc == 'vi' and name == 'Thomas Thêm':
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Thomas More"})
        elif loc == 'vi' and name == 'George Cát':
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "George Sand"})
        elif loc == 'hi' and 'offrey Chaucer' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "जेफ्री चौसर"})
        elif loc == 'fr' and 'Garnison' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "William Lloyd Garrison"})
        elif loc == 'fr' and 'Révérend' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Pandita Ramabai"})
        elif loc == 'ha' and 'Rev.' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Pandita Ramabai"})
        elif loc == 'sw' and 'Mchungaji' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Pandita Ramabai"})
        elif loc == 'vi' and 'Linh mục' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Pandita Ramabai"})
        elif loc == 'id' and name == 'Hans Christian Anderson':
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Hans Christian Andersen"})
        elif loc == 'id' and name == 'Laura Jane Addams':
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Jane Addams"})
        elif loc == 'uk' and 'Лаура' in name:
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Джейн Аддамс"})
        elif loc == 'fr' and name == 'Élisée Otis':
            discrepancies.append({"slug": item['slug'], "locale": loc, "localName": name, "correctName": "Elisha Otis"})

with open('scratch/name_discrepancies_final_batch_6.json', 'w', encoding='utf-8') as f:
    json.dump(discrepancies, f, ensure_ascii=False, indent=2)

print("Done")
