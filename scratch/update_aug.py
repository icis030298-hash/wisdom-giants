import json

out_file = r"c:\Users\user\OneDrive\바탕 화면\wisdom-giants-20260512T091146Z-3-001\wisdom-giants\scratch\task3_id_retry_out_1.json"

with open(out_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

events = [
    "Lahir di kota Roma.",
    "Kematian ayahnya, Octavius.",
    "Menyampaikan orasi pemakaman untuk nenek dari pihak ibunya, Julia Caesaris.",
    "Mengenakan toga virilis dan terpilih menjadi anggota Dewan Pontifex.",
    "Memimpin pertandingan Yunani untuk menghormati Kuil Venus Genetrix, yang dibangun oleh Caesar.",
    "Pembunuhan ayah angkatnya, Julius Caesar.",
    "Tiba di Roma dan bertemu Mark Antony.",
    "Mengalahkan dua legiun di bawah komando Antony.",
    "Diterima di Senat dan diberikan komando militer.",
    "Mengalahkan pasukan Antony di Pertempuran Forum Gallorum dan Pertempuran Mutina.",
    "Diangkat menjadi konsul.",
    "Membentuk Triumvirat Kedua bersama Antony dan Lepidus di dekat Bologna.",
    "Senat Romawi mendeklarasikan Julius Caesar sebagai dewa.",
    "Mengalahkan pasukan Brutus dan Cassius di Pertempuran Filipi.",
    "Mengakhiri pengepungan Lucius Antonius di Perusia dan menerima penyerahan dirinya.",
    "Mengeksekusi 300 senator dan penunggang kuda yang telah bekerja sama dengan Lucius Antonius.",
    "Menandatangani Perjanjian Brundisium dengan Antony.",
    "Menikahkan kakak perempuannya, Octavia Minor, dengan Antony.",
    "Menyimpulkan perjanjian perdamaian sementara, Pakta Misenum, dengan Sextus Pompey.",
    "Menceraikan Scribonia dan menikahi Livia Drusilla.",
    "Setuju untuk memperpanjang Triumvirat selama lima tahun lagi.",
    "Sepenuhnya menghancurkan armada Sextus Pompey di Pertempuran Naulochus.",
    "Senat mencabut kekuasaan konsuler Antony dan menyatakan perang terhadap Mesir.",
    "Mengalahkan armada Antony dan Cleopatra di Pertempuran Actium.",
    "Mulai memegang jabatan konsul setiap tahun.",
    "Meraih kemenangan di Aleksandria, yang menyebabkan bunuh diri Antony dan Cleopatra.",
    "Diberi gelar 'Warga Negara Pertama dari Negara' (princeps civitatis) oleh Senat.",
    "Setelah mengakhiri perang saudara, menyatakan kembalinya kekuasaan luar biasa kepada Senat dan dianugerahi gelar 'Augustus'.",
    "Menikahkan putrinya Julia dengan putra saudara perempuannya, Marcellus.",
    "Marcellus meninggal, dan Augustus mengundurkan diri dari jabatan konsul.",
    "Secara pribadi melakukan pembangunan jalan.",
    "Akhirnya menekan pemberontakan di wilayah Cantabria di Spanyol.",
    "Menjabat sebagai Pontifex Maximus setelah kematian Lepidus.",
    "Anak tirinya Drusus meninggal setelah jatuh dari kuda di Germania.",
    "Terpilih sebagai konsul, dan cucu dari pihak ibu, Gaius Caesar, memulai karir politiknya.",
    "Terpilih sebagai konsul, cucu dari pihak ibu, Lucius Caesar, memulai karir politiknya, dan ia dianugerahi gelar 'Bapak Negara' (pater patriae) oleh Senat dan rakyat Romawi.",
    "Cucu dari pihak ibu, Lucius Caesar, meninggal muda.",
    "Cucu dari pihak ibu, Gaius Caesar, meninggal muda, dan ia mengadopsi Tiberius dan Agrippa Postumus sebagai putra-putranya.",
    "Mendirikan 'Perbendaharaan Militer' (aerarium militare) untuk mendanai pensiun bagi tentara aktif dan pensiunan.",
    "Tiga legiun Romawi dimusnahkan oleh suku Jermanik di Hutan Teutoburg.",
    "Tiberius diberikan semua hak prerogatif yang dipegang oleh Augustus.",
    "Meninggal di Nola, dan Senat serta majelis rakyat menyatakannya sebagai dewa."
]

titles = [
    "Kaisar Pertama Kekaisaran Romawi",
    "Pembentukan Pax Romana",
    "Perluasan Wilayah Kekaisaran dan Perlindungan Perbatasan",
    "Peningkatan Sistem Negara",
    "Pembangunan Kembali Kota Roma",
    "Pencatatan 'Res Gestae Divi Augusti'",
    "Dianugerahi Gelar 'Augustus'",
    "Diberi Gelar 'Warga Negara Pertama dari Negara'",
    "Mengamankan Komando Militer",
    "Reformasi Pajak",
    "Penamaan Bulan 'Agustus'",
    "Proyek Konstruksi",
    "Pembentukan Dana Pensiun Militer"
]

descs = [
    "Memerintah sebagai Kaisar pertama Kekaisaran Romawi dan pendiri dinasti Julio-Claudian.",
    "Pemerintahannya mengantarkan era perdamaian dan kemakmuran yang dikenal sebagai 'Pax Romana' (Perdamaian Romawi), yang mempertahankan perdamaian di dunia Mediterania selama lebih dari dua abad.",
    "Memperluas wilayah Kekaisaran Romawi, melindungi perbatasan dan sekutunya, dan menyimpulkan perjanjian perdamaian dengan Parthia.",
    "Mereformasi sistem perpajakan Roma, membangun jaringan transportasi darat, dan membentuk pasukan tetap, angkatan laut kecil, dan Pengawal Praetoria.",
    "Membentuk pasukan polisi dan pemadam kebakaran di Roma dan membangun kembali sebagian besar kota secara ekstensif.",
    "Sebelum kematiannya, dia meninggalkan catatan pencapaiannya yang dikenal sebagai 'Res Gestae Divi Augusti'.",
    "Menerima gelar 'Augustus', yang berarti 'yang dihormati', dari Senat.",
    "Diberi gelar 'princeps civitatis' (Warga Negara Pertama dari Negara) oleh Senat, yang berarti tokoh terkemuka.",
    "Menjadi komandan tertinggi militer Romawi dan memegang wewenang untuk merayakan kemenangan.",
    "Melaksanakan reformasi pajak, termasuk pajak langsung tarif tetap pada penduduk provinsi dan pengenalan sistem pemungutan pajak yang dikelola oleh pegawai negeri sipil.",
    "Mantan 'bulan keenam' (Sextilis) berganti nama menjadi 'Augustus' (Agustus) untuk menghormatinya.",
    "Berkontribusi sangat signifikan pada pengembangan arsitektur Roma sehingga ia dengan bangga membual, 'Saya menemukan Roma sebagai kota batu bata dan meninggalkannya sebagai kota marmer'.",
    "Mendirikan 'Perbendaharaan Militer' (aerarium militare) untuk memberikan pensiun bagi tentara yang bertugas aktif dan yang sudah pensiun."
]

qs = [
    "Siapa nama asli Augustus?",
    "Bagaimana Augustus menjadi kaisar pertama Kekaisaran Romawi?",
    "Apa pencapaian terbesar era Augustus?",
    "Apakah Augustus menikmati perjudian?",
    "Mengapa bulan Agustus dinamai Augustus?"
]

ans = [
    "Sebelum diadopsi oleh Caesar, namanya adalah Gaius Octavius, dan setelah diadopsi, ia dikenal sebagai Gaius Julius Caesar Octavianus.",
    "Setelah runtuhnya Triumvirat Kedua, ia memonopoli kekuasaan dan, setelah menerima gelar 'Augustus' dari Senat pada 27 SM, menjadi kaisar pertama Kekaisaran Romawi.",
    "Pemerintahannya membawa era kemakmuran yang dikenal sebagai 'Pax Romana' (Perdamaian Romawi), mempertahankan perdamaian di dunia Mediterania selama lebih dari dua abad.",
    "Bertentangan dengan citra stoisnya, ia menikmati perjudian, terutama permainan dadu dan ganjil-genap, dan sering membangun persahabatan dengan sengaja kehilangan uang.",
    "Berdasarkan keputusan Senat Romawi, bulan tersebut dinamai untuk menghormatinya untuk memperingati penaklukan Aleksandria dan kenaikan kekuasaannya pada Agustus 30 SM."
]

for i, x in enumerate(events): data['augustus']['timeline'][i]['event'] = x
for i, x in enumerate(titles): data['augustus']['keyAchievements'][i]['title'] = x
for i, x in enumerate(descs): data['augustus']['keyAchievements'][i]['description'] = x
for i, x in enumerate(qs): data['augustus']['faq'][i]['question'] = x
for i, x in enumerate(ans): data['augustus']['faq'][i]['answer'] = x

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
