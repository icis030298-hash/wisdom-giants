'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'gw_chatted_giants'

export function useGiantHistory() {
  const [chattedGiants, setChattedGiants] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setChattedGiants(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load chat history from localStorage:', e)
    }
  }, [])

  const addGiant = (slug: string) => {
    if (!slug) return
    setChattedGiants(prev => {
      if (prev.includes(slug)) return prev
      const next = [...prev, slug]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.error('Failed to save chat history to localStorage:', e)
      }
      return next
    })
  }

  const hasChattedWith = (slug: string) => chattedGiants.includes(slug)

  return {
    chattedGiants,
    addGiant,
    hasChattedWith,
    totalChatted: chattedGiants.length,
  }
}
