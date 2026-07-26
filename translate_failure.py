import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-failure-resilience_para_000.json": "## Ujian Penderitaan: Menempa Kekuatan Melalui Kegagalan",
  "quotes-failure-resilience_para_001.json": "Sejarah bukan sekadar catatan kemenangan; itu adalah bukti kapasitas semangat manusia yang gigih untuk bangkit dari abu kekalahan. Narasi mereka yang telah membentuk dunia kita sering kali diselingi oleh momen-momen kegagalan yang mendalam, kemunduran yang bisa saja memadamkan cahaya yang lebih redup. Namun, justru di dalam ujian penderitaan inilah kekuatan sejati ditempa, dan benih-benih pertumbuhan monumental ditaburkan. Memahami bagaimana tokoh-tokoh seperti Abraham Lincoln, Frida Kahlo, dan Thomas Edison melewati masa-masa tergelap mereka menawarkan pelajaran berharga bagi perjuangan kontemporer kita sendiri, dari tekanan di tempat kerja hingga lanskap transisi karier yang menakutkan serta pencarian makna abadi.",
  "quotes-failure-resilience_para_002.json": "### Abraham Lincoln: Kebangkitan Tak Kenal Lelah dari Kekalahan",
  "quotes-failure-resilience_para_003.json": "Jalan Abraham Lincoln menuju kursi kepresidenan adalah serangkaian kegagalan publik dan pribadi yang tak kenal lelah. Sebelum memimpin suatu bangsa melewati konflik yang paling memecah belah, Lincoln mengalami karier politik yang diwarnai dengan kekalahan pemilu dan usaha bisnis yang hancur. Kehidupan awalnya ditandai oleh kemiskinan dan kehilangan ibunya yang tragis. Dalam perjalanan politiknya, ia kalah dalam delapan pemilihan, menghadapi kebangkrutan, dan menderita gangguan saraf yang parah. Namun, setiap kali terjatuh, ia menunjukkan kemampuan luar biasa untuk belajar, beradaptasi, dan bertahan. Ketangguhannya tidak lahir dari ketiadaan rasa sakit, tetapi dari pemahaman mendalam bahwa kemunduran bukanlah titik akhir, melainkan jalan memutar di jalur menuju tujuan yang lebih besar.",
  "quotes-failure-resilience_para_004.json": "Salah satu pernyataan Lincoln yang paling terkenal, meskipun sering diparafrasekan, menangkap semangat ini:",
  "quotes-failure-resilience_para_005.json": "> \"Beri saya waktu enam jam untuk menebang pohon dan saya akan menghabiskan empat jam pertama untuk mengasah kapaknya.\"",
  "quotes-failure-resilience_para_006.json": "Kutipan ini, meskipun mungkin diragukan kebenarannya dalam kata-kata aslinya, dengan sempurna merangkum pendekatannya yang metodis terhadap berbagai tantangan. Ia memahami perlunya persiapan dan belajar dari kesalahan masa lalu. Kemampuannya untuk menyerap rasa perih dari kekalahan, untuk menganalisis penyebab-penyebabnya tanpa menyerah pada keputusasaan, memungkinkannya untuk menyempurnakan strategi-strateginya dan pada akhirnya mencapai tujuan politiknya. Bagi kita, ini berlaku untuk profesional modern yang menghadapi penolakan proposal atau proyek yang terhenti. Teladan Lincoln mengajarkan kita untuk melihat momen-momen ini bukan sebagai dakwaan atas harga diri kita, melainkan sebagai kesempatan untuk mengasah 'kapak' kita sendiri – untuk menilai kembali pendekatan kita, memperoleh keterampilan baru, dan memperkuat tekad kita sebelum usaha signifikan berikutnya.",
  "quotes-failure-resilience_para_007.json": "### Frida Kahlo: Seni sebagai Alkimia dari Rasa Sakit dan Ketangguhan",
  "quotes-failure-resilience_para_008.json": "Kehidupan Frida Kahlo adalah kanvas yang dilukis dengan warna-warna cerah, tetapi juga dipenuhi luka yang dalam akibat penderitaan fisik dan emosional. Sebuah kecelakaan bus yang menghancurkan di masa mudanya meninggalkannya dengan rasa sakit seumur hidup dan serangkaian lebih dari 30 operasi. Trauma fisik ini, ditambah dengan hubungan pribadi yang penuh gejolak, bisa saja dengan mudah mengarah pada kehidupan yang didefinisikan oleh sikap merasa menjadi korban. Alih-alih demikian, Kahlo mengubah rasa sakitnya menjadi ekspresi seni yang kuat dan tak tergoyahkan. Potret dirinya, yang telanjang dan mendalam, menjadi eksplorasi yang mendalam tentang identitasnya, penderitaannya, dan semangatnya yang tak terpatahkan. Ia tidak menghindar dari keburukan atau rasa sakit; ia memeluknya, membedahnya, dan menciptakannya kembali sebagai seni.",
  "quotes-failure-resilience_para_009.json": "Kata-katanya bergema dengan penerimaan diri yang sengit ini:",
  "quotes-failure-resilience_para_010.json": "> \"Saya melukis diri saya sendiri karena saya begitu sering sendirian dan karena saya adalah subjek yang paling saya kenal.\"",
  "quotes-failure-resilience_para_011.json": "Dan dalam contoh lain, merenungkan ketangguhannya:",
  "quotes-failure-resilience_para_012.json": "> \"Saya harap jalan keluarnya menyenangkan – dan saya harap tidak pernah kembali.\"",
  "quotes-failure-resilience_para_013.json": "Karya Kahlo berfungsi sebagai metafora yang kuat tentang bagaimana kita dapat mengubah penderitaan pribadi menjadi hasil kreatif dan pemahaman diri. Di era di mana kesejahteraan mental semakin diprioritaskan, teladannya mendorong kita untuk menghadapi tantangan emosional dan fisik kita bukan dengan rasa malu, tetapi dengan kesediaan untuk mengeksplorasinya, mengartikulasikannya, dan mungkin bahkan menemukan bentuk katarsis atau pertumbuhan melaluinya. Baik itu melalui penjurnalan, hobi kreatif, atau mencari dukungan terapeutik, Kahlo mengajarkan kita bahwa mengakui dan terlibat dengan rasa sakit kita, alih-alih menekannya, dapat menjadi jalan menuju diri yang lebih otentik dan tangguh.",
  "quotes-failure-resilience_para_014.json": "### Thomas Edison: Kegigihan Ide yang Mencerahkan",
  "quotes-failure-resilience_para_015.json": "Thomas Edison, sang penemu yang produktif, identik dengan inovasi, tetapi perjalanannya diwarnai dengan jumlah kegagalan yang mencengangkan. Sebelum bola lampu pijar menerangi dunia, Edison dan timnya dilaporkan menguji ribuan bahan untuk filamennya. Narasi umum sering menyoroti keberhasilannya pada akhirnya, tetapi menutupi banyaknya hal yang ia anggap sebagai upaya yang 'gagal'. Pernyataannya yang terkenal tentang kegagalan sangat melegenda:",
  "quotes-failure-resilience_para_016.json": "> \"Saya tidak gagal. Saya hanya menemukan 10.000 cara yang tidak akan berhasil.\"",
  "quotes-failure-resilience_para_017.json": "Perspektif ini sangat penting. Edison tidak melihat setiap eksperimen yang tidak berhasil sebagai jalan buntu, melainkan sebagai data yang berharga, selangkah lebih dekat menuju solusi. Pola pikir ini sangat dapat diterapkan pada jalur karier modern. Pencarian kerja dapat terasa seperti serangkaian penolakan tanpa henti. Pendiri perusahaan rintisan menghadapi rintangan terus-menerus. Pendekatan Edison mendorong kita untuk membingkai ulang pengalaman-pengalaman ini. Setiap wawancara yang tidak ditawarkan, setiap rencana bisnis yang tidak segera mendapatkan daya tarik, bukanlah kegagalan definitif, melainkan sebuah iterasi. Ini adalah kesempatan untuk menyempurnakan resume kita, mengasah keterampilan wawancara kita, mengubah strategi kita, dan belajar lebih banyak tentang pasar atau kemampuan kita sendiri. Eksperimennya yang tak kenal lelah dan penolakannya untuk berkecil hati oleh hasil negatif adalah ciri khas inovasi sejati dan pelajaran penting bagi siapa saja yang menavigasi medan ketidakpastian dalam pengembangan profesional.",
  "quotes-failure-resilience_para_018.json": "### Merangkul Pola Pikir Berkembang untuk Tantangan Modern",
  "quotes-failure-resilience_para_019.json": "Kehidupan Lincoln, Kahlo, dan Edison menawarkan penawar yang kuat untuk ketakutan akan kegagalan yang menyebar luas yang sering melumpuhkan kita di abad ke-21. Di dunia yang terkadang mengagungkan kesuksesan instan, kisah-kisah mereka mengingatkan kita bahwa pencapaian sejati sering kali merupakan hasil dari upaya berkelanjutan, belajar dari kesalahan, dan keyakinan tak tergoyahkan pada kapasitas seseorang untuk beradaptasi. Bagi individu yang bergulat dengan ketidakpastian karier, tekanan untuk berprestasi, atau pencarian eksistensial akan tujuan, tokoh-tokoh sejarah ini memberikan kerangka kerja yang kuat. Mereka mengajarkan kita bahwa kemunduran bukanlah indikator ketidakmampuan, melainkan komponen penting dari proses pertumbuhan. Dengan mengadopsi pola pikir yang merangkul eksperimen, belajar dari setiap hasil, dan berpegang pada visi yang lebih besar, kita juga dapat bangkit dengan kuat setelah kemunduran kita sendiri yang tak terhindarkan, mengubah persepsi akan kegagalan menjadi katalisator bagi perkembangan pribadi dan profesional yang mendalam.",
  "quotes-failure-resilience_title.json": "Bangkit Kuat Setelah Kemunduran: Mengubah Kegagalan Menjadi Pertumbuhan"
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

print('Done quotes-failure-resilience')
