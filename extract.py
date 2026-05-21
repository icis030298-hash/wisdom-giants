import json

data_path = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\src\data\final-narratives.json"
slugs = ["charles-darwin","michelangelo","claude-monet","fyodor-dostoevsky","victor-hugo","anton-chekhov","frederic-chopin","katsushika-hokusai","agatha-christie","mark-twain","goethe","mary-shelley"]

with open(data_path, "r", encoding="utf-8") as f:
    data = json.load(f)

extracted = {}
for slug in slugs:
    if slug in data:
        g = data[slug]
        extracted[slug] = {
            "epic_en": g.get("epic_en", ""),
            "trials_en": g.get("trials_en", ""),
            "overcoming_en": g.get("overcoming_en", ""),
            "wisdom": []
        }
        for w in g.get("wisdom", []):
            extracted[slug]["wisdom"].append({
                "quote_en": w.get("quote_en", ""),
                "meaning_en": w.get("meaning_en", "")
            })

with open("extracted.json", "w", encoding="utf-8") as f:
    json.dump(extracted, f, indent=2, ensure_ascii=False)
