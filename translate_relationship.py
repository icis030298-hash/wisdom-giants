import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-relationship-advice_para_000.json": "## Upaya Terus-Menerus Menuju Hubungan yang Harmonis",
  "quotes-relationship-advice_para_001.json": "Manusia pada dasarnya adalah makhluk sosial. Suka cita kita yang terdalam dan kesedihan kita yang paling mendalam sering kali bermuara dari hubungan kita dengan orang lain. Di dunia yang dipenuhi dengan interaksi sesaat dan tekanan kinerja yang terus-menerus, keinginan akan hubungan yang tulus dan langgeng bisa terasa seperti cita-cita yang jauh. Namun, kebijaksanaan zaman kuno menawarkan kerangka kerja yang kuat untuk menumbuhkan koneksi semacam itu, bukan dengan memberantas emosi, tetapi dengan memahami dan mengendalikan reaksi kita terhadapnya. Para filsuf dan pemikir lintas budaya telah bergulat dengan aspek fundamental kondisi manusia ini, meninggalkan warisan wawasan yang tetap sangat relevan dengan perjuangan modern kita terhadap tekanan pekerjaan, ketidakpastian karier, dan pencarian makna hidup.",
  "quotes-relationship-advice_para_002.json": "### Konfusius: Fondasi Timbal Balik dan Kebajikan",
  "quotes-relationship-advice_para_003.json": "Konfusius, filsuf Tiongkok yang dihormati, menempatkan pentingnya keharmonisan sosial sebagai hal yang utama, yang ia yakini berawal dari penanaman kebajikan di dalam diri individu dan pembentukan hubungan yang baik. Filosofinya, yang berakar pada perilaku etis dan tatanan sosial, memberikan cetak biru mendalam tentang bagaimana kita dapat berinteraksi dengan orang lain dengan cara yang menumbuhkan rasa saling menghormati dan meminimalkan perselisihan. Inti dari ajarannya terletak pada *Ren* (仁), yang sering diterjemahkan sebagai kebajikan atau kemanusiaan, dan *Li* (礼), ritus atau kepatutan yang memandu perilaku sosial. Bagi Konfusius, hubungan sejati dibangun di atas fondasi pemahaman dan pemenuhan peran seseorang dalam suatu komunitas, baik secara kekeluargaan, profesional, maupun kemasyarakatan.",
  "quotes-relationship-advice_para_004.json": "Ia menekankan prinsip *Shu* (恕), yang sering dipahami sebagai 'Aturan Perak' – pendahulu dari Aturan Emas. Aturan ini menasihati kita untuk memperlakukan orang lain sebagaimana kita ingin diperlakukan, tetapi dengan penekanan penting pada tidak memaksakan keinginan kita kepada mereka. Ini berarti mempertimbangkan sudut pandang orang lain dan menghindari tindakan yang akan menyebabkan mereka merasa tidak nyaman atau sakit hati.",
  "quotes-relationship-advice_para_005.json": "> \"Jangan paksakan pada orang lain apa yang tidak Anda inginkan untuk diri Anda sendiri.\"\n> - Konfusius",
  "quotes-relationship-advice_para_006.json": "Dalam konteks hubungan modern, hal ini diterjemahkan menjadi penawar ampuh untuk sifat interaksi kita yang sering kali berpusat pada diri sendiri. Ketika dihadapkan pada konflik di tempat kerja atau kesalahpahaman dalam hubungan pribadi, Konfusius akan mendesak kita untuk berhenti sejenak dan mempertimbangkan apakah tindakan atau kata-kata kita dapat kita terima jika itu ditujukan kepada kita. Prinsip yang sederhana namun mendalam ini mendorong empati dan pengurangan perilaku yang menyebabkan gesekan yang tidak perlu. Ini tentang melakukan interaksi dengan keinginan tulus untuk kesejahteraan orang lain, menumbuhkan lingkungan di mana hubungan dapat berkembang tanpa sengatan ketidakpedulian.",
  "quotes-relationship-advice_para_007.json": "### Socrates: Kekuatan Introspeksi Diri dan Kebajikan",
  "quotes-relationship-advice_para_008.json": "Socrates, filsuf Athena yang penuh teka-teki, merevolusi pemikiran dengan memutar fokus ke dalam, dengan lantang menyatakan bahwa \"hidup yang tidak diuji tidak layak dijalani.\" Metodenya, metode Socrates, melibatkan pertanyaan tanpa henti untuk menyingkap ketidaktahuan dan mencapai kebenaran. Meskipun bukan secara langsung seorang ahli teori tentang hubungan dalam pengertian modern, penekanannya pada pengetahuan diri dan kebajikan sangat diperlukan untuk menavigasi dinamika antarpribadi tanpa menyerah pada pola-pola destruktif.",
  "quotes-relationship-advice_para_009.json": "Socrates percaya bahwa kebajikan adalah pengetahuan, dan bahwa kesalahan bersumber dari ketidaktahuan. Jika kita benar-benar memahami apa yang baik, kita akan bertindak sesuai dengan itu. Ini menyiratkan bahwa banyak masalah relasional tidak muncul dari kebencian, tetapi dari kurangnya kesadaran diri dan pemahaman yang tidak lengkap tentang motivasi kita sendiri dan dampaknya terhadap orang lain. Dengan melakukan introspeksi diri yang ketat, kita dapat mengidentifikasi bias, rasa tidak aman, dan kecenderungan reaktif kita sendiri yang sering kali menyabotase hubungan kita.",
  "quotes-relationship-advice_para_010.json": "> \"Saya tahu bahwa saya tidak tahu apa-apa.\"\n> - Socrates",
  "quotes-relationship-advice_para_011.json": "Kerendahan hati ini, yang merupakan inti dari pendekatan Socrates, sangat penting untuk menjaga perspektif. Dalam menghadapi kemunduran karier atau kecemasan dalam menemukan tujuan hidup seseorang, penekanan Sokrates pada pemahaman diri sendiri mendorong introspeksi daripada menyalahkan. Ketika perselisihan muncul, alih-alih langsung bereaksi secara defensif, kita dapat bertanya pada diri sendiri: \"Apa peran saya dalam situasi ini? Asumsi apa yang saya buat? Apakah saya bertindak berdasarkan pemahaman yang tulus atau prasangka yang mendarah daging?\" Dialog internal ini, yang terinspirasi oleh Socrates, memungkinkan kita untuk mendekati konflik dengan keinginan akan kejelasan dan pertumbuhan, sehingga mengurangi rasa sakit emosional yang sering menyertai gesekan dalam hubungan. Hal ini memungkinkan kita untuk terhubung dengan orang lain secara otentik, yang didasarkan pada pemahaman yang lebih jelas tentang diri kita sendiri dan dampak yang kita timbulkan.",
  "quotes-relationship-advice_para_012.json": "### Seneca: Menguasai Emosi dan Menumbuhkan Ketangguhan",
  "quotes-relationship-advice_para_013.json": "Lucius Annaeus Seneca, filsuf Stoik Romawi, negarawan, dan penulis naskah drama, menawarkan wawasan mendalam tentang mengelola emosi dan menumbuhkan ketangguhan batin – alat penting untuk menavigasi kompleksitas hubungan manusia. Kaum Stoik percaya bahwa meskipun kita tidak dapat mengendalikan peristiwa eksternal, kita dapat mengendalikan penilaian dan reaksi kita terhadapnya. Prinsip ini sangat kuat ketika diterapkan pada hubungan, di mana tindakan eksternal orang lain sering kali dapat memicu respons emosional yang intens.",
  "quotes-relationship-advice_para_014.json": "Seneca mengajarkan bahwa penderitaan sering kali bukan timbul dari peristiwa itu sendiri, tetapi dari opini kita tentang peristiwa tersebut. Ia menganjurkan pendekatan rasional terhadap tantangan hidup, mendorong kita untuk fokus pada apa yang berada dalam kendali kita – pikiran, keinginan, dan tindakan kita – serta menerima apa yang tidak berada di bawah kendali kita.",
  "quotes-relationship-advice_para_015.json": "> \"Kita lebih banyak menderita dalam imajinasi daripada dalam kenyataan.\"\n> - Seneca",
  "quotes-relationship-advice_para_016.json": "Dalam kehidupan kontemporer, kebijaksanaan ini merupakan obat yang mujarab untuk kecemasan akan tekanan karier dan ketidakpastian hidup. Ketika kritik seorang kolega terasa sangat pribadi, atau sebuah hubungan goyah, ajaran Seneca mengingatkan kita untuk memeriksa interpretasi kita. Apakah kritik tersebut merupakan penilaian yang objektif, ataukah reaksi emosional kita yang memperkuat dampak negatifnya? Dengan secara sadar memilih untuk merespons dengan nalar daripada reaktivitas, kita dapat mencegah perselisihan kecil meningkat menjadi keretakan besar. Filosofi Seneca mendorong kita untuk membangun benteng pertahanan dalam diri yang kuat, memungkinkan kita untuk berinteraksi dengan orang lain dengan ketenangan, menawarkan dukungan dan pengertian tanpa kewalahan oleh pergumulan mereka atau pergumulan kita sendiri.",
  "quotes-relationship-advice_para_017.json": "### Menenun Kebijaksanaan Kuno ke dalam Kehidupan Modern",
  "quotes-relationship-advice_para_018.json": "Filosofi Konfusius, Socrates, dan Seneca, meskipun terpisah oleh waktu dan budaya, menyatu pada satu pesan yang kuat: hubungan yang tulus tidak menuntut ketiadaan rasa sakit, tetapi penguasaan atas respons kita terhadapnya. Dengan merangkul sikap timbal balik dan kebajikan, terlibat dalam introspeksi diri yang ketat, dan menumbuhkan ketangguhan emosional, kita dapat membangun hubungan yang tidak hanya langgeng tetapi juga menjadi sumber makna dan dukungan yang mendalam. Dalam menavigasi perairan kehidupan modern yang penuh gejolak, mulai dari tekanan kemajuan karier hingga pencarian kepuasan pribadi, suara-suara kuno ini menawarkan panduan abadi untuk menempa hubungan yang kuat, otentik, dan, yang terpenting, bebas dari penderitaan yang tidak perlu.",
  "quotes-relationship-advice_title.json": "Panduan Stoik dan Filosofis untuk Menjalin Hubungan: Koneksi Tanpa Rasa Sakit"
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

print('Done quotes-relationship-advice')
