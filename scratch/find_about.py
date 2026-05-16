for filepath in ['messages/en.json', 'messages/ko.json', 'extracted_ko.json']:
    print(f"--- {filepath} ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if '"about"' in line.lower():
                print(f"{i+1}: {line.strip()}")
