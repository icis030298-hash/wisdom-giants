import fs from 'fs'

async function fetchWikiSources() {
  const wikipediaLinks = JSON.parse(
    fs.readFileSync('src/data/wikipedia-links.json', 'utf8')
  )
  
  const sourcesFile = 'scripts/wiki-sources-all.json'
  let sources: Record<string, string> = {}
  
  if (fs.existsSync(sourcesFile)) {
    sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'))
  }

  const allSlugs = Object.keys(wikipediaLinks)
  console.log(`총 ${allSlugs.length}개의 위인 위키 링크 확인.`)

  let count = 0
  for (const slug of allSlugs) {
    if (sources[slug]) {
      continue // 이미 있으면 스킵
    }

    const urlData = wikipediaLinks[slug]
    const url = urlData?.ko || urlData?.en
    if (!url) {
      console.log(`⚠️ ${slug}: 위키 링크 없음, 건너뜀`)
      continue
    }

    try {
      const title = decodeURIComponent(url.split('/wiki/')[1])
      const apiUrl = `https://ko.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=${encodeURIComponent(title)}&format=json&explaintext=1&redirects=1`

      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'GiantsWisdomBot/1.0 (contact@giantswisdom.com)'
        }
      })
      const text = await res.text()
      const data = JSON.parse(text)
      
      const pages = data.query?.pages
      if (pages) {
        const pageId = Object.keys(pages)[0]
        const extract = pages[pageId].extract || ''
        sources[slug] = extract
        console.log(`✅ ${slug}: ${extract.length}자 수집`)
      } else {
        console.log(`⚠️ ${slug}: 본문을 찾을 수 없음`)
        sources[slug] = ""
      }
    } catch (e: any) {
      console.error(`❌ ${slug}: Fetch 에러 - ${e.message}`)
      sources[slug] = ""
    }

    count++
    if (count % 10 === 0) {
      fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2))
      console.log(`💾 중간 저장 완료 (${Object.keys(sources).length}/${allSlugs.length})`)
    }

    await new Promise(r => setTimeout(r, 500)) // Rate limit
  }

  fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2))
  console.log('완료: scripts/wiki-sources-all.json 생성됨')
}

fetchWikiSources()
