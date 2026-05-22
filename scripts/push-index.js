import { google } from 'googleapis';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const key = JSON.parse(fs.readFileSync(path.join(__dirname, '../google-service-account.json'), 'utf8'));

// 구글 인덱싱 API 엔드포인트
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

async function requestIndexing(url, type = 'URL_UPDATED') {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const jwtClient = await auth.getClient();

    const response = await jwtClient.request({
      url: INDEXING_API_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        url: url,
        type: type, // 'URL_UPDATED' or 'URL_DELETED'
      },
    });

    console.log(`[SUCCESS] 구글 색인 요청 성공: ${url}`);
    console.log('응답 내용:', response.data);
  } catch (error) {
    console.error(`[ERROR] 색인 요청 실패: ${url}`);
    console.error(error.response ? error.response.data : error.message);
  }
}

// 스크립트 실행 인자로 URL을 받습니다.
const targetUrl = process.argv[2];

if (!targetUrl) {
  console.log('사용법: node scripts/push-index.js <URL>');
  console.log('예시: node scripts/push-index.js https://www.giantswisdom.com/ko/debate');
  process.exit(1);
}

requestIndexing(targetUrl);
