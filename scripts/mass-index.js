import { google } from 'googleapis';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE_PATH = path.join(__dirname, '../google-service-account.json');
const PROGRESS_FILE_PATH = path.join(__dirname, './indexing-progress.json');
const SITEMAP_URL = 'https://www.giantswisdom.com/sitemap.xml';
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const DAILY_LIMIT = 200;

// 1. 서비스 계정 키 파일 존재 여부 확인
if (!fs.existsSync(KEY_FILE_PATH)) {
  console.error(`\x1b[31m[오류] '${KEY_FILE_PATH}' 파일을 찾을 수 없습니다.\x1b[0m`);
  console.error('\x1b[33m구글 클라우드에서 다운로드한 JSON 키 파일의 이름을 "google-service-account.json"으로 변경하여 프로젝트 최상위 폴더에 넣어주세요!\x1b[0m');
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(KEY_FILE_PATH, 'utf8'));

// 2. 색인 진행도 데이터 불러오기
let progress = { submitted: [] };
if (fs.existsSync(PROGRESS_FILE_PATH)) {
  try {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE_PATH, 'utf8'));
  } catch (e) {
    console.warn('[경고] 진행도 파일이 손상되어 새로 초기화합니다.');
  }
}

async function runMassIndexing() {
  try {
    console.log(`\x1b[36m[시작] 사이트맵 파싱 중... (${SITEMAP_URL})\x1b[0m`);
    
    // 3. 실시간 사이트맵 가져오기
    const sitemapRes = await fetch(SITEMAP_URL);
    if (!sitemapRes.ok) {
      throw new Error(`사이트맵을 가져오는데 실패했습니다: ${sitemapRes.statusText}`);
    }
    const sitemapXml = await sitemapRes.text();
    
    // 4. URL 추출 (정규식 사용)
    const locRegex = /<loc>(.*?)<\/loc>/g;
    const allUrls = [];
    let match;
    while ((match = locRegex.exec(sitemapXml)) !== null) {
      allUrls.push(match[1]);
    }
    
    console.log(`\x1b[32m[성공] 사이트맵에서 총 ${allUrls.length}개의 URL을 찾았습니다.\x1b[0m`);
    
    // 5. 이미 제출된 URL 제외 필터링
    const submittedSet = new Set(progress.submitted);
    const pendingUrls = allUrls.filter(url => !submittedSet.has(url));
    
    console.log(`\x1b[34m[분석] 이미 제출된 URL: ${submittedSet.size}개 | 남은 대기 URL: ${pendingUrls.length}개\x1b[0m`);
    
    if (pendingUrls.length === 0) {
      console.log('\x1b[32m[완료] 축하합니다! 모든 URL이 이미 색인 요청되었습니다. 새로 추가된 URL이 없습니다.\x1b[0m');
      return;
    }
    
    // 6. 오늘 보낼 개수 설정 (최대 200개)
    const targetsToSubmit = pendingUrls.slice(0, DAILY_LIMIT);
    console.log(`\x1b[35m[진행] 오늘 한도 내에서 총 ${targetsToSubmit.length}개의 URL을 순차 전송합니다...\x1b[0m\n`);
    
    // 7. Google Indexing API 인증 설정
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const jwtClient = await auth.getClient();
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < targetsToSubmit.length; i++) {
      const url = targetsToSubmit[i];
      const indexNum = i + 1;
      
      try {
        const response = await jwtClient.request({
          url: INDEXING_API_ENDPOINT,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        
        console.log(`[${indexNum}/${targetsToSubmit.length}] \x1b[32m성공\x1b[0m: ${url}`);
        progress.submitted.push(url);
        successCount++;
        
        // 매 10개 성공할 때마다 중간 진행 상황 저장
        if (successCount % 10 === 0) {
          fs.writeFileSync(PROGRESS_FILE_PATH, JSON.stringify(progress, null, 2), 'utf8');
        }
        
        // API 요청 간에 안정성을 위해 아주 약간의 딜레이(100ms) 추가
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`[${indexNum}/${targetsToSubmit.length}] \x1b[31m실패\x1b[0m: ${url}`);
        console.error(`  - 사유: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        failCount++;
        
        // 403 에러나 401 에러(서치콘솔 연동 안됨 등)인 경우 스크립트 중단
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          console.error('\n\x1b[31m[경고] 권한 부족으로 인해 중단되었습니다. 구글 서치 콘솔에 이메일이 등록되었는지 다시 한번 확인해 주세요!\x1b[0m');
          break;
        }
      }
    }
    
    // 8. 최종 진행도 저장
    fs.writeFileSync(PROGRESS_FILE_PATH, JSON.stringify(progress, null, 2), 'utf8');
    
    console.log(`\n\x1b[36m=== 오늘의 작업 리포트 ===\x1b[0m`);
    console.log(`- 전송 시도: ${targetsToSubmit.length}개`);
    console.log(`- 전송 성공: ${successCount}개`);
    console.log(`- 전송 실패: ${failCount}개`);
    console.log(`- 누적 성공률: ${((progress.submitted.length / allUrls.length) * 100).toFixed(1)}% (${progress.submitted.length}/${allUrls.length} 완료)`);
    console.log(`=========================\n`);
    
    if (progress.submitted.length < allUrls.length) {
      console.log(`\x1b[33m[다음 안내] 아직 전송하지 못한 URL이 ${allUrls.length - progress.submitted.length}개 남아있습니다.\x1b[0m`);
      console.log(`\x1b[33m구글 API 24시간 한도가 리셋되는 내일 같은 시간에 이 스크립트를 다시 한번 실행해 주세요!\x1b[0m`);
    } else {
      console.log(`\x1b[32m[축하합니다!] 모든 페이지의 색인 요청이 완료되었습니다!\x1b[0m`);
    }
    
  } catch (error) {
    console.error('\n\x1b[31m[에러 발생] 실행 도중 오류가 발생했습니다:\x1b[0m', error.message);
  }
}

runMassIndexing();
