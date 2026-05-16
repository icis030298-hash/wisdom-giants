keys = ['intro', 'subIntro', 'visionTitle', 'visionDesc', 'epicTitle', 'epicDesc', 'chatTitle', 'chatDesc', 'testTitle', 'testDesc', 'outroTitle', 'outroDesc']
for filepath in ['messages/en.json', 'messages/ko.json']:
    print(f"--- {filepath} ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            for k in keys:
                if f'"{k}":' in line:
                    print(f"{i+1}: {line.strip()}")
