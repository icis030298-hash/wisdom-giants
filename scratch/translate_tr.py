import json
import urllib.request
import urllib.parse
import time

def translate_text(text):
    if not text or not str(text).strip():
        return text
    try:
        q = urllib.parse.quote(text)
        req = urllib.request.Request(
            f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=tr&dt=t&q={q}',
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        translated = ''.join([seg[0] for seg in data[0] if seg[0]])
        return translated
    except Exception as e:
        print(f"Error translating: {text} - {e}")
        time.sleep(1)
        try:
            req = urllib.request.Request(
                f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=tr&dt=t&q={q}',
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            response = urllib.request.urlopen(req)
            data = json.loads(response.read().decode('utf-8'))
            translated = ''.join([seg[0] for seg in data[0] if seg[0]])
            return translated
        except Exception as e2:
            print(f"Retry failed: {text} - {e2}")
            return text

def translate_value(key, value):
    if isinstance(value, str):
        if key in ["slug", "id"]:
            return value
        # Some things like "sourceVerified" has a boolean, but handled below
        return translate_text(value)
    elif isinstance(value, dict):
        return {k: translate_value(k, v) for k, v in value.items()}
    elif isinstance(value, list):
        return [translate_value(key, v) for v in value]
    else:
        return value

def main():
    in_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_tr_in_0.json'
    out_file = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/task_tr_out_0.json'
    
    with open(in_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    translated_data = {}
    for giant_key, giant_info in data.items():
        print(f"Translating {giant_key}...")
        translated_data[giant_key] = translate_value(giant_key, giant_info)
        time.sleep(0.5) # Be nice to the free API
        
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print("Translation completed.")

if __name__ == '__main__':
    main()
