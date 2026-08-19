#!/usr/bin/env node
/**
 * Pull hardcoded locale branches out of a component and into messages/.
 *
 * 232 branches across 30 files is too many to move by hand — that is a day of
 * typing and a typo in the middle of it. The branches are regular, though:
 *
 *   isKo ? "한국어" : "English"
 *   locale === 'ko' ? "..." : locale === 'de' ? "..." : "..."
 *
 * so they can be read out, written to ko/en, and replaced with a t() call.
 *
 * Two rules this follows, both learned the hard way today:
 *
 *  - Nothing is transformed silently. Anything the parser is not sure about is
 *    reported and left alone. A codemod that half-converts a file is worse than
 *    one that refuses, because the leftovers look converted.
 *  - Template holes become ICU arguments. `${giantName}` in the source turns
 *    into {giantName} in the message and a parameter on the t() call, so the
 *    value keeps coming from the component rather than being frozen into the
 *    translation — the same reason the four giant names use interpolation.
 *
 * Usage:
 *   node scripts/extract-hardcoded-i18n.js <file.tsx> --namespace Foo [--write]
 *
 * Without --write it prints the plan and touches nothing.
 */
const fs = require('fs')
const path = require('path')

const argv = process.argv.slice(2)
const file = argv[0]
const write = argv.includes('--write')
const nsIdx = argv.indexOf('--namespace')
const namespace = nsIdx >= 0 ? argv[nsIdx + 1] : null

if (!file || !namespace) {
  console.error('usage: extract-hardcoded-i18n.js <file> --namespace <Name> [--write]')
  process.exit(1)
}

const src = fs.readFileSync(file, 'utf8')

// Two shapes this cannot safely rewrite. Both are refusals rather than
// best-effort attempts: a file that is half converted looks converted.
const blockers = []
if (!/^["']use client["']/m.test(src)) {
  // useTranslations is a hook. A server component needs getTranslations and an
  // await, which is a different edit than the one below.
  blockers.push('서버 컴포넌트 (useTranslations 불가 — getTranslations 필요)')
}
// A file that already declares `t` is already using next-intl. That is not a
// reason to refuse — the new keys just need a hook variable that does not
// shadow the existing one. If the existing hook is already on this namespace,
// reuse it rather than declaring a second one for the same thing.
const existing = src.match(
  new RegExp(`const\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*useTranslations\\(\\s*['"]${namespace}['"]\\s*\\)`)
)
const HOOK = existing ? existing[1] : /\bconst\s+t\s*=/.test(src) ? 't' + namespace : 't'

if (blockers.length) {
  console.log(`${file}`)
  for (const b of blockers) console.log(`  건너뜀: ${b}`)
  process.exit(0)
}

/** Read a quoted or backticked literal starting at i. Returns null if not one. */
function readLiteral(s, i) {
  const q = s[i]
  if (q !== '"' && q !== "'" && q !== '`') return null
  let j = i + 1
  let depth = 0
  while (j < s.length) {
    const c = s[j]
    if (c === '\\') { j += 2; continue }
    if (q === '`' && c === '$' && s[j + 1] === '{') { depth++; j += 2; continue }
    if (q === '`' && c === '}' && depth > 0) { depth--; j++; continue }
    if (c === q && depth === 0) return { raw: s.slice(i, j + 1), end: j + 1, quote: q }
    j++
  }
  return null
}

/** Literal text -> { text, params } with ${x} turned into {x}. */
function toMessage(raw) {
  const quote = raw[0]
  let body = raw.slice(1, -1)
  const params = []
  if (quote === '`') {
    body = body.replace(/\$\{([^}]+)\}/g, (_m, expr) => {
      const e = expr.trim()
      // Only plain identifiers and simple property paths become arguments; an
      // inline ternary or a call would need judgement this script does not have.
      if (!/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(e)) {
        params.push({ unsupported: e })
        return `\${${expr}}`
      }
      const name = e.split('.').pop()
      params.push({ name, expr: e })
      return `{${name}}`
    })
  }
  return { text: body.replace(/\\`/g, '`'), params }
}

/**
 * Find `<cond> ? <literal> : <literal>` chains.
 * Conditions handled: isKo, isEn, locale === 'xx'.
 */
const COND = /(?:^|[^\w$])(isKo|isEn|locale\s*===\s*['"]([a-z]{2})['"])\s*\?/g

const found = []
const skipped = []

let m
while ((m = COND.exec(src))) {
  const condStart = m.index + m[0].indexOf(m[1])
  const chain = []
  let i = COND.lastIndex // just after '?'
  let cond = m[1]
  let localeOf = (c) => (c === 'isKo' ? 'ko' : c === 'isEn' ? 'en' : (c.match(/['"]([a-z]{2})['"]/) || [])[1])

  let ok = true
  while (true) {
    while (/\s/.test(src[i])) i++
    const lit = readLiteral(src, i)
    if (!lit) { ok = false; break }
    chain.push({ locale: localeOf(cond), raw: lit.raw })
    i = lit.end
    while (/\s/.test(src[i])) i++
    if (src[i] !== ':') { ok = false; break }
    i++
    while (/\s/.test(src[i])) i++
    // Either another `cond ?` (chain continues) or the final literal.
    const next = src.slice(i, i + 60).match(/^(isKo|isEn|locale\s*===\s*['"][a-z]{2}['"])\s*\?/)
    if (next) {
      cond = next[1]
      i += next[0].length
      continue
    }
    const fallback = readLiteral(src, i)
    if (!fallback) { ok = false; break }
    chain.push({ locale: 'en', raw: fallback.raw, isFallback: true })
    i = fallback.end
    break
  }

  const snippet = src.slice(condStart, Math.min(i, condStart + 90)).replace(/\s+/g, ' ')
  if (!ok || chain.length < 2) {
    skipped.push({ at: src.slice(0, condStart).split('\n').length, why: '리터럴이 아닌 분기', snippet })
    continue
  }
  // Resume scanning past the whole chain. Without this the regex picks up the
  // second and third conditions of the same chain as if they were new ones,
  // and the resulting edit ranges overlap — which is what tore the JSX apart
  // in footer.tsx: one twelve-arm chain came back as eleven "branches".
  COND.lastIndex = i
  found.push({ start: condStart, end: i, chain, snippet })
}

// Key names from the English text: first few words, camelCased.
const usedKeys = new Set()
function keyFor(text) {
  let base = text
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('')
  if (!base) base = 'text'
  let k = base
  let n = 2
  while (usedKeys.has(k)) k = base + n++
  usedKeys.add(k)
  return k
}

const messages = { ko: {}, en: {} }
const edits = []
const unsupported = []

for (const f of found) {
  const byLocale = {}
  let params = []
  for (const c of f.chain) {
    const { text, params: p } = toMessage(c.raw)
    byLocale[c.locale] = text
    for (const q of p) {
      if (q.unsupported) unsupported.push({ snippet: f.snippet, expr: q.unsupported })
      else if (!params.some((x) => x.name === q.name)) params.push(q)
    }
  }
  const en = byLocale.en ?? Object.values(byLocale)[0]
  const key = keyFor(en)
  messages.en[key] = en
  messages.ko[key] = byLocale.ko ?? en
  const args = params.length ? `, { ${params.map((p) => `${p.name}: ${p.expr}`).join(', ')} }` : ''
  edits.push({ ...f, key, replacement: `${HOOK}('${key}'${args})` })
}

console.log(`${file}`)
console.log(`  분기 ${found.length}건 추출  ·  건너뜀 ${skipped.length}건  ·  미지원 보간 ${unsupported.length}건\n`)
for (const e of edits) {
  console.log(`  ${e.key}`)
  console.log(`    en  ${messages.en[e.key]}`)
  console.log(`    ko  ${messages.ko[e.key]}`)
  console.log(`    →   ${e.replacement}`)
}
if (skipped.length) {
  console.log('\n  ── 건너뜀 (수동 확인 필요) ──')
  for (const s of skipped) console.log(`    L${s.at}  ${s.why}: ${s.snippet}`)
}
if (unsupported.length) {
  console.log('\n  ── 보간이 단순 식별자가 아님 (수동) ──')
  for (const u of unsupported) console.log(`    ${u.expr}   in  ${u.snippet}`)
}

if (!write) {
  console.log('\n  (--write 없이 실행: 파일을 바꾸지 않았습니다)')
  process.exit(0)
}

// Apply edits back to front so offsets stay valid.
let out = src
for (const e of [...edits].sort((a, b) => b.start - a.start)) {
  out = out.slice(0, e.start) + e.replacement + out.slice(e.end)
}

// Drop the now-unused isKo/isEn declarations.
out = out.replace(/^\s*const\s+is(?:Ko|En)\s*=\s*locale\s*===\s*['"][a-z]{2}['"]\s*;?\s*$/gm, '')

// The hook declaration is NOT inserted automatically.
//
// Two attempts at it went wrong the same way. "Put it before the first
// `return (`" lands inside a nested helper in chat-interface, after the first
// use in dna/page, and nowhere at all in chats/page — the declaration ends up
// out of scope or below the code that needs it, and tsc reports a name that
// does not exist. Finding the component body properly needs an AST, not a
// regex, and a wrong guess here produces a file that looks converted and does
// not compile.
//
// Extraction is the part worth automating; adding one line per file is not.
const needsHook = !new RegExp(`const\\s+${HOOK}\\s*=`).test(out)
const needsImport = !/from ["']next-intl["']/.test(out)

fs.writeFileSync(file, out, 'utf8')

const msgDir = path.join(process.cwd(), 'messages')
for (const loc of ['ko', 'en']) {
  const p = path.join(msgDir, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(p, 'utf8'))
  json[namespace] = { ...(json[namespace] || {}), ...messages[loc] }
  fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n', 'utf8')
}
console.log(`\n  적용 완료. messages/ko.json · en.json 의 ${namespace} 네임스페이스에 ${edits.length}개 키.`)
if (needsHook || needsImport) {
  console.log('\n  ⚠ 아래 두 줄을 손으로 넣으세요 (컴포넌트 본문 최상단):')
  if (needsImport) console.log(`      import { useTranslations } from "next-intl"`)
  if (needsHook) console.log(`      const ${HOOK} = useTranslations("${namespace}")`)
}
