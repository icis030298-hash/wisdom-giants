'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'gw_read_giants'

// The gauge used to count only giants you had sent a message to, so the key was
// named for chatting. It now counts giants whose story you have actually read,
// which is a different and much larger set, hence the new key.
//
// The old key is still read once and merged in. Without that, someone sitting
// at four giants would open the site and find themselves back at zero. It is
// read, never written, and deliberately not deleted -- it costs a few bytes and
// it means rolling this change back does not throw the history away.
const LEGACY_STORAGE_KEY = 'gw_chatted_giants'

function readSlugs(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s): s is string => typeof s === 'string' && s.length > 0)
  } catch (e) {
    console.error(`Failed to load giant history from localStorage (${key}):`, e)
    return []
  }
}

export function useGiantHistory() {
  const [readGiants, setReadGiants] = useState<string[]>([])

  useEffect(() => {
    const current = readSlugs(STORAGE_KEY)
    const legacy = readSlugs(LEGACY_STORAGE_KEY)
    const merged = Array.from(new Set([...legacy, ...current]))

    setReadGiants(merged)

    // Persist the merge so the old key stops being the source of truth. Only
    // when it actually added something, so this is a one-time write.
    if (merged.length > current.length) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      } catch (e) {
        console.error('Failed to migrate giant history in localStorage:', e)
      }
    }
  }, [])

  // Stable identity: chat-interface lists this in a useEffect dependency array,
  // and a fresh function each render would re-run that effect every time.
  const markGiantRead = useCallback((slug: string) => {
    if (!slug) return
    setReadGiants(prev => {
      if (prev.includes(slug)) return prev
      const next = [...prev, slug]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.error('Failed to save giant history to localStorage:', e)
      }
      return next
    })
  }, [])

  const hasRead = useCallback(
    (slug: string) => readGiants.includes(slug),
    [readGiants]
  )

  return {
    readGiants,
    markGiantRead,
    hasRead,
    totalRead: readGiants.length,
  }
}
