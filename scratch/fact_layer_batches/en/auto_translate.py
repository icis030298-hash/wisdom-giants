import json
import glob
import os
import time
from deep_translator import GoogleTranslator

def translate_file(filepath):
    out_dir = os.path.dirname(filepath)
    filename = os.path.basename(filepath)
    
    # We already translated batch_001 and batch_002
    if filename in ["batch_001.json", "batch_002.json"]:
        return
        
    out_filepath = os.path.join(out_dir, "translated_" + filename)
    if os.path.exists(out_filepath):
        return

    print(f"Translating {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    translator = GoogleTranslator(source='ko', target='en')
    
    # Extract source texts
    texts = [item['sourceText'] for item in data]
    
    # Translate in chunks to avoid overwhelming the API
    translated_texts = []
    chunk_size = 30
    for i in range(0, len(texts), chunk_size):
        chunk = texts[i:i+chunk_size]
        try:
            res = translator.translate_batch(chunk)
            translated_texts.extend(res)
            time.sleep(1) # Small delay to avoid rate limiting
        except Exception as e:
            print(f"Error translating chunk in {filename}: {e}")
            # fallback to one by one
            for text in chunk:
                try:
                    res = translator.translate(text)
                    translated_texts.append(res)
                    time.sleep(0.5)
                except Exception as ex:
                    print(f"Error translating single text '{text}': {ex}")
                    translated_texts.append(text) # fallback to original

    if len(translated_texts) == len(data):
        for i, item in enumerate(data):
            item['translatedText'] = translated_texts[i]
            
        with open(out_filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved {out_filepath}")
    else:
        print(f"Mismatch in length for {filename}: {len(translated_texts)} vs {len(data)}")

def main():
    directory = r"C:\Users\natey\Desktop\wisdom-giants\scratch\fact_layer_batches\en"
    files = sorted(glob.glob(os.path.join(directory, "batch_*.json")))
    for filepath in files:
        translate_file(filepath)
        
if __name__ == "__main__":
    main()
