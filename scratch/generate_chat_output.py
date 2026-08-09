import json

with open('scratch/candidates_500_roster.json', 'r', encoding='utf-8') as f:
    roster = json.load(f)

# Sort by number to maintain original order or sort by category? 
# The user wants "번호" (number) so let's sort by "no"
roster.sort(key=lambda x: int(x.get('no', 0)))

def print_batch(start, end):
    print(f"### 명단 출력 ({start+1} ~ {end})\n")
    print("| 번호 | 영문명 | 한국어명 | 생몰연도 | 지역 | 분야 | 성별 |")
    print("|---|---|---|---|---|---|---|")
    for giant in roster[start:end]:
        no = giant.get('no', '')
        name_en = giant.get('nameEn', '')
        name_ko = giant.get('nameKo', '')
        era = giant.get('era', '')
        region = giant.get('region', '')
        category = giant.get('category', '')
        gender = giant.get('gender', '')
        print(f"| {no} | {name_en} | {name_ko} | {era} | {region} | {category} | {gender} |")

print_batch(0, 100)
