import json
import os

data = {
  "poe-obsession-psychology_para_000.json": "Di masa pertengahan abad ke-19 yang penuh gejolak, Edgar Allan Poe, seorang tokoh yang kehidupannya sama kelamnya dengan fiksinya, mengukir sudut-sudut paling gelap dari jiwa manusia dan obsesinya dengan kejelasan yang mengerikan. Keberadaannya adalah permadani yang ditenun dengan benang-benang kesunyian, kehilangan, dan kegilaan yang merambah, mendorong sastranya melampaui fantasi semata menuju eksplorasi mendalam tentang dorongan gelap dan kecemasan yang melekat pada umat manusia. Saat ini, kita juga bergulat dengan tekanan karier, bisnis, dan startup yang tiada henti di dunia yang terus berubah, sering kali menyerah pada gelombang depresi dan kecemasan. Perjuangan individu modern mencerminkan, dengan keakuratan yang mengejutkan, pertempuran internal yang ditanggung Poe berabad-abad yang lalu. Obsesi kompulsif, ketakutan akan kematian, dan hilangnya orang-orang terkasih yang menyiksa karakter-karakternya adalah bayangan dari psikologi batin kita sendiri, dan memahaminya adalah langkah pertama untuk memahami diri kita sendiri."
}

out_dir = "C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/"
for k, v in data.items():
    slug = k.split('_')[0] if '_' in k else k.replace('.json', '')
    if 'para' in k:
        type_str = 'para'
        index = int(k.split('_')[2].split('.')[0])
        out = {"slug": slug, "type": type_str, "index": index, "id_text": v}
    else:
        type_str = 'title'
        out = {"slug": slug, "type": type_str, "id_text": v}
    with open(os.path.join(out_dir, k), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
print("Saved poe 0.")
