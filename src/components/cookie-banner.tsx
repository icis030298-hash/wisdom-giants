"use client"

import { useState, useEffect } from "react"
import { Cookie, Shield, BarChart3, Megaphone, Settings, X } from "lucide-react"
import { useTranslations } from "next-intl"

export function CookieBanner() {
  const t = useTranslations("Cookie")
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  
  // Toggles for customization
  const [analyticsConsent, setAnalyticsConsent] = useState(true)
  const [advertisingConsent, setAdvertisingConsent] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("giants_cookie_consent")
      if (!consent) {
        // Small delay for elegant slide-up entry
        const timer = setTimeout(() => setShowBanner(true), 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      advertising: true,
    }
    localStorage.setItem("giants_cookie_consent", JSON.stringify(preferences)); window.dispatchEvent(new Event("consent_updated"))
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      advertising: false,
    }
    localStorage.setItem("giants_cookie_consent", JSON.stringify(preferences)); window.dispatchEvent(new Event("consent_updated"))
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    const preferences = {
      necessary: true,
      analytics: analyticsConsent,
      advertising: advertisingConsent,
    }
    localStorage.setItem("giants_cookie_consent", JSON.stringify(preferences)); window.dispatchEvent(new Event("consent_updated"))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl transition-all duration-500 ease-out animate-fade-in-up">
      {/* The two amber blur orbs are gone: on a dark slab they read as a glow,
          on cream they read as a stain. */}
      <div
        className="rd-surface p-6 shadow-[0_12px_32px_rgba(60,42,28,0.12)] relative overflow-hidden"
        style={{ borderRadius: "var(--rd-card-radius)" }}
      >
        <div className="relative z-10 space-y-6">
          {/* Default view */}
          {!showCustomize ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex gap-4 items-start">
                <div
                  className="w-12 h-12 flex items-center justify-center border rd-hairline shrink-0 rd-accent"
                  style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}
                >
                  {/* No pulse: a consent notice should sit still and be read. */}
                  <Cookie className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="rd-text-ink font-serif font-bold text-lg flex items-center gap-2">
                    {t("title")}
                  </h4>
                  <p className="rd-text-body text-sm leading-relaxed">
                    {t("description")}
                  </p>
                </div>
              </div>

              {/* The three-way weighting is unchanged on purpose: "customize"
                  and "reject all" stay one identical secondary treatment and
                  "accept all" stays the single filled button. Making refusal
                  quieter than consent would undermine the validity of the
                  consent collected. Only the colours moved to tokens. */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 justify-end">
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-4 py-2.5 border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 transition-opacity text-xs font-semibold flex items-center gap-1.5"
                  style={{ borderRadius: "var(--rd-card-radius)", transitionDuration: "120ms" }}
                >
                  <Settings className="w-3.5 h-3.5" />
                  {t("customize")}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 transition-opacity text-xs font-semibold"
                  style={{ borderRadius: "var(--rd-card-radius)", transitionDuration: "120ms" }}
                >
                  {t("rejectAll")}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 rd-bg-accent border font-bold text-xs hover:opacity-90 transition-opacity"
                  style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)", transitionDuration: "120ms" }}
                >
                  {t("acceptAll")}
                </button>
              </div>
            </div>
          ) : (
            // Customize settings view
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 rd-accent" />
                  <h4 className="rd-text-ink font-serif font-bold text-lg">
                    {t("title")}
                  </h4>
                </div>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="p-1.5 rounded-lg rd-text-muted hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cookie options */}
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div
                  className="flex items-start justify-between gap-4 p-4 border rd-hairline"
                  style={{ background: "var(--rd-bg-base)", borderRadius: "var(--rd-card-radius)" }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center rd-text-muted shrink-0"
                      style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}
                    >
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="rd-text-ink text-sm font-semibold">{t("necessary")}</h5>
                      <p className="rd-text-body text-xs">{t("necessaryDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center h-9">
                    <span className="text-xs rd-accent font-semibold px-2.5 py-1 rounded-full border rd-hairline" style={{ background: "var(--rd-divider-faint)" }}>
                      Always Active
                    </span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div
                  className="flex items-start justify-between gap-4 p-4 border rd-hairline"
                  style={{ background: "var(--rd-bg-base)", borderRadius: "var(--rd-card-radius)" }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center rd-text-muted shrink-0"
                      style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}
                    >
                      <BarChart3 className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="rd-text-ink text-sm font-semibold">{t("analytics")}</h5>
                      <p className="rd-text-body text-xs">{t("analyticsDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center h-9">
                    <button
                      onClick={() => setAnalyticsConsent(!analyticsConsent)}
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      style={{ background: analyticsConsent ? 'var(--rd-accent-brown)' : 'var(--rd-divider-faint)' }}
                      role="switch"
                      aria-checked={analyticsConsent}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                          analyticsConsent ? 'translate-x-5' : 'translate-x-0'
                        }`}
                        style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-border)' }}
                      />
                    </button>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div
                  className="flex items-start justify-between gap-4 p-4 border rd-hairline"
                  style={{ background: "var(--rd-bg-base)", borderRadius: "var(--rd-card-radius)" }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center rd-text-muted shrink-0"
                      style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}
                    >
                      <Megaphone className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="rd-text-ink text-sm font-semibold">{t("advertising")}</h5>
                      <p className="rd-text-body text-xs">{t("advertisingDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center h-9">
                    <button
                      onClick={() => setAdvertisingConsent(!advertisingConsent)}
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      style={{ background: advertisingConsent ? 'var(--rd-accent-brown)' : 'var(--rd-divider-faint)' }}
                      role="switch"
                      aria-checked={advertisingConsent}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                          advertisingConsent ? 'translate-x-5' : 'translate-x-0'
                        }`}
                        style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-border)' }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-between items-center border-t rd-hairline pt-4">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="px-4 py-2 rounded-xl rd-text-body hover:opacity-80 transition-opacity text-xs font-semibold"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2.5 border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 transition-opacity text-xs font-semibold" style={{ borderRadius: "var(--rd-card-radius)" }}
                  >
                    {t("savePreferences")}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2.5 rd-bg-accent border font-bold text-xs hover:opacity-90 transition-opacity" style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
                  >
                    {t("acceptAll")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export function ConsentScripts() {
  useEffect(() => {
    const loadScript = (src: string, id: string, crossOrigin?: string, content?: string) => {
      if (document.getElementById(id)) return
      const script = document.createElement("script")
      script.id = id
      if (src) script.src = src
      if (crossOrigin) script.crossOrigin = crossOrigin
      script.async = true
      if (content) script.innerHTML = content
      document.body.appendChild(script)
    }

    const checkConsent = () => {
      try {
        const raw = localStorage.getItem("giants_cookie_consent")
        if (raw) {
          const consent = JSON.parse(raw)
          if (consent.advertising) {
            loadScript(
              "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2081809442345110",
              "adsense-script",
              "anonymous"
            )
          }
          // Consent Mode v2: 스크립트를 주입하지 않고 동의 상태만 갱신한다.
          // gtag는 layout.tsx에서 이미 로드되어 있다.
          if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('consent', 'update', {
              analytics_storage: consent.analytics ? 'granted' : 'denied',
              ad_storage: consent.advertising ? 'granted' : 'denied',
              ad_user_data: consent.advertising ? 'granted' : 'denied',
              ad_personalization: consent.advertising ? 'granted' : 'denied',
            });
          }
        }
      } catch (e) {}
    }
    
    checkConsent()
    
    const onStorage = (e: StorageEvent) => {
      if (e.key === "giants_cookie_consent") checkConsent()
    }
    
    window.addEventListener("storage", onStorage)
    window.addEventListener("consent_updated", checkConsent)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("consent_updated", checkConsent)
    }
  }, [])

  return null
}

