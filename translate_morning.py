import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-morning-motivation_para_000.json": "## Fajar Hari yang Baru: Sebuah Kebangkitan Filosofis",
  "quotes-morning-motivation_para_001.json": "Transisi dari tidur ke bangun menghadirkan peluang yang unik. Itu adalah ruang liminal, kanvas tempat niat hari itu bisa dilukis. Di dunia modern kita yang serba cepat dan sering kali luar biasa sibuk, penanaman awal hari yang positif dan disengaja bukan sekadar basa-basi; ini merupakan keharusan strategis untuk ketabahan mental dan kesejahteraan yang berkelanjutan. Dunia kuno, meskipun sangat berbeda dalam realitas materialnya, bergulat dengan perjuangan manusia yang serupa: kecemasan pemerintahan, pengejaran kebajikan, sifat kehidupan yang fana, dan tuntutan tanggung jawab yang tiada henti. Kepada kebijaksanaan para raksasa sejarah inilah – kaisar Stoik Marcus Aurelius, negarawan polimatik Benjamin Franklin, dan filsuf Stoik Seneca – kita berpaling untuk mendapatkan panduan abadi tentang cara menyambut setiap pagi dengan tujuan dan ketangguhan.",
  "quotes-morning-motivation_para_002.json": "### Marcus Aurelius: Benteng Batin Sang Kaisar",
  "quotes-morning-motivation_para_003.json": "Marcus Aurelius, Kaisar Romawi dari tahun 161 hingga 180 M, adalah seorang pria yang dibebani dengan tanggung jawab besar, terus-menerus menavigasi perang, wabah, dan intrik politik. Namun, dalam refleksi pribadinya, yang dikenal sebagai \"Meditations,\" ia menempa filosofi kedamaian batin dan tata kelola diri yang rasional. Pagi harinya bukanlah untuk menyerah pada kekacauan eksternal melainkan untuk memperkuat pikirannya sendiri. Ia memahami bahwa meskipun kita tidak dapat mengendalikan peristiwa eksternal, kita memiliki kekuasaan mutlak atas reaksi kita terhadapnya. Ini adalah fondasi pemikiran Stoik dan penawar yang kuat untuk kecemasan yang melanda para profesional modern, pelajar, dan individu yang menghadapi ketidakpastian karier atau pencarian makna eksistensial.",
  "quotes-morning-motivation_para_004.json": "Aurelius sering mengingatkan dirinya akan sifat kehidupan yang fana dan pentingnya berfokus pada apa yang berada dalam kendali kita. Tulisan-tulisannya menawarkan cetak biru yang mendalam untuk disiplin diri dan kehidupan etis, yang dapat diterapkan pada kesibukan harian dari tenggat waktu, konflik antarpribadi, dan tekanan tanpa henti untuk berprestasi.",
  "quotes-morning-motivation_para_005.json": "> \"Saat fajar menyingsing, ketika Anda kesulitan untuk bangun, biarkan pikiran ini menahan Anda: Saya bangkit untuk melakukan pekerjaan manusia.\"",
  "quotes-morning-motivation_para_006.json": "Pernyataan sederhana namun mendalam ini, yang ditulis di tengah tuntutan sebuah kekaisaran, berbicara langsung tentang perjuangan modern melawan penundaan dan perasaan kewalahan. Hal itu membingkai ulang alarm pagi bukan sebagai musuh, melainkan sebagai panggilan untuk merangkul tujuan bawaan kita dan berkontribusi pada dunia, sekecil apa pun ruang lingkup pengaruh kita mungkin terlihat.",
  "quotes-morning-motivation_para_007.json": "### Benjamin Franklin: Arsitek Pengembangan Diri",
  "quotes-morning-motivation_para_008.json": "Benjamin Franklin, Bapak Pendiri Amerika Serikat, mencontohkan cita-cita Pencerahan dari individu mandiri. Kehidupannya adalah bukti kekuatan pembentukan kebiasaan yang rajin dan penyelidikan yang rasional. Franklin dengan cermat mendokumentasikan rutinitas hariannya dan eksperimen pribadinya dalam pengembangan diri, dengan terkenal menguraikan tiga belas kebajikan yang berusaha ia kembangkan. Pendekatannya terhadap pagi hari adalah salah satu niat yang terstruktur, dirancang untuk memaksimalkan produktivitas dan pertumbuhan moral.",
  "quotes-morning-motivation_para_009.json": "Pertanyaan pagi hari Franklin yang terkenal, \"Kebaikan apa yang akan kulakukan hari ini?\", merupakan pendorong kuat bagi siapa pun yang berusaha menanamkan tindakan harian mereka dengan makna. Hal ini mengalihkan fokus dari konsumsi pasif atau pemecahan masalah reaktif ke arah kontribusi proaktif dan pertimbangan etis. Pertanyaan ini sangat relevan di dunia saat ini, di mana batas antara pekerjaan dan kehidupan pribadi memudar, dan keinginan untuk membuat perbedaan nyata menjadi semakin penting.",
  "quotes-morning-motivation_para_010.json": "> \"Tidur lebih awal dan bangun lebih awal membuat seseorang sehat, kaya, dan bijaksana.\"",
  "quotes-morning-motivation_para_011.json": "Meskipun sering dikutip, kebijaksanaan di sini melampaui sekadar kesehatan fisik atau keuntungan finansial. Hal ini berbicara mengenai disiplin yang diperlukan untuk menumbuhkan pikiran yang tajam sekaligus seimbang, yang mampu menavigasi tantangan kompleks dengan kejelasan dan pandangan ke depan. Pendekatan sistematis Franklin terhadap kehidupan, pengejaran pengetahuannya yang konstan, dan dedikasinya pada pelayanan publik menawarkan model yang menarik bagi individu modern yang berjuang untuk meraih kesuksesan tanpa mengorbankan integritas atau kesejahteraan mereka.",
  "quotes-morning-motivation_para_012.json": "### Seneca: Menguasai Seni Kehidupan",
  "quotes-morning-motivation_para_013.json": "Lucius Annaeus Seneca, seorang filsuf Stoik terkemuka, negarawan, dan penulis naskah drama Kekaisaran Romawi, menawarkan wawasan mendalam tentang kondisi manusia, terutama pengelolaan emosi dan apresiasi waktu. Surat-suratnya, yang ditujukan kepada temannya Lucilius, adalah harta karun berupa filosofi praktis, dirancang untuk membimbing pembaca menuju kehidupan yang bajik dan tenang. Seneca menyadari bahwa sebagian besar penderitaan kita bersumber bukan dari keadaan eksternal, melainkan dari penilaian dan kecemasan kita sendiri mengenai hal itu.",
  "quotes-morning-motivation_para_014.json": "Penekanannya pada momen saat ini dan penggunaan waktu terbatas kita dengan penuh kesadaran sangat selaras dengan kekhawatiran kontemporer tentang kelelahan (burnout) dan perasaan bahwa hidup ini berlalu begitu saja. Ajaran Seneca mendorong kita untuk menghadapi ketakutan kita, hidup selaras dengan alam, dan menemukan kepuasan bukan pada harta benda eksternal, melainkan pada kultivasi diri batin kita.",
  "quotes-morning-motivation_para_015.json": "> \"Bukannya kita memiliki waktu yang singkat untuk hidup, melainkan kita membuang banyak waktu.\"",
  "quotes-morning-motivation_para_016.json": "Pengamatan yang tajam ini berfungsi sebagai pengingat yang kuat untuk mendekati setiap hari dengan intensionalitas. Bagi mereka yang sedang menavigasi transisi karier, menghadapi kemunduran pribadi, atau sekadar berusaha menemukan makna yang lebih dalam di rutinitas mereka, filosofi Seneca memberikan kerangka kerja untuk merebut kembali kendali atas waktu dan perhatian seseorang. Dengan secara sadar memilih bagaimana kita menghabiskan pagi kita – baik dalam perenungan yang tenang, perencanaan terfokus, atau persiapan yang sadar – kita dapat meletakkan dasar untuk hari yang dijalani dengan tujuan yang lebih besar dan penyesalan yang lebih sedikit.",
  "quotes-morning-motivation_para_017.json": "## Merangkul Pagi Hari: Panggilan Bertindak",
  "quotes-morning-motivation_para_018.json": "Kebijaksanaan Marcus Aurelius, Benjamin Franklin, dan Seneca, yang ditempa di zaman yang jauh dari zaman kita, tetap sangat kuat. Wawasan mereka mengenai disiplin diri, tindakan bertujuan, dan penatalayanan waktu yang sadar menawarkan perangkat ampuh untuk menghadapi kompleksitas eksistensi modern. Dengan mengadopsi sebagian kecil saja dari niat mereka di pagi hari kita – dengan menanyakan pada diri sendiri pertanyaan tentang kebaikan milik Franklin, merenungkan tugas dari Aurelius, atau mengindahkan peringatan Seneca terhadap waktu yang terbuang – kita dapat mengubah kebangkitan harian kita dari sekadar transisi menjadi ritual pemberdayaan diri yang kuat. Fajar, karenanya, bukan hanya akhir dari malam, melainkan awal dari sebuah peluang: peluang untuk menumbuhkan kebijaksanaan, membina kepositifan, dan menjalani hidup dengan makna serta ketangguhan yang lebih besar.",
  "quotes-morning-motivation_title.json": "Kebijaksanaan Harian untuk Inspirasi Pagi: Memulai Hari dengan Kepositifan"
}'''

T = json.loads(json_str)

for filename, text in T.items():
    in_path = os.path.join(tasks_dir, filename)
    out_path = os.path.join(results_dir, filename)
    with open(in_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    out_data = {
        'slug': data['slug'],
        'type': data['type']
    }
    if 'index' in data:
        out_data['index'] = data['index']
    out_data['id_text'] = text
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out_data, f, ensure_ascii=False, indent=2)

print('Done quotes-morning-motivation')
