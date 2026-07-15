const fs = require('fs');

let data = JSON.parse(fs.readFileSync('scratch/el_batch_8_out.json', 'utf8'));

if (data["alfred-nobel"]) data["alfred-nobel"].keyAchievements[0].title = "Εφεύρεση του δυναμίτη";
if (data["jang-yeong-sil"]) data["jang-yeong-sil"].timeline[4].event = "Ολοκλήρωσε το Honcheoni, μια σφαίρα (αρμιλλρική).";
if (data["sophocles"]) {
    // Note: timeline 4 and 5 in the error output, let's just make sure we are targeting the right index
    // We can just find the one that has Korean text
    for (let t of data["sophocles"].timeline) {
        if (t.event.includes("정치 생활에 들어가 요직을 여러 번 지냈으며, 해군 제독으로 활약함.")) {
            t.event = "Εισήλθε στην πολιτική, καταλαμβάνοντας πολλές σημαντικές θέσεις και υπηρέτησε ως ναύαρχος.";
        }
        if (t.event.includes("사망.")) {
            t.event = "Απεβίωσε.";
        }
    }
}
if (data["nana-asmau"]) {
    for (let t of data["nana-asmau"].timeline) {
        if (t.event.includes("소코토 칼리파국의 창시자인 우스만 단 포디오의 딸로 태어남.")) {
            t.event = "Γεννήθηκε ως κόρη του Ουσμάν νταν Φόντιο, ιδρυτή του Χαλιφάτου του Σοκότο.";
        }
        if (t.event.includes("소코토 칼리파국 건국으로 이어진 풀라니 전쟁을 겪음.")) {
            t.event = "Βίωσε τον Πόλεμο των Φουλάνι, ο οποίος οδήγησε στην ίδρυση του Χαλιφάτου του Σοκότο.";
        }
    }
}
if (data["dido"]) {
    for (let f of data["dido"].faq) {
        if (f.answer && f.answer.includes("아이네이스")) {
            f.answer = "Στην «Αινειάδα», η κατάρα που έριξε η Διδώ στον Αινεία και τους απογόνους του λειτουργεί ως μυθική εξήγηση για τον έντονο ανταγωνισμό και τους τρεις Καρχηδονιακούς Πολέμους μεταξύ Καρχηδόνας και Ρώμης.";
        }
    }
}
if (data["gebre-mesqel-lalibela"]) {
    for (let t of data["gebre-mesqel-lalibela"].timeline) {
        if (t.event.includes("은둔자로서 말년을 보내기 위해 왕위를 양위한 후 사망함.")) {
            t.event = "Παραιτήθηκε από τον θρόνο για να ζήσει ως ερημίτης και στη συνέχεια απεβίωσε. Αργότερα ανακηρύχθηκε άγιος από την Αιθιοπική Ορθόδοξη Εκκλησία Τεουαχέντο.";
        }
    }
    for (let k of data["gebre-mesqel-lalibela"].keyAchievements) {
        if (k.description && k.description.includes("그의 수도를 예루살렘을 대체할 주요 기독교 순례지로 확립함.")) {
            k.description = "Καθιέρωσε την πρωτεύουσά του ως σημαντικό χριστιανικό κέντρο προσκυνήματος, ως εναλλακτική της Ιερουσαλήμ.";
        }
    }
}
if (data["moshoeshoe-i"]) {
    for (let k of data["moshoeshoe-i"].keyAchievements) {
        if (k.title && k.title.includes("능숙한 외교술")) {
            k.title = "Επιδέξια διπλωματία";
        }
    }
}
if (data["samuel-ajayi-crowther"]) {
    for (let f of data["samuel-ajayi-crowther"].faq) {
        if (f.question && f.question.includes("중요")) {
            f.question = "Γιατί είναι τόσο σημαντικό το γλωσσολογικό του έργο;";
        }
    }
}

fs.writeFileSync('scratch/el_batch_8_out.json', JSON.stringify(data, null, 2), 'utf8');
