const fs = require('fs');
const candidates = JSON.parse(fs.readFileSync('scripts/candidates-approval.json', 'utf8'));

const suspects = [];

candidates.forEach(c => {
  const bio = c.briefBio.toLowerCase();
  
  // If region is africa, middle-east-turkey, or eurasia
  // but bio mentions Western nations like American, British, French, German, Italian, etc.
  if (['africa', 'middle-east-turkey', 'eurasia'].includes(c.region)) {
    const keywords = ['american', 'born in the united states', 'born in the us', 'born in massachusetts', 'born in new york', 'born in england', 'born in france', 'born in germany', 'born in martinique', 'british scholar', 'french scholar', 'german missionary'];
    const matched = keywords.filter(kw => bio.includes(kw));
    if (matched.length > 0) {
      suspects.push({
        name: c.nameEn,
        slug: c.slug,
        region: c.region,
        bio: c.briefBio,
        matched
      });
    }
  }
});

console.log('Suspect candidates count:', suspects.length);
console.log(JSON.stringify(suspects, null, 2));
