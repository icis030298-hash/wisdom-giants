const http = require('http');
http.get('http://localhost:3006/ko/giant/marie-curie', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const h1Count = (data.match(/<h1/g) || []).length;
    const jsonLdCount = (data.match(/application\/ld\+json/g) || []).length;
    const bailoutMatch = data.match(/template id="B:0"/g);
    console.log('H1 Count:', h1Count);
    console.log('JSON-LD Count:', jsonLdCount);
    console.log('Bailout Exists:', !!bailoutMatch);
  });
});
