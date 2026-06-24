import fs from 'fs'

async function fetchWikiSources() {
  const wikipediaLinks = JSON.parse(
    fs.readFileSync('src/data/wikipedia-links.json', 'utf8')
  )

  const pilotSlugs = [
    'king-sejong', 'diogenes', 'socrates',
    'napoleon-bonaparte', 'albert-einstein',
    'marie-curie', 'leonardo-da-vinci',
    'thomas-edison', 'joan-of-arc', 'confucius'
  ]

  const sources: Record<string, string> = {}

  for (const slug of pilotSlugs) {
    const url = wikipediaLinks[slug]
    if (!url) {
      console.log(`⚠️ ${slug}: 위키 링크 없음, 건너뜀`)
      continue
    }

    try {
      const title = decodeURIComponent(url.split('/wiki/')[1])
      const apiUrl = `https://ko.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=${encodeURIComponent(title)}&format=json&explaintext=1&redirects=1`

      console.log(`Fetching ${slug}... (${apiUrl})`)
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
      }
    } catch (e: any) {
      console.error(`❌ ${slug}: Fetch 에러 - ${e.message}`)
    }

    await new Promise(r => setTimeout(r, 500)) // Rate limit
  }

  fs.writeFileSync(
    'scripts/wiki-source-pilot.json',
    JSON.stringify(sources, null, 2)
  )
  console.log('완료: scripts/wiki-source-pilot.json 생성됨')
}

fetchWikiSources().catch(console.error)
