import json
import time
from deep_translator import GoogleTranslator

# Load the Korean source of truth
with open('src/data/fact-layers/fact-layer-ko.json', 'r', encoding='utf-8') as f:
    ko_data = json.load(f)

# Load current HE data
with open('src/data/fact-layers/fact-layer-he.json', 'r', encoding='utf-8') as f:
    he_data = json.load(f)

infected = ['beethoven','confucius','yi-sun-shin','gwanggaeto-the-great','ataturk','theodore-roosevelt','rosa-parks','frederick-douglass','harriet-tubman','florence-nightingale','yu-gwan-sun','harriet-beecher-stowe','kim-gu','buddha','friedrich-nietzsche','immanuel-kant','rene-descartes','sigmund-freud','carl-jung','baruch-spinoza','sun-tzu','john-locke','simone-de-beauvoir','soren-kierkegaard','jeong-yak-yong','zhuangzi','li-bai','blaise-pascal','charles-babbage','li-qingzhao','matsuo-basho','clara-barton','gottfried-leibniz','meister-eckhart','vitus-bering','george-eliot','jane-austen','john-stuart-mill','olympe-de-gouges','plotinus','elizabeth-cady-stanton','virgil','eleanor-of-aquitaine','sundiata-keita','maria-theresa','ching-shih','askia-the-great','al-biruni','carl-linnaeus','lise-meitner','emmy-noether','alexander-von-humboldt','tycho-brahe','john-muir','alfred-russel-wallace','al-farabi','thomas-more']

translator = GoogleTranslator(source='ko', target='iw')

def translate_str(text):
    if not text:
        return text
    # Avoid translating names that might just be short IDs, but we should translate everything
    try:
        res = translator.translate(text)
        time.sleep(0.3)
        return res
    except Exception as e:
        print(f"Error translating: {text[:20]}... {e}")
        time.sleep(2)
        try:
            res = translator.translate(text)
            return res
        except:
            return text

def translate_obj(obj):
    if isinstance(obj, str):
        import re
        ko = re.compile(r'[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]')
        if ko.search(obj):
            return translate_str(obj)
        return obj
    elif isinstance(obj, dict):
        new_dict = {}
        for k, v in obj.items():
            if k in ['id', 'slug', 'sourceVerified', 'mbti']:
                new_dict[k] = v
            else:
                new_dict[k] = translate_obj(v)
        return new_dict
    elif isinstance(obj, list):
        return [translate_obj(item) for item in obj]
    else:
        return obj

for idx, slug in enumerate(infected):
    print(f"Translating {idx+1}/{len(infected)}: {slug}")
    he_data[slug] = translate_obj(ko_data[slug])
    # save incrementally
    if idx % 5 == 0:
        with open('src/data/fact-layers/fact-layer-he.json', 'w', encoding='utf-8') as f:
            json.dump(he_data, f, ensure_ascii=False, indent=2)

with open('src/data/fact-layers/fact-layer-he.json', 'w', encoding='utf-8') as f:
    json.dump(he_data, f, ensure_ascii=False, indent=2)

print("Translation of 57 failed items complete!")
