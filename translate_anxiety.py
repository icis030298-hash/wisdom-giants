import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-anxiety-calm_para_000.json": "## Arus Kecemasan yang Tak Terlihat",
  "quotes-anxiety-calm_para_001.json": "Di era modern kita yang sangat terhubung dan terus-menerus terstimulasi, keriuhan tuntutan eksternal sering kali menenggelamkan suara hening kedamaian batin. Kecemasan yang parah, yang mungkin dulunya merupakan penderitaan yang lebih terisolasi, kini tampaknya menjadi pendamping yang menyebar luas bagi banyak orang, didorong oleh tekanan pekerjaan yang tak henti-hentinya, ketidakpastian lintasan karier, dan pencarian makna yang meluas di dunia yang sering terasa terfragmentasi. Kita bergulat dengan aliran informasi yang tiada henti, perbandingan sosial, dan ketidakpastian eksistensial, meninggalkan kita merasa terombang-ambing di lautan kekhawatiran. Namun, pergumulan manusia dengan kekacauan batin jauh dari kata baru. Peradaban kuno juga menghadapi kecemasan mereka sendiri, dan refleksi mendalam mereka menawarkan secercah harapan serta panduan praktis untuk menavigasi lanskap mental kita sendiri yang penuh gejolak.",
  "quotes-anxiety-calm_para_002.json": "### Gema dari Stoa: Marcus Aurelius dan Kekuatan Perspektif",
  "quotes-anxiety-calm_para_003.json": "Kaisar Romawi Marcus Aurelius, meskipun memimpin sebuah kekaisaran yang luas dan menghadapi ancaman konstan, menemukan pelipur lara dalam prinsip-prinsip Stoikisme. Refleksi pribadinya, yang kemudian disusun sebagai \"Meditations,\" menawarkan bukti kuat akan kemanjuran disiplin internal dalam menghadapi kekacauan eksternal. Aurelius memahami bahwa sebagian besar penderitaan kita tidak bersumber dari peristiwa itu sendiri, melainkan dari penilaian kita terhadapnya. Ia terus mengingatkan dirinya sendiri untuk fokus pada apa yang berada dalam kendalinya – pikirannya, tindakannya, dan karakternya – daripada memikirkan kekuatan nasib yang tidak dapat dikendalikan atau pendapat orang lain.",
  "quotes-anxiety-calm_para_004.json": "Tulisan-tulisannya dipenuhi dengan latihan pembingkaian ulang kognitif, yang mendesak para pembaca untuk melihat tantangan bukan sebagai rintangan yang tidak dapat diatasi, melainkan sebagai kesempatan untuk kebajikan dan pertumbuhan. Pertimbangkan perenungannya tentang sifat fana dari kehidupan dan ketenaran:",
  "quotes-anxiety-calm_para_005.json": "> \"Lihatlah ke dalam. Di dalam adalah air mancur kebaikan, dan itu akan terus menggelembung ke atas, jika engkau mau terus menggali.\" - Marcus Aurelius",
  "quotes-anxiety-calm_para_006.json": "Fokus internal ini sangat relevan saat ini. Ketika dihadapkan pada kecemasan mencari pekerjaan, tekanan dari pekerjaan yang menuntut, atau ketakutan eksistensial dari keberadaan yang tampaknya tidak bermakna, kebijaksanaan Aurelius mendorong kita untuk mengalihkan pandangan ke dalam. Alih-alih terpaku pada validasi atau hasil eksternal, kita dapat menumbuhkan ketangguhan batin kita. Praktik memeriksa pikiran kita, mempertanyakan keabsahannya, dan menyelaraskannya dengan nilai-nilai inti kita dapat melucuti kekuatan perenungan yang penuh kecemasan. Dengan mengenali bahwa kedamaian pikiran kita adalah sebuah konstruksi internal, kita merebut kembali kendali atas kesejahteraan emosional kita, mengubah apa yang dianggap krisis menjadi peluang untuk penguasaan diri.",
  "quotes-anxiety-calm_para_007.json": "### Nasihat Seneca: Merangkul Kematian dan Momen Saat Ini",
  "quotes-anxiety-calm_para_008.json": "Lucius Annaeus Seneca, seorang filsuf Stoik yang terkemuka, negarawan, dan penulis naskah drama, juga bergulat dengan kecemasan hidup, khususnya ketakutan akan kematian dan kemalangan. Surat-suratnya, terutama yang ditujukan kepada temannya Lucilius, memberikan nasihat praktis tentang menjalani kehidupan yang bajik dan tenang. Seneca berpendapat bahwa sebagian besar penderitaan kita bersifat antisipatif – kita menyiksa diri kita sendiri dengan bayangan malapetaka masa depan yang mungkin tidak akan pernah terwujud. Ia menganjurkan pemeriksaan yang ketat terhadap ketakutan kita, membedahnya untuk mengungkapkan fondasinya yang sering kali tidak rasional.",
  "quotes-anxiety-calm_para_009.json": "Filosofi Seneca berakar kuat pada pemahaman bahwa hidup ini terbatas dan bahwa momen saat ini adalah satu-satunya yang benar-benar kita miliki. Ia dengan terkenal menulis:",
  "quotes-anxiety-calm_para_010.json": "> \"Bukannya kita memiliki waktu yang singkat untuk hidup, melainkan kita membuang banyak waktu.\" - Seneca",
  "quotes-anxiety-calm_para_011.json": "Sentimen ini adalah penawar ampuh untuk kecemasan yang melumpuhkan kita, yang mencegah kita untuk terlibat sepenuhnya dalam kehidupan kita. Tekanan untuk mencapai sesuatu, untuk terus menjadi produktif, dapat mengarah pada keadaan ketidakpuasan yang terus-menerus. Pesan Seneca memohon kita untuk merebut kembali waktu kita dengan hidup secara sadar di saat ini. Ketika kewalahan oleh tekanan pekerjaan atau ketidakpastian masa depan, ajarannya mengundang kita untuk membumikan diri kita di sini dan saat ini. Mempraktikkan kesadaran penuh (mindfulness), berfokus pada tugas yang ada, dan menghargai momen-momen sederhana dapat secara signifikan meringankan beban kekhawatiran masa depan dan penyesalan masa lalu. Penekanannya pada singkatnya hidup berfungsi bukan sebagai pernyataan yang mengerikan, melainkan sebagai seruan yang jelas untuk hidup dengan tujuan dan kehadiran.",
  "quotes-anxiety-calm_para_012.json": "### Jalan Sang Buddha: Memahami Penderitaan dan Menumbuhkan Ketidakterikatan",
  "quotes-anxiety-calm_para_013.json": "Siddhartha Gautama, sang Buddha, yang ajarannya membentuk landasan agama Buddha, menawarkan analisis mendalam tentang penderitaan manusia (dukkha) dan jalan menuju penghentiannya. Ajaran intinya, terutama Empat Kebenaran Mulia, membahas sifat kecemasan dan memberikan kerangka kerja untuk mengatasinya. Buddha menyadari bahwa kemelekatan dan nafsu keinginan adalah pendorong utama ketidakpuasan dan penderitaan. Kondisi cemas kita sering kali muncul dari kemelekatan yang putus asa pada hasil, harta benda, atau keadaan tertentu, serta penolakan yang putus asa terhadap yang lainnya.",
  "quotes-anxiety-calm_para_014.json": "Jalannya menekankan kesadaran, perilaku etis, dan disiplin mental. Praktik meditasi, yang sentral bagi tradisi Buddhis, bukanlah tentang mengosongkan pikiran, melainkan tentang mengamati isinya tanpa menghakimi. Pengamatan yang sadar ini memungkinkan kita untuk melihat sifat sementara dari pikiran dan emosi, termasuk kecemasan. Ajaran Buddha tentang ketidakkekalan menunjukkan bahwa segala sesuatu, termasuk kekhawatiran kita, pada akhirnya akan berlalu.",
  "quotes-anxiety-calm_para_015.json": "> \"Akar dari penderitaan adalah kemelekatan.\" - Buddha",
  "quotes-anxiety-calm_para_016.json": "Kebijaksanaan kuno ini menawarkan lensa yang kuat untuk melihat kecemasan modern. Pengejaran tanpa henti akan kemajuan karier, hasrat akan keamanan materi, atau ketakutan akan penolakan sosial semuanya dapat dipahami sebagai bentuk kemelekatan. Dengan menumbuhkan sikap tidak terikat – bukan ketidakpedulian, melainkan sikap tidak melekat yang sehat – kita dapat mengurangi cengkeraman emosional dari kecemasan-kecemasan ini. Praktik-praktik seperti meditasi Vipassanā, yang melibatkan pengamatan sensasi dan pikiran dengan ketenangan, dapat melatih pikiran untuk merespons pemicu stres dengan lebih tenang dan jernih. Memahami bahwa rasa diri kita dan keprihatinan duniawi kita tidaklah kekal dapat menumbuhkan rasa kebebasan yang mendalam, yang memungkinkan kita untuk menavigasi kompleksitas karier dan kehidupan dengan hati yang lebih membumi dan damai.",
  "quotes-anxiety-calm_para_017.json": "## Kebijaksanaan Kuno untuk Jiwa Modern",
  "quotes-anxiety-calm_para_018.json": "Kebijaksanaan Marcus Aurelius, Seneca, dan Buddha, meskipun ditempa di era yang sangat berbeda, berbicara langsung tentang kondisi manusia yang abadi. Wawasan mereka tentang sifat kecemasan, kekuatan perspektif, pentingnya kehadiran, dan akar penderitaan tidak hanya menawarkan keingintahuan filosofis, melainkan juga alat praktis untuk menumbuhkan kedamaian batin. Di dunia yang sering memperburuk kecemasan kita, berpaling pada suara-suara kuno ini dapat memberikan pengaruh yang membumikan, mengingatkan kita bahwa kapasitas untuk mencapai ketenangan tidak terletak pada keadaan eksternal, melainkan di dalam diri kita sendiri. Dengan meresapi perenungan mereka, kita dapat mulai mengurai simpul kekhawatiran dan menemukan kedamaian pikiran yang lebih mendalam dan abadi.",
  "quotes-anxiety-calm_title.json": "Meditasi Kuno untuk Kecemasan Parah: Cara Memperoleh Kedamaian Pikiran"
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

print('Done quotes-anxiety-calm')
