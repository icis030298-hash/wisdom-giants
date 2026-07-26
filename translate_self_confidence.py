import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-self-confidence_para_000.json": "## Sifat Elusif dari Harga Diri",
  "quotes-self-confidence_para_001.json": "Di dunia kontemporer kita, yang dikepung oleh arus validasi media sosial tanpa henti dan pencapaian eksternal, upaya mengejar harga diri yang tulus dapat terasa seperti mengejar fatamorgana. Kita sering dibombardir dengan gambar-gambar kesempurnaan dan kesuksesan yang direkayasa, yang mengarahkan kita untuk mempertanyakan nilai kita sendiri. Namun, lokus validasi eksternal ini pada dasarnya rapuh, rentan terhadap perubahan opini publik dan tren yang cepat berlalu. Harga diri yang sejati, dapat dikatakan, bukanlah sebuah komoditas yang harus diperoleh, melainkan kekuatan mendalam yang ditumbuhkan dari dalam. Untuk memahami kultivasi batin ini, kita dapat beralih pada wawasan yang mendalam, meskipun terkadang menantang, dari tokoh-tokoh sejarah yang bergulat dengan penderitaan, kesulitan, dan esensi dari eksistensi manusia.",
  "quotes-self-confidence_para_002.json": "### Afirmasi Kehidupan Nietzsche dan Kehendak untuk Berkuasa",
  "quotes-self-confidence_para_003.json": "Friedrich Nietzsche, filsuf Jerman yang penuh teka-teki, menawarkan perspektif yang menyegarkan tentang penaklukan diri dan penciptaan nilai. Konsepnya tentang 'kehendak untuk berkuasa' sering disalahpahami sebagai dominasi semata, tetapi pada intinya, konsep tersebut menandakan dorongan mendasar menuju pertumbuhan, penguasaan diri, dan penegasan kehidupan secara keseluruhan, termasuk penderitaannya. Bagi Nietzsche, kekuatan yang sejati, dan lebih jauh lagi, rasa diri yang kuat, tidak muncul dari menghindari kesulitan, tetapi dari menghadapi dan mengintegrasikannya. Ia dengan terkenal menyatakan bahwa apa yang tidak membunuh kita akan membuat kita lebih kuat, sebuah sentimen yang sangat bergema saat kita mempertimbangkan tantangan kehidupan modern, dari menavigasi kemunduran karier hingga menanggung kehilangan pribadi.",
  "quotes-self-confidence_para_004.json": "Filosofi Nietzsche mendesak kita untuk melampaui penerimaan pasif atas keadaan kita dan secara aktif membentuk identitas kita. Ia mengkritik mentalitas kawanan dan kenyamanan moralitas konvensional, dan sebaliknya mengadvokasi penciptaan nilai-nilai diri sendiri. Proses penciptaan diri ini, meskipun sulit, merupakan landasan harga diri yang otentik. Hal itu membutuhkan keberanian untuk mempertanyakan norma-norma yang berlaku dan untuk menempa jalan seseorang sendiri, bahkan ketika itu sepi atau tidak populer. Tekanan terus-menerus untuk menyesuaikan diri dalam lanskap profesional saat ini, kecemasan akan ketidakpastian karier, dan pencarian makna pribadi semuanya dapat dibingkai ulang melalui lensa Nietzsche sebagai peluang untuk penegasan diri dan penguatan tekad batin seseorang.",
  "quotes-self-confidence_para_005.json": "Salah satu refleksi Nietzsche yang paling tajam dalam merangkul totalitas kehidupan, termasuk rasa sakitnya, ditemukan dalam konsepnya tentang *amor fati* – cinta pada nasib. Ia mendesak individu-individu untuk tidak sekadar menanggung apa yang diperlukan, tetapi untuk mencintainya.",
  "quotes-self-confidence_para_006.json": "> \"Formula saya untuk kehebatan dalam diri manusia adalah *amor fati*: bahwa seseorang tidak menginginkan apa pun menjadi berbeda, tidak ke depan, tidak ke belakang, tidak untuk selama-lamanya. Bukan sekadar menanggung apa yang diperlukan, apalagi menyembunyikannya… melainkan *mencintainya*.\"",
  "quotes-self-confidence_para_007.json": "Penerimaan radikal ini, penerimaan atas semua yang telah dibawa oleh kehidupan ini, adalah penawar ampuh untuk keputusasaan yang dapat muncul dari kegagalan yang dirasakan atau ekspektasi yang tidak terpenuhi. Ini mendorong kita untuk menemukan kekuatan bukan pada ketiadaan kesulitan, tetapi dalam kapasitas kita untuk menemukan makna dan bahkan sukacita di dalamnya.",
  "quotes-self-confidence_para_008.json": "### Frida Kahlo: Ketangguhan yang Ditempa dalam Ujian Kepedihan",
  "quotes-self-confidence_para_009.json": "Frida Kahlo, seniman Meksiko yang ikonik, memberikan kesaksian yang mendalam dan sangat pribadi tentang kekuatan mengubah penderitaan menjadi seni dan ekspresi diri. Kehidupannya ditandai oleh rasa sakit fisik dan emosional yang luar biasa, mulai dari kecelakaan bus yang menghancurkan di masa mudanya yang meninggalkannya dengan luka seumur hidup hingga hubungan yang penuh gejolak dan kehilangan pribadi yang mendalam. Namun, melalui seninya, Kahlo tidak menghindar dari menggambarkan realitasnya; sebaliknya, ia menghadapinya dengan kejujuran yang tak tergoyahkan dan kreativitas yang hidup.",
  "quotes-self-confidence_para_010.json": "Potret diri Kahlo bukanlah sekadar penggambaran bentuk fisiknya, melainkan eksplorasi yang telanjang mengenai dunia batinnya, rasa sakitnya, identitasnya, dan ketangguhannya. Ia menggunakan seninya sebagai sarana pemahaman diri dan penegasan diri, menciptakan bahasa visual kuat yang mengomunikasikan pengalaman uniknya kepada dunia. Kemampuannya untuk mengubah penderitaan menjadi keindahan yang menakjubkan dan resonansi emosional yang mendalam merupakan pelajaran berharga bagi siapa pun yang menghadapi tantangan luar biasa. Dalam masyarakat yang sering mendorong kita untuk menyembunyikan kerentanan kita, teladan Kahlo memperjuangkan kekuatan yang ditemukan dalam penerimaan diri yang radikal dan keberanian untuk mengekspresikan diri seseorang yang otentik, tidak peduli seberapa tidak sempurna atau menyakitkannya diri tersebut.",
  "quotes-self-confidence_para_011.json": "Karyanya berfungsi sebagai pengingat yang kuat bahwa bekas luka kita, baik yang terlihat maupun tidak terlihat, tidak mengurangi nilai kita tetapi sebenarnya dapat menjadi bagian integral dari identitas kita dan sumber kekuatan yang unik. Hal ini sangat relevan bagi individu yang menavigasi tekanan karier modern, di mana ketakutan untuk tampil lemah atau tidak kompeten dapat menyebabkan stres yang luar biasa. Warisan Kahlo mendorong kita untuk melihat tantangan kita bukan sebagai rintangan yang tak tertandingi, melainkan sebagai wadah yang dapat menempa rasa diri yang lebih dalam dan lebih otentik.",
  "quotes-self-confidence_para_012.json": "Kata-kata Kahlo sendiri sering kali mencerminkan hubungan mendalam antara seni, rasa sakit, dan keinginannya untuk hidup:",
  "quotes-self-confidence_para_013.json": "> \"Saya melukis diri saya sendiri karena saya begitu sering sendirian dan karena saya adalah subjek yang paling saya kenal.\"",
  "quotes-self-confidence_para_014.json": "Dan dalam contoh lain, berbicara pada roh gigih yang memicu eksistensinya:",
  "quotes-self-confidence_para_015.json": "> \"Saya harap jalan keluarnya menyenangkan – dan saya harap tidak pernah kembali.\"",
  "quotes-self-confidence_para_016.json": "Pernyataan-pernyataan ini mengungkapkan kesadaran diri yang mendalam dan penerimaan atas keberadaannya, rasa sakitnya dan segalanya. Kata-kata itu berbicara tentang ketabahan batin yang melampaui batasan fisik dan penilaian eksternal.",
  "quotes-self-confidence_para_017.json": "## Menumbuhkan Kekuatan Batin untuk Kehidupan Modern",
  "quotes-self-confidence_para_018.json": "Baik Nietzsche maupun Kahlo, dengan cara mereka yang berbeda, menawarkan kerangka kerja yang kuat untuk memahami dan menumbuhkan harga diri yang tulus. Kehidupan mereka menunjukkan bahwa kekuatan sejati bukanlah ketiadaan perjuangan, melainkan kapasitas untuk menghadapinya, mengintegrasikannya, dan muncul dengan rasa diri yang lebih kuat. Dalam menghadapi tekanan modern – kecemasan akan kemajuan karier, pencarian tujuan di dunia yang sering kali membingungkan, dan negosiasi konstan akan identitas pribadi – filosofi mereka memberikan panduan yang tak ternilai. Dengan merangkul cita-cita gaya Nietzschean tentang penaklukan diri dan keberanian ala Kahlo untuk mengekspresikan diri otentik kita, bahkan di tengah rasa sakit, kita dapat mulai membangun harga diri yang tidak bergantung pada validasi eksternal, tetapi berakar pada fondasi yang tak tergoyahkan dari ketangguhan batin kita sendiri. Perjalanan ini membutuhkan introspeksi, keberanian, dan kesediaan untuk mencintai nasib kita, apa adanya diri kita.",
  "quotes-self-confidence_title.json": "Menemukan Harga Diri yang Tulus: Refleksi Filosofis tentang Kekuatan Batin"
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

print('Done quotes-self-confidence')
