import json
import os
import time
import sys
from deep_translator import GoogleTranslator

def translate_chunk(chunk_num):
    num_str = f"{chunk_num:03d}"
    input_path = f"scratch/optimization/chunks/chunk_{num_str}.json"
    output_dir = "scratch/optimization/translations/uk"
    output_path = f"{output_dir}/trans_chunk_{num_str}.json"

    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    if os.path.exists(output_path):
        print(f"[Chunk {num_str}] Already exists. Skipping.")
        return

    print(f"[Chunk {num_str}] Reading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        korean_strings = json.load(f)

    print(f"[Chunk {num_str}] Translating {len(korean_strings)} strings to Ukrainian (uk)...")

    translator = GoogleTranslator(source='ko', target='uk')
    translated_map = {}

    # Translate in batches or one by one
    # Batch translation is faster
    batch_size = 30
    for i in range(0, len(korean_strings), batch_size):
        batch = korean_strings[i:i+batch_size]
        try:
            # Clean empty/whitespace strings
            cleaned_batch = [s for s in batch]
            res = translator.translate_batch(cleaned_batch)
            for original, translated in zip(batch, res):
                translated_map[original] = translated
            time.sleep(1)
        except Exception as e:
            print(f"[Chunk {num_str}] Batch translation error: {e}. Falling back to one by one.")
            for s in batch:
                if not s.strip():
                    translated_map[s] = s
                    continue
                for attempt in range(3):
                    try:
                        translated = translator.translate(s)
                        translated_map[s] = translated
                        time.sleep(0.5)
                        break
                    except Exception as ex:
                        print(f"[Chunk {num_str}] Error on single string '{s}': {ex}. Attempt {attempt+1}/3")
                        if attempt == 2:
                            translated_map[s] = s # fallback
                        time.sleep(2)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(translated_map, f, ensure_ascii=False, indent=2)
    print(f"[Chunk {num_str}] Saved successfully.")

def main():
    print("Starting translation of chunks 003 to 047 to Ukrainian (uk)...")
    for i in range(3, 48):
        try:
            translate_chunk(i)
            time.sleep(1)
        except Exception as e:
            print(f"Fatal error at chunk {i}: {e}")
            sys.exit(1)
    print("All chunks from 003 to 047 translated successfully.")

if __name__ == "__main__":
    main()
