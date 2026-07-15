import json
from deep_translator import GoogleTranslator

translator = GoogleTranslator(source='ko', target='ha')
texts = [
    "1902년 12월 16일",
    "1916년",
    "1429년 4월",
    "기원전 563년경"
]

for t in texts:
    print(t, "->", translator.translate(t))
