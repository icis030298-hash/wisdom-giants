const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/all_mismatches_b7.json', 'utf8'));

const badPatterns = [
  "Mafi kyawun", "Bora Zaidi Kati Ya", "Điều tuyệt vời nhất", "Le meilleur de", // Gebre
  "Photo de", "Hoton", "Picha ya", "Hình Ảnh", // Sol Plaatje
  "tôi", // Ranavalona I
  "Ô ", "Ewe ", "O ", // Yaa Asantewaa
  "Les conseils de", // Cetshwayo
  "عمدة", // Amda Seyon (Mayor of Zion)
  "퀴" // Olaudah Equiano Chinese with Korean char
];

const discrepancies = [];

for (const m of data) {
  let isBad = false;
  for (const p of badPatterns) {
    if (m.localName.includes(p)) {
      isBad = true;
      break;
    }
  }
  
  if (isBad) {
    discrepancies.push({
      slug: m.slug,
      locale: m.locale,
      localName: m.localName,
      correctName: m.correctName
    });
  }
}

fs.writeFileSync('scratch/name_discrepancies_final_batch_7.json', JSON.stringify(discrepancies, null, 2));
console.log('Saved to scratch/name_discrepancies_final_batch_7.json');
