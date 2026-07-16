import json

out_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_retry_out_1.json"

with open(out_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

events = [
    "Lahir di Zundert, Belanda.",
    "Adik laki-lakinya, Theodorus 'Theo', lahir.",
    "Dikirim ke sekolah desa di Zundert.",
    "Mendaftar di sekolah asrama di Zevenbergen.",
    "Dikirim ke sekolah menengah di Tilburg.",
    "Putus sekolah dan kembali ke rumah.",
    "Mendapat pekerjaan di galeri Goupil & Cie di Den Haag.",
    "Dipindahkan ke cabang galeri Goupil di London di Southampton Street.",
    "Diatur untuk pindah ke Paris.",
    "Diberhentikan dari galeri Goupil; bekerja sebagai guru pengganti tanpa bayaran di sebuah sekolah asrama di Ramsgate, Inggris; hidup sebagai asisten pendeta Metodis.",
    "Mempersiapkan ujian masuk teologi dengan pamannya, Johannes Stricker, di Amsterdam.",
    "Gagal dalam ujian masuk teologi dan meninggalkan rumah pamannya; mengambil kursus 3 bulan di sekolah misionaris Protestan di Laeken dekat Brussel.",
    "Mengambil posisi sebagai misionaris awam di desa pertambangan Petit Wasmes di Borinage, Belgia; diberhentikan oleh organisasi misionaris.",
    "Kembali ke Cuesmes dan tinggal bersama seorang penambang; mulai mendalami seni dengan sungguh-sungguh atas rekomendasi Theo.",
    "Berangkat ke Brussel dan mendaftar di Académie Royale des Beaux-Arts.",
    "Kembali ke Etten untuk tinggal lama bersama keluarganya; melamar putri pamannya, Cornelia 'Kee' Vos-Stricker, tetapi ditolak.",
    "Belajar melukis cat minyak dari Anton Mauve dan mendirikan studio; memulai hubungan dengan Clasina Maria 'Sien' Hoornik, seorang pelacur alkoholik; menghabiskan tiga minggu di rumah sakit karena serangan gonore.",
    "Meninggalkan Sien dan anak-anaknya; pindah ke provinsi Drenthe di utara Belanda; kembali ke rumah orang tuanya di Nuenen.",
    "Jatuh cinta dengan tetangganya Margot Begemann, tetapi ia mencoba bunuh diri dengan racun karena tentangan keluarga mereka terhadap pernikahan tersebut.",
    "Ayahnya meninggal pada 26 Maret; menyelesaikan 'The Potato Eaters'; 'The Potato Eaters' pertama kali dipamerkan ke publik di Den Haag.",
    "Pindah ke Antwerpen.",
    "Mengambil ujian masuk untuk tingkat yang lebih tinggi di Akademi Seni Rupa Kerajaan di Antwerpen dan diterima; dirawat di rumah sakit karena kerja berlebihan, pola makan yang buruk, dan merokok berlebihan; pindah ke Paris, tinggal di apartemen saudaranya Theo, dan belajar seni di studio Fernand Cormon.",
    "Pindah ke Asnières-sur-Seine, pinggiran barat laut Paris; berteman dengan Paul Gauguin; mengadakan pameran di Montmartre bersama Bernard, Anquetin, dan Toulouse-Lautrec.",
    "Meninggalkan Paris untuk beristirahat dan pindah ke Arles di Prancis selatan; menyewa empat kamar di 2 Place Lamartine di Arles; Paul Gauguin tiba di Arles; setelah bertengkar dengan Gauguin, ia memotong telinga kirinya dan dirawat di rumah sakit.",
    "Kembali ke Rumah Kuning di Arles; sebuah petisi oleh penduduk kota menyebabkan polisi menutup rumahnya, mengirimnya kembali ke rumah sakit; secara sukarela memasukkan dirinya ke rumah sakit jiwa Saint-Paul-de-Mausole di Saint-Rémy-de-Provence.",
    "Albert Aurier memuji karyanya di 'Mercure de France'; menerima undangan dari Les XX di Brussel untuk berpartisipasi dalam pameran tahunan mereka; berpartisipasi dalam Salon des Indépendants ke-6 di Champs-Élysées di Paris; meninggalkan klinik di Saint-Rémy dan pindah ke Auvers-sur-Oise, pinggiran Paris.",
    "Mencoba bunuh diri dengan menembak dadanya dengan revolver pada 27 Juli.",
    "Meninggal pada 29 Juli.",
    "Dimakamkan di pemakaman kota Auvers-sur-Oise pada 30 Juli.",
    "Saudaranya Theo meninggal pada 25 Januari.",
    "Janda Theo, Johanna van Gogh-Bonger, menggali jenazah Theo dan memakamkannya kembali di sebelah makam Vincent."
]

titles = [
    "Master Pasca-Impresionisme",
    "Seniman Produktif",
    "Warna dan Goresan Kuas yang Berani",
    "Penggunaan Warna Simbolis",
    "Seri Potret Diri",
    "Ketenaran Global Anumerta"
]

descs = [
    "Salah satu pelukis Pasca-Impresionis paling terkenal dan berpengaruh dalam sejarah seni Barat, berkontribusi pada kebangkitan Ekspresionisme dalam seni modern.",
    "Menciptakan sekitar 2.100 karya seni, termasuk sekitar 860 lukisan cat minyak, hanya dalam waktu lebih dari satu dekade.",
    "Membangun gaya unik yang ditandai dengan warna-warna berani dan sapuan kuas dramatis pada lanskap, lukisan alam benda, potret, dan potret diri.",
    "Percaya bahwa warna membawa beban psikologis dan moral di luar penggambaran sederhana, terutama menggunakan warna kuning sebagai simbol sinar matahari, kehidupan, dan yang ilahi.",
    "Menghasilkan lebih dari 43 potret diri antara tahun 1885 dan 1889, mengekspresikan tingkat introspeksi yang tinggi dan berbagai kondisi mental serta fisik.",
    "Meskipun dia hanya menjual satu lukisan selama hidupnya, setelah kematiannya, seni dan kisah hidupnya memikat imajinasi publik sebagai simbol kejeniusan yang disalahpahami, dan karya-karyanya adalah beberapa lukisan termahal yang pernah terjual."
]

qs = [
    "Berapa banyak lukisan yang dijual Vincent van Gogh selama hidupnya?",
    "Berapa banyak karya seni yang diciptakan Vincent van Gogh semasa hidupnya?",
    "Mengapa Vincent van Gogh memotong telinganya?",
    "Bagaimana Vincent van Gogh meninggal?",
    "Seperti apa hubungan antara Vincent van Gogh dan saudaranya Theo?",
    "Lukisan Van Gogh manakah yang terjual dengan harga tertinggi?"
]

ans = [
    "Selama hidupnya, Van Gogh hanya menjual satu lukisan: 'Kebun Anggur Merah di Arles' ('The Red Vineyard at Arles').",
    "Dia menciptakan sekitar 2.100 karya seni, termasuk sekitar 860 lukisan cat minyak, hanya dalam waktu lebih dari satu dekade.",
    "Setelah pertengkaran dengan Paul Gauguin, dia tampak berhalusinasi dan memotong seluruh atau sebagian telinga kirinya dengan pisau cukur, yang menunjukkan bahwa dia menderita gangguan mental akut.",
    "Pada tanggal 27 Juli 1890, pada usia 37 tahun, ia mencoba bunuh diri dengan menembak dadanya sendiri dengan revolver di ladang gandum, dan meninggal karena infeksi luka tersebut dua hari kemudian pada tanggal 29 Juli.",
    "Adik laki-lakinya Theo mendukung Vincent secara finansial dan emosional, dan keduanya mempertahankan persahabatan yang mendalam, bertukar ratusan surat sepanjang hidup mereka.",
    "Pada tanggal 15 Mei 1990, lukisannya 'Portrait of Dr. Gachet' (versi pertama) terjual seharga $82,5 juta di Christie's, mencetak rekor harga tertinggi yang baru."
]

for i, x in enumerate(events): data['vincent-van-gogh']['timeline'][i]['event'] = x
for i, x in enumerate(titles): data['vincent-van-gogh']['keyAchievements'][i]['title'] = x
for i, x in enumerate(descs): data['vincent-van-gogh']['keyAchievements'][i]['description'] = x
for i, x in enumerate(qs): data['vincent-van-gogh']['faq'][i]['question'] = x
for i, x in enumerate(ans): data['vincent-van-gogh']['faq'][i]['answer'] = x

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
