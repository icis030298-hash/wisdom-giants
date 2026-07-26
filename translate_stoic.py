import os
import json

tasks_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/tasks/'
results_dir = 'C:/Users/user/.gemini/antigravity/brain/45f5002d-398c-41ef-8740-cf257710e53c/scratch/pipeline/id/results/'

json_str = r'''{
  "quotes-stoic-happiness_para_000.json": "## Sifat Fana dari Kesenangan Eksternal",
  "quotes-stoic-happiness_para_001.json": "Di dunia kontemporer kita, sukacita sering disamakan dengan kesenangan sesaat: sensasi pembelian baru, validasi sekilas dari tanda suka (likes) di media sosial, atau pelarian sementara yang ditawarkan oleh hiburan. Kita mengejar rangsangan eksternal ini, dengan keyakinan bahwa mereka memegang kunci kebahagiaan, hanya untuk mendapati diri kita terus-menerus mencari kepuasan berikutnya, sebuah tugas Sisifus yang membuat kita merasa hampa. Pengejaran ini adalah kesalahpahaman mendasar tentang apa yang terkandung dalam sukacita yang sejati dan abadi. Para filsuf Stoik, berabad-abad yang lalu, bergulat dengan kecenderungan manusiawi ini dan menawarkan alternatif yang radikal namun sangat praktis.",
  "quotes-stoic-happiness_para_002.json": "### Nasihat Seneca tentang Waktu dan Kekayaan Sejati",
  "quotes-stoic-happiness_para_003.json": "Lucius Annaeus Seneca, negarawan Romawi, penulis naskah drama, dan filsuf Stoik, memahami sifat ilusi dari kekayaan eksternal. Tulisan-tulisannya secara konsisten menekankan pentingnya kebajikan dan watak batin atas harta benda atau kedudukan sosial. Seneca menyadari bahwa kekayaan sejati tidak terletak pada apa yang dimiliki seseorang, melainkan pada bagaimana ia hidup dan pada kualitas karakternya. Ia dengan terkenal menegur orang-orang sezamannya, dan lebih jauh lagi kita, karena salah mengelola sumber daya mereka yang paling berharga: waktu.",
  "quotes-stoic-happiness_para_004.json": "> \"Bukannya kita memiliki waktu yang singkat untuk hidup, melainkan kita membuang banyak waktu.",
  "quotes-stoic-happiness_para_005.json": "> Hidup ini tidak singkat, tetapi kitalah yang membuatnya demikian dengan membuang-buangnya.\"\n> - Seneca",
  "quotes-stoic-happiness_para_006.json": "Kutipan ini merupakan dakwaan yang kuat terhadap penundaan dan gangguan, baik dulu maupun sekarang. Tekanan pekerjaan modern, rentetan informasi yang terus-menerus, dan kecemasan seputar lintasan karier dapat membuat kita merasa terus-menerus kekurangan waktu. Kebijaksanaan Seneca mengingatkan kita bahwa masalahnya bukanlah kelangkaan momen, melainkan kegagalan kita untuk menginvestasikannya secara bijak dalam aktivitas yang menumbuhkan diri batin kita dan selaras dengan nilai-nilai kita. Sukacita sejati, bagi Seneca, adalah kondisi internal, yang ditumbuhkan melalui nalar, disiplin diri, dan pengejaran akan kebijaksanaan, yang tidak bergantung pada keadaan eksternal.",
  "quotes-stoic-happiness_para_007.json": "## Marcus Aurelius: Benteng Batin Sang Kaisar",
  "quotes-stoic-happiness_para_008.json": "Mungkin tidak ada tokoh yang mewujudkan cita-cita Stoik tentang ketangguhan batin yang lebih mendalam daripada Marcus Aurelius, Kaisar Romawi dari tahun 161 hingga 180 M. Sambil memimpin kekaisaran dan menghadapi perang, wabah, serta intrik politik yang terus-menerus, ia berpaling ke dalam, dengan cermat mencatat pikiran dan perenungannya. Meditasi pribadi ini, yang kemudian disusun sebagai \"Meditations,\" mengungkap seorang pria yang berjuang untuk hidup berdasarkan prinsip-prinsip Stoik bahkan di tengah tekanan dan tanggung jawab yang sangat besar. Konsepnya mengenai \"benteng batin\" – sebuah benteng nalar dan kebajikan di dalam pikiran yang tidak dapat ditembus oleh peristiwa eksternal – merupakan inti dari pemahaman Stoik mengenai sukacita.",
  "quotes-stoic-happiness_para_009.json": "Marcus Aurelius memahami bahwa meskipun kita tidak dapat mengendalikan peristiwa eksternal, kita memiliki kendali mutlak atas penilaian dan respons kita terhadap peristiwa tersebut. Ini merupakan landasan dari sukacita Stoik: kemampuan untuk tetap tenang dan puas tanpa memedulikan kehendak nasib.",
  "quotes-stoic-happiness_para_010.json": "> \"Anda memiliki kekuasaan atas pikiran Anda – bukan atas kejadian-kejadian di luar. Sadarilah ini, dan Anda akan menemukan kekuatan.\"\n> - Marcus Aurelius",
  "quotes-stoic-happiness_para_011.json": "Wawasan ini sangat relevan dengan pergumulan modern. Baik saat menghadapi kehilangan pekerjaan, menavigasi hubungan kerja yang kompleks, maupun menghadapi kemunduran pribadi, kemampuan untuk fokus pada apa yang berada dalam kendali kita – pikiran, sikap, dan tindakan kita – adalah hal yang terpenting. Praktik memeriksa kesan kita, mempertanyakan reaksi awal kita, dan memilih respons yang rasional dan berbudi luhur, merupakan jalan menuju kedamaian batin yang tak tergoyahkan, yang merupakan definisi sejati Stoik tentang sukacita. Ini bukanlah ketiadaan kesulitan, melainkan kehadiran dari ketabahan batin.",
  "quotes-stoic-happiness_para_012.json": "### Fondasi Cicero dalam Kebajikan dan Nalar",
  "quotes-stoic-happiness_para_013.json": "Meskipun bukan secara ketat seorang filsuf Stoik layaknya Seneca atau Marcus Aurelius, Marcus Tullius Cicero, negarawan Romawi, orator, pengacara, dan filsuf, sangat terlibat dengan gagasan-gagasan Stoik dan mengintegrasikannya ke dalam karya filosofisnya sendiri. Cicero menekankan bahwa kebajikan adalah satu-satunya kebaikan dan fondasi dari kehidupan yang bahagia. Baginya, sama seperti para pengikut Stoik, sukacita yang sejati terkait erat dengan menjalani kehidupan yang bajik, dibimbing oleh nalar dan keadilan. Ia percaya bahwa keadaan eksternal tidak dapat mengurangi kebahagiaan orang yang bajik.",
  "quotes-stoic-happiness_para_014.json": "Tulisan-tulisan Cicero sering mengeksplorasi gagasan bahwa pikiran yang tertata dengan baik, yang dibimbing oleh prinsip-prinsip filosofis, adalah pertahanan utama terhadap perubahan nasib dalam hidup. Ia memperjuangkan pengembangan kebijaksanaan, keadilan, keberanian, dan kesederhanaan sebagai komponen penting dari kehidupan yang berkembang.",
  "quotes-stoic-happiness_para_015.json": "> \"Pengejaran akan kebajikan adalah satu-satunya pengejaran yang tidak diikuti oleh penyesalan.\"\n> - Cicero (interpretasi yang diparafrasekan dari filosofi intinya)",
  "quotes-stoic-happiness_para_016.json": "## Menumbuhkan Diri yang Tak Tergoyahkan Saat Ini",
  "quotes-stoic-happiness_para_017.json": "Pelajaran-pelajaran dari Seneca, Marcus Aurelius, dan Cicero bukanlah peninggalan dari masa lalu; melainkan resep abadi untuk menavigasi kompleksitas keberadaan manusia. Definisi Stoik tentang sukacita bukanlah tentang euforia yang memabukkan, melainkan tentang kepuasan yang mendalam dan stabil yang berasal dari kehidupan batin yang penuh kebajikan, nalar, dan ketangguhan. Dalam menghadapi tekanan kehidupan modern – kecemasan karier, pencarian makna, ritme yang tak kenal lelah – kita dapat menemukan pelipur lara dan kekuatan dengan menumbuhkan benteng batin kita sendiri. Ini melibatkan latihan kesadaran diri, berfokus pada respons kita ketimbang peristiwa eksternal, dan berkomitmen pada tindakan yang bajik. Dengan menginternalisasi prinsip-prinsip ini, kita dapat membangun diri batin yang tak tergoyahkan, yang mampu mengalami sukacita yang dalam dan abadi yang tidak dapat dikikis oleh keadaan eksternal apa pun. Itu adalah sukacita yang ditemukan bukan dalam perolehan, melainkan dalam keberadaan; bukan dalam kesenangan sesaat, melainkan dalam karakter yang bertahan lama.",
  "quotes-stoic-happiness_title.json": "Definisi Sukacita yang Sesungguhnya dari Stoikisme: Diri Batin yang Tak Tergoyahkan"
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

print('Done quotes-stoic-happiness')
