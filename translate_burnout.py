import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-burnout-recovery_para_000.json": "## Dampak Tersembunyi dari Tuntutan Modern",
  "quotes-burnout-recovery_para_001.json": "Laju kehidupan kontemporer yang tak kenal lelah, ditandai dengan konektivitas terus-menerus, ekspektasi kinerja yang meningkat, dan tekanan luas untuk mencapai sesuatu, sering kali mengarah pada kondisi kelelahan yang mendalam. Fenomena ini, yang umumnya disebut kelelahan atau burnout, bukanlah sekadar perasaan lelah sesaat; ini adalah pengurasan sumber daya fisik, emosional, dan mental yang berakar dalam. Hal ini mengikis kapasitas kita untuk bersukacita, menurunkan produktivitas kita, dan bahkan dapat memicu sinisme serta keterlepasan dari pekerjaan dan kehidupan kita. Dalam pencarian kita akan makna dan kesuksesan, kita sering mendapati diri kita berlari dengan tenaga yang tersisa, cadangan energi di dalam diri kita terkuras oleh tuntutan tanpa henti yang dibebankan kepada kita. Pada saat-saat kelelahan yang mendalam inilah kebijaksanaan dari mereka yang telah bergulat dengan perjuangan manusia yang serupa selama ribuan tahun dapat menawarkan penghiburan dan panduan.",
  "quotes-burnout-recovery_para_002.json": "### Gema dari Zaman Kuno: Ketahanan Stoik",
  "quotes-burnout-recovery_para_003.json": "Para filsuf Stoik, khususnya Seneca the Younger dan Kaisar Romawi Marcus Aurelius, hidup di era yang, meskipun berbeda dalam kemajuan teknologi, tidak kalah saratnya dengan kecemasan akan kekuasaan, tanggung jawab, dan sifat nasib yang tidak dapat diprediksi. Tulisan-tulisan mereka menawarkan cetak biru yang mendalam untuk menumbuhkan ketabahan batin, penangkal penting bagi kelelahan yang melanda keberadaan modern kita.",
  "quotes-burnout-recovery_para_004.json": "Seneca, seorang penulis naskah drama, negarawan, dan tutor bagi Kaisar Nero, memahami tekanan kehidupan publik secara mendalam. Ia menulis secara ekstensif tentang mengelola emosi, mengatasi kesulitan, dan menjalani kehidupan yang bajik. Refleksinya mengenai waktu dan penggunaan yang tepat dari waktu tersebut sangat relevan dengan perjuangan modern kita saat merasa kewalahan.",
  "quotes-burnout-recovery_para_005.json": "> \"Bukannya kita memiliki waktu yang singkat untuk hidup, melainkan kita membuang banyak waktu.\" - Seneca",
  "quotes-burnout-recovery_para_006.json": "Kutipan ini berfungsi sebagai pengingat yang kuat bahwa persepsi kita tentang kelangkaan sering kali berakar dari salah urus alih-alih kurangnya kesempatan. Dalam konteks kelelahan, ini mendesak kita untuk memeriksa ke mana waktu dan energi kita diarahkan, mempertanyakan apakah aktivitas kita selaras dengan nilai-nilai kita dan berkontribusi pada kesejahteraan kita, atau hanya berfungsi untuk menguras tenaga kita.",
  "quotes-burnout-recovery_para_007.json": "Marcus Aurelius, seorang raja-filsuf, menghadapi beban besar memimpin Kekaisaran Romawi melalui peperangan dan wabah penyakit. Refleksi pribadinya, yang disusun dalam *Meditations* miliknya, mengungkap seorang pria yang berjuang untuk mencapai ketenangan di tengah kekacauan. Pendekatan stoiknya menekankan pada memfokuskan apa yang berada dalam kendali kita – pikiran, penilaian, dan tindakan kita – serta menerima apa yang tidak bisa kita kendalikan.",
  "quotes-burnout-recovery_para_008.json": "> \"Kebahagiaan hidup Anda bergantung pada kualitas pikiran Anda.\" - Marcus Aurelius",
  "quotes-burnout-recovery_para_009.json": "Wawasan mendalam ini secara langsung membahas komponen kognitif dari burnout. Ketika kita merasa kewalahan, pikiran kita dapat berputar ke arah kenegatifan dan malapetaka. Aurelius mengingatkan kita bahwa dengan secara sadar mengarahkan energi mental kita menuju pemikiran yang konstruktif dan rasional, kita dapat secara signifikan mengubah pengalaman stres dan kelelahan kita. Ia juga berbicara tentang pentingnya tujuan:",
  "quotes-burnout-recovery_para_010.json": "> \"Jangan buang waktu lagi untuk berdebat tentang seperti apa seharusnya orang baik itu. Jadilah orang baik.\"",
  "quotes-burnout-recovery_para_011.json": "Desakan ini adalah seruan untuk bertindak, sebuah pengalihan dari perenungan ke perwujudan. Bagi mereka yang mengalami kelelahan, ini menunjukkan bahwa alih-alih meratapi keadaan mereka yang terkuras atau mengidealkan diri masa depan yang lebih energik, jalan ke depan terletak pada melakukan tindakan kecil yang bermakna yang selaras dengan nilai-nilai mereka, bahkan dalam kondisi lelah mereka saat ini.",
  "quotes-burnout-recovery_para_012.json": "### Jalan Tengah: Kebijaksanaan Buddhis untuk Kedamaian Batin",
  "quotes-burnout-recovery_para_013.json": "Berabad-abad sebelumnya, Siddhartha Gautama, sang Buddha, melepaskan kehidupan mewah untuk mencari akhir dari penderitaan. Ajaran-ajarannya, yang membentuk dasar-dasar Buddhisme, menawarkan jalan menuju pembebasan dari siklus ketidakpuasan dan kesusahan yang dapat bermanifestasi sebagai burnout. Inti dari filosofinya terletak pada pemahaman tentang sifat penderitaan (dukkha) dan ketidakkekalan segala sesuatu.",
  "quotes-burnout-recovery_para_014.json": "Salah satu ajaran Buddha yang paling sentral adalah Empat Kebenaran Mulia, yang mengartikulasikan realitas penderitaan, penyebabnya (kemelekatan dan nafsu keinginan), penghentiannya, dan jalan menuju penghentiannya (Jalan Berunsur Delapan). Kerangka kerja ini membantu kita memahami bahwa burnout, seperti semua bentuk penderitaan, timbul dari kondisi-kondisi tertentu dan dapat diatasi dengan menumbuhkan kondisi dan praktik mental tertentu.",
  "quotes-burnout-recovery_para_015.json": "> \"Pikiran adalah segalanya. Apa yang Anda pikirkan, Anda akan menjadi apa.\"",
  "quotes-burnout-recovery_para_016.json": "Kutipan ini, yang sering dikaitkan dengan Buddha, merangkum pengaruh mendalam dari lanskap batin kita terhadap pengalaman eksternal kita. Hal ini sangat selaras dengan penekanan Stoik pada pemikiran tetapi dari tradisi filosofis yang berbeda. Hal ini menunjukkan bahwa dengan menumbuhkan kesadaran, kasih sayang, dan ketenangan dalam diri kita sendiri, kita dapat mengubah hubungan kita dengan tekanan yang mengarah pada burnout. Penekanan Buddha pada saat ini juga merupakan alat yang ampuh:",
  "quotes-burnout-recovery_para_017.json": "> \"Jangan terpaku pada masa lalu, jangan memimpikan masa depan, pusatkan pikiran pada saat ini.\"",
  "quotes-burnout-recovery_para_018.json": "Nasihat ini merupakan penangkal langsung terhadap perenungan dan kecemasan yang sering kali memicu burnout. Dengan memancangkan diri kita pada keadaan 'saat ini', kita dapat mengurangi beban mental dari penyesalan dan kekhawatiran, yang memungkinkan kita untuk terlibat lebih penuh dan efektif dengan tugas-tugas yang ada, sekecil apa pun kelihatannya.",
  "quotes-burnout-recovery_para_019.json": "### Mengintegrasikan Kebijaksanaan Kuno ke dalam Kesibukan Modern",
  "quotes-burnout-recovery_para_020.json": "Kebijaksanaan Seneca, Marcus Aurelius, dan Buddha, meskipun berasal dari konteks sejarah yang sangat berbeda, berbicara dengan kejelasan yang luar biasa terhadap tantangan burnout modern. Wawasan mereka bukanlah renungan filosofis abstrak melainkan panduan praktis untuk menavigasi kompleksitas keberadaan manusia.",
  "quotes-burnout-recovery_para_021.json": "Ketika dihadapkan pada tuntutan karier yang sangat besar, kecemasan mencari pekerjaan, atau pencarian eksistensial akan makna, kita dapat bersandar pada suara-suara kuno ini. Pengingat Seneca untuk menghargai waktu kita dengan bijak mendorong kita untuk menetapkan batasan dan memprioritaskan tugas-tugas yang selaras dengan nilai-nilai inti kita, alih-alih menyerah pada ilusi kesibukan. Fokus Marcus Aurelius pada kekuatan pikiran kita memberdayakan kita untuk membingkai ulang tantangan dan menumbuhkan pola pikir yang lebih tangguh, mengenali bahwa respons internal kita sering kali lebih penting daripada keadaan eksternal.",
  "quotes-burnout-recovery_para_022.json": "Lebih jauh lagi, penekanan Buddhis pada kesadaran dan hidup di saat ini menawarkan penyeimbang yang kuat terhadap tarikan konstan dari gangguan dan kecemasan akan masa depan. Dengan melatih kehadiran, kita dapat menemukan momen-momen kedamaian dan kejelasan bahkan di tengah kekacauan, yang memungkinkan kita untuk melakukan tanggung jawab kita dengan energi yang diperbarui dan perspektif yang lebih jernih. Burnout adalah sebuah sinyal, sebuah undangan untuk berhenti sejenak, merenung, dan mengkalibrasi ulang. Dengan mengintegrasikan pelajaran abadi ini, kita dapat bergerak melampaui sekadar bertahan hidup dan menumbuhkan kehidupan dengan kesejahteraan dan tujuan yang berkelanjutan, mengubah kelelahan menjadi kebijaksanaan dan kepenatan menjadi kekuatan yang abadi.",
  "quotes-burnout-recovery_title.json": "10 Kutipan untuk Mengatasi Burnout: Kebijaksanaan untuk Menghibur Pikiran yang Lelah"
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

print('Done quotes-burnout-recovery')
