import json
import sys
import os

def main():
    batch_path = sys.argv[1]
    trans_path = sys.argv[2]
    out_path = sys.argv[3]
    
    with open(batch_path, 'r', encoding='utf-8') as f:
        batch = json.load(f)
        
    with open(trans_path, 'r', encoding='utf-8') as f:
        translations = json.load(f)
        
    for item in batch:
        item_id = item.get('id')
        if item_id in translations:
            item['translatedText'] = translations[item_id]
        else:
            print(f"Warning: Missing translation for {item_id}")
            
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(batch, f, ensure_ascii=False, indent=2)
        
if __name__ == '__main__':
    main()
