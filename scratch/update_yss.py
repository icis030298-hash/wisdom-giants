import json

out_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_retry_out_1.json"

with open(out_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

events = [
    "Lahir pada 28 April (8 Maret menurut kalender lunar) sebagai putra ketiga Yi Jeong di Geoncheon-dong, Distrik Selatan, Hanseong-bu.",
    "Menikahi Nyonya Bang dan bersiap untuk ujian militer sambil mempelajari seni militer di bawah naungan ayah mertuanya, Bang Jin.",
    "Mengikuti ujian militer khusus pada usia 27 tahun, tetapi jatuh dari kudanya dan gagal.",
    "Lulus ujian militer tiga tahunan pada 22 Maret di usia 32 tahun, menempati posisi keempat dalam kategori Pyonggwa (丙科), dan memulai karier resminya sebagai penjabat instruktur (Gwonji Hullyeonwon Bongsa).",
    "Menjadi komandan pertahanan perbatasan (Gwongwan) Donggubibo pada bulan Desember.",
    "Menjabat sebagai pejabat pelatihan militer (Hullyeonwon Bongsa) di Haemi selama 10 bulan.",
    "Dipindahkan pada bulan Desember untuk menjabat sebagai perwira militer bagi Komandan Angkatan Darat Provinsi Chungcheong.",
    "Dipindahkan pada bulan Juli untuk menjabat sebagai komandan angkatan laut (Manho) Balpojin di Provinsi Jeolla.",
    "Saat menjabat sebagai komandan Balpojin pada bulan Januari, ia diberhentikan oleh Seo Ik karena diduga gagal merawat senjata militer dengan baik, tetapi segera dipekerjakan kembali.",
    "Menjadi pejabat pelatihan militer (Hullyeonwon Bongsa) pada bulan Mei.",
    "Direkomendasikan oleh Yi Yong, Komandan Angkatan Darat Provinsi Hamgyong Selatan, pada bulan Juli, dan menjadi perwira militernya.",
    "Direkomendasikan dan dikirim sebagai komandan pertahanan perbatasan (Gwongwan) Geonwonbo pada bulan Agustus.",
    "Mengalami kematian ayahnya pada 15 November.",
    "Menjadi asisten master (Jubu) di Istal Kerajaan pada bulan Januari, diikuti dengan penunjukan bersamaan sebagai komandan (Manho) Josan dan pengawas pertanian militer (Dunjeonsaui) Nokdo.",
    "Pada bulan September, Pertempuran Nokdundo pecah menyusul serangan mendadak oleh bangsa Jurchen, dan Yi Sun-shin tetap tinggal bersama Yi Gyeong-rok untuk bertarung dan meraih kemenangan.",
    "Pada bulan Oktober, Komandan Angkatan Darat Utara, Yi Il, menyalahkannya atas kekalahan di Nokdundo, yang mengakibatkan pemecatannya, pemenjaraannya, dan wajib militer ke dalam angkatan darat sebagai rakyat jelata (Baeguijonggun).",
    "Diampuni dan dipekerjakan kembali setelah menangkap pemimpin Jurchen Ueulginae selama ekspedisi kedua ke Nokdundo.",
    "Direkomendasikan oleh Yi San-hae, Jeong Eon-sin, dan lain-lain untuk penunjukan luar biasa oleh Dewan Pertahanan Perbatasan (Bibyeonsa) pada bulan Januari.",
    "Menjadi perwira militer bagi Inspektur Jenderal Provinsi Jeolla pada bulan Februari.",
    "Menjadi utusan kerajaan militer (Mugyeom Seonjeongwan) pada bulan November.",
    "Diangkat sebagai hakim Jeongeup pada bulan Desember atas rekomendasi Ryu Seong-ryong, dan memerintah kota dengan pemerintahan yang penuh kebajikan, menerima pujian luas dari rakyat.",
    "Atas perintah Raja Seonjo pada bulan Februari, ia dipromosikan dari hakim Jeongeup menjadi hakim wilayah Jindo, komandan Garipo, dan kemudian diangkat sebagai Komandan Angkatan Laut Kiri Provinsi Jeolla.",
    "Menerima berita invasi Jepang di Busanpo melalui pengiriman dari Won Gyun pada pukul 22.00 pada 26 Mei (16 April menurut kalender lunar).",
    "Meraih kemenangan pertamanya di Pertempuran Okpo pada 16 Juni (7 Mei menurut kalender lunar), menenggelamkan 26 kapal armada Jepang.",
    "Mengerahkan Kapal Kura-kura untuk pertama kalinya pada Pertempuran Sacheon pada 8 Juli (29 Mei menurut kalender lunar), menghancurkan 13 kapal Jepang.",
    "Sangat mengalahkan pasukan Jepang menggunakan formasi 'Sayap Bangau' (Hakikjin) di Pertempuran Pulau Hansan pada 14 Agustus (8 Juli menurut kalender lunar).",
    "Dipromosikan ke pangkat Jaheondaebu pada 16 Agustus.",
    "Menghancurkan lebih dari 100 kapal Jepang di Pertempuran Busan pada 1 September (kalender lunar).",
    "Maju ke Ungpo di Ungcheon pada 12 Maret (10 Februari menurut kalender lunar) dan terlibat dalam Pertempuran Ungpo.",
    "Diangkat oleh istana kerajaan Joseon sebagai Panglima Tertinggi Angkatan Laut Tiga Provinsi (Samdo Sugun Tongjesa) pada 1 Agustus (kalender lunar).",
    "Diberhentikan dari jabatan Panglima Tertinggi pada 11 April (25 Februari menurut kalender lunar), dikawal ke Hanseong, dan dipenjara.",
    "Diselamatkan dari hukuman mati pada 16 Mei (1 April menurut kalender lunar) dan diperintahkan untuk bertugas sebagai prajurit biasa (Baeguijonggun) di bawah Panglima Tertinggi Gwon Yul.",
    "Ibunya meninggal di atas kapal pada 26 Mei (11 April menurut kalender lunar) saat ia bertugas sebagai prajurit biasa.",
    "Diangkat kembali sebagai Panglima Tertinggi Angkatan Laut Tiga Provinsi pada 28 Agustus (16 Juli menurut kalender lunar) setelah kekalahan telak Won Gyun di Pertempuran Chilcheollyang.",
    "Meraih kemenangan besar di Pertempuran Myeongnyang pada 26 Oktober (16 September menurut kalender lunar), menghancurkan lebih dari 130 dari ratusan kapal Jepang hanya dengan 13 kapal perang.",
    "Gugur dalam pertempuran oleh peluru nyasar saat mengejar pasukan Jepang yang mundur di Pertempuran Noryang pada 19 November (kalender lunar).",
    "Dipromosikan secara anumerta menjadi Pangkat Pertama Senior (Jeong 1-pum), Daegwang Boguk Sungnok Daebu, Penasihat Negara Kanan Dewan Negara, dan merangkap Penceramah Kerajaan pada bulan Desember.",
    "Dihormati secara anumerta sebagai Subjek Berjasa Seonmu Kelas Satu dan Deokpung Buwongun pada bulan Juni, dan tambahan diberikan gelar Penasihat Negara Kiri dan merangkap Penceramah Kerajaan pada bulan Juli.",
    "Menerima gelar anumerta 'Chungmu' (Kesetiaan dan Keberanian) dari Raja Injo pada bulan Maret, menjadi Chungmugong.",
    "Tambahan dipromosikan secara anumerta ke Pangkat Pertama Senior, Kepala Penasihat Negara Dewan Negara, oleh Raja Jeongjo pada bulan Juli."
]

titles = [
    "Lulus Ujian Militer",
    "Kemenangan di Pertempuran Nokdundo",
    "Pengembangan dan Pembuatan Kapal Kura-kura",
    "Kemenangan dalam Pertempuran Angkatan Laut Utama Perang Imjin",
    "Menjabat sebagai Panglima Tertinggi Angkatan Laut Tiga Provinsi",
    "Kemenangan Besar di Pertempuran Myeongnyang",
    "Kemenangan di Pertempuran Noryang dan Gugur dalam Tugas",
    "Dihormati sebagai Pahlawan-Suci"
]

descs = [
    "Lulus ujian militer tiga tahunan pada tahun 1576 di usia 32 tahun, menempati posisi keempat dalam kategori Pyonggwa, dan memulai karier resminya.",
    "Pada tahun 1587, selama Pertempuran Nokdundo yang disebabkan oleh serangan mendadak oleh bangsa Jurchen, dia tetap tinggal bersama Yi Gyeong-rok, berjuang dan menang, menyelamatkan lebih dari 60 warga Joseon.",
    "Segera setelah pengangkatannya sebagai Komandan Angkatan Laut Kiri Jeolla, dia memperkuat persiapan militer dengan memperluas senjata dan perbekalan serta mengembangkan dan membangun Kapal Kura-kura sebagai persiapan untuk perang.",
    "Setelah pecahnya Perang Imjin, dia berturut-turut mengalahkan angkatan laut Jepang dalam pertempuran laut utama termasuk Okpo, Sacheon, Pulau Hansan, dan Busan, merebut kendali laut dan memutus jalur pasokan Jepang.",
    "Diangkat sebagai Panglima Tertinggi Angkatan Laut Tiga Provinsi (Samdo Sugun Tongjesa) pada tahun 1593, mengambil komando tertinggi dan membangun kembali angkatan laut Joseon.",
    "Setelah kekalahan di Chilcheollyang, ia meraih kemenangan besar di Selat Myeongnyang dengan 12 kapal melawan ratusan kapal Jepang, membalikkan keadaan Perang Jeongyu (Invasi Kedua).",
    "Dalam Pertempuran Noryang pada tahun 1598, ia bergabung dengan angkatan laut Ming untuk mengalahkan dengan parah pasukan Jepang yang mundur, dan terbunuh dalam tugas oleh peluru nyasar selama pertempuran.",
    "Dihormati sebagai santo bela diri yang menyelamatkan bangsa melalui kemenangan berturut-turut dalam pertempuran laut melawan angkatan laut Jepang dengan kecerdasan brilian dan strategi luar biasa sebagai Panglima Tertinggi Angkatan Laut Tiga Provinsi selama Perang Imjin."
]

qs = [
    "Kapan dan di mana Yi Sun-shin lahir?",
    "Kapan Yi Sun-shin lulus ujian militer?",
    "Mengapa Yi Sun-shin dicopot pangkatnya dan dijadikan sebagai prajurit biasa (Baeguijonggun) sebanyak dua kali?",
    "Di pertempuran laut manakah Yi Sun-shin gugur dalam tugas?",
    "Apa saja tulisan terkenal yang ditinggalkan oleh Yi Sun-shin?",
    "Gelar anumerta apa yang diterima Yi Sun-shin?",
    "Bagaimana struktur keluarga Yi Sun-shin?"
]

ans = [
    "Yi Sun-shin lahir pada 28 April 1545 (8 Maret menurut kalender lunar) di Geoncheon-dong, Distrik Selatan, Hanseong-bu (dekat Gedung Sindo saat ini di 19 Eulji-ro 18-gil, Jung-gu, Seoul).",
    "Yi Sun-shin lulus ujian militer tiga tahunan pada 22 Maret 1576 (tahun ke-9 Raja Seonjo) di usia 32 tahun, menempati posisi keempat dalam kategori Pyonggwa.",
    "Pertama kali pada tahun 1587 ketika Komandan Angkatan Darat Utara Yi Il salah menyalahkannya atas kekalahan di Pertempuran Nokdundo, yang menyebabkan pemenjaraannya dan wajib militer selanjutnya sebagai prajurit biasa. Kedua kalinya adalah pada tahun 1597 ketika dia diberhentikan dari jabatannya sebagai Panglima Tertinggi dan diperintahkan untuk mengabdi sebagai tentara biasa atas tuduhan tidak mematuhi perintah pengadilan.",
    "Yi Sun-shin gugur dalam tugas karena peluru nyasar pada 19 November 1598 (kalender lunar), selama Pertempuran Noryang saat mengejar pasukan Jepang yang mundur.",
    "Yi Sun-shin meninggalkan 'Nanjung Ilgi' (Buku Harian Perang), yang mencatat pengalamannya selama Perang Imjin, dan 'Chungmugong Yi Sun-shin Jeonseo', kumpulan lengkap karya anumertanya.",
    "Yi Sun-shin menerima gelar anumerta 'Chungmu' (Kesetiaan dan Keberanian) dari Raja Injo pada bulan Maret 1643 (tahun ke-21 Raja Injo), sehingga menjadi Chungmugong.",
    "Yi Sun-shin memiliki tiga putra (Yi Hoe, Yi Ye, Yi Myeon) dan satu putri dengan istrinya, Nyonya Bang dari Sangju (klan Onyang Bang), serta dua putra (Yi Hun, Yi Sin) dan dua putri dengan selirnya, Nyonya Oh dari Haeju."
]

for i, x in enumerate(events): data['yi-sun-shin']['timeline'][i]['event'] = x
for i, x in enumerate(titles): data['yi-sun-shin']['keyAchievements'][i]['title'] = x
for i, x in enumerate(descs): data['yi-sun-shin']['keyAchievements'][i]['description'] = x
for i, x in enumerate(qs): data['yi-sun-shin']['faq'][i]['question'] = x
for i, x in enumerate(ans): data['yi-sun-shin']['faq'][i]['answer'] = x

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
