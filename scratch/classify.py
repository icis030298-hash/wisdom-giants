import json
import re

def classify(item):
    loc = item["locale"]
    loc_n = item["localName"]
    cor_n = item["correctName"]
    
    if "Chuông" in loc_n or "Halogénure" in loc_n:
        return "A"
    
    if loc == "zh":
        if "I" in cor_n or "1" in cor_n or "一世" in cor_n or "二世" in cor_n:
            return "E"
        if len(loc_n) == len(cor_n) and loc_n != cor_n:
            return "G"
            
    if loc == "ru" and "," in cor_n and "," not in loc_n:
        return "D"
        
    regnal_pattern = r"\b(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII)\b|1세|2세|I\.|II\."
    if re.search(regnal_pattern, cor_n) or re.search(regnal_pattern, loc_n):
        return "E"
        
    if "(значения)" in cor_n or "(disambiguasi)" in cor_n or "(ابهام‌زدایی)" in cor_n or "(desambiguación)" in cor_n or "(ujednoznacznienie)" in cor_n or "(동음이의)" in cor_n:
        return "B"
        
    if "توضيح" in cor_n or "значения" in cor_n or "ابهام‌زدایی" in cor_n:
        return "B"
        
    if len(cor_n) > len(loc_n) + 5 and any(p in cor_n for p in loc_n.split()):
        return "F"
        
    return "C"

with open(r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\discrepancies_chunk_5.json", "r", encoding="utf-8") as f:
    data = json.load(f)

result = []
for item in data:
    result.append({
        "slug": item["slug"],
        "locale": item["locale"],
        "category": classify(item)
    })

with open(r"C:\Users\user\.gemini\antigravity\brain\fd1639da-cae6-4e4e-b69a-088e371128fa\scratch\classified_5.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)
    
with open(r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\classified_5.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)
