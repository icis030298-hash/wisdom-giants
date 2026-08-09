const https = require('https');

const query = `
SELECT ?item ?itemLabel WHERE {
  ?item wdt:P31 wd:Q146.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 5
`;

const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query);

const options = {
  headers: {
    'User-Agent': 'AntigravityBot/1.0 (https://example.com/)'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('Wikidata is UP. Output preview:');
      try {
        const json = JSON.parse(data);
        console.log(json.results.bindings.map(b => b.itemLabel.value).join(', '));
      } catch(e) {
        console.log('Parse error:', e.message);
      }
    } else {
      console.log('Wikidata is DOWN or returned error. Response:', data.substring(0, 200));
    }
  });
}).on('error', err => {
  console.log('Request failed:', err.message);
});
