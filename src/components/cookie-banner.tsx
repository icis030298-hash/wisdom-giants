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
    localStorage.setItem("giants_cookie_consent", JSON.stringify(preferences))
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      advertising: false,
    }
    localStorage.setItem("giants_cookie_consent", JSON.stringify(preferences))
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    const preferences = {
      necessary: true,
      analytics: analyticsConsent,
      advertising: advertisingConsent,
    }
    localStorage.setItem("giants_cookie_consent", JSON.stringify(preferences))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl transition-all duration-500 ease-out animate-fade-in-up">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        {/* Glowing Decorative Orbs */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-700" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/15 transition-all duration-700" />

        <div className="relative z-10 space-y-6">
          {/* Default view */}
          {!showCustomize ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0 text-amber-500">
                  <Cookie className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-white font-serif font-bold text-lg flex items-center gap-2">
                    {t("title")}
                  </h4>
                  <p className="text-zinc-300 text-sm leading-relaxed font-light">
                    {t("description")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 justify-end">
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {t("customize")}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-semibold"
                >
                  {t("rejectAll")}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.03] active:scale-[0.97]"
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
                  <Settings className="w-5 h-5 text-amber-500" />
                  <h4 className="text-white font-serif font-bold text-lg">
                    {t("title")}
                  </h4>
                </div>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cookie options */}
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white text-sm font-semibold">{t("necessary")}</h5>
                      <p className="text-zinc-400 text-xs font-light">{t("necessaryDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center h-9">
                    <span className="text-xs text-amber-500 font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                      Always Active
                    </span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                      <BarChart3 className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white text-sm font-semibold">{t("analytics")}</h5>
                      <p className="text-zinc-400 text-xs font-light">{t("analyticsDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center h-9">
                    <button
                      onClick={() => setAnalyticsConsent(!analyticsConsent)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        analyticsConsent ? 'bg-amber-500' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                          analyticsConsent ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                      <Megaphone className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white text-sm font-semibold">{t("advertising")}</h5>
                      <p className="text-zinc-400 text-xs font-light">{t("advertisingDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-center h-9">
                    <button
                      onClick={() => setAdvertisingConsent(!advertisingConsent)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        advertisingConsent ? 'bg-amber-500' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                          advertisingConsent ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-between items-center border-t border-zinc-800 pt-4">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-semibold"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-xs font-semibold"
                  >
                    {t("savePreferences")}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.03] active:scale-[0.97]"
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
