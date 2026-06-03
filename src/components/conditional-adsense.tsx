"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

/**
 * Conditionally loads Google AdSense script only after advertising cookie consent.
 * Prevents GDPR violations by not loading tracking scripts before consent.
 */
export function ConditionalAdSense() {
  const [canLoad, setCanLoad] = useState(false)

  useEffect(() => {
    const checkConsent = () => {
      try {
        const raw = localStorage.getItem("giants_cookie_consent")
        if (!raw) {
          // No preference set yet — load non-personalized ads (npa=1)
          setCanLoad(true)
          return
        }
        const consent = JSON.parse(raw)
        // Load if advertising consent is true or undefined (not explicitly rejected)
        if (consent.advertising !== false) {
          setCanLoad(true)
        }
      } catch {
        setCanLoad(true)
      }
    }

    checkConsent()

    // Re-check when storage changes (user updates consent)
    const handler = (e: StorageEvent) => {
      if (e.key === "giants_cookie_consent") checkConsent()
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  if (!canLoad) return null

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2081809442345110"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
