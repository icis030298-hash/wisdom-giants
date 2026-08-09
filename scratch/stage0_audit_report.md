# STAGE 0 — 기존 검증 프로세스 감사 보고서 (Audit Report)

**작성일시:** 2026-08-09 19:10  
**감사 대상:** `candidates_500_roster.json` 및 기존 검증 스크립트 일체  

---

## 1. 사용한 검증 스크립트 파일 경로 및 전체 소스

### [스크립트 1] Python Wikipedia 1:1 유효성 검증 스크립트
- **파일 경로:** [`scratch/verify_500_robust.py`](file:///C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/verify_500_robust.py)
- **전체 소스코드:**
```python
import json
import time
import requests
import urllib.parse

def check_wikipedia(session, title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=info&redirects=1&titles={urllib.parse.quote(title)}&format=json"
    
    for attempt in range(5):
        try:
            resp = session.get(url, timeout=5)
            if resp.status_code == 429:
                time.sleep(2)
                continue
            resp.raise_for_status()
            data = resp.json()
            
            pages = data.get('query', {}).get('pages', {})
            redirects = data.get('query', {}).get('redirects', [])
            
            redirect_target = None
            if redirects:
                redirect_target = redirects[0]['to']
            
            for page_id in pages:
                if page_id == "-1":
                    return False, None
                return True, redirect_target
        except Exception as e:
            time.sleep(1)
            
    return False, None

def main():
    print("Verifying 500 names using Python requests...")
    
    with open('scratch/candidates_500_roster.json', 'r', encoding='utf-8') as f:
        candidates = json.load(f)
        
    valid = []
    missing = []
    redirected = []
    
    session = requests.Session()
    session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Script/1.0'})
    
    for i, c in enumerate(candidates):
        if i % 50 == 0:
            print(f"Checking {i}/500...")
            
        name_en = c['nameEn']
        exists, redirect = check_wikipedia(session, name_en)
        
        if exists:
            if redirect:
                c['nameEn'] = redirect
                redirected.append(f"{name_en} -> {redirect}")
            valid.append(c)
        else:
            missing.append(c)
            
        time.sleep(0.05) # 50ms delay
        
    print("\n--- Name Verification Report ---")
    print(f"Total checked: {len(candidates)}")
    print(f"Valid direct matches: {len(valid) - len(redirected)}")
    print(f"Redirects found & updated: {len(redirected)}")
    print(f"Missing / Not Found: {len(missing)}")
    
    with open('scratch/candidates_500_roster_verified.json', 'w', encoding='utf-8') as f:
        json.dump(valid, f, ensure_ascii=False, indent=2)
        
    if redirected:
        with open('scratch/candidates_500_redirects.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(redirected))
            
    if missing:
        with open('scratch/candidates_500_missing.json', 'w', encoding='utf-8') as f:
            json.dump(missing, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
```

### [스크립트 2] 누락/미매칭 15인 수동 매핑 및 통합 스크립트
- **파일 경로:** [`scratch/fix_15_missing.js`](file:///C:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/scratch/fix_15_missing.js)
- **전체 소스코드:**
```javascript
const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('scratch/candidates_500_missing.json', 'utf8'));
const verified = JSON.parse(fs.readFileSync('scratch/candidates_500_roster_verified.json', 'utf8'));

const corrections = {
    "Yi Hwang (Toegye)": "Yi Hwang",
    "Yi I (Yulgok)": "Yi I",
    "Sol Geo": "Solgeo",
    "Seok Ga-mo-ni (Park Eun-sik)": "Park Eun-sik",
    "Su Shi (Su Dongpo)": "Su Shi",
    "Rani of Jhansi (Lakshmibai)": "Rani of Jhansi",
    "Queen Nandi": "Nandi (mother of Shaka)",
    "King Sobhuza I": "Sobhuza I",
    "Queen Majaji": "Rain Queen",
    "Seoae Ryu Seong-ryong": "Ryu Seong-ryong",
    "Atatürk (Mustafa Kemal)": "Mustafa Kemal Atatürk",
    "J.A. Macdonald": "John A. Macdonald",
    "L. v. Beethoven": "Ludwig van Beethoven",
    "Tz'u-hsi (Cixi)": "Empress Dowager Cixi",
    "Nzinga of Ndongo": "Nzinga of Ndongo and Matamba"
};

missing.forEach(c => {
    if (corrections[c.nameEn]) {
        c.nameEn = corrections[c.nameEn];
    }
    verified.push(c);
});

fs.writeFileSync('scratch/candidates_500_roster_verified_final.json', JSON.stringify(verified, null, 2), 'utf8');
console.log(`Added 15 missing items. Total verified: ${verified.length}`);
```

---

## 2. 스크립트가 실제로 체크한 항목 및 미체크 항목 목록

### ✅ 실제로 체크한 항목 (단 1가지)
1. **영문 위키백과 문서 존재 여부 및 표제어 리다이렉트 치환**: 영문명(`nameEn`)으로 Wikipedia API(`action=query&prop=info&redirects=1`)를 호출하여 해당 문서(Page ID != -1)가 실재하는지 확인하고, 표제어 리다이렉트 대상 제목이 있으면 `nameEn`을 치환함.

### ❌ 미체크 항목 (전면 생략됨)
1. **Wikidata entity type (P31) 검증 (인물 vs 비인물)**: 대상이 `human (Q5)` 인지, 아니면 동물/개념/작품인지 체크하지 않음.
2. **생몰연도 검증 (사망연도 필터, 오타, BC 표기)**:
   - 사망연도 1970/1996년 이전 사망 기준 대조하지 않음.
   - 생몰년 오타(예: 148 ~ 1934) 검증하지 않음.
   - B.C. 기년법 표기 정규화 검증하지 않음.
   - 생존자 오기재 / 환각 사망 연도 대조하지 않음.
3. **한글 표기 유효성 및 문자 오염 검증**: `nameKo` 필드에 특수문자나 에티오피아 문자(U+1343 등) 오염이 포함되었는지 검사하지 않음.
4. **명단 내부 중복 검사 (Wikidata Q-ID / 영문명)**: 500명 목록 내부에서 인물이 중복(예: Bach, Beethoven, Mozart, Gauss, Machiavelli 중복 오기재)되었는지 체크하지 않음.
5. **라이브 로스터(484/493명) 중복 검사**: 라이브 사이트에 이미 존재하는 36명의 중복 인물(Q-ID 대조)을 차집합 처리하지 않음.

---

## 3. 실행 로그 원본

### [로그 1] `verify_500_robust.py` 실행 로그 원본
- **태스크 ID:** `bb3327d3-aebc-42a2-9b7f-ddba2f88a732/task-11878`
- **로그 파일 URI:** [`file:///C:/Users/user/.gemini/antigravity/brain/bb3327d3-aebc-42a2-9b7f-ddba2f88a732/.system_generated/tasks/task-11878.log`](file:///C:/Users/user/.gemini/antigravity/brain/bb3327d3-aebc-42a2-9b7f-ddba2f88a732/.system_generated/tasks/task-11878.log)
- **출력 원본 전체:**
```
Verifying 500 names using Python requests...
Checking 0/500...
Checking 50/500...
Checking 100/500...
Checking 150/500...
Checking 200/500...
Checking 250/500...
Checking 300/500...
Checking 350/500...
Checking 400/500...
Checking 450/500...

--- Name Verification Report ---
Total checked: 500
Valid direct matches: 404
Redirects found & updated: 81
Missing / Not Found: 15
```

### [로그 2] `fix_15_missing.js` 실행 로그 원본
- **태스크 ID:** `bb3327d3-aebc-42a2-9b7f-ddba2f88a732/task-11923` (직접 실행)
- **출력 원본 전체:**
```
Added 15 missing items. Total verified: 500
```

---

## 4. 발견된 결함 항목별 원인 분석

| 번호 | 발견된 결함 항목 | 근본 원인 분석 (Root Cause) |
|---|---|---|
| **219** | **Wojtek / 보이테크**<br>(2차대전 폴란드군 시리아불곰) | Wikipedia API는 `Wojtek (bear)` 문서를 정상 페이지(Page ID != -1)로 반환하므로 문서 존재 여부만 본 스크립트가 '유효한 문서'로 판단함. Wikidata의 `instance of (P31) == human (Q5)` 조건 검증이 전무했기 때문임. |
| **26** | **Sugawara no Michizane**<br>(한글명 스ጋ와라 에티오피아 문자 U+1343 혼입) | 검증 스크립트가 `nameEn` 필드만 조회하고 `nameKo` 필드의 유니코드/한글 범위 정규식 검사를 생략하여 문자 오염이 걸러지지 않음. |
| **258** | **Tōgō Heihachirō**<br>(생몰 148 ~ 1934 오타) | 연도 수치의 범위 검증(예: 생애 기간 1786년 오인 등 범위 이상값) 및 Wikidata P569/P570 대조 로직이 스크립트에 없었기 때문임. |
| **40** | **Chanakya**<br>(375 ~ 283 BC, 앞쪽 BC 누락) | BC/AD 표기에 대한 구조화 파싱 및 표준 형식 검증 규칙이 포함되지 않음. |
| **364 / 460** | **Mario Vargas Llosa / Jane Goodall**<br>(생존 인물을 사망으로 오기재) | 1) 생존/사망 판정을 Wikidata P570(date of death) 필드로 대조하지 않고 LLM 생성 텍스트를 그대로 수용함, 2) LLM의 환각(Hallucination)으로 인해 생존 인물이 사망으로 오기재되었으나 검증 로직에서 감지하지 못함. |
| **내부중복** | **명단 내부 동일 인물 5건**<br>(Bach, Beethoven, Mozart, Gauss, Machiavelli) | 500명 생성 및 검증 과정에서 `Wikidata Q-ID` 또는 슬러그 기준 `Set` / `Map` 중복 체크 로직이 전혀 작동하지 않았음. |
| **라이브중복** | **라이브 로스터와 36명 중복** | 프로덕션 환경의 라이브 인물 슬러그/Q-ID 목록(484명)을 차집합(Exclude Set)으로 지정하여 사전/사후 검사를 수행하는 단계가 전무했음. |

---

**결론 및 승인 요청:**
기존 검증 프로세스는 "Wikipedia 문서 존재 여부 및 표제어 리다이렉트" 단 1가지 기준만 확인하여 위 8가지 치명적 결함을 통과시켰습니다. 
이에 **STAGE 0 감사 보고서를 제출하고, 대표님의 승인을 얻은 후 STAGE 1(Q-ID 기준 중복 제거) 작업으로 진입하고자 합니다.**

**STOP — STAGE 0 승인을 요청합니다.**
