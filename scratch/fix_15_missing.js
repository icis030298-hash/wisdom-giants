const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('scratch/candidates_500_missing.json', 'utf8'));
const verified = JSON.parse(fs.readFileSync('scratch/candidates_500_roster_verified.json', 'utf8'));

const corrections = {
    "Yi Hwang (Toegye)": "Yi Hwang",
    "Yi I (Yulgok)": "Yi I",
    "Sol Geo": "Solgeo",
    "Seok Ga-mo-ni (Park Eun-sik)": "Park Eun-sik",
    "Su Shi (Su Dongpo)": "Su Shi",
    "Rani of Jhansi (Lakshmibai)": "Rani of Jhansi",
    "Queen Nandi": "Nandi (mother of Shaka)",
    "King Sobhuza I": "Sobhuza I",
    "Queen Majaji": "Rain Queen",
    "Seoae Ryu Seong-ryong": "Ryu Seong-ryong",
    "Atatürk (Mustafa Kemal)": "Mustafa Kemal Atatürk",
    "J.A. Macdonald": "John A. Macdonald",
    "L. v. Beethoven": "Ludwig van Beethoven",
    "Tz'u-hsi (Cixi)": "Empress Dowager Cixi",
    "Nzinga of Ndongo": "Nzinga of Ndongo and Matamba"
};

missing.forEach(c => {
    if (corrections[c.nameEn]) {
        c.nameEn = corrections[c.nameEn];
    }
    verified.push(c);
});

fs.writeFileSync('scratch/candidates_500_roster_verified_final.json', JSON.stringify(verified, null, 2), 'utf8');
console.log(`Added 15 missing items. Total verified: ${verified.length}`);
