const https = require('https');
const fs = require('fs');

const query = `
SELECT ?person ?personLabel ?description ?birthDate ?deathDate ?genderLabel ?countryLabel ?continentLabel ?occupationLabel ?sitelinks WHERE {
  ?person wdt:P31 wd:Q5. # human
  ?person wdt:P570 ?deathDate.
  FILTER(YEAR(?deathDate) < 1970)
  
  ?person wdt:P21 ?gender.
  ?person wdt:P27 ?country.
  OPTIONAL { ?country wdt:P30 ?continent. }
  ?person wdt:P106 ?occupation.
  
  ?person wikibase:sitelinks ?sitelinks.
  FILTER(?sitelinks > 35) # highly notable

  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "en". 
    ?person rdfs:label ?personLabel.
    ?person schema:description ?description.
    ?gender rdfs:label ?genderLabel.
    ?country rdfs:label ?countryLabel.
    ?continent rdfs:label ?continentLabel.
    ?occupation rdfs:label ?occupationLabel.
  }
} LIMIT 5000
`;

const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query);

const options = {
  headers: {
    'User-Agent': 'AntigravityBot/1.0 (https://example.com/)'
  }
};

console.log('Fetching massive Wikidata pool...');
https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      fs.writeFileSync('scratch/wikidata_pool.json', data, 'utf8');
      console.log('Saved to scratch/wikidata_pool.json');
    } else {
      console.log('Error:', data.substring(0, 500));
    }
  });
}).on('error', err => {
  console.log('Request failed:', err.message);
});
