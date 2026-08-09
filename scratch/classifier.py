import json
import re

def classify(slug, locale, local, correct):
    # D: Last-First Name inversion format like 'Форд, Генри'
    if locale == 'ru' and ',' in correct and ',' not in local:
        return 'D'

    # E: Regnal titles
    regnal = [' I', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' Ier', '세', '왕', 'king', 'emperor']
    if any(r in correct for r in regnal) or slug in ['menelik-ii', 'tewodros-ii', 'yohannes-iv', 'amda-seyon-i', 'susenyos-i', 'osei-tutu-i']:
        if any(c.isdigit() for c in correct) or 'I' in correct or 'V' in correct or '세' in correct or '왕' in correct or 'Ier' in correct:
            return 'E'
        if locale == 'ru' and any(n in correct for n in [' I', ' II', ' III', ' IV', ' V']):
            return 'E'
        # Just use some more relaxed rule if it matches slug numbering
        if '-i' in slug or '-ii' in slug or '-iii' in slug or '-iv' in slug or '-v' in slug:
            return 'E'

    # A: Literal translation errors
    literal = ['Photo', 'meilleur', 'Ô', 'Ewe', 'My', 'tôi', 'meat', 'bird', 'Les conseils de', 'C\'est exact']
    if any(m in local for m in literal):
        return 'A'

    # F: Wikipedia full formal name
    local_w = local.replace('-', ' ').split()
    correct_w = correct.replace('-', ' ').split()
    if len(correct_w) >= len(local_w) + 2:
        return 'F'
    if len(correct_w) > len(local_w) and locale in ['ar', 'de', 'es', 'fr', 'it', 'pt', 'en']:
        # Could be full name if it's longer
        if local_w[0] in correct_w and local_w[-1] in correct_w:
            return 'F'

    # G: Traditional / Simplified Chinese
    if locale == 'zh':
        return 'G'

    # C: Punctuation, orthography, transcription (Default)
    return 'C'

def main():
    with open('scratch/discrepancies_chunk_4.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    result = []
    for item in data:
        cat = classify(item['slug'], item['locale'], item['localName'], item['correctName'])
        result.append({
            "slug": item['slug'],
            "locale": item['locale'],
            "category": cat
        })
        
    with open('scratch/classified_4.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
