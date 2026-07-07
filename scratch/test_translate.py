from deep_translator import GoogleTranslator
import sys
try:
    translated = GoogleTranslator(source='ko', target='uk').translate("안녕하세요")
    with open("scratch/test_out.txt", "w", encoding="utf-8") as f:
        f.write(translated)
    print("Success: Written to file")
except Exception as e:
    print("Failed:", e)
