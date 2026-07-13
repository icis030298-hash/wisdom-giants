const http = require('http');

http.get('http://localhost:3000/sitemap/pages.xml', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('<priority>1.0</priority>')) {
      console.log('✅ Priority 1.0 found for Home Page!');
    } else {
      console.error('❌ Priority 1.0 not found');
    }
    
    if (data.includes('<priority>0.5</priority>')) {
      console.log('✅ Priority 0.5 found for static pages!');
    } else {
      console.error('❌ Priority 0.5 not found');
    }

    if (data.includes('<changefreq>')) {
      console.log('✅ ChangeFreq found!');
    } else {
      console.error('❌ ChangeFreq not found');
    }

    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Error fetching sitemap:', err.message);
  process.exit(1);
});
