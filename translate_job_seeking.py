import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-job-seeking_para_000.json": "## Memetakan Perairan yang Belum Terjamah: Navigator Sejarah dalam Ketidakpastian",
  "quotes-job-seeking_para_001.json": "Lanskap profesional modern sering kali terasa seperti lautan yang belum terjamah. Di tengah arus perubahan teknologi yang cepat, pasang surut ekonomi, dan tekanan yang terus ada untuk mendefinisikan 'tujuan' seseorang, banyak orang mendapati diri mereka terombang-ambing, mempertanyakan arah mereka. Di momen-momen ketidakpastian yang mendalam ini, di manakah seseorang menemukan kompas? Sejarah, yang kaya akan biografi individu-individu yang menavigasi tantangan pribadi dan sosial yang sangat besar, menawarkan tidak sekadar penghiburan, tetapi juga panduan praktis. Tokoh-tokoh ini, melalui perjuangan, inovasi, dan filosofi mereka yang bertahan lama, memberikan kerangka kerja yang tak ternilai untuk memahami dan menghadapi dilema karier kita sendiri.",
  "quotes-job-seeking_para_002.json": "### Pengejaran Tak Kenal Lelah Sang Polimatik: Leonardo da Vinci",
  "quotes-job-seeking_para_003.json": "Leonardo da Vinci, nama yang identik dengan kegeniusan, jauh dari kata individu yang berpikiran tunggal. Kehidupannya adalah bukti dari rasa ingin tahu yang tak terbatas dan dorongan tiada henti untuk memahami dunia melalui pengamatan dan eksperimen. Meskipun dirayakan karena mahakarya seninya seperti Mona Lisa dan Perjamuan Terakhir (The Last Supper), buku catatannya mengungkapkan pikiran yang sama-sama terpikat oleh anatomi, teknik, botani, dan hidrolika. Karier Da Vinci bukanlah pendakian yang linier, melainkan sebuah penjelajahan yang meluas. Ia berpindah antar pelindung, mengubah fokusnya, dan mengejar proyek-proyek yang sering kali tidak selesai. Warisan abadinya tidak terletak pada jalur karier tunggal yang terdefinisi dengan rapi, melainkan pada proses pembelajaran terus-menerus dan keberanian merangkul beragam minat. Ia memahami bahwa penguasaan di satu bidang dapat menerangi bidang lainnya, dan bahwa mengejar pengetahuan itu sendiri merupakan upaya yang berharga. Pendekatan multi-aspek ini, meskipun tampaknya kacau menurut standar karier modern, memungkinkannya untuk mensintesis ide-ide dengan cara yang revolusioner. Pendekatannya mengajarkan kepada kita bahwa adalah sah-sah saja, bahkan bermanfaat, untuk mengeksplorasi berbagai jalan, membiarkan rasa ingin tahu menjadi pemandu, dan menyadari bahwa nilai dapat ditemukan di persimpangan bidang-bidang yang tampaknya berbeda.",
  "quotes-job-seeking_para_004.json": "### Pelopor Pragmatis: Benjamin Franklin",
  "quotes-job-seeking_para_005.json": "Benjamin Franklin mewujudkan semangat perbaikan diri dan penerapan praktis. Dari awal yang sederhana sebagai pekerja magang pencetak, ia bangkit menjadi penulis terkemuka, penemu, ilmuwan, diplomat, dan negarawan. Otobiografinya adalah catatan luar biasa tentang pengembangan diri yang disengaja, menguraikan pengejarannya akan kebajikan dan pendekatannya yang sistematis dalam pemecahan masalah. Karier Franklin ditandai oleh kemampuan adaptasi yang pragmatis. Ketika menghadapi tantangan, baik itu memperbaiki penerangan jalan atau bernegosiasi dengan kekuatan asing, ia menerapkan nalar, pengamatan, dan kesediaan untuk bereksperimen. Pepatah-pepatah terkenalnya sering kali menyaring pelajaran hidup yang kompleks menjadi maksim yang berkesan. Pertimbangkan sudut pandangnya tentang waktu dan nilainya:",
  "quotes-job-seeking_para_006.json": "> \"Apakah engkau mencintai kehidupan? Maka janganlah membuang-buang waktu, karena dari situlah kehidupan itu dibuat.\" - Benjamin Franklin",
  "quotes-job-seeking_para_007.json": "Kutipan ini, lebih dari sekadar kata-kata klise, mencerminkan pemahaman mendalam tentang bagaimana upaya yang terfokus dan penggunaan waktu yang efisien berkontribusi pada kehidupan yang memuaskan serta upaya yang sukses. Dalam konteks pencarian karier, teladan Franklin mendorong kita untuk bersikap proaktif, mencari peluang untuk belajar dan berkontribusi, serta memandang setiap pengalaman, bahkan kemunduran sekalipun, sebagai kesempatan untuk menyempurnakan keterampilan dan pengetahuan kita. Penekanannya pada kegunaan dan pelayanan publik juga memberikan penawar yang kuat untuk obsesi modern akan keuntungan pribadi semata, yang menunjukkan bahwa menemukan makna dalam pekerjaan seseorang sering kali melibatkan kontribusi pada sesuatu yang lebih besar dari diri sendiri.",
  "quotes-job-seeking_para_008.json": "### Negarawan yang Teguh: Abraham Lincoln",
  "quotes-job-seeking_para_009.json": "Perjalanan Abraham Lincoln menuju kepresidenan adalah narasi mendalam tentang ketangguhan di hadapan kegagalan yang berulang dan penderitaan yang mendalam. Sebelum memimpin negaranya melewati krisis terbesarnya, Lincoln menghadapi banyak kemunduran pribadi dan profesional, termasuk kegagalan bisnis, kehilangan orang-orang terkasih, dan kekalahan pemilu berkali-kali. Jalannya menuju kepemimpinan nasional sama sekali tidak mulus. Namun, melalui semua itu, ia mempertahankan komitmen yang teguh pada prinsip-prinsipnya dan keyakinan yang tak tergoyahkan akan kemungkinan masa depan yang lebih baik. Kefasihan Lincoln dan kemampuannya untuk terhubung dengan orang biasa diasah melalui latihan bertahun-tahun serta empati mendalam terhadap kondisi manusia. Pidato Gettysburg-nya yang terkenal, meskipun singkat, merangkum pemahaman mendalamnya tentang pengorbanan, tujuan, dan cita-cita abadi suatu bangsa. Sudut pandangnya tentang ketekunan sangatlah mencerahkan:",
  "quotes-job-seeking_para_010.json": "> \"Kemungkinan bahwa kita mungkin gagal dalam perjuangan seharusnya tidak menghalangi kita dari upaya yang paling berat sekalipun.\" - Abraham Lincoln",
  "quotes-job-seeking_para_011.json": "Sentimen ini berbicara langsung mengenai ketakutan akan kegagalan yang sering kali melumpuhkan individu selama pencarian karier atau saat merenungkan perubahan profesional yang signifikan. Kehidupan Lincoln menunjukkan bahwa kesuksesan sejati sering kali ditempa dalam kawah kesulitan, dan bahwa visi yang jelas, ditambah dengan upaya terus-menerus, dapat mengatasi rintangan yang tampaknya tidak dapat diatasi. Kemampuannya untuk mengartikulasikan visi yang memikat untuk masa depan, bahkan di saat-saat paling kelam, menawarkan pelajaran berharga tentang kepemimpinan dan pentingnya memiliki tujuan yang memandu.",
  "quotes-job-seeking_para_012.json": "## Pelajaran bagi Navigator Modern",
  "quotes-job-seeking_para_013.json": "Kebijaksanaan Da Vinci, Franklin, dan Lincoln melampaui konteks sejarah mereka, menawarkan kompas abadi bagi siapa saja yang menavigasi ketidakpastian jalur karier modern. Da Vinci mengingatkan kita bahwa rasa ingin tahu adalah pendorong karier yang valid, dan bahwa minat yang beragam dapat mengarah pada inovasi yang tidak terduga. Franklin memperjuangkan pragmatisme, perbaikan diri yang berkelanjutan, dan nilai dari upaya yang terfokus. Lincoln memberi contoh ketangguhan, pentingnya visi yang memandu, dan keberanian untuk mengejar tujuan yang sulit terlepas dari risiko kegagalan. Di era yang sering kali menuntut spesialisasi dan hasil instan, para raksasa sejarah ini mendesak kita untuk merangkul eksplorasi, menumbuhkan kemampuan beradaptasi, dan bertekun dengan tujuan. Kehidupan mereka bukanlah cetak biru untuk direplikasi secara persis, melainkan bukti abadi akan kapasitas manusia untuk belajar, beradaptasi, dan menemukan makna, bahkan ketika jalan di depan tidak jelas.",
  "quotes-job-seeking_title.json": "Panduan Pencarian Karier & Ketidakpastian: Kompas Saat Anda Tersesat"
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

print('Done quotes-job-seeking')
