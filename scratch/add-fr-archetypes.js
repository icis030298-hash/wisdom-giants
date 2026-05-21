const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'heritage-test.ts');
let content = fs.readFileSync(filePath, 'utf8');

const targetType = `export const archetypes: Record<string, { name: { ko: string; en: string; de: string; ja: string; es?: string }; description: { ko: string; en: string; de: string; ja: string; es?: string } }> = {`;
const replacementType = `export const archetypes: Record<string, { name: { ko: string; en: string; de: string; ja: string; es?: string; fr?: string }; description: { ko: string; en: string; de: string; ja: string; es?: string; fr?: string } }> = {`;

content = content.replace(targetType, replacementType);

const frArchetypes = {
  'LRDI': { name: "L'Architecte Universel", desc: "Vous êtes un stratège qui révolutionne le monde grâce à une vision grandiose et une raison froide." },
  'LPDI': { name: "Le Pionnier Audacieux", desc: "Vous repoussez les limites de l'humanité avec un cœur ardent qui défie l'impossible et des idées novatrices." },
  'LRHI': { name: "Le Réformateur Éclairé", desc: "Vous menez sagement le changement pour un avenir meilleur tout en maintenant la stabilité de l'ensemble du système." },
  'LPHI': { name: "Le Leader Inspirateur", desc: "Vous êtes un leader qui rassemble tous les cœurs vers un rêve grandiose et réalise de grands changements." },
  'LRDT': { name: "Le Décideur Traditionnel", desc: "Vous avez le pouvoir de restaurer l'ordre au milieu du chaos en vous basant sur des valeurs classiques et un jugement rationnel." },
  'LPDT': { name: "Le Rebelle Charismatique", desc: "Vous vous battez avec passion pour les valeurs traditionnelles que vous croyez justes et faites bouger le monde." },
  'LRHT': { name: "Le Souverain Bienveillant", desc: "Vous menez la paix et le consensus historiques grâce à une perspective globale et une communication harmonieuse." },
  'LPHT': { name: "L'Unificateur Dévoué", desc: "Vous préservez les traditions communautaires et réalisez l'harmonie grâce à une humanité chaleureuse et une attitude dévouée." },
  'SRDI': { name: "L'Inventeur Précis", desc: "Vous changez de manière innovante des aspects précis de nos vies avec une logique acérée et des idées créatives." },
  'SPDI': { name: "Le Créateur Radical", desc: "Vous laissez des œuvres uniques dans le monde avec une passion sans compromis et un sens non conventionnel." },
  'SRHI': { name: "Le Sage Visionnaire", desc: "Vous résolvez les problèmes du quotidien et recherchez un développement harmonieux avec une sagesse silencieuse mais claire." },
  'SPHI': { name: "L'Artiste Compatissant", desc: "Vous guérissez et changez les blessures du monde avec une compréhension profonde et un regard chaleureux sur l'être humain." },
  'SRDT': { name: "Le Gardien Stoïque", desc: "Vous accomplissez silencieusement vos devoirs tout en adhérant à des jugements réalistes et à des principes traditionnels." },
  'SPDT': { name: "L'Activiste Passionné", desc: "Vous protégez les valeurs précieuses qui nous entourent jusqu'au bout avec une passion qui ne peut tolérer l'injustice." },
  'SRHT': { name: "Le Protecteur Humble", desc: "Vous propagez la stabilité et la paix autour de vous à travers une vie harmonieuse tout en respectant la tradition et l'ordre." },
  'SPHT': { name: "L'Âme Douce", desc: "Vous avez le pouvoir spécial d'unir les cœurs des gens avec une sensibilité chaleureuse et une attitude harmonieuse." }
};

// Loop through each archetype key and insert fr translations
for (const [key, trans] of Object.entries(frArchetypes)) {
  // Find name: { ... } for this key
  const nameRegex = new RegExp(`'${key}':\\s*{\\s*name:\\s*{([^}]+)}`);
  const nameMatch = content.match(nameRegex);
  if (nameMatch) {
    const originalNameBlock = nameMatch[1];
    if (!originalNameBlock.includes('fr:')) {
      const updatedNameBlock = originalNameBlock.trim() + `, fr: "${trans.name}"`;
      content = content.replace(originalNameBlock, updatedNameBlock);
    }
  }

  // Find description: { ... } for this key
  const descRegex = new RegExp(`'${key}':\\s*{\\s*name:\\s*{[^}]+},\\s*description:\\s*{([^}]+)}`);
  const descMatch = content.match(descRegex);
  if (descMatch) {
    const originalDescBlock = descMatch[1];
    if (!originalDescBlock.includes('fr:')) {
      const updatedDescBlock = originalDescBlock.trim() + `, fr: "${trans.desc}"`;
      content = content.replace(originalDescBlock, updatedDescBlock);
    }
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully added French translations to heritage-test.ts archetypes!");
