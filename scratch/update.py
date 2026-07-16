import json
import codecs

with codecs.open(r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_sw_ko_chunk_0.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with codecs.open(r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\t1.json", "r", encoding="utf-8") as f:
    t1 = json.load(f)

with codecs.open(r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\t2.json", "r", encoding="utf-8") as f:
    t2 = json.load(f)

translations = {}
translations.update(t1)
translations.update(t2)

for k, v in translations.items():
    if k in data:
        for i, t in enumerate(v.get('timeline', [])):
            if i < len(data[k]['timeline']):
                data[k]['timeline'][i]['event'] = t
        for i, a in enumerate(v.get('keyAchievements', [])):
            if i < len(data[k]['keyAchievements']):
                data[k]['keyAchievements'][i]['title'] = a['title']
                data[k]['keyAchievements'][i]['description'] = a['description']
        for i, faq in enumerate(v.get('faq', [])):
            if i < len(data[k]['faq']):
                data[k]['faq'][i]['question'] = faq['question']
                data[k]['faq'][i]['answer'] = faq['answer']
        if 'missingDataNote' in v:
            data[k]['missingDataNote'] = v['missingDataNote']

with codecs.open(r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_sw_out_0.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
