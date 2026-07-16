import json

out_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_retry_out_1.json"

with open(out_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

events = [
    "Lahir di Negara Zhao dari Pangeran Yiren dan Zhao Ji",
    "Memulai pemerintahan sebagai Raja Negara Qin ke-31 (Lü Buwei memulai perwalian)",
    "Memulai kekuasaan secara pribadi",
    "Menaklukkan Negara Han",
    "Menaklukkan Negara Zhao",
    "Menaklukkan Negara Wei",
    "Menaklukkan Negara Chu",
    "Menaklukkan Negara Yan",
    "Menaklukkan Negara Qi dan menyatukan daratan Tiongkok",
    "Melakukan Pembakaran Buku (Fen Shu)",
    "Melakukan Penguburan Sarjana (Keng Ru)",
    "Meninggal pada usia 50 tahun di Shaqiu selama tur inspeksi terakhirnya"
]

titles = [
    "Penyatuan Tiongkok",
    "Penciptaan Sistem Kekaisaran",
    "Implementasi Sistem Komando-Kabupaten",
    "Standarisasi Berat, Ukuran, Mata Uang, dan Aksara",
    "Penyelesaian Tembok Besar"
]

descs = [
    "Menyatukan Tiongkok yang terpecah dan menetapkan sistem kekaisaran serta sistem komando-kabupaten (sistem Junxian), meletakkan kerangka dasar untuk dinasti Tiongkok selama 2.000 tahun berikutnya.",
    "Yang pertama menggunakan gelar 'Kaisar' (Huangdi) sebagai ganti 'Raja' dan memproklamirkan dirinya sebagai 'Kaisar Pertama' (Shi Huangdi).",
    "Mengikuti saran Kanselir Li Si, ia membagi seluruh negara menjadi 36 komando dan menunjuk seorang administrator, seorang komandan militer, dan seorang inspektur untuk masing-masing, membangun sistem pemerintahan terpusat.",
    "Untuk memerintah kekaisaran secara efisien, ia menstandarkan sistem berat dan ukuran, mata uang, dan sistem penulisan, serta memperbaiki jaringan jalan.",
    "Menghubungkan tembok pertahanan periode Negara-Negara Berperang untuk menyelesaikan Tembok Besar untuk mencegah invasi oleh Xiongnu."
]

qs = [
    "Kapan Qin Shi Huang lahir?",
    "Mengapa Qin Shi Huang menggunakan gelar 'Kaisar' (Huangdi)?",
    "Apa saja tindakan tirani utama Qin Shi Huang?",
    "Upaya apa yang dilakukan Qin Shi Huang untuk mencapai keabadian?",
    "Bagaimana Qin Shi Huang meninggal?"
]

ans = [
    "Qin Shi Huang lahir pada tahun 259 SM di Negara Zhao dari Pangeran Yiren, yang dikirim ke sana sebagai sandera dari Negara Qin, dan Zhao Ji.",
    "Menganggap gelar 'Raja' tidak memadai untuk dirinya sendiri, Qin Shi Huang mengambil karakter 'Huang' dan 'Di' dari Tiga Penguasa dan Lima Kaisar untuk membentuk 'Huangdi' (Kaisar), dan menamai dirinya 'Kaisar Pertama' (Shi Huangdi).",
    "Qin Shi Huang melakukan 'Pembakaran Buku dan Penguburan Sarjana', penindasan budaya besar-besaran di mana ia membakar semua buku kecuali yang berkaitan dengan sejarah Qin, kedokteran, dan pertanian, dan mengubur hidup-hidup lebih dari 460 sarjana.",
    "Dalam usahanya mencari ramuan kehidupan, Qin Shi Huang mengirim alkemis Xu Fu dengan 3.000 anak laki-laki dan perempuan serta sebuah kapal yang sarat dengan harta karun ke Gunung Penglai. Ia juga menelan merkuri, keliru percaya bahwa itu adalah ramuan keabadian.",
    "Selama tur inspeksi terakhirnya pada tahun 210 SM, Qin Shi Huang jatuh sakit parah di wilayah Shaqiu dan meninggal pada usia 50 tahun."
]

for i, x in enumerate(events): data['qin-shi-huang']['timeline'][i]['event'] = x
for i, x in enumerate(titles): data['qin-shi-huang']['keyAchievements'][i]['title'] = x
for i, x in enumerate(descs): data['qin-shi-huang']['keyAchievements'][i]['description'] = x
for i, x in enumerate(qs): data['qin-shi-huang']['faq'][i]['question'] = x
for i, x in enumerate(ans): data['qin-shi-huang']['faq'][i]['answer'] = x

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
