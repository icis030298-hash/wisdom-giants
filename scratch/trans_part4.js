const fs = require('fs');

let fileContent = fs.readFileSync('scratch/el_batch_8_out.json', 'utf8');

// Replace the stray Korean word '및' (and) with 'και' globally
fileContent = fileContent.replace(/및/g, "και");

let data = JSON.parse(fileContent);

// 20. behanzin
if (data["behanzin"] && data["behanzin"].keyAchievements && data["behanzin"].keyAchievements[2]) {
    data["behanzin"].keyAchievements[2].description = "Διοικούσε τις «Μίνο» ή Αμαζόνες του Νταχομέι, οι οποίες ήταν μία από τις μοναδικές καταγεγραμμένες γυναικείες μονάδες μάχης στην πρώτη γραμμή της ιστορίας και φημίζονταν για τη γενναιότητά τους.";
}

// 21. saad-zaghloul
if (data["saad-zaghloul"] && data["saad-zaghloul"].timeline && data["saad-zaghloul"].timeline[4]) {
    data["saad-zaghloul"].timeline[4].event = "Ίδρυσε το Wafd (Αντιπροσωπεία) για να απαιτήσει ανεξαρτησία από τη Μεγάλη Βρετανία.";
}

// 23. sayyid-mohammed-abdullah-hassan
if (data["sayyid-mohammed-abdullah-hassan"] && data["sayyid-mohammed-abdullah-hassan"].faq && data["sayyid-mohammed-abdullah-hassan"].faq[2]) {
    data["sayyid-mohammed-abdullah-hassan"].faq[2].answer = "Τιμάται ως εθνικός ήρωας και «πατέρας του σομαλικού εθνικισμού» για τον ρόλο του στην αντίσταση ενάντια στην ξένη κυριαρχία. Αγάλματα, σχολεία, ακόμη και ένα αεροδρόμιο έχουν πάρει το όνομά του.";
}

// 30. ahmad-baba-al-massufi
if (data["ahmad-baba-al-massufi"] && data["ahmad-baba-al-massufi"].keyAchievements && data["ahmad-baba-al-massufi"].keyAchievements[3]) {
    data["ahmad-baba-al-massufi"].keyAchievements[3].title = "Σύμβολο αντίστασης";
}

fs.writeFileSync('scratch/el_batch_8_out.json', JSON.stringify(data, null, 2), 'utf8');
