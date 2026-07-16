import json

out_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_retry_out_1.json"

with open(out_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

events = [
    "Lahirnya Gwanggaeto yang Agung, raja ke-19 Goguryeo.",
    "Kenaikan takhta ayahnya, Raja Gogugyang, setelah kematian pamannya, Raja Sosurim.",
    "Dinobatkan sebagai Putra Mahkota.",
    "Naik takhta sebagai raja ke-19 Goguryeo mengikuti Raja Gogugyang, dan mulai menggunakan nama era Yeongnak.",
    "Memimpin 40.000 tentara untuk menyerang perbatasan utara Baekje, merebut lebih dari 10 benteng termasuk Seokhyeonseong.",
    "Ketika Baekje menyerang perbatasan selatan Goguryeo, dia memerintahkan para jenderalnya untuk memukul mundur mereka.",
    "Menaklukkan Khitan, memulihkan lebih dari 10.000 orang yang telah ditawan pada tahun ke-8 Raja Sosurim (378).",
    "Merebut Gwanmiseong, kubu utara Baekje, setelah pengepungan selama 20 hari.",
    "Kematian Raja Jinsa dari Baekje dan naiknya Raja Asin.",
    "Memukul mundur serangan Baekje di Gwanmiseong. Mendirikan 9 kuil Buddha di Pyongyang.",
    "Memukul mundur serangan Baekje di Sugokseong. Membangun 7 benteng di perbatasan selatan untuk bertahan melawan invasi Baekje.",
    "Menangkap lebih dari 8.000 pasukan Baekje hidup-hidup dan meraih kemenangan besar di Paesu. Maju ke Yeomsu (Air Asin), menaklukkan dan menundukkan suku Khitan Paeryeo.",
    "Melancarkan serangan besar-besaran ke Baekje, merebut 58 benteng dan lebih dari 700 desa di utara Sungai Han, dan mengepung Wiryeseong. Menerima penyerahan diri Raja Asin dari Baekje dan kembali dengan penuh kemenangan, menyandera saudara raja dan 10 menteri.",
    "Menaklukkan Sushen untuk menstabilkan wilayah perbatasan timur laut.",
    "Melakukan tur kerajaan ke Pyongyang. Ketika Baekje dan Wa (Jepang) menyerang Silla, Silla mengirim utusan ke Pyongyang untuk memohon bantuan.",
    "Mengirim pasukan besar sebanyak 50.000 orang ke Silla untuk mengalahkan pasukan Wa. Mengejar dan memukul mundur pasukan Wa hingga Jongbalseong di Geumgwan Gaya. Mengganti raja Silla dari Naemul Maripgan menjadi Silseong Maripgan. Raja Murong Sheng dari Yan Akhir menyerang Sinseong dan Namsosŏng.",
    "Menyerang dan merebut Sukgunseong dari Yan Akhir.",
    "Memusnahkan pasukan Wa yang menyerbu wilayah Daifang. Menyerang Yan Akhir dan menyerang hingga Komando Yan, merebutnya.",
    "Mengalahkan pasukan Yan Akhir di Yodongseong (Benteng Liaodong).",
    "Mengalahkan pasukan Yan Akhir di Mokjeoseong, dengan kuat mengamankan pendudukan Liaodong.",
    "Memobilisasi 50.000 orang untuk mengalahkan pasukan Yan Akhir dan merebut rampasan perang dalam jumlah besar. Merebut 6 benteng Yan Akhir dalam perjalanan kembali.",
    "Ketika Go Un, yang merupakan keturunan Goguryeo, mendirikan Yan Utara, ia menjalin hubungan persahabatan, sehingga menstabilkan perbatasan barat.",
    "Membangun 6 benteng termasuk Doksanseong di timur negara itu dan memindahkan rumah tangga dari Pyongyang untuk tinggal di sana. Melakukan tur kerajaan ke selatan.",
    "Menyerang dan menundukkan Buyeo Timur.",
    "Meninggal dunia.",
    "Raja Jangsu mendirikan prasasti di makamnya dan, sesuai dengan wasiatnya, menunjuk penjaga makam untuk mengelola mausoleum kerajaan."
]

titles = [
    "Penaklukan Baekje",
    "Penaklukan Khitan dan Sushen",
    "Penyelamatan Silla dan Kekalahan Wa",
    "Kemenangan dalam Perang Melawan Yan Akhir",
    "Penundukan Buyeo Timur",
    "Penguatan Urusan Dalam Negeri"
]

descs = [
    "Melancarkan serangan besar-besaran ke Baekje pada tahun 396, merebut 58 benteng dan lebih dari 700 desa di utara Sungai Han, dan menerima penyerahan diri Raja Asin.",
    "Menaklukkan Khitan pada tahun 392 untuk memulihkan rakyat yang ditawan, dan menaklukkan Sushen pada tahun 398 untuk menstabilkan wilayah perbatasan timur laut.",
    "Mengirim pasukan sebanyak 50.000 orang ke Silla pada tahun 400 untuk mengalahkan pasukan sekutu Baekje dan Wa, dan membangun pengaruh atas Silla dengan melakukan hal-hal seperti mengganti rajanya.",
    "Mengamankan pendudukan Liaodong dengan memenangkan perang sengit melawan Yan Akhir, dan menstabilkan perbatasan barat melalui hubungan persahabatan dengan Yan Utara.",
    "Memperkuat pengaruh utara Goguryeo dengan menyerang dan menundukkan Buyeo Timur pada tahun 410.",
    "Meletakkan fondasi negara dengan menekankan Pyongyang, membangun 9 kuil dan benteng di sana, dan menetapkan sistem untuk memelihara makam kerajaan sebelumnya dan penjaga makam."
]

qs = [
    "Siapa nama Gwanggaeto yang Agung?",
    "Raja Goguryeo keberapa Gwanggaeto yang Agung?",
    "Kapan Gwanggaeto yang Agung memerintah?",
    "Apa nama era Gwanggaeto yang Agung?",
    "Hasil apa yang dicapai Gwanggaeto yang Agung dalam perang melawan Baekje?",
    "Bagaimana Gwanggaeto yang Agung menyelamatkan Silla?",
    "Kapan Prasasti Gwanggaeto didirikan?"
]

ans = [
    "Namanya Damdeok atau An.",
    "Dia adalah raja ke-19 Goguryeo.",
    "Dia memerintah dari bulan lunar ke-5 tahun 391 hingga bulan lunar ke-10 tahun 412.",
    "Nama eranya adalah Yeongnak.",
    "Pada tahun 396, ia melancarkan serangan besar-besaran terhadap Baekje, merebut 58 benteng dan lebih dari 700 desa di utara Sungai Han, dan menerima penyerahan diri Raja Asin dari Baekje.",
    "Pada tahun 400, ia mengirim pasukan sebanyak 50.000 orang ke Silla, mengalahkan pasukan sekutu Baekje dan Wa, dan memberikan pengaruh atas Silla dengan mengganti rajanya.",
    "Prasasti Gwanggaeto yang Agung didirikan oleh Raja Jangsu pada tahun 414."
]

for i, x in enumerate(events): data['gwanggaeto-the-great']['timeline'][i]['event'] = x
for i, x in enumerate(titles): data['gwanggaeto-the-great']['keyAchievements'][i]['title'] = x
for i, x in enumerate(descs): data['gwanggaeto-the-great']['keyAchievements'][i]['description'] = x
for i, x in enumerate(qs): data['gwanggaeto-the-great']['faq'][i]['question'] = x
for i, x in enumerate(ans): data['gwanggaeto-the-great']['faq'][i]['answer'] = x

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
