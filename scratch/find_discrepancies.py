import json

def main():
    with open('scratch/name_audit_final_batch_3.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    discrepancies = []
    
    for item in data:
        slug = item['slug']
        names = item['names']
        name_en = item['nameEn']
        
        for lang, local_name in names.items():
            norm_local = local_name.lower()
            
            is_discrepancy = False
            correct_name = name_en
            
            if 'ne adam' in norm_local:
                is_discrepancy = True
            elif 'thêm' in norm_local:
                is_discrepancy = True
            elif 'more' == norm_local:
                is_discrepancy = True
            elif 'toyota' in norm_local:
                is_discrepancy = True
                correct_name = "Toyotomi Hideyoshi" # specific fix for Toyotomi
            elif 'أمريكا' in norm_local:
                is_discrepancy = True
                correct_name = "أميليا إيرهارت" # Amelia Earhart in Arabic
            elif slug == "alexander-graham-bell" and "أمريكا" in norm_local:
                pass # not applicable
                
            if is_discrepancy:
                # Assign Wikipedia-style standard names as best effort if we can't fetch them
                if slug == "toyotomi-hideyoshi" and lang == "fr":
                    correct_name = "Toyotomi Hideyoshi"
                elif slug == "toyotomi-hideyoshi" and lang == "ha":
                    correct_name = "Toyotomi Hideyoshi"
                elif slug == "toyotomi-hideyoshi" and lang == "sw":
                    correct_name = "Toyotomi Hideyoshi"
                elif slug == "toyotomi-hideyoshi" and lang == "vi":
                    correct_name = "Toyotomi Hideyoshi"
                elif "ne adam wata" in norm_local:
                    correct_name = name_en
                
                discrepancies.append({
                    "slug": slug,
                    "locale": lang,
                    "localName": local_name,
                    "correctName": correct_name
                })

    with open('scratch/name_discrepancies_final_batch_3.json', 'w', encoding='utf-8') as f:
        json.dump(discrepancies, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
