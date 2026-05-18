const https = require('https');

function translate(text, sl = 'en', tl = 'ja') {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const result = parsed[0].map(item => item[0]).join('');
            resolve(result);
          } else {
            reject(new Error("Invalid response format"));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

translate("Stay hungry, stay foolish.")
  .then(res => console.log("SUCCESS:", res))
  .catch(err => console.error("FAILED:", err));
