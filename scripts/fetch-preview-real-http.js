const https = require('https');
const http = require('http');

const candidateUrls = [
  'https://wisdom-giants-git-feat-blog-i18n-lastmod-posts-icis030298-hashs-projects.vercel.app',
  'https://wisdom-giants-git-feat-blog-i18n-lastmod-posts.vercel.app'
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function testCandidateUrls() {
  console.log('Testing candidate Vercel Preview URLs...');
  for (const baseUrl of candidateUrls) {
    const testPath = `${baseUrl}/pl/blog/peter-the-great-wisdom`;
    const res = await fetchHtml(testPath);
    console.log(`URL: ${testPath} -> Status: ${res.statusCode || res.error}`);
    if (res.statusCode === 200) {
      console.log('Found active Vercel Preview URL:', baseUrl);
      return baseUrl;
    }
  }
  return null;
}

testCandidateUrls();
