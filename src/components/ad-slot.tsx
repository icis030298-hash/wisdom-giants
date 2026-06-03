"use client"

import { useEffect, useRef } from "react"

interface AdSlotProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  responsive?: boolean
  className?: string
  label?: string
}

/**
 * Google AdSense Ad Slot Component
 * - Respects cookie consent stored in localStorage
 * - Shows "Advertisement" label above the ad per AdSense policy
 * - Only renders if advertising consent is granted
 */
export function AdSlot({ slot, format = "auto", responsive = true, className = "", label = "Advertisement" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Check advertising consent from cookie banner
    try {
      const consent = localStorage.getItem("giants_cookie_consent")
      if (consent) {
        const parsed = JSON.parse(consent)
        // If advertising consent is false, don't load ad
        if (parsed.advertising === false) return
      }
    } catch {
      // If no consent stored, default to showing non-personalized ads
    }

    if (initialized.current) return
    initialized.current = true

    try {
      const adsbygoogle = (window as any).adsbygoogle
      if (adsbygoogle) {
        adsbygoogle.push({})
      }
    } catch (e) {
      console.warn("AdSense push failed:", e)
    }
  }, [])

  return (
    <div className={`w-full ${className}`} ref={adRef}>
      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center mb-1">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2081809442345110"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}

/**
 * In-Article Ad — used between blog post sections
 */
export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      slot="4898120960"
      format="auto"
      responsive={true}
      className={`my-8 ${className}`}
      label="Advertisement"
    />
  )
}

/**
 * Display Ad — used in sidebar or between content blocks
 */
export function DisplayAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      slot="4898120960"
      format="rectangle"
      responsive={true}
      className={`my-6 ${className}`}
      label="Advertisement"
    />
  )
}
